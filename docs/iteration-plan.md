# Chemico Compliance Copilot — Iteration Plan

Last updated: 2026-04-15

## Overview

7 iterations, each a discrete shippable step. Small scope by design — token and rate-limit aware.

---

## Iteration 1 — Foundation & Shell
**Status:** In Progress

- Next.js 16 App Router + TypeScript + Tailwind + shadcn/ui
- Chemico brand colors (navy `#0A2342`, teal `#00B2A9`) applied via OKLCH CSS variables
- Inter font, TooltipProvider, updated metadata
- Sidebar layout with Chemico branding and nav links
- 5 placeholder routes: `/dashboard`, `/copilot`, `/documents`, `/sites`, `/reports`
- Root `/` redirects to `/dashboard`
- `.env.local.example` with all required keys

**Steps:**
- [x] Scaffold Next.js 16 with pnpm
- [x] Initialize shadcn/ui + install all components
- [x] Apply brand colors to `globals.css`
- [x] Update `layout.tsx` (Inter font, TooltipProvider, metadata)
- [ ] Sidebar shell layout (`app/(protected)/layout.tsx` + `app-sidebar.tsx`)
- [ ] 5 placeholder pages
- [ ] `.env.local.example`

---

## Iteration 2 — Supabase + Mock Data
**Status:** Pending

- Connect Supabase client (server + client helpers)
- DDL: `CREATE EXTENSION IF NOT EXISTS vector` + all tables
- `hnsw` index on `document_chunks.embedding vector_cosine_ops`
- Seed realistic mock data (50 sites, SDS docs, compliance alerts)
- RLS: permissive SELECT, no write policies (read-only demo)
- Service role key used server-side only

**Tables:** `sites`, `documents`, `document_chunks`, `chat_sessions`, `chat_messages`, `compliance_alerts`, `reports`

---

## Iteration 3 — Dashboard
**Status:** Pending

- KPI cards: overall compliance score, open alerts (critical/warning/info), sites at risk, SDS pending review
- Compliance trend chart (shadcn charts over seeded data)
- Recent alerts table
- Site compliance summary list
- All data from Supabase via server components

---

## Iteration 4 — AI Copilot Chat
**Status:** Pending

- Route: `src/app/api/chat/route.ts` with `export const runtime = 'nodejs'`
- `buildMessages({ history, userInput, ragChunks? })` — pure function, ragChunks optional (seam for Iteration 5)
- Claude `claude-sonnet-4-6` streaming via Anthropic SDK; return `stream.toReadableStream()`
- Chat UI via shadcn blocks; session list sidebar; streaming message display
- Chemico compliance system prompt
- Chat sessions persisted to Supabase

---

## Iteration 5 — Document Library + RAG
**Status:** Pending

- Document table UI with filters (type, site, status)
- `scripts/embed.ts` — local Node one-shot script to chunk + embed seeded docs into pgvector
- OpenAI `text-embedding-3-small` for embeddings
- `RAG_ENABLED` env flag — when false or retrieval throws, calls `buildMessages` without `ragChunks`
- Wire retrieved chunks into `buildMessages` — no UI rework needed
- Citation display in chat responses

---

## Iteration 6 — Sites Page
**Status:** Pending

- Sites table with compliance score, status badge, open alert count
- Site detail drawer: linked documents, open alerts, compliance history
- Filter by state, industry, status
- "Ask Copilot about this site" → `/copilot` with prefilled input

---

## Iteration 7 — Reports + Polish
**Status:** Pending

- Reports page: SARA threshold, VOC, audit history, site compliance (pre-seeded rows)
- shadcn charts over seeded data
- Nav polish, loading skeletons, empty states
- Demo script walkthrough
- Final brand pass

---

## Environment Variables

```env
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-4-6
OPENAI_API_KEY=
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RAG_ENABLED=false
```

## Key Decisions

| Decision | Choice | Reason |
|---|---|---|
| Package manager | pnpm | Faster than npm |
| UI components | shadcn/ui only (core + registry blocks) | Consistency, no custom components |
| Font | Inter | Matches Chemico website |
| Color space | OKLCH | Tailwind v4 default |
| Embeddings | OpenAI `text-embedding-3-small` | Cheapest, fast, 1536 dimensions |
| LLM | Anthropic Claude `claude-sonnet-4-6` | Live, non-deterministic responses |
| RAG retrieval | pgvector + hnsw index | Built into Supabase, no extra service |
| Route group | `(protected)` | Matches PRD spec |
| Chunking script | Local Node `scripts/embed.ts` | One-shot for demo seeding |
