# AchSwap AI Worker

This Cloudflare Worker is the **only** component allowed to talk to OpenRouter (LLM) and Qdrant (vector DB).

## Responsibilities
- Accept chat requests from the frontend
- Generate query embeddings (via Cloudflare Workers AI — free)
- Perform vector search over the *entire* documentation in Qdrant
- Assemble a complete, high-fidelity prompt using:
  - Strong system instructions
  - All relevant retrieved documentation chunks
  - Conversation history
  - Current page context (when available)
- Stream tokens from OpenRouter back to the user

## Setup

### Option A: Deploy via Cloudflare Dashboard (Web UI) ← You are doing this

You mentioned you're selecting the `worker/` folder directly in the Cloudflare website and adding your private keys there.

**Steps in the Dashboard:**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → **Create application** → Worker.
2. Choose **"Deploy via Git"** (recommended for ongoing updates) or create a new Worker.
3. Connect your GitHub repo (`achswap-docs`).
4. **Important settings**:
   - **Root directory**: `worker`
   - Build command: leave empty or `npm install`
   - Framework preset: None
5. After the Worker is created:
   - Go to your Worker → **Settings** tab

**Required configuration in Dashboard (Settings):**

**Bindings** (critical - this fixes the "Cannot read properties of undefined (reading 'run')" error):
- Click **Add binding** → **AI** (Workers AI)
  - Variable name: `AI`

  **This is the #1 reason for the 500 + 'undefined (reading run)' error when deploying via dashboard.**

**Variables** (Environment variables):
- `QDRANT_URL` → your Qdrant URL (use Qdrant Cloud for production, e.g. `https://xxx.qdrant.io`)
- `QDRANT_COLLECTION` → `achswap`
- `OPENROUTER_BASE_URL` → `https://openrouter.ai/api/v1` (for the LLM calls)
- `OPENROUTER_MODEL` → `google/gemma-4-31b-it:free` (or the model you want, e.g. the free one you specified)

**Secrets** (click "Add variable" and choose "Secret"):
- `CHAT_API` → Your OpenRouter API key (sk-or-... this is the main one)
- `QDRANT_API_KEY` → Your Qdrant API key (only if your Qdrant instance requires it)

6. Save and redeploy.

**After deployment**:
- Copy the Worker URL (e.g. `https://achswap-ai-worker.your-subdomain.workers.dev`)
- Update `src/lib/aiConfig.ts`:
  ```ts
  WORKER_URL: 'https://achswap-ai-worker.your-subdomain.workers.dev',
  ```
- Commit, push, and redeploy your docs site on Vercel.

**Critical for the AI to actually know your docs**:
- You must run the indexer against the **same Qdrant** the worker uses:
  ```bash
  npm run index-docs
  ```
  (make sure `.env` points to your production Qdrant)

**Note**: Cloudflare Workers cannot reach a local Qdrant. Use Qdrant Cloud (free tier is fine) for production.

### Option B: Using Wrangler CLI (recommended for developers)

```bash
cd worker
wrangler deploy
```

Set secrets with CLI:
```bash
wrangler secret put CHAT_API
wrangler secret put QDRANT_API_KEY
```

## Local Development (from root)

From the project root:

```bash
npm run dev          # starts docs + worker together (best)
npm run worker:dev   # worker only
```

Or inside worker folder:

```bash
wrangler dev
```

Note: Workers AI embedding may require being logged in (`wrangler login`) and may have limitations locally.

## Important
- Never put the OpenRouter key in any client code or repo.
- The frontend must only ever call this worker.
- After updating docs, re-run `npm run index-docs` from project root.

## Endpoints
- POST /chat — main streaming endpoint
- GET /health — status
