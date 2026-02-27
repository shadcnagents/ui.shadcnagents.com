"use client"

import { useChat } from "@ai-sdk/react"
import { useState } from "react"

export default function TableEditor() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div className="mx-auto flex h-screen max-w-3xl flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className="mb-4">
            {m.parts?.map((part, i) => {
              if (
                part.type === "tool-invocation" &&
                part.toolName === "generateTable"
              ) {
                const data = part.result?.rows ?? []
                const cols = part.result?.columns ?? []
                return (
                  <table key={i} className="w-full border-collapse">
                    <thead>
                      <tr>
                        {cols.map((col: string) => (
                          <th key={col} className="border p-2 text-left text-xs">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row: Record<string, string>, j: number) => (
                        <tr key={j}>
                          {cols.map((col: string) => (
                            <td key={col} className="border p-2 text-sm">
                              {row[col]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              }
              if (part.type === "text") {
                return <p key={i} className="text-sm">{part.text}</p>
              }
              return null
            })}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Generate a table..."
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </form>
    </div>
  )
}