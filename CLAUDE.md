# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev             # Start dev server with Turbopack
npm run build           # Production build
npm run lint            # ESLint (strict: max-warnings 0)
npm run check:types     # TypeScript type check
npm run check:prettier  # Prettier format check
npm run format          # Auto-format with Prettier
```

Unit tests run with **Vitest** (`src/**/*.test.ts(x)`); E2E guardrails with **Playwright** (`e2e/`).

```bash
npm run test           # Vitest unit tests (run once)
npm run test:watch     # Vitest in watch mode
npm run test:e2e       # Playwright E2E tests
```

## Architecture

This is a Next.js App Router personal blog at oazevedo.dev. TypeScript strict mode, Tailwind CSS 4, MDX for blog content.

### Content pipeline

Blog posts are `.mdx` files in `src/app/blog/posts/`. The `getBlogPosts()` utility in `src/app/blog/utils.ts` reads and serializes them using `next-mdx-remote` with:

- Remark plugins: GFM, reading time, emoji, TOC extraction
- Rehype plugins: Shiki (dark-plus theme) for syntax highlighting, slug + autolink headings

The `[slug]` dynamic route generates static pages at build time. `BlogContent` (`src/app/blog/[slug]/blog-content.tsx`) is a client component that renders the serialized MDX.

### Key directories

- `src/app/` — Next.js App Router pages and routes (blog, OG image, RSS, sitemap, robots)
- `src/components/` — Shared React components; `table-of-contents/` is the most complex (~430 LOC with its own hooks and context)
- `src/hooks/` — Custom hooks for TOC anchor observation, clipboard, scroll position
- `src/lib/` — Constants (site name, base URL), `cn()` CSS utility, custom Shiki transformers
- `src/app/blog/posts/` — MDX blog post content

### Path alias

`@/*` maps to `src/*` (configured in `tsconfig.json`).

### Code style

- Imports ordered by ESLint `import/order` rule (enforced)
- Prettier: single quotes, 80-char width, Tailwind class sorting via `prettier-plugin-tailwindcss`
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, etc.
- Pre-commit hook runs `lint-staged` (Prettier + ESLint fix on changed files)
