"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────
type DitherMatrix = "bayer2" | "bayer4" | "bayer8"

interface Block {
  x: number
  y: number
  width: number
  height: number
  density: number
  targetDensity: number
  phase: number
  speed: number
}

export interface AnimatedLogoProps {
  size?: number
  colorFg?: string
  className?: string
}

// ── HEX → RGB ──────────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  let cleaned = hex.replace("#", "")
  if (cleaned.length === 3) {
    cleaned =
      cleaned[0] +
      cleaned[0] +
      cleaned[1] +
      cleaned[1] +
      cleaned[2] +
      cleaned[2]
  }
  const bigint = parseInt(cleaned, 16)
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
}

// ── Bayer matrix ───────────────────────────────────────────────────────────
const B8 = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36,
  14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23,
  61, 29, 53, 21,
]

function getBayer(ix: number, iy: number): number {
  return B8[(iy % 8) * 8 + (ix % 8)] / 64
}

// ── Seeded random ──────────────────────────────────────────────────────────
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

// ── Generate blocks for logo ───────────────────────────────────────────────
function generateBlocks(
  canvasSize: number,
  gridUnit: number,
  seed: number
): Block[] {
  const rand = seededRandom(seed)
  const blocks: Block[] = []

  // Block sizes optimized for small logo
  const sizes = [
    { w: 1, h: 1 },
    { w: 1, h: 2 },
    { w: 2, h: 1 },
    { w: 2, h: 2 },
    { w: 1, h: 3 },
    { w: 3, h: 1 },
  ]

  // Density levels
  const densityLevels = [0.2, 0.35, 0.5, 0.7, 0.85, 1.0]

  const gridCols = Math.ceil(canvasSize / gridUnit)
  const gridRows = Math.ceil(canvasSize / gridUnit)

  // Generate 12-15 blocks for a nice fill
  const blockCount = 14

  for (let i = 0; i < blockCount; i++) {
    const sizeIdx = Math.floor(rand() * sizes.length)
    const size = sizes[sizeIdx]

    const gridX = Math.floor(rand() * gridCols)
    const gridY = Math.floor(rand() * gridRows)

    const x = gridX * gridUnit
    const y = gridY * gridUnit
    const width = size.w * gridUnit
    const height = size.h * gridUnit

    const densityIdx = Math.floor(rand() * densityLevels.length)
    const density = densityLevels[densityIdx]
    const targetIdx = Math.floor(rand() * densityLevels.length)
    const targetDensity = densityLevels[targetIdx]

    blocks.push({
      x,
      y,
      width,
      height,
      density,
      targetDensity,
      phase: rand() * Math.PI * 2,
      speed: 0.08 + rand() * 0.12,
    })
  }

  return blocks
}

// ── Component ──────────────────────────────────────────────────────────────
export function AnimatedLogo({
  size = 32,
  colorFg = "#0066FF",
  className,
}: AnimatedLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blocksRef = useRef<Block[]>([])
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef(Date.now())
  const seedRef = useRef(Math.floor(Math.random() * 10000))

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!

    const dpr = window.devicePixelRatio || 1
    const canvasSize = Math.round(size * dpr)
    canvas.width = canvasSize
    canvas.height = canvasSize

    // Grid unit for small canvas (aim for ~8x8 grid)
    const gridUnit = Math.max(4, Math.floor(canvasSize / 8))
    const pxSize = Math.max(1, Math.floor(dpr))

    blocksRef.current = generateBlocks(canvasSize, gridUnit, seedRef.current)

    const [r, g, b] = hexToRgb(colorFg)

    const render = () => {
      const elapsed = (Date.now() - startTimeRef.current) * 0.001 * 0.12

      ctx.clearRect(0, 0, canvasSize, canvasSize)
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`

      for (const block of blocksRef.current) {
        const oscillation = Math.sin(elapsed * block.speed + block.phase)
        const t = oscillation * 0.5 + 0.5
        const currentDensity = block.density + (block.targetDensity - block.density) * t

        const startCol = Math.max(0, Math.floor(block.x / pxSize))
        const endCol = Math.min(Math.ceil(canvasSize / pxSize), Math.ceil((block.x + block.width) / pxSize))
        const startRow = Math.max(0, Math.floor(block.y / pxSize))
        const endRow = Math.min(Math.ceil(canvasSize / pxSize), Math.ceil((block.y + block.height) / pxSize))

        for (let row = startRow; row < endRow; row++) {
          for (let col = startCol; col < endCol; col++) {
            const threshold = getBayer(col, row)
            if (currentDensity > threshold) {
              ctx.fillRect(col * pxSize, row * pxSize, pxSize, pxSize)
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [size, colorFg])

  return (
    <canvas
      ref={canvasRef}
      className={cn("rounded-sm", className)}
      style={{
        width: size,
        height: size,
        display: "block",
      }}
    />
  )
}
