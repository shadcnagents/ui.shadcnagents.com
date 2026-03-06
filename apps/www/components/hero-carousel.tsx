"use client"

import { useEffect, useState, useCallback } from "react"
import Autoplay from "embla-carousel-autoplay"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "@/lib/utils"
import { stackPreviewRegistry } from "@/components/stack-previews"

const HERO_STACKS = [
  { slug: "tool-websearch-claude", label: "Web Search" },
  { slug: "wdk-workflows-sequential", label: "Workflows" },
  { slug: "marketing-model-comparison-table-1", label: "Model Comparison" },
  { slug: "ai-elements-chat", label: "Chat Interface" },
  { slug: "ai-agents-routing", label: "Agent Routing" },
]

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
      containScroll: false,
    },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <div className="relative w-full">
      {/* Carousel container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {HERO_STACKS.map((stack) => {
            const PreviewComponent = stackPreviewRegistry[stack.slug]

            return (
              <div
                key={stack.slug}
                className="relative flex-[0_0_65%] px-2 transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden rounded-lg border border-border bg-background shadow-md">
                  <div className="relative h-full w-full origin-top-left scale-[0.5] overflow-hidden" style={{ width: "200%", height: "200%" }}>
                    {PreviewComponent && <PreviewComponent />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {HERO_STACKS.map((stack, index) => (
          <button
            key={stack.slug}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              selectedIndex === index
                ? "w-4 bg-primary"
                : "w-1 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Go to ${stack.label}`}
          />
        ))}
      </div>
    </div>
  )
}
