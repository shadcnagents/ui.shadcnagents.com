import { generateText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "prompt is required" }, { status: 400 })
    }

    const { text, toolCalls } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      tools: {
        getWeather: tool({
          description: "Get current weather for a city",
          parameters: z.object({
            city: z.string().describe("The city name"),
          }),
          execute: async ({ city }) => ({
            city,
            temperature: 18,
            condition: "Partly Cloudy",
            humidity: 65,
            wind: "12 mph",
          }),
        }),
      },
    })

    return Response.json({ text, toolCalls })
  } catch (error) {
    console.error("[tool-call]", error)
    return Response.json({ error: "Failed to run tool call" }, { status: 500 })
  }
}
