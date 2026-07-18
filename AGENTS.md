<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# IdeaDen — Agent Guide

**What:** AI-powered project blueprint generator. Next.js frontend (port 3000) → Express backend (port 8000, separate repo `../ideaden-server`) → Gemini API → MongoDB.

## Commands

| Where | Command | Purpose |
|-------|---------|---------|
| `./` | `npm run dev` | Next.js dev server (port 3000) |
| `./` | `npm run lint` | ESLint (flat config, `eslint.config.mjs`) |
| `./` | `npm run build` | Next.js production build |
| `../ideaden-server` | `npm run dev` | Express dev server (tsx watch, port 8000) |
| `../ideaden-server` | `npm run build` | esbuild bundle → `api/index.js` |
| `../ideaden-server` | `npm start` | Vercel serverless entry (`api/index.js`) |

No test/typecheck scripts. No CI in `.github/`.

## Architecture

- **Data flow:** Auth → Next.js → MongoDB (via Better Auth, direct). Business API → Next.js → Express (`@/lib/api/client.ts`) → MongoDB. AI gen → Express → Gemini API. Gemini errors are re-thrown (no mock fallback — router returns 500).
- **Server repo:** `../ideaden-server`. CommonJS (`"type": "commonjs"`), Express 5, `module.exports = app` for Vercel compat.
- **Server routes:** `/api/ideas/generate` (generate.ts), `/api/ideas` (ideas.ts ideas CRUD), `/api/blogs` (blogs.ts blogs CRUD + generate), `/api/users` (users.ts profile).
- **Auth:** Better Auth at `src/app/api/auth/[...all]/route.ts`. MongoDB native adapter, email/password + Google OAuth. Uses `adminClient()` + `jwtClient()` plugins.
- **Protected routes:** `<AuthRequired>` wrapper + `useSession()` from `@/lib/auth-client`.
- **State:** TanStack Query (React Query v5).
- **Env:** Two `.env` files — both committed (`.gitignore` has an opt-in exception).
- **Daily quota:** Free users limited to **3 generations/day** (ideas + blogs each). Checked server-side after rate limit.
- **User lookup:** Dual query `${or: [{_id: ObjectId(userId)}, {id: userId}]}` — Better Auth stores `id` as string, not ObjectId.

## Server env loading gotcha

Use `import "dotenv/config"` as the **first** import (e.g. `config/db.ts:1`). Do NOT use `require("dotenv")` + `dotenv.config()` — tsx/esbuild hoists `import` above `require`, so env vars aren't set at module level.

## Conventions

- **shadcn/ui style:** `"base-luma"` (components.json).
- **CSS:** Tailwind v4 (`@tailwindcss/postcss`), `tw-animate-css`, `@import "shadcn/tailwind.css"`.
- **Imports:** `@/` → `./src/*`.
- **Component exports:** Named exports only. File names: PascalCase.
- **Directories:** UI primitives at `@/components/ui/`, shared layout at `@/components/shared/`, feature components at `@/components/{feature}/`.
- **DB:** Native MongoDB driver only. **No ORMs.**
- **Page wrappers:** All pages use `mx-auto max-w-6xl px-4 sm:px-6` for vertical alignment with Navbar/Footer.
- **Route groups:** Auth pages in `(auth)/login`, `(auth)/register`.

## Notable

- **Gemini:** Uses `gemini-flash-lite` with `responseMimeType: "application/json"` via raw `fetch()` (not Google SDK). Two services: `services/gemini.ts` (ideas, JSON) and `services/gemini-blog.ts` (blogs, JSON with markdown content field).
- **Server build:** `esbuild index.ts --bundle --platform=node --outfile=api/index.js --external:express --external:cors --external:mongodb --external:dotenv`
- **Two rate limits per generation:** 15s client-side (`handleCooldown` in generate pages) AND 15s server-side per `userId` in `routes/{generate,blogs}.ts`. Both needed.
- **No `lorem ipsum` per PRD.**
- **Big dependency:** `shadcn` (^4.13.0) and `@base-ui/react` (^1.6.0) — the latter is installed but not obviously imported in app code (may be used by shadcn deps).
- **`PRD.md`** is gitignored (project spec, not part of app).
- **`CLAUDE.md`** just contains `@AGENTS.md`.
