import type { Message } from "@ai-sdk/react"

// ============================================================================
// TYPES
// ============================================================================

export interface Conversation {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messageCount: number
  preview?: string
}

export interface PersistedMessage {
  id: string
  conversationId: string
  role: "user" | "assistant" | "system" | "tool"
  content: string
  createdAt: Date
  metadata?: Record<string, unknown>
}

export interface PersistenceAdapter {
  // Conversations
  createConversation(title?: string): Promise<Conversation>
  getConversation(id: string): Promise<Conversation | null>
  listConversations(limit?: number): Promise<Conversation[]>
  updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation>
  deleteConversation(id: string): Promise<void>

  // Messages
  saveMessages(conversationId: string, messages: Message[]): Promise<void>
  getMessages(conversationId: string): Promise<Message[]>
  appendMessage(conversationId: string, message: Message): Promise<void>
  deleteMessages(conversationId: string): Promise<void>
}

// ============================================================================
// LOCAL STORAGE ADAPTER (Demo/Development)
// ============================================================================

const STORAGE_PREFIX = "chat-persistence"

export function createLocalStorageAdapter(): PersistenceAdapter {
  const getKey = (type: string, id?: string) =>
    id ? `${STORAGE_PREFIX}:${type}:${id}` : `${STORAGE_PREFIX}:${type}`

  const getConversationIds = (): string[] => {
    if (typeof window === "undefined") return []
    const ids = localStorage.getItem(getKey("conversation-ids"))
    return ids ? JSON.parse(ids) : []
  }

  const saveConversationIds = (ids: string[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(getKey("conversation-ids"), JSON.stringify(ids))
  }

  return {
    async createConversation(title = "New Conversation") {
      const id = crypto.randomUUID()
      const conversation: Conversation = {
        id,
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 0,
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(getKey("conversation", id), JSON.stringify(conversation))
        const ids = getConversationIds()
        saveConversationIds([id, ...ids])
      }

      return conversation
    },

    async getConversation(id) {
      if (typeof window === "undefined") return null
      const data = localStorage.getItem(getKey("conversation", id))
      if (!data) return null

      const parsed = JSON.parse(data)
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
      }
    },

    async listConversations(limit = 50) {
      if (typeof window === "undefined") return []

      const ids = getConversationIds().slice(0, limit)
      const conversations: Conversation[] = []

      for (const id of ids) {
        const data = localStorage.getItem(getKey("conversation", id))
        if (data) {
          const parsed = JSON.parse(data)
          conversations.push({
            ...parsed,
            createdAt: new Date(parsed.createdAt),
            updatedAt: new Date(parsed.updatedAt),
          })
        }
      }

      return conversations.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      )
    },

    async updateConversation(id, updates) {
      const current = await this.getConversation(id)
      if (!current) throw new Error("Conversation not found")

      const updated: Conversation = {
        ...current,
        ...updates,
        updatedAt: new Date(),
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(getKey("conversation", id), JSON.stringify(updated))
      }

      return updated
    },

    async deleteConversation(id) {
      if (typeof window === "undefined") return

      localStorage.removeItem(getKey("conversation", id))
      localStorage.removeItem(getKey("messages", id))

      const ids = getConversationIds().filter((i) => i !== id)
      saveConversationIds(ids)
    },

    async saveMessages(conversationId, messages) {
      if (typeof window === "undefined") return

      const serialized = messages.map((m) => ({
        ...m,
        createdAt: m.createdAt?.toISOString?.() || new Date().toISOString(),
      }))

      localStorage.setItem(
        getKey("messages", conversationId),
        JSON.stringify(serialized)
      )

      // Update conversation
      const preview = messages[messages.length - 1]?.content?.slice(0, 100)
      await this.updateConversation(conversationId, {
        messageCount: messages.length,
        preview,
      })
    },

    async getMessages(conversationId) {
      if (typeof window === "undefined") return []

      const data = localStorage.getItem(getKey("messages", conversationId))
      if (!data) return []

      const parsed = JSON.parse(data)
      return parsed.map((m: any) => ({
        ...m,
        createdAt: m.createdAt ? new Date(m.createdAt) : undefined,
      }))
    },

    async appendMessage(conversationId, message) {
      const messages = await this.getMessages(conversationId)
      messages.push(message)
      await this.saveMessages(conversationId, messages)
    },

    async deleteMessages(conversationId) {
      if (typeof window === "undefined") return
      localStorage.removeItem(getKey("messages", conversationId))
      await this.updateConversation(conversationId, { messageCount: 0, preview: undefined })
    },
  }
}

// ============================================================================
// PRISMA ADAPTER TEMPLATE
// ============================================================================

export const PRISMA_SCHEMA = `
// Add to your schema.prisma

model Conversation {
  id         String    @id @default(cuid())
  title      String    @default("New Conversation")
  userId     String?   // Optional: link to user
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  messages   Message[]

  @@index([userId])
  @@index([updatedAt])
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role           String       // "user" | "assistant" | "system" | "tool"
  content        String       @db.Text
  metadata       Json?
  createdAt      DateTime     @default(now())

  @@index([conversationId])
}
`

export const PRISMA_ADAPTER_CODE = `
import { PrismaClient } from "@prisma/client"
import type { PersistenceAdapter, Conversation } from "./persistence"
import type { Message } from "@ai-sdk/react"

export function createPrismaAdapter(prisma: PrismaClient): PersistenceAdapter {
  return {
    async createConversation(title = "New Conversation") {
      const conversation = await prisma.conversation.create({
        data: { title },
      })
      return {
        ...conversation,
        messageCount: 0,
      }
    },

    async getConversation(id) {
      const conversation = await prisma.conversation.findUnique({
        where: { id },
        include: { _count: { select: { messages: true } } },
      })
      if (!conversation) return null
      return {
        ...conversation,
        messageCount: conversation._count.messages,
      }
    },

    async listConversations(limit = 50) {
      const conversations = await prisma.conversation.findMany({
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          _count: { select: { messages: true } },
          messages: { take: 1, orderBy: { createdAt: "desc" } },
        },
      })
      return conversations.map((c) => ({
        ...c,
        messageCount: c._count.messages,
        preview: c.messages[0]?.content?.slice(0, 100),
      }))
    },

    async updateConversation(id, updates) {
      const conversation = await prisma.conversation.update({
        where: { id },
        data: {
          title: updates.title,
        },
        include: { _count: { select: { messages: true } } },
      })
      return {
        ...conversation,
        messageCount: conversation._count.messages,
      }
    },

    async deleteConversation(id) {
      await prisma.conversation.delete({ where: { id } })
    },

    async saveMessages(conversationId, messages) {
      await prisma.$transaction([
        prisma.message.deleteMany({ where: { conversationId } }),
        prisma.message.createMany({
          data: messages.map((m) => ({
            id: m.id,
            conversationId,
            role: m.role,
            content: m.content,
            metadata: m.annotations ? { annotations: m.annotations } : undefined,
          })),
        }),
      ])
    },

    async getMessages(conversationId) {
      const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
      })
      return messages.map((m) => ({
        id: m.id,
        role: m.role as Message["role"],
        content: m.content,
        createdAt: m.createdAt,
      }))
    },

    async appendMessage(conversationId, message) {
      await prisma.message.create({
        data: {
          id: message.id,
          conversationId,
          role: message.role,
          content: message.content,
        },
      })
    },

    async deleteMessages(conversationId) {
      await prisma.message.deleteMany({ where: { conversationId } })
    },
  }
}
`

// ============================================================================
// MESSAGE SERIALIZATION UTILITIES
// ============================================================================

export function serializeMessages(messages: Message[]): string {
  return JSON.stringify(
    messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt?.toISOString?.(),
      annotations: m.annotations,
    }))
  )
}

export function deserializeMessages(data: string): Message[] {
  try {
    const parsed = JSON.parse(data)
    return parsed.map((m: any) => ({
      ...m,
      createdAt: m.createdAt ? new Date(m.createdAt) : undefined,
    }))
  } catch {
    return []
  }
}

// ============================================================================
// AUTO-TITLE GENERATION
// ============================================================================

export function generateTitle(messages: Message[]): string {
  const firstUserMessage = messages.find((m) => m.role === "user")
  if (!firstUserMessage) return "New Conversation"

  const content = firstUserMessage.content
  if (content.length <= 50) return content

  // Find a good break point
  const truncated = content.slice(0, 50)
  const lastSpace = truncated.lastIndexOf(" ")
  return lastSpace > 20 ? truncated.slice(0, lastSpace) + "…" : truncated + "…"
}
