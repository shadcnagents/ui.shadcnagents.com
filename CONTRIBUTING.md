# Contributing

Thanks for your interest in contributing to shadcncloud.

## About this repository

This is a monorepo using [pnpm](https://pnpm.io) workspaces and [Turborepo](https://turbo.build/repo).

## Structure

```
apps/
  www/            — Next.js 16 app (shadcncloud.com)
    app/          — App Router pages
    components/   — React components
    config/       — Configuration files
    content/docs/ — MDX documentation
    registry/     — Component registry
```

## Development

### Install dependencies

```bash
pnpm install
```

### Run the dev server

```bash
pnpm dev
```

### Build the registry

```bash
pnpm registry:build
```

## Adding Patterns

Patterns live in `apps/www/registry/`. When adding or modifying patterns:

1. Add the pattern definition to `registry/ui.ts` or `registry/examples.ts`
2. Add the component files to `registry/default/ui/` or `registry/default/example/`
3. Run `pnpm registry:build` to regenerate the registry index
4. Add documentation in `content/docs/` if applicable

## Commit Convention

Use conventional commits: `category(scope): message`

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code change that is not a fix or feature
- `docs`: Documentation changes
- `build`: Build system or dependency changes
