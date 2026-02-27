"use client"

import { useState, useEffect } from "react"

interface Task {
  id: string
  name: string
  status: "queued" | "running" | "done" | "failed"
}

export default function QueueDisplay() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", name: "Fetch data", status: "done" },
    { id: "2", name: "Process records", status: "running" },
    { id: "3", name: "Generate report", status: "queued" },
    { id: "4", name: "Send notifications", status: "queued" },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) => {
        const running = prev.findIndex((t) => t.status === "running")
        if (running === -1) return prev
        const next = [...prev]
        next[running] = { ...next[running], status: "done" }
        if (running + 1 < next.length) {
          next[running + 1] = { ...next[running + 1], status: "running" }
        }
        return next
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mx-auto max-w-md p-8">
      <h2 className="text-sm font-medium">Task Queue</h2>
      <div className="mt-4 space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 rounded border p-3">
            <StatusDot status={task.status} />
            <span className="text-sm">{task.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    done: "bg-green-500",
    running: "bg-blue-500 animate-pulse",
    queued: "bg-muted-foreground/30",
    failed: "bg-red-500",
  }
  return <div className={`size-2 rounded-full ${colors[status]}`} />
}