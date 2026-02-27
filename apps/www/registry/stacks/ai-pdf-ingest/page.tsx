"use client"

import { useChat } from "@ai-sdk/react"
import { useState } from "react"

export default function PDFAnalysis() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()
  const [file, setFile] = useState<File | null>(null)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("prompt", input || "Summarize this PDF")

    handleSubmit(e, {
      experimental_attachments: [
        {
          name: file.name,
          contentType: file.type,
          url: URL.createObjectURL(file),
        },
      ],
    })
  }

  return (
    <div className="mx-auto flex h-screen max-w-xl flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className="mb-4 text-sm">
            <p className="text-xs font-medium text-muted-foreground">
              {m.role}
            </p>
            <p className="mt-1">{m.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="border-t p-4">
        <input type="file" accept=".pdf" onChange={handleFileUpload} />
        <div className="mt-2 flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about the PDF..."
            className="flex-1 rounded-md border px-3 py-2 text-sm"
          />
          <button className="rounded-md bg-foreground px-4 py-2 text-sm text-background">
            Analyze
          </button>
        </div>
      </form>
    </div>
  )
}