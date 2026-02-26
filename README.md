# shadcnagents

AI SDK agent pattern registry — full-stack Vercel AI SDK patterns for workflows, tool calling, and agent orchestration. Built with AI SDK v6 and shadcn/ui.

## Tech Stack

- **Next.js v16** — App Router, React Server Components, Turbopack (default)
- **React 19** — Server Components, Server Actions, `use()` hook
- **Tailwind CSS v4** — OKLCH color space, CSS-based config
- **AI SDK v6** — Vercel AI SDK for agent patterns
- **Turborepo** — Monorepo build system
- **Fumadocs** — Documentation framework
- **shadcn/ui** — Radix + Base UI component variants

## Getting Started

```bash
pnpm install
pnpm dev
```

The site runs at [http://localhost:3003](http://localhost:3003).

## Project Structure

```
apps/
  www/          — The main Next.js app (shadcnagents.com)
    app/        — Next.js App Router pages
    components/ — React components
    config/     — Site, docs, and pattern configuration
    content/    — MDX documentation (Fumadocs)
    registry/   — Component registry system
    styles/     — Global CSS (Tailwind v4)
```

## Key Features

- **100+ AI SDK Agent Patterns** — Copy-paste ready patterns
- **Radix + Base UI variants** — Every pattern in both UI libraries
- **Theme system** — OKLCH color themes, light/dark mode
- **Registry system** — CLI install via `npx shadcn add`
- **Fumadocs** — Full documentation site

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm www:dev` | Dev server for www only |
| `pnpm registry:build` | Rebuild component registry |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | TypeScript type checking |

## License

MIT — see [LICENSE.md](LICENSE.md)
