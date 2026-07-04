/**
 * AchSwap AI Assistant — Cloudflare Worker
 *
 * This is the single source of truth for all AI requests.
 * - Never called directly from browser to Cerebras
 * - Receives user messages + optional current page
 * - Retrieves relevant docs from entire site via Qdrant RAG
 * - Builds a high-quality prompt containing full retrieved context
 * - Streams response from Cerebras back to client
 *
 * Security:
 *   - CHAT_API lives only as a Cloudflare secret
 *   - All external calls happen here
 */

import type { Env, ChatRequest, ChatMessage } from './types';
import { embedQuery, searchQdrant, buildQueryText } from './rag';
import { buildFinalMessages, trimHistory } from './prompt';
import { callCerebrasStream, createStreamingResponse } from './stream';

// ---------------- CONFIG ----------------
const MAX_MESSAGES = 12; // safety limit
const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20; // per IP per window

// Very lightweight in-memory rate limiter (resets on worker restart)
const rateLimitMap = new Map<string, number[]>();

function getClientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  let timestamps = rateLimitMap.get(ip) || [];
  timestamps = timestamps.filter((t) => t > windowStart);

  if (timestamps.length >= RATE_LIMIT_MAX) {
    return true;
  }

  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

function validateRequest(body: any): body is ChatRequest {
  if (!body || !Array.isArray(body.messages)) return false;
  if (body.messages.length > MAX_MESSAGES) return false;

  for (const m of body.messages) {
    if (!m.role || !m.content) return false;
    if (typeof m.content !== 'string' || m.content.length > MAX_MESSAGE_LENGTH) return false;
    if (!['user', 'assistant'].includes(m.role)) return false;
  }
  return true;
}

function corsHeaders(origin?: string | null) {
  // In production, tighten this. For now allow the main docs domains + localhost.
  const allowed = [
    'https://docs.achswap.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
  ];

  const allowOrigin = origin && (allowed.includes(origin) || origin.endsWith('.achswap.app'))
    ? origin
    : '*';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Health check
    if (url.pathname === '/health' || url.pathname === '/') {
      return new Response(
        JSON.stringify({
          ok: true,
          service: 'achswap-ai-worker',
          model: env.CEREBRAS_MODEL,
          collection: env.QDRANT_COLLECTION,
        }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
        }
      );
    }

    if (request.method !== 'POST' || url.pathname !== '/chat') {
      return new Response('Not found', { status: 404, headers: corsHeaders(origin) });
    }

    // Rate limit
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please slow down.' }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
        }
      );
    }

    let body: ChatRequest;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }

    if (!validateRequest(body)) {
      return new Response(JSON.stringify({ error: 'Invalid request payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }

    try {
      // 1. Extract latest user question
      const lastUserMessage = [...body.messages].reverse().find((m) => m.role === 'user');
      if (!lastUserMessage) {
        throw new Error('No user message found');
      }

      const queryText = buildQueryText(lastUserMessage.content, body.currentPage);

      // 2. Embed the query (free via Workers AI)
      const queryVector = await embedQuery(env, queryText);

      // 3. Retrieve relevant documentation from ENTIRE site
      const retrieved = await searchQdrant(env, queryVector, 8);

      // 4. Prepare clean history (trimmed)
      const trimmedHistory = trimHistory(body.messages);

      // 5. Build the final high-signal prompt
      const finalMessages = buildFinalMessages(trimmedHistory, retrieved, body.currentPage);

      // 6. Call Cerebras with streaming
      const cerebrasStream = await callCerebrasStream(
        {
          CEREBRAS_BASE_URL: env.CEREBRAS_BASE_URL,
          CEREBRAS_MODEL: env.CEREBRAS_MODEL,
          CHAT_API: env.CHAT_API,
        },
        finalMessages
      );

      // 7. Transform and return stream to client
      const response = createStreamingResponse(cerebrasStream);

      // Merge CORS headers
      const headers = new Headers(response.headers);
      Object.entries(corsHeaders(origin)).forEach(([k, v]) => headers.set(k, v));

      return new Response(response.body, {
        status: response.status,
        headers,
      });
    } catch (err: any) {
      console.error('Worker error:', err);

      // Return clean error (never leak secrets)
      const msg = err?.message?.includes('Cerebras')
        ? 'The AI service is temporarily unavailable. Please try again shortly.'
        : err?.message || 'Unexpected error while processing your request.';

      return new Response(
        JSON.stringify({
          error: msg,
          // In dev you can add: details: String(err)
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
        }
      );
    }
  },
};
