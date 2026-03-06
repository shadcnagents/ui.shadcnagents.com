"use client"

import { stackPreviewRegistry } from "@/components/stack-previews"

const GRID_STACKS = [
  // Row 1 - starts from col 3 (right side, no overlap with title)
  { slug: "tool-websearch-claude", row: 1, col: 3 },
  { slug: "ai-agents-routing", row: 1, col: 5 },
  // Row 2 - starts from col 2
  { slug: "ai-elements-chat", row: 2, col: 2 },
  { slug: "ai-artifact-chart", row: 2, col: 4, featured: true },
  // Row 3 - can use col 1 now (below title)
  { slug: "basics-generate-text", row: 3, col: 1 },
  { slug: "ai-elements-reasoning-chat", row: 3, col: 3 },
  { slug: "marketing-model-comparison-table-1", row: 3, col: 5, featured: true },
  // Row 4
  { slug: "ai-workflow-basic", row: 4, col: 2 },
  { slug: "ai-elements-sources-chat", row: 4, col: 4 },
  // Row 5
  { slug: "ai-elements-plan", row: 5, col: 1 },
  { slug: "json-render-generate", row: 5, col: 3 },
  { slug: "ai-artifact-table", row: 5, col: 5 },
]

export function HeroGrid() {
  return (
    <div className="absolute -top-4 left-[42%] w-[1000px]">
      {/* Dashed vertical lines */}
      <div className="pointer-events-none absolute inset-0">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute bottom-0 top-0 border-l border-dashed border-foreground/10"
            style={{ left: `${i * 20}%` }}
          />
        ))}
      </div>

      {/* Dashed horizontal lines */}
      <div className="pointer-events-none absolute inset-0">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-dashed border-foreground/10"
            style={{ top: `${i * 20}%` }}
          />
        ))}
      </div>

      {/* Grid with stacks */}
      <div
        className="relative grid"
        style={{
          gridTemplateColumns: "repeat(5, 180px)",
          gridTemplateRows: "repeat(5, 180px)",
          gap: "0px",
        }}
      >
        {GRID_STACKS.map((stack) => (
          <GridCard
            key={stack.slug}
            slug={stack.slug}
            row={stack.row}
            col={stack.col}
            featured={stack.featured}
          />
        ))}
      </div>
    </div>
  )
}

function GridCard({
  slug,
  row,
  col,
  featured = false,
}: {
  slug: string
  row: number
  col: number
  featured?: boolean
}) {
  const PreviewComponent = stackPreviewRegistry[slug]

  return (
    <div
      className={`relative size-[180px] overflow-hidden ${
        featured
          ? "rounded-xl bg-card shadow-xl ring-1 ring-border"
          : "border border-dashed border-foreground/10 bg-foreground/[0.02]"
      }`}
      style={{
        gridRowStart: row,
        gridColumnStart: col,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="overflow-hidden rounded-[inherit]"
          style={{
            width: "720px",
            height: "720px",
            transform: "scale(0.25)",
            flexShrink: 0,
          }}
        >
          {PreviewComponent && <PreviewComponent />}
        </div>
      </div>
    </div>
  )
}
