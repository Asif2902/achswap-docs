# AchSwap AI Worker

This Cloudflare Worker is the **only** component allowed to talk to Cerebras and Qdrant.

## Responsibilities
- Accept chat requests from the frontend
- Generate query embeddings (via Cloudflare Workers AI — free)
- Perform vector search over the *entire* documentation in Qdrant
- Assemble a complete, high-fidelity prompt using:
  - Strong system instructions
  - All relevant retrieved documentation chunks
  - Conversation history
  - Current page context (when available)
- Stream tokens from Cerebras back to the user

## Setup

1. `cd worker`
2. `npm install -g wrangler` (or use npx)
3. Copy `wrangler.toml` values and update QDRANT_URL + COLLECTION
4. Set secrets:
   ```bash
   wrangler secret put CHAT_API
   wrangler secret put QDRANT_API_KEY   # if needed
   ```
5. Deploy:
   ```bash
   wrangler deploy
   ```

## Local Development

```bash
wrangler dev
```

Note: Workers AI embedding may require being logged in (`wrangler login`) and may have limitations locally.

## Important
- Never put the Cerebras key in any client code or repo.
- The frontend must only ever call this worker.
- After updating docs, re-run `npm run index-docs` from project root.

## Endpoints
- POST /chat — main streaming endpoint
- GET /health — status
