<p align="center">
    <img src="https://ideaden.vercel.app/ideaden-color.png" alt="IdeaDen Logo" width="400" />
</p>

<p align="center">
  <strong>AI-powered project idea & blog content generator</strong>
</p>

<p align="center">
  <a href="https://ideaden.vercel.app">
    <img src="https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
</p>

---

## Overview

**IdeaDen** is a full-stack AI-powered platform that transforms vague ideas into structured project ideas and publish-ready blog content. Built with **Next.js 16** and a **Node.js/Express backend**, it leverages **Google Gemini AI** to generate comprehensive project specs, technical roadmaps, and SEO-optimized articles in seconds.

### The Problem

Every developer faces the blank screen problem — you want to build something but can't decide what. Hours are wasted brainstorming, researching tech stacks, and structuring project plans. Content creators struggle with writer's block, topic research, and SEO optimization. IdeaDen eliminates these bottlenecks with AI-powered generation tailored to your preferences and tech stack.

---

## Features

### AI Project Idea Generator

- Complete project ideas with problem statement, solution, target audience, and key features
- Recommended tech stack with rationale per category
- Competitive analysis and differentiation points
- Step-by-step implementation first steps
- De-duplication against previously generated ideas
- Developer preference-aware (stack, experience, focus)

### AI Blog Content Generator

- 6 templates: Standard, How-To Guide, Listicle, Thought Leadership, Case Study, Review
- 6 tones: Professional, Casual, Humorous, Persuasive, Inspirational, Educational
- 3 lengths: Short (~500 words), Medium (~1000 words), Long (~1500 words)
- Custom SEO keyword integration for better ranking
- Regeneration support with content de-duplication

### Explore Community Ideas

- Browse AI-generated project ideas and blog articles from the community
- Full-text search across titles and descriptions
- Filter by duration (1 week to 2 months)
- Sort by newest or oldest
- Pagination for browsing thousands of entries
- Related ideas on detail pages

### Personal Dashboard

- Stats cards for total ideas, blogs, unique tech stacks, blog topics
- Tech stack distribution donut chart (Recharts)
- Blog topic distribution donut chart (Recharts)
- 14-day generation timeline area chart (Recharts)

### Authentication and Security

- Email/password registration and login
- Google OAuth integration
- JWT-based sessions with httpOnly cookies
- Role-based access control (Free, Pro)
- User profile with developer preferences

### User Experience

- Dark/light mode with system preference detection
- Fully responsive across mobile, tablet, and desktop
- Smooth scroll animations
- Glassmorphism cards with backdrop blur effects
- shadcn/ui components

---

## Tech Stack

| Category       | Technology                             |
| -------------- | -------------------------------------- |
| **Frontend**   | Next.js 16 (App Router), React 19      |
| **Backend**    | Express 5, TypeScript                  |
| **Database**   | MongoDB (native driver, no Mongoose)   |
| **Auth**       | Better Auth (frontend), JWKS (backend) |
| **AI**         | Google Gemini Flash Lite               |
| **Styling**    | Tailwind CSS v4, shadcn/ui             |
| **State**      | TanStack Query                         |
| **Charts**     | Recharts                               |
| **Icons**      | Lucide React                           |
| **Animations** | Custom IntersectionObserver hooks      |
| **Deployment** | Vercel (both frontend and backend)     |

---

## Architecture

The system runs as two separate Vercel deployments communicating over HTTP:

```
+-------------------------------------------------------------------+
|                       FRONTEND (Next.js 16)                       |
|                                                                   |
|   +--------------+   +--------------+   +--------------+          |
|   |  App Router  |   |  Auth Flow   |   |   UI Layer   |          |
|   |   (Pages)    |   |(Better Auth) |   | (shadcn/ui)  |          |
|   +------+-------+   +------+-------+   +--------------+          |
|          |                  |                                     |
|          |              (MongoDB)                                 |
|          |                  |                                     |
|   +------v------------------v------+                              |
|   |      Server Actions Layer      |                              |
|   |     (Authentication + JWT)     |                              |
|   +----------------+---------------+                              |
+--------------------+----------------------------------------------+
                     |
                     | JWT token
                     +--> Authorization: Bearer <token>
                     |
                     v
+-------------------------------------------------------------------+
|                       EXTERNAL BACKEND API                        |
|                         (Express 5 API)                           |
|              (Idea CRUD, Blog CRUD, Gemini AI)                    |
|                                                                   |
|                            (MongoDB)                              |
+-------------------------------------------------------------------+
```

### How Auth Works Across the Boundary

The frontend owns authentication via Better Auth (connected directly to MongoDB). When server actions need to call the backend, they extract a JWT from the session and pass it in the `Authorization` header. The backend verifies the JWT by fetching the JWKS endpoint from the frontend (`${CLIENT_URL}/api/auth/jwks`) — it never handles passwords or sessions directly.

### Backend Details

- **Express 5** with TypeScript and separate route files
- **MongoDB native driver** — no ORM, direct collection access
- **esbuild** bundles to a single `api/index.js` for Vercel serverless
- **JWT verification** via remote JWKS using `jose`
- **Two Gemini AI services** — one for project ideas (structured JSON), one for blogs (markdown content)
- **Rate limiting** — 15s per-user cooldown + daily quotas (3/day free, unlimited Pro)
- **De-duplication** — prevents generating similar content to user's previous items

---

## Getting Started

This project has two repositories:

- **Frontend**: `ideaden` (this repo) — Next.js 16
- **Backend**: `ideaden-server` ([Idea-Den-Server](https://github.com/JowelislamHabib/Idea-Den-Server)) — Express 5 API server

Both must be running for full functionality.

### Prerequisites

- Node.js 18+
- MongoDB database (shared between frontend and backend)
- Google Gemini API key
- Backend running at `http://localhost:8000`

### Frontend Setup

```bash
git clone https://github.com/JowelislamHabib/Idea-Den.git
cd idea-den
npm install
```

Create a `.env.local` file:

```env
# MongoDB (for Better Auth)
MONGODB_URI=your_mongodb_connection_string

# Better Auth
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Backend API
NEXT_PUBLIC_BASE_URL=http://localhost:8000

# Image Upload (ImgBB)
NEXT_PUBLIC_IMAGE_UPLOAD_API=your_imgbb_api_key

# Stripe (for Pro plan)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Backend Setup

```bash
git clone https://github.com/JowelislamHabib/Idea-Den-Server.git
cd idea-den-server
npm install
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:3000
PORT=8000
```

```bash
npm run dev
```

Backend runs on [http://localhost:8000](http://localhost:8000).

### Production

```bash
# Frontend
npm run build && npm run start

# Backend
npm run build && npm start
```

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Login/Register pages
│   ├── generate/                 # AI generation pages (ideas, blogs)
│   ├── explore/                  # Browse community content
│   ├── dashboard/                # User analytics dashboard
│   ├── about/, contact/          # Static pages
│   └── api/auth/[...all]/        # Better Auth catch-all handler
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── shared/                   # Navbar, Footer, AuthRequired
│   ├── home/                     # Landing page sections
│   ├── explore/                  # IdeaCard, BlogCard
│   └── dashboard/                # Dashboard components
├── lib/
│   ├── auth.ts                   # Better Auth server config
│   ├── auth-client.ts            # Better Auth client
│   ├── api/
│   │   ├── client.ts             # API fetch wrapper with auth
│   │   ├── get-token.ts          # Client-side JWT retrieval
│   │   └── uploadImage.ts        # ImgBB image upload
│   ├── getTokenServer.ts         # Server-side JWT extraction
│   └── utils.ts                  # cn() and helpers
└── public/
```

---

## Server Actions & API Client

The frontend uses **TanStack Query** for data fetching with an `apiClient` wrapper that handles authentication. Server-side, it uses **getTokenServer** to extract JWTs from httpOnly cookies for backend calls.

### Auth Flow Code

```typescript
// Server-side session validation
const session = await auth.api.getSession({ headers: await headers() });

// JWT token extraction for backend calls
const token = await getTokenServer();
// Passed as: Authorization: Bearer <token>
```

### Client-side API usage

```typescript
const { data } = useQuery({
  queryKey: ["my-ideas"],
  queryFn: async () => {
    const token = await getToken();
    return apiClient<{ ideas: Idea[] }>("/api/ideas/mine", { token });
  },
});
```

---

## Use Cases

| Persona                | How They Use IdeaDen                         |
| ---------------------- | -------------------------------------------- |
| Solo Developers        | Generate project ideas for portfolio builds  |
| Startup Founders       | Validate concepts with structured specs      |
| Hackathon Participants | Get a complete project plan in minutes       |
| Students               | Find capstone ideas with tech stack guidance |
| Content Creators       | Generate SEO-optimized blog posts            |
| Tech Bloggers          | Overcome writer's block with AI drafts       |
| Freelancers            | Quickly scope projects for clients           |

---

## Deployment

Deployed on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/JowelislamHabib/Idea-Den)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Author

**Jowel Islam Habib**

- GitHub: [@JowelislamHabib](https://github.com/JowelislamHabib)
- LinkedIn: [Jowel Islam Habib](https://www.linkedin.com/in/jowelislamhabib/)
- Email: [Jowel@Bintofajjal.com](mailto:Jowel@Bintofajjal.com)
