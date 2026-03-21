import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

// Simulated failure state (in production, this would be removed)
let simulatedFailures: Set<string> = new Set()

export async function POST(req: Request) {
  const { messages, provider, model, simulateFailure } = await req.json()

  // Handle simulation toggle
  if (simulateFailure !== undefined) {
    if (simulateFailure) {
      simulatedFailures.add(provider)
    } else {
      simulatedFailures.delete(provider)
    }
    return Response.json({ ok: true })
  }

  // Check for simulated failure
  if (simulatedFailures.has(provider)) {
    // Simulate 429 rate limit error
    return new Response(
      JSON.stringify({
        error: {
          message: "Rate limit exceeded",
          type: "rate_limit_error",
          code: "rate_limit_exceeded",
        },
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
        },
      }
    )
  }

  // Get the appropriate model based on provider
  const getModel = () => {
    switch (provider) {
      case "openai":
        return openai(model || "gpt-4o-mini")
      case "anthropic":
        return anthropic(model || "claude-sonnet-4-20250514")
      case "google":
        return google(model || "gemini-2.0-flash")
      default:
        return openai("gpt-4o-mini")
    }
  }

  try {
    const result = streamText({
      model: getModel(),
      messages,
      maxTokens: 1024,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error(`[${provider}] Error:`, error)

    // Return appropriate error response
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error"

    if (errorMessage.includes("rate") || errorMessage.includes("429")) {
      return new Response(
        JSON.stringify({ error: { message: "Rate limit exceeded" } }),
        { status: 429 }
      )
    }

    return new Response(JSON.stringify({ error: { message: errorMessage } }), {
      status: 500,
    })
  }
}

// Health check endpoint
export async function GET(req: Request) {
  const url = new URL(req.url)
  const provider = url.searchParams.get("provider")

  if (simulatedFailures.has(provider || "")) {
    return new Response(
      JSON.stringify({ status: "degraded", reason: "simulated_failure" }),
      { status: 503 }
    )
  }

  return Response.json({
    status: "healthy",
    provider,
    timestamp: new Date().toISOString(),
  })
}
