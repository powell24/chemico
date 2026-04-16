# Chemico Compliance Copilot — Iteration Plan

Last updated: 2026-04-15

## Overview

7 iterations, each a discrete shippable step. Small scope by design — token and rate-limit aware.

---

## Iteration 1 — Foundation & Shell

**Status:** Done

- Next.js 16 App Router + TypeScript + Tailwind + shadcn/ui
- Chemico brand colors applied via OKLCH CSS variables
- Inter font, sidebar layout with Chemico branding and nav links
- 6 placeholder routes: `/dashboard`, `/copilot`, `/documents`, `/sites`, `/reports`, `/settings`
- Root `/` redirects to `/dashboard`

**Steps:**

- [x] Scaffold Next.js 16 with pnpm
- [x] Initialize shadcn/ui + install all components
- [x] Apply brand colors to `globals.css`
- [x] Update `layout.tsx` (Inter font, metadata)
- [x] Sidebar shell layout (`app/(protected)/layout.tsx` + `app-sidebar.tsx`)
- [x] 6 placeholder pages with skeletons
- [x] Login + signup pages with chemical-themed split-screen design

---

## Iteration 2 — Supabase + Mock Data

**Status:** Done

- Supabase browser + server clients via `@supabase/ssr` (anon key only — no service role)
- DDL: pgvector extension + 7 tables + HNSW index + RLS policies
- Seed: 50 sites, 23 documents, 34 compliance alerts, 6 reports
- RLS: permissive SELECT for anon; INSERT/UPDATE requires `auth.uid() = user_id`
- `.env.local` wired with OpenAI + Supabase keys

**Steps:**

- [x] Supabase browser client (`src/lib/supabase/client.ts`)
- [x] Supabase server client (`src/lib/supabase/server.ts`)
- [x] DDL — all 7 tables, HNSW index, RLS policies
- [x] Seed data — 50 sites, 23 docs, 34 alerts, 6 reports
- [x] `.env.local` configured

**Tables:** `sites`, `documents`, `document_chunks`, `chat_sessions`, `chat_messages`, `compliance_alerts`, `reports`

---

## Iteration 3 — Dashboard

**Status:** In Progress

- KPI cards: overall compliance score, open alerts (critical/warning/info), sites at risk, SDS pending review
- Compliance trend chart (hardcoded time-series, no time-series table in DB)
- Recent alerts table with severity badges
- Site compliance summary — 10 worst sites
- All data from Supabase via Server Components (no client-side fetching)

**Steps:**

- [ ] Create `src/lib/supabase/queries/dashboard.ts`
  - `getDashboardMetrics()` — avg compliance score, alert counts by severity, sites at risk count, docs pending count
  - `getRecentAlerts(limit)` — open alerts joined with site name, ordered by severity + date
  - `getSitesSummary(limit)` — sites ordered by compliance_score asc (worst first)
- [ ] KPI cards (4) — overall score, critical alerts, sites at risk, SDS pending
- [ ] Recent alerts table — severity badge, title, site name, category, relative date
- [ ] Site compliance summary list — site name, location, industry, score bar, status badge
- [ ] Compliance trend chart — hardcoded 30-day mock time-series using shadcn charts
- [ ] Wire `app/(protected)/dashboard/page.tsx` as Server Component pulling live Supabase data

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
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RAG_ENABLED=false
```

## Key Decisions

| Decision          | Choice                                  | Reason                                          |
| ----------------- | --------------------------------------- | ----------------------------------------------- |
| Package manager   | pnpm                                    | Faster than npm                                 |
| UI components     | shadcn/ui only (core + registry blocks) | Consistency, no custom components               |
| Font              | Inter                                   | Matches Chemico website                         |
| Color space       | OKLCH                                   | Tailwind v4 default                             |
| LLM               | OpenAI `gpt-4o-mini`                    | Cost-effective, fast, live non-deterministic    |
| Embeddings        | OpenAI `text-embedding-3-small`         | Cheapest, fast, 1536 dimensions                 |
| RAG retrieval     | pgvector + HNSW index                   | Built into Supabase, no extra service           |
| Auth credentials  | Anon key only — no service role key     | Security-first; seed data via SQL Editor        |
| Route group       | `(protected)`                           | Matches PRD spec                                |
| Chunking script   | Local Node `scripts/embed.ts`           | One-shot for demo seeding                       |
