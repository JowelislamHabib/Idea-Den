<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# IdeaDen — Agent Guide

**What:** AI-powered project blueprint generator. Next.js frontend sends form data to a separate Express backend (port 8000) which calls Gemini API and stores results in MongoDB.

## Commands

| Where | Command | Purpose |
|-------|---------|---------|
| `./` | `npm run dev` | Next.js dev server (port 3000) |
| `./` | `npm run lint` | ESLint (flat config, `eslint.config.mjs`) |
| `./` | `npm run build` | Next.js production build |
| `../ideaden-server` | `npm run dev` | Express dev server (tsx watch, port 8000) |
| `../ideaden-server` | `npm run build` | esbuild bundle to `api/index.js` |
| `../ideaden-server` | `npm start` | Vercel serverless entry (`api/index.js`) |

No test/typecheck scripts. No CI in `.github/`.

## Architecture

- **Data flow:** Auth → Next.js → MongoDB (direct, via Better Auth). Business API → Next.js → Express (port 8000, via `@/lib/api/client.ts`) → MongoDB. AI gen → Express → Gemini API (falls to mock on failure).
- **Server repo:** `../ideaden-server`. CommonJS (`"type": "commonjs"`, `module.exports = app` for Vercel compat).
- **Auth:** Better Auth at `src/app/api/auth/[...all]/route.ts`. MongoDB native adapter, email/password + Google OAuth.
- **Protected routes:** Client-side guard using `useSession()` from `@/lib/auth-client` + `<AuthRequired>`.
- **State:** TanStack Query (React Query v5).
- **Env:** Two `.env` files — one in `./` (Next.js), one in `../ideaden-server/` (Express). Both committed.

## Server env loading gotcha

Do NOT use `require("dotenv")` + `dotenv.config()` at the top of any module imported early by the server. tsx/esbuild hoists `import` statements above `require()` calls, so env vars aren't set yet when module-level code runs. Instead use `import "dotenv/config"` as the **first** import (e.g. `config/db.ts:1`). This guarantees env is loaded before any other module-level code.

## Conventions

- **shadcn/ui style:** `"base-luma"` — not new-york or default. Component source is `components.json`.
- **CSS:** Tailwind v4 (`@tailwindcss/postcss`), `tw-animate-css`, `@import "shadcn/tailwind.css"`.
- **Imports:** `@/` → `./src/*` (tsconfig paths).
- **Component exports:** Named exports only. File names: PascalCase (`Navbar.tsx`).
- **Directories:** UI primitives at `@/components/ui/`. Shared layout: `@/components/shared/`. Feature components: `@/components/{feature}/`.
- **DB:** Native MongoDB driver only. **No ORMs** (Mongoose, Prisma, etc. are banned).
- **Route groups:** Auth pages in `(auth)/login`, `(auth)/register`.

## Notable

- **Two rate limits per generation:** 15s client-side in `GeneratePage` (`handleCooldown`) AND 15s server-side per `userId` in `routes/generate.ts`. Both needed to avoid Gemini 429s.
- **Gemini mock fallback:** `services/gemini.ts:236` catches any API failure and returns a contextual mock blueprint. Do not remove — this is the safety net for free-tier quota exhaustion.
- No `lorem ipsum` allowed. Fallback mock produces real content.
- `.prompts/` contains build-order scaffolding (informational, not executable).
