/**
 * AchSwap AI Assistant Configuration
 *
 * LOCAL DEVELOPMENT:
 *   Run `npm run dev`  → starts BOTH Docusaurus (docs) + Worker (AI backend) together.
 *   The worker will be available at http://localhost:8787
 *
 * PRODUCTION:
 *   1. Deploy the worker: cd worker && wrangler deploy
 *   2. Set WORKER_URL in Cloudflare Pages Build Environment Variables
 *   3. The build injects it into a meta tag, read at runtime
 *
 * NEVER put any API keys here.
 */

export const AI_CONFIG = {
  // UI behavior
  MAX_HISTORY_TURNS: 10,
  STREAM_TIMEOUT_MS: 45000,

  // Suggested prompts shown before first message
  // Kept relevant to actual content in the documentation
  SUGGESTED_QUESTIONS: [
    'How does smart routing work?',
    'What are V4 pools and hooks?',
    'How do gasless swaps work?',
    'Explain concentrated liquidity',
    'How do I add liquidity?',
    'How do I remove liquidity?',
    'What is the Aggregator?',
    'Explain Exact Output swaps',
    'How does bridging USDC work?',
    'What contract addresses are used?',
    'Explain the fee structure',
    'What networks are supported?',
    'How do I setup my wallet?',
    'What is AchMarket?',
    'How do prediction markets work?',
    'What are V2 vs V3 vs V4 pools?',
  ] as const,
} as const;

export type SuggestedQuestion = (typeof AI_CONFIG.SUGGESTED_QUESTIONS)[number];

/**
 * Returns the effective worker URL.
 * Priority:
 *   1. Runtime global override: window.__ACHSWAP_AI_WORKER_URL__
 *   2. Meta tag injected at build: <meta name="achswap-ai-worker-url" content="...">
 *   3. Build-time Docusaurus custom field (if injected)
 */
export function getWorkerUrl(): string {
  // 1. Runtime escape hatch (highest priority)
  if (typeof window !== 'undefined') {
    // @ts-ignore - optional global escape hatch
    const runtime = (window as any).__ACHSWAP_AI_WORKER_URL__;
    if (runtime) return runtime.replace(/\/$/, '');
  }

  // 2. Meta tag injected by Docusaurus headTags (works with Cloudflare Pages build env vars)
  if (typeof document !== 'undefined') {
    const meta = document.querySelector('meta[name="achswap-ai-worker-url"]');
    if (meta?.content) return meta.content.replace(/\/$/, '');
  }

  // 3. Build-time injection via DefinePlugin (from root .env or WORKER_URL env)
  if (typeof process !== 'undefined' && process.env.WORKER_URL) {
    return process.env.WORKER_URL.replace(/\/$/, '');
  }

  return '';
}

