import { MainNavItem, SidebarNavItem } from "types/nav"

interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Stacks",
      href: "/stacks",
    },
    {
      title: "Agents",
      href: "/agents",
    },
    {
      title: "Chat",
      href: "/chat",
    },
    {
      title: "Templates",
      href: "/templates",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
          items: [],
        },
        {
          title: "Installation",
          href: "/docs/installation",
          items: [],
        },
        {
          title: "Patterns Overview",
          href: "/docs/patterns/overview",
          items: [],
          label: "new",
        },
        {
          title: "Theming",
          href: "/docs/theming",
          items: [],
        },
        {
          title: "Changelog",
          href: "/docs/changelog",
          items: [],
        },
      ],
    },
    {
      title: "AI",
      items: [
        {
          title: "AI Elements",
          href: "/docs/ai/ai-elements",
          items: [],
          label: "new",
        },
        {
          title: "AI SDK Blocks",
          href: "/docs/ai/ai-sdk-blocks",
          items: [],
          label: "new",
        },
      ],
    },
    {
      title: "Prompts",
      items: [
        {
          title: "Few-Shot Prompting",
          href: "/docs/prompts/few-shot-prompting",
          items: [],
          label: "new",
        },
        {
          title: "Context Engineering",
          href: "/docs/prompts/context-engineering",
          items: [],
          label: "new",
        },
      ],
    },
    {
      title: "Agents",
      items: [
        {
          title: "Building Agents",
          href: "/docs/agents/building-agents",
          items: [],
          label: "new",
        },
        {
          title: "Agent Patterns",
          href: "/docs/agents/agent-patterns",
          items: [],
          label: "new",
        },
        {
          title: "Router Agents",
          href: "/docs/agents/router-agents",
          items: [],
          label: "new",
        },
      ],
    },
    {
      title: "Components",
      items: [
        {
          title: "Button Group & Input Group",
          href: "/docs/components/button-group-input-group",
          items: [],
        },
      ],
    },
  ],
}
