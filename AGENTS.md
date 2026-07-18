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

**No test/typecheck scripts. No CI.** Only build check before committing.

## Architecture

- **Data flow:** Auth → Next.js → MongoDB (via Better Auth, direct). Business API → Next.js → Express (`@/lib/api/client.ts`) → MongoDB. AI gen → Express → Gemini API.
- **Server repo:** `../ideaden-server`. CommonJS (`"type": "commonjs"`), Express 5. Imports `"dotenv/config"` as first import in `config/db.ts:1` (tsx/esbuild hoists `import` above `require`).
- **Server routes:** `/api/ideas/generate` (generate.ts), `/api/ideas` (ideas.ts CRUD + `/quota`, `/mine`), `/api/blogs` (blogs.ts CRUD + generate + `/quota`, `/mine`), `/api/users` (users.ts profile).
- **Auth:** Better Auth at `src/app/api/auth/[...all]/route.ts`. MongoDB native adapter, email/password + Google OAuth. Uses `adminClient()` + `jwtClient()` plugins. JWT via `cookieCache` strategy.
- **Protected routes:** `<AuthRequired>` wrapper + `useSession()` from `@/lib/auth-client`.
- **JWT for Express API:** Server-side: `@/lib/getTokenServer.ts` reads JWT from httpOnly cookie. Client-side: `fetch("/api/auth/get-token")` retrieves JWT. Pass as `{ token }` option to `apiClient()` which sets `Authorization: Bearer <token>` header.
- **State:** TanStack Query (React Query v5) via `src/app/providers.tsx`.
- **Env:** `.env` gitignored (`.gitignore` has `.env*`). Required vars: `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `MONGODB_URI`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_IMAGE_UPLOAD_API` (ImgBB key), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Do NOT commit env files.
- **Daily quota:** Free users limited to **3 ideas/day** AND **3 blogs/day** (separate per-type quotas). Server-side, checked after rate limit.
- **User lookup:** Dual query `${or: [{_id: ObjectId(userId)}, {id: userId}]}` — Better Auth stores `id` as string, not ObjectId.

## Conventions

- **UI:** shadcn `"base-luma"` style (`components.json`). Tailwind v4 (`@tailwindcss/postcss`), `tw-animate-css`, `@import "shadcn/tailwind.css"`.
- **CSS lib:** `tailwind-merge`, `class-variance-authority`, `clsx`.
- **Icons:** `lucide-react` only. No emojis.
- **Imports:** `@/` → `./src/*`.
- **Components:** Named exports. PascalCase filenames. UI primitives at `@/components/ui/`, shared at `@/components/shared/` (Navbar in `Navbar/Navbar.tsx`, Footer in `Footer/Footer.tsx`), feature components at `@/components/{feature}/`.
- **Animations:** Custom `motion-wrapper.tsx` — exports `FadeIn`, `SlideUp`, `StaggerContainer`, `StaggerItem`, `Float`. IntersectionObserver-based, does not use Framer Motion (though framer-motion ^12 is in deps).
- **Page wrappers:** Home sections use `mx-auto max-w-7xl px-4 sm:px-6`. Other pages use `max-w-6xl px-4 sm:px-6`.
- **Route groups:** Auth at `(auth)/login`, `(auth)/register`.
- **DB:** Native MongoDB driver only. No ORMs.

## Notable

- **Gemini:** Uses `gemini-flash-lite` with `responseMimeType: "application/json"` via raw `fetch()` (not Google SDK). Two services: `services/gemini.ts` (ideas, JSON) and `services/gemini-blog.ts` (blogs, JSON with markdown content field).
- **Server build:** `esbuild index.ts --bundle --platform=node --outfile=api/index.js --external:express --external:cors --external:mongodb --external:dotenv`
- **Two rate limits per generation:** 15s client-side (`handleCooldown` in generate pages) AND 15s server-side per `userId` (in-memory Map in `routes/{generate,blogs}.ts`). Both needed.
- **Icon hover pattern:** Home section icon boxes use `transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground` (container has `group`, icon box has `bg-primary/10 border border-primary/20`, icon has `text-primary`).
- **Fonts in layout:** Inter (`--font-sans`), Geist (`--font-geist-sans`), Geist_Mono (`--font-geist-mono`), Space_Grotesk (`--font-heading`). `className` applies all via CSS variables.
- **Image upload:** Client-side via ImgBB API (`@/lib/api/uploadImage.ts`). Uses `NEXT_PUBLIC_IMAGE_UPLOAD_API`. Direct browser→ImgBB upload, not through backend.
- **Utilities in deps:** `sonner` (toasts), `recharts` (charts), `react-markdown` (markdown render), `@tailwindcss/typography` (prose styling).
- **`PRD.md`** is gitignored (project spec, not part of app).
