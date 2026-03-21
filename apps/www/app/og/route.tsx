import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get("title") || "shadcnagents"
  const description =
    searchParams.get("description") ||
    "AI SDK Components, Blocks & Agent Patterns"

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#09090b",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 25% 25%, rgba(124, 58, 237, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
          }}
        />

        {/* Logo/Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#a1a1aa",
              letterSpacing: "-0.02em",
            }}
          >
            shadcnagents
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#fafafa",
            lineHeight: 1.1,
            marginBottom: "24px",
            maxWidth: "900px",
            letterSpacing: "-0.03em",
          }}
        >
          {title.length > 60 ? `${title.slice(0, 60)}...` : title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "28px",
            color: "#a1a1aa",
            lineHeight: 1.4,
            maxWidth: "800px",
          }}
        >
          {description.length > 120
            ? `${description.slice(0, 120)}...`
            : description}
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "80px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              padding: "12px 20px",
              borderRadius: "9999px",
            }}
          >
            <span style={{ color: "#fafafa", fontSize: "18px" }}>
              shadcnagents.com
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
