"use client"

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import type { Conversation, PersistenceAdapter } from "../lib/persistence"

// ============================================================================
// CONVERSATION SIDEBAR
// ============================================================================

interface ConversationSidebarProps {
  adapter: PersistenceAdapter
  currentId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
}

export function ConversationSidebar({
  adapter,
  currentId,
  onSelect,
  onNew,
  onDelete,
}: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const loadConversations = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await adapter.listConversations(100)
      setConversations(data)
    } finally {
      setIsLoading(false)
    }
  }, [adapter])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // Refresh periodically to catch updates
  useEffect(() => {
    const interval = setInterval(loadConversations, 5000)
    return () => clearInterval(interval)
  }, [loadConversations])

  const filteredConversations = searchQuery
    ? conversations.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.preview?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations

  // Group by date
  const grouped = groupByDate(filteredConversations)

  return (
    <div className="flex h-full flex-col bg-muted/30">
      {/* Header */}
      <div className="shrink-0 border-b border-border/50 p-4">
        <button
          onClick={onNew}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <PlusIcon className="size-4" />
          New Chat
        </button>
      </div>

      {/* Search */}
      <div className="shrink-0 px-4 py-3">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search conversations…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border/50 bg-background py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground/50 focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/20"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {isLoading && conversations.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <motion.div
              className="size-5 rounded-full border-2 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-muted-foreground/70">
              {searchQuery ? "No matches found" : "No conversations yet"}
            </p>
            {!searchQuery && (
              <button
                onClick={onNew}
                className="text-sm text-primary hover:underline"
              >
                Start a new chat
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([label, items]) => (
              <div key={label}>
                <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {label}
                </p>
                <div className="space-y-0.5">
                  <AnimatePresence mode="popLayout">
                    {items.map((conversation) => (
                      <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        isActive={conversation.id === currentId}
                        onSelect={() => onSelect(conversation.id)}
                        onDelete={() => onDelete(conversation.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="shrink-0 border-t border-border/50 px-4 py-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{conversations.length} conversations</span>
          <span>
            {conversations.reduce((sum, c) => sum + c.messageCount, 0)} messages
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CONVERSATION ITEM
// ============================================================================

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}

function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
}: ConversationItemProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="group relative"
    >
      <button
        onClick={onSelect}
        onContextMenu={(e) => {
          e.preventDefault()
          setShowMenu(true)
        }}
        className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
          isActive
            ? "bg-primary/10 text-foreground"
            : "hover:bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{conversation.title}</p>
            {conversation.preview && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground/70">
                {conversation.preview}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] text-muted-foreground/50">
              {formatRelativeTime(conversation.updatedAt)}
            </p>
            {conversation.messageCount > 0 && (
              <p className="mt-0.5 text-[10px] text-muted-foreground/40">
                {conversation.messageCount} msg
              </p>
            )}
          </div>
        </div>
      </button>

      {/* Menu button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setShowMenu(!showMenu)
        }}
        className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-1.5 transition-opacity ${
          showMenu ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        } hover:bg-muted`}
      >
        <MoreIcon className="size-4 text-muted-foreground" />
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded-lg border border-border bg-popover p-1 shadow-lg"
            >
              <button
                onClick={() => {
                  onDelete()
                  setShowMenu(false)
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                <TrashIcon className="size-4" />
                Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============================================================================
// UTILITIES
// ============================================================================

function groupByDate(
  conversations: Conversation[]
): Record<string, Conversation[]> {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const groups: Record<string, Conversation[]> = {}

  for (const conv of conversations) {
    const date = conv.updatedAt
    let label: string

    if (date >= today) {
      label = "Today"
    } else if (date >= yesterday) {
      label = "Yesterday"
    } else if (date >= lastWeek) {
      label = "This Week"
    } else if (date >= lastMonth) {
      label = "This Month"
    } else {
      label = "Older"
    }

    if (!groups[label]) groups[label] = []
    groups[label].push(conv)
  }

  return groups
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

// ============================================================================
// ICONS
// ============================================================================

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  )
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
      />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  )
}
