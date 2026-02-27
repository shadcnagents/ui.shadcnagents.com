import { generateText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "prompt is required" }, { status: 400 })
    }

    const { text, steps } = await generateText({
      model: openai("gpt-4o"),
      maxSteps: 5,
      prompt,
      tools: {
        search: tool({
          description: "Search the web for information on a topic",
          parameters: z.object({
            query: z.string().describe("The search query"),
          }),
          execute: async ({ query }) =>
            `Simulated search results for "${query}": Found 3 relevant articles about recent developments.`,
        }),
        analyze: tool({
          description: "Analyze and synthesize information",
          parameters: z.object({
            content: z.string().describe("Content to analyze"),
            focus: z.string().describe("What aspect to focus on"),
          }),
          execute: async ({ content, focus }) =>
            `Analysis focusing on "${focus}": ${content.slice(0, 150)}...`,
        }),
      },
    })

    const serializedSteps = steps.map((step) => ({
      toolCalls: step.toolCalls?.map((tc) => ({
        toolName: tc.toolName,
        args: tc.args,
      })),
    }))

    return Response.json({ text, stepCount: steps.length, steps: serializedSteps })
  } catch (error) {
    console.error("[agent]", error)
    return Response.json({ error: "Agent execution failed" }, { status: 500 })
  }
}
