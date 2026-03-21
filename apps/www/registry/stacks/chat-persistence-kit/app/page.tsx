"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { AnimatePresence, motion } from "motion/react"

import { ConversationSidebar } from "../components/conversation-sidebar"
import {
  createLocalStorageAdapter,
  generateTitle,
  PRISMA_ADAPTER_CODE,
  PRISMA_SCHEMA,
} from "../lib/persistence"

const adapter = createLocalStorageAdapter()

export default function ChatPersistenceDemo() {
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showCode, setShowCode] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    id: currentConversationId || undefined,
    onFinish: async () => {
      // Auto-save after each message
      if (currentConversationId) {
        await adapter.saveMessages(currentConversationId, messages)

        // Update title if this is the first exchange
        if (messages.length === 2) {
          const title = generateTitle(messages)
          await adapter.updateConversation(currentConversationId, { title })
        }
      }
    },
  })

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load conversation when selected
  const loadConversation = useCallback(
    async (id: string) => {
      const savedMessages = await adapter.getMessages(id)
      setMessages(savedMessages)
      setCurrentConversationId(id)
    },
    [setMessages]
  )

  // Create new conversation
  const createNewConversation = useCallback(async () => {
    const conversation = await adapter.createConversation()
    setMessages([])
    setCurrentConversationId(conversation.id)
  }, [setMessages])

  // Delete conversation
  const deleteConversation = useCallback(
    async (id: string) => {
      await adapter.deleteConversation(id)
      if (id === currentConversationId) {
        setMessages([])
        setCurrentConversationId(null)
      }
    },
    [currentConversationId, setMessages]
  )

  // Initialize with a conversation
  useEffect(() => {
    const init = async () => {
      const conversations = await adapter.listConversations(1)
      if (conversations.length > 0) {
        await loadConversation(conversations[0].id)
      }
    }
    init()
  }, [loadConversation])

  // Save messages when they change
  useEffect(() => {
    if (currentConversationId && messages.length > 0 && !isLoading) {
      adapter.saveMessages(currentConversationId, messages)
    }
  }, [currentConversationId, messages, isLoading])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 border-r border-border/50 overflow-hidden"
          >
            <ConversationSidebar
              adapter={adapter}
              currentId={currentConversationId}
              onSelect={loadConversation}
              onNew={createNewConversation}
              onDelete={deleteConversation}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="shrink-0 border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-lg p-2 hover:bg-muted transition-colors"
              >
                <SidebarIcon className="size-5 text-muted-foreground" />
              </button>
              <div>
                <h1 className="text-sm font-semibold">Chat Persistence Kit</h1>
                <p className="text-xs text-muted-foreground">
                  {currentConversationId
                    ? `${messages.length} messages • Auto-saved`
                    : "Select or create a conversation"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCode(!showCode)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  showCode
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {showCode ? "Hide Code" : "View Code"}
              </button>

              {/* Connection status */}
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1">
                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  Auto-save
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {showCode ? (
            <CodeView />
          ) : (
            <div className="flex h-full flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {!currentConversationId ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                    <div className="rounded-full bg-muted p-4">
                      <ChatIcon className="size-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        No conversation selected
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Create a new chat or select one from the sidebar
                      </p>
                    </div>
                    <button
                      onClick={createNewConversation}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      New Conversation
                    </button>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                    <p className="text-sm text-muted-foreground/70">
                      Send a message to get started
                    </p>
                  </div>
                ) : (
                  <div className="mx-auto max-w-3xl space-y-4">
                    {messages.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          m.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            m.role === "user"
                              ? "rounded-br-sm bg-primary text-primary-foreground"
                              : "rounded-bl-sm bg-muted"
                          }`}
                        >
                          {m.content}
                        </div>
                      </motion.div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="size-1.5 rounded-full bg-muted-foreground/40"
                                animate={{ y: [0, -4, 0] }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={bottomRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              {currentConversationId && (
                <div className="shrink-0 border-t border-border/50 p-4">
                  <form
                    onSubmit={handleSubmit}
                    className="mx-auto flex max-w-3xl gap-2"
                  >
                    <input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Type a message..."
                      disabled={isLoading}
                      className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CODE VIEW
// ============================================================================

function CodeView() {
  const [activeTab, setActiveTab] = useState<"schema" | "adapter">("schema")

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border/50 bg-muted/30">
            <button
              onClick={() => setActiveTab("schema")}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "schema"
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Prisma Schema
            </button>
            <button
              onClick={() => setActiveTab("adapter")}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "adapter"
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Prisma Adapter
            </button>
          </div>

          {/* Code */}
          <div className="p-4">
            <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-xs text-zinc-100">
              <code>
                {activeTab === "schema" ? PRISMA_SCHEMA : PRISMA_ADAPTER_CODE}
              </code>
            </pre>
          </div>

          {/* Instructions */}
          <div className="border-t border-border/50 bg-muted/20 p-4">
            <h3 className="text-sm font-semibold mb-2">Quick Start</h3>
            <ol className="space-y-1.5 text-xs text-muted-foreground list-decimal list-inside">
              <li>
                Add the schema to your{" "}
                <code className="bg-muted px-1 rounded">schema.prisma</code>
              </li>
              <li>
                Run{" "}
                <code className="bg-muted px-1 rounded">
                  npx prisma db push
                </code>
              </li>
              <li>Copy the adapter code to your project</li>
              <li>
                Replace{" "}
                <code className="bg-muted px-1 rounded">
                  createLocalStorageAdapter()
                </code>{" "}
                with{" "}
                <code className="bg-muted px-1 rounded">
                  createPrismaAdapter(prisma)
                </code>
              </li>
            </ol>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <FeatureCard
            title="Auto-Save"
            description="Messages are automatically persisted after each response"
          />
          <FeatureCard
            title="Conversation History"
            description="Full sidebar with search, grouping by date, and message previews"
          />
          <FeatureCard
            title="Offline Support"
            description="LocalStorage adapter works without a database for development"
          />
          <FeatureCard
            title="Database Ready"
            description="Prisma adapter template for PostgreSQL, MySQL, or SQLite"
          />
          <FeatureCard
            title="Auto Title"
            description="Conversations are automatically titled from the first message"
          />
          <FeatureCard
            title="Type Safe"
            description="Full TypeScript types for messages, conversations, and adapters"
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-4">
      <h4 className="text-sm font-medium">{title}</h4>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

// ============================================================================
// ICONS
// ============================================================================

function SidebarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
      />
    </svg>
  )
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
      />
    </svg>
  )
}
