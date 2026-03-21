import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Simulate rate limiting for demo (randomly return 429)
  const simulateRateLimit = Math.random() < 0.3 // 30% chance of rate limit

  if (simulateRateLimit) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "x-ratelimit-remaining-requests": "0",
        "x-ratelimit-remaining-tokens": "0",
        "x-ratelimit-reset-requests": "5s",
        "Retry-After": "5",
      },
    })
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
  })

  const response = result.toDataStreamResponse()

  // Add rate limit headers to successful responses
  const remaining = Math.floor(Math.random() * 100)
  response.headers.set("x-ratelimit-remaining-requests", String(remaining))
  response.headers.set("x-ratelimit-remaining-tokens", String(remaining * 1000))
  response.headers.set("x-ratelimit-reset-requests", "60s")

  return response
}
