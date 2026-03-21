import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const {
    messages,
    simulateDisconnect,
    disconnectAfter,
    lastEventId,
    resumeFrom,
  } = await req.json()

  // For demo: simulate a disconnection after certain bytes
  if (simulateDisconnect && disconnectAfter) {
    // Create a stream that disconnects after N bytes
    const encoder = new TextEncoder()
    let bytesSent = 0
    let eventId = 0

    const stream = new ReadableStream({
      async start(controller) {
        const result = streamText({
          model: openai("gpt-4o-mini"),
          messages,
          maxTokens: 500,
        })

        try {
          for await (const chunk of result.textStream) {
            // Send event ID for Last-Event-ID tracking
            eventId++
            const eventIdLine = `id: evt-${eventId}\n`
            controller.enqueue(encoder.encode(eventIdLine))

            // Send data
            const dataLine = `data: ${JSON.stringify({ content: chunk, id: `evt-${eventId}` })}\n\n`
            const data = encoder.encode(dataLine)

            bytesSent += data.length

            // Simulate disconnect after threshold
            if (bytesSent > disconnectAfter) {
              // Abruptly close the stream to simulate network failure
              controller.close()
              return
            }

            controller.enqueue(data)

            // Add heartbeat every 5 events
            if (eventId % 5 === 0) {
              controller.enqueue(encoder.encode(": heartbeat\n\n"))
            }
          }

          // Send done marker
          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  }

  // Normal streaming with proper SSE format
  const encoder = new TextEncoder()
  let eventId = lastEventId ? parseInt(lastEventId.split("-")[1]) || 0 : 0

  const stream = new ReadableStream({
    async start(controller) {
      const result = streamText({
        model: openai("gpt-4o-mini"),
        messages,
        maxTokens: 1024,
      })

      try {
        for await (const chunk of result.textStream) {
          eventId++

          // Send event ID
          controller.enqueue(encoder.encode(`id: evt-${eventId}\n`))

          // Send data
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ content: chunk, id: `evt-${eventId}` })}\n\n`
            )
          )

          // Heartbeat every 10 events
          if (eventId % 10 === 0) {
            controller.enqueue(encoder.encode(": heartbeat\n\n"))
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"))
        controller.close()
      } catch (error) {
        console.error("Stream error:", error)
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: "Stream error" })}\n\n`
          )
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable nginx buffering
    },
  })
}
