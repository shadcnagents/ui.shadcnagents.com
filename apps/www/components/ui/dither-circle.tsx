"use client"

import { useEffect, useRef } from "react"

export interface DitherCircleProps {
  color?: string
  pxSize?: number
  className?: string
}

// Bayer 8x8 matrix for dithering
const BAYER8 = [
  0, 32, 8, 40, 2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44, 4, 36, 14, 46, 6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37,
  63, 31, 55, 23, 61, 29, 53, 21,
]

function getBayerThreshold(x: number, y: number): number {
  return BAYER8[(y % 8) * 8 + (x % 8)] / 64
}

function hexToRgb(hex: string): [number, number, number] {
  let cleaned = hex.replace("#", "")
  if (cleaned.length === 3) {
    cleaned = cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2]
  }
  const bigint = parseInt(cleaned, 16)
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
}

export function DitherCircle({
  color = "#0066FF",
  pxSize = 3,
  className,
}: DitherCircleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = container.getBoundingClientRect()
      const W = rect.width
      const H = rect.height

      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = W + "px"
      canvas.style.height = H + "px"

      render(dpr)
    }

    const render = (dpr: number) => {
      const W = canvas.width
      const H = canvas.height
      const ps = Math.max(1, Math.floor(pxSize * dpr))

      ctx.clearRect(0, 0, W, H)

      const [r, g, b] = hexToRgb(color)
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`

      // Circle parameters - centered, with radius based on container size
      const centerX = W * 0.55
      const centerY = H * 0.45
      const radius = Math.min(W, H) * 0.5

      // Iterate over pixel grid
      const cols = Math.ceil(W / ps)
      const rows = Math.ceil(H / ps)

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const px = col * ps + ps / 2
          const py = row * ps + ps / 2

          // Distance from center (normalized 0 to 1)
          const dx = px - centerX
          const dy = py - centerY
          const dist = Math.sqrt(dx * dx + dy * dy)
          const normalizedDist = dist / radius

          // Skip if outside the circle
          if (normalizedDist > 1.15) continue

          // Gradient: solid center, fading to edges with dithering
          // Inner 40% is mostly solid, then gradient fades out
          let density: number
          if (normalizedDist < 0.35) {
            density = 1.0
          } else if (normalizedDist < 0.5) {
            density = 1.0 - (normalizedDist - 0.35) * 0.3
          } else if (normalizedDist < 0.75) {
            density = 0.85 - (normalizedDist - 0.5) * 1.2
          } else if (normalizedDist < 1.0) {
            density = 0.55 - (normalizedDist - 0.75) * 1.8
          } else {
            density = 0.1 - (normalizedDist - 1.0) * 0.7
          }

          density = Math.max(0, Math.min(1, density))

          // Apply Bayer dithering
          const threshold = getBayerThreshold(col, row)
          if (density > threshold) {
            ctx.fillRect(col * ps, row * ps, ps, ps)
          }
        }
      }
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    return () => {
      ro.disconnect()
    }
  }, [color, pxSize])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  )
}
