/**
 * VARIANTS FEATURE - DISABLED
 *
 * This feature has been disabled. Each component now has a single, focused demo.
 * If you want different use cases, create separate components instead.
 *
 * Original philosophy was to show the same AI pattern applied to different industries,
 * but this added complexity without clear value. Components like generate-text,
 * stream-text, etc. are primitives - the "variants" are actually showing WHAT you
 * can build with them, which is better represented as separate, dedicated components.
 */

export interface StackVariant {
  id: string
  name: string
  description: string
  industry?: string
  isDefault?: boolean
  isPro?: boolean
}

// Empty variants - feature disabled
export const stackVariants: Record<string, StackVariant[]> = {}

export function getStackVariants(slug: string): StackVariant[] {
  return []
}

export function hasVariants(slug: string): boolean {
  return false
}
