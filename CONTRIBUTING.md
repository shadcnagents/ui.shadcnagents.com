# Contributing

Thanks for your interest in contributing to shadcnagents — the AI SDK agent pattern registry.

## About this repository

This is a monorepo using [pnpm](https://pnpm.io) workspaces and [Turborepo](https://turbo.build/repo). It contains production-ready Vercel AI SDK patterns for workflows, tool calling, and agent orchestration.

## Tech Stack

- **Next.js 16** — App Router, React Server Components, Turbopack
- **React 19** — Server Components, Server Actions
- **Tailwind CSS v4** — OKLCH color space, CSS-based config
- **AI SDK v6** — Vercel AI SDK for agent patterns
- **Turborepo** — Monorepo build system
- **Fumadocs** — Documentation framework
- **shadcn/ui** — Radix UI components

## Project Structure

```
apps/
  www/                    — Next.js app (shadcnagents.com)
    app/                  — App Router pages
    components/           — React components
    config/               — Site, docs, and pattern configuration
    content/docs/         — MDX documentation (Fumadocs)
    registry/
      stacks/             — AI SDK pattern implementations
      ui.ts               — UI component registry
      examples.ts         — Example registry
      registry-stacks.ts  — Stacks registry definitions
    styles/               — Global CSS (Tailwind v4)
```

## Development Setup

### Prerequisites

- Node.js 20+
- pnpm 9+

### Install dependencies

```bash
pnpm install
```

### Environment variables

Copy the example environment file:

```bash
cp apps/www/.env.example apps/www/.env.local
```

Required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `OPENAI_API_KEY` — For AI SDK patterns
- `ANTHROPIC_API_KEY` — For Claude patterns

### Run the dev server

```bash
pnpm dev
```

The site runs at [http://localhost:3003](http://localhost:3003).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm lint` | Run ESLint |
| `pnpm registry:build` | Rebuild component registry |
| `pnpm --filter www registry:build:stacks` | Rebuild stacks registry |
| `pnpm --filter www new-pro-stack` | Create a new pro stack |

## Adding Stacks

Stacks are AI SDK patterns located in `apps/www/registry/stacks/`. Each stack is a self-contained implementation.

### Stack structure

```
registry/stacks/
  my-new-stack/
    app/
      page.tsx            — Main page component
      layout.tsx          — Layout wrapper
      api/
        route.ts          — API route (if needed)
    components/
      my-component.tsx    — Stack-specific components
```

### Steps to add a stack

1. Create the stack directory in `registry/stacks/`
2. Add the implementation files
3. Register the stack in `registry/registry-stacks.ts`
4. Add stack metadata in `config/stacks.ts`
5. Run `pnpm --filter www registry:build:stacks`
6. Add documentation in `content/docs/` if applicable

### Stack previews

Stack preview components go in `components/stack-previews/`. These are displayed in the stacks grid at `/stacks`.

## Adding Components

UI components live in `registry/default/ui/`. When adding components:

1. Add the component definition to `registry/ui.ts`
2. Add component files to `registry/default/ui/`
3. Run `pnpm registry:build`
4. Add documentation in `content/docs/components/`

## Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Use `cn()` utility for className merging
- Prefer Server Components where possible
- Use `"use client"` directive only when necessary

## Commit Convention

Use conventional commits: `category(scope): message`

| Category | Description |
|----------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that is not a fix or feature |
| `docs` | Documentation changes |
| `build` | Build system or dependency changes |
| `chore` | Maintenance tasks |

Examples:
```
feat(stacks): add web-search agent pattern
fix(layout): resolve Suspense boundary flash
docs(readme): update setup instructions
```

## Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes
4. Run type checking: `pnpm typecheck`
5. Commit with conventional commit message
6. Push and open a PR

## Questions?

Open an issue on [GitHub](https://github.com/shadcnagents/ui.shadcnagents.com/issues).
