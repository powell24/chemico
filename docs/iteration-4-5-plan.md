# Iteration 4 & 5 — Detailed Step Plan

Last updated: 2026-04-18

---

## Iteration 4 — AI Copilot Chat

**Goal:** A fully working AI chat interface where users can ask compliance and SDS questions, powered by OpenAI gpt-4o-mini with streaming responses and persistent chat history in Supabase.

---

### Step 1 — API Route (Streaming Chat Endpoint)

- [ ] Create `src/app/api/chat/route.ts`
  - `export const runtime = 'edge'` for streaming support
  - Accept `POST` with `{ messages, sessionId }` body
  - Build system prompt: Chemico compliance assistant persona
  - Call OpenAI `gpt-4o-mini` with `stream: true`
  - Return streaming `Response` using `ReadableStream`
  - Leave a `ragChunks?` seam in `buildMessages()` for Iteration 5

- [ ] Create `src/lib/openai/client.ts`
  - Initialize OpenAI client from `OPENAI_API_KEY` env var

- [ ] Create `src/lib/openai/build-messages.ts`
  - `buildMessages({ history, userInput, ragChunks? })` — pure function
  - System prompt: Chemico SDS and compliance expert
  - Maps chat history to OpenAI message format
  - Appends RAG context block when `ragChunks` is provided (empty for now)

---

### Step 2 — Supabase Chat Queries

- [ ] Create `src/lib/supabase/queries/chat.ts`
  - `createSession(title)` — insert new `chat_sessions` row, return session id
  - `getSessionMessages(sessionId)` — fetch all `chat_messages` for a session ordered by `created_at`
  - `getSessions()` — list all sessions ordered by `updated_at` desc
  - `saveMessage({ sessionId, role, content })` — insert a `chat_messages` row

---

### Step 3 — Chat Page Layout

- [ ] Create `src/app/(protected)/copilot/page.tsx` (Server Component)
  - Fetch list of existing sessions from Supabase
  - Pass to client chat shell

- [ ] Create `src/app/(protected)/copilot/_components/chat-shell.tsx` (`"use client"`)
  - Two-column layout: session sidebar (left) + chat area (right)
  - Session list with "New Chat" button
  - Active session highlighted

---

### Step 4 — Session Sidebar

- [ ] Create `src/app/(protected)/copilot/_components/session-sidebar.tsx`
  - List of past sessions with title and relative date
  - "New Chat" button at the top
  - Clicking a session loads its messages
  - Uses shadcn `ScrollArea` for overflow

---

### Step 5 — Chat Message Area

- [ ] Create `src/app/(protected)/copilot/_components/message-list.tsx`
  - Renders user and assistant bubbles
  - User: right-aligned, brand color background
  - Assistant: left-aligned, muted background
  - Auto-scrolls to bottom on new message
  - Shows typing indicator while streaming

- [ ] Create `src/app/(protected)/copilot/_components/message-input.tsx`
  - Textarea input with send button
  - `Shift+Enter` for newline, `Enter` to send
  - Disabled while response is streaming

---

### Step 6 — Streaming Hook

- [ ] Create `src/hooks/use-chat.ts`
  - Manages local message state
  - `sendMessage(input)` — appends user message, calls `/api/chat`, streams assistant response token by token
  - Creates a new Supabase session on first message
  - Persists each message to Supabase after completion
  - Handles loading and error states

---

### Step 7 — Wire & Test

- [ ] Wire `chat-shell` → `session-sidebar` + `message-list` + `message-input` + `use-chat`
- [ ] Test: send a message, verify streaming appears token by token
- [ ] Test: reload page, verify session and messages persist from Supabase
- [ ] Test: start a new session, verify it appears in the sidebar

---

## Iteration 5 — Document Library + RAG

**Goal:** A searchable document library UI and AI-powered retrieval that injects relevant SDS/compliance document chunks into the Copilot's context, making answers grounded in Chemico's actual documents.

---

### Step 1 — Document Library Page

- [ ] Create `src/lib/supabase/queries/documents.ts`
  - `getDocuments({ type?, siteId?, status?, page, pageSize })` — paginated, filtered list
  - `getDocumentById(id)` — single document with site join

- [ ] Create `src/app/(protected)/documents/page.tsx` (Server Component)
  - Accept `searchParams`: `type`, `site_id`, `status`, `page`
  - Fetch paginated documents and pass to client components

---

### Step 2 — Document Table UI

- [ ] Create `src/app/(protected)/documents/_components/document-table.tsx`
  - shadcn `Table` with columns: Name, Type, Site, Status, Last Updated
  - Status badge: `active` (green), `processing` (amber), `archived` (gray)
  - Type badge: `sds`, `msds`, `regulation`, `audit`, `training`
  - Clicking a row opens the document detail sheet

- [ ] Create `src/app/(protected)/documents/_components/document-filters.tsx`
  - Filter bar: Type dropdown, Site dropdown, Status dropdown
  - Updates URL search params on change (soft navigation)

- [ ] Add `PaginationControl` for document table

---

### Step 3 — Document Detail Sheet

- [ ] Create `src/app/(protected)/documents/_components/document-detail-sheet.tsx`
  - shadcn `Sheet` (slides in from right)
  - Shows: document name, type, site, status, version, effective date, expiry date, description
  - "Ask Copilot about this document" button → navigates to `/copilot` with prefilled prompt

---

### Step 4 — Embedding Script

- [ ] Create `scripts/embed.ts` (local Node.js one-shot script)
  - Reads all documents from `documents` table where `embedding IS NULL`
  - For each document: chunk the `description` + metadata into ~500 token chunks
  - Call OpenAI `text-embedding-3-small` to embed each chunk
  - Upsert into `document_chunks` table with `embedding` vector
  - Log progress per document

- [ ] Add script to `package.json`:
  ```json
  "embed": "ts-node --project tsconfig.scripts.json scripts/embed.ts"
  ```

- [ ] Create `tsconfig.scripts.json` for Node script compilation

---

### Step 5 — RAG Retrieval

- [ ] Create `src/lib/supabase/queries/rag.ts`
  - `retrieveChunks(queryEmbedding, limit = 5)` — calls Supabase RPC `match_document_chunks`
  - Returns top-K chunks ordered by cosine similarity
  - Guarded by `RAG_ENABLED` env flag — returns `[]` when disabled or on error

- [ ] Create Supabase SQL function `match_document_chunks` (run in SQL Editor):
  ```sql
  create or replace function match_document_chunks(
    query_embedding vector(1536),
    match_count int default 5
  )
  returns table (id uuid, content text, document_id uuid, similarity float)
  language sql stable
  as $$
    select id, content, document_id,
           1 - (embedding <=> query_embedding) as similarity
    from document_chunks
    where embedding is not null
    order by embedding <=> query_embedding
    limit match_count;
  $$;
  ```

---

### Step 6 — Wire RAG into Copilot

- [ ] Update `src/app/api/chat/route.ts`
  - Before calling OpenAI, embed the user's message using `text-embedding-3-small`
  - Call `retrieveChunks(queryEmbedding)` to get top-K relevant chunks
  - Pass `ragChunks` into `buildMessages()` (seam was already left in Iteration 4)
  - If `RAG_ENABLED=false` or retrieval fails, proceed without chunks (graceful fallback)

- [ ] Update `src/lib/openai/build-messages.ts`
  - When `ragChunks` provided, prepend a context block to the system prompt:
    ```
    Relevant document excerpts:
    [chunk 1 content]
    [chunk 2 content]
    ...
    Answer using these excerpts where relevant.
    ```

---

### Step 7 — Citation Display

- [ ] Update assistant message bubbles to parse and render source citations
  - If the response contains `[Source: Document Name]` patterns, render them as small badges below the message
  - Update system prompt to instruct the model to cite sources by document name

---

### Step 8 — Wire & Test

- [ ] Run `pnpm embed` to generate embeddings for seeded documents
- [ ] Test: ask a question about a chemical in the Copilot
- [ ] Verify: relevant document chunks appear in the API payload (log server-side)
- [ ] Verify: assistant response references actual document content
- [ ] Test: `RAG_ENABLED=false` — verify chat still works without retrieval
- [ ] Test: document filters, pagination, and detail sheet

---

## Environment Variables (additions for Iteration 4 & 5)

No new variables needed — all keys are already in `.env.local`:

```env
OPENAI_API_KEY=          # used for chat + embeddings
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
RAG_ENABLED=false        # flip to true after running pnpm embed
```
