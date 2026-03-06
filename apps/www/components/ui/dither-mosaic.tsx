"use client"

import { useEffect, useRef } from "react"

// ── Types ──────────────────────────────────────────────────────────────────
export type DitherMatrix = "bayer2" | "bayer4" | "bayer8"

interface Block {
  x: number
  y: number
  width: number
  height: number
  density: number
  targetDensity: number
  phase: number
  speed: number
  layer: number
}

export interface DitherMosaicProps {
  matrix?: DitherMatrix
  pxSize?: number
  colorFg?: string
  blockCount?: number
  animationSpeed?: number
  minBlockSize?: number
  maxBlockSize?: number
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

// ── Bayer matrices ─────────────────────────────────────────────────────────
const B2 = [0, 2, 3, 1]
const B4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const B8 = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36,
  14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23,
  61, 29, 53, 21,
]

function getBayer(ix: number, iy: number, matrix: DitherMatrix): number {
  if (matrix === "bayer2") return B2[(iy % 2) * 2 + (ix % 2)] / 4
  if (matrix === "bayer4") return B4[(iy % 4) * 4 + (ix % 4)] / 16
  return B8[(iy % 8) * 8 + (ix % 8)] / 64
}

// ── Seeded random for consistent block generation ──────────────────────────
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

// ── Generate overlapping blocks with mosaic layout ─────────────────────────
function generateBlocks(
  count: number,
  canvasWidth: number,
  canvasHeight: number,
  minSize: number,
  seed: number = 42
): Block[] {
  const rand = seededRandom(seed)
  const blocks: Block[] = []

  // Grid unit size for snapping (like the image)
  const gridUnit = minSize

  // Block sizes in grid units (matching image proportions)
  const sizes = [
    { w: 1, h: 1 },
    { w: 1, h: 2 },
    { w: 2, h: 1 },
    { w: 2, h: 2 },
    { w: 2, h: 3 },
    { w: 3, h: 2 },
    { w: 3, h: 3 },
    { w: 1, h: 3 },
    { w: 3, h: 1 },
    { w: 4, h: 2 },
    { w: 2, h: 4 },
  ]

  // Density levels for dithering (matches image: sparse, medium, dense, solid)
  // Avoiding 0 to ensure all blocks are visible
  const densityLevels = [0.15, 0.25, 0.4, 0.55, 0.75, 1.0]

  const gridCols = Math.ceil(canvasWidth / gridUnit)
  const gridRows = Math.ceil(canvasHeight / gridUnit)

  for (let i = 0; i < count; i++) {
    // Pick size from predefined sizes
    const sizeIdx = Math.floor(rand() * sizes.length)
    const size = sizes[sizeIdx]

    // Random grid position (allow partial overflow for edge variety)
    const gridX = Math.floor(rand() * gridCols) - 1
    const gridY = Math.floor(rand() * gridRows) - 1

    const x = gridX * gridUnit
    const y = gridY * gridUnit
    const width = size.w * gridUnit
    const height = size.h * gridUnit

    // Pick densities - bias toward distinct levels
    const densityIdx = Math.floor(rand() * densityLevels.length)
    const density = densityLevels[densityIdx]

    // Target density can be same or different for subtle animation
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
      speed: 0.05 + rand() * 0.15, // Slower, subtler animation
      layer: i, // Each block has unique layer for proper z-ordering
    })
  }

  return blocks
}

// ── Render a single block with dithering ───────────────────────────────────
function renderBlock(
  ctx: CanvasRenderingContext2D,
  block: Block,
  density: number,
  ps: number,
  matrix: DitherMatrix,
  canvasWidth: number,
  canvasHeight: number
) {
  // Get pixel bounds for this block (clipped to canvas)
  const startCol = Math.max(0, Math.floor(block.x / ps))
  const endCol = Math.min(Math.ceil(canvasWidth / ps), Math.ceil((block.x + block.width) / ps))
  const startRow = Math.max(0, Math.floor(block.y / ps))
  const endRow = Math.min(Math.ceil(canvasHeight / ps), Math.ceil((block.y + block.height) / ps))

  for (let row = startRow; row < endRow; row++) {
    for (let col = startCol; col < endCol; col++) {
      const threshold = getBayer(col, row, matrix)
      if (density > threshold) {
        ctx.fillRect(col * ps, row * ps, ps, ps)
      }
    }
  }
}

// ── Component ──────────────────────────────────────────────────────────────
export function DitherMosaic({
  matrix = "bayer8",
  pxSize = 3,
  colorFg = "#0066FF",
  blockCount = 35,
  animationSpeed = 0.1,
  minBlockSize = 60,
  className,
}: DitherMosaicProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blocksRef = useRef<Block[]>([])
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef(Date.now())
  const seedRef = useRef(Math.floor(Math.random() * 10000))

  useEffect(() => {
    const canvas = canvasRef.current!
    const container = containerRef.current!
    const ctx = canvas.getContext("2d")!

    let dpr = 1

    const resize = () => {
      dpr = window.devicePixelRatio || 1
      const W = container.clientWidth
      const H = container.clientHeight
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = W + "px"
      canvas.style.height = H + "px"

      // Regenerate blocks on resize
      blocksRef.current = generateBlocks(
        blockCount,
        canvas.width,
        canvas.height,
        minBlockSize * dpr,
        seedRef.current
      )
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const [r, g, b] = hexToRgb(colorFg)

    const render = () => {
      const elapsed = (Date.now() - startTimeRef.current) * 0.001 * animationSpeed
      const ps = Math.max(1, Math.floor(pxSize * dpr))

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`

      // Render each block individually (maintains distinct boundaries)
      for (const block of blocksRef.current) {
        // Animate density with smooth oscillation
        const oscillation = Math.sin(elapsed * block.speed + block.phase)
        const t = oscillation * 0.5 + 0.5 // 0 to 1
        const currentDensity = block.density + (block.targetDensity - block.density) * t

        renderBlock(
          ctx,
          block,
          currentDensity,
          ps,
          matrix,
          canvas.width,
          canvas.height
        )
      }

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [matrix, pxSize, colorFg, blockCount, animationSpeed, minBlockSize])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          background: "transparent",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  )
}
