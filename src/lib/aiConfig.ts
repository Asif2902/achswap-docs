/**
 * AchSwap AI Assistant Configuration
 *
 * LOCAL DEVELOPMENT:
 *   Run `npm run dev`  → starts BOTH Docusaurus (docs) + Worker (AI backend) together.
 *   The worker will be available at http://localhost:8787
 *
 * PRODUCTION:
 *   1. Deploy the worker: cd worker && wrangler deploy
 *   2. Update WORKER_URL below to your live worker URL (https://xxx.workers.dev)
 *   3. Rebuild and deploy the docs site
 *
 * NEVER put any API keys here.
 */

export const AI_CONFIG = {
  /**
   * The base URL of your Cloudflare Worker.
   * All chat traffic goes exclusively through this endpoint.
   *
   * Set via root .env as WORKER_URL=... or env var before build.
   * For local dev: use `npm run dev` (defaults to localhost:8787)
   */
  WORKER_URL: (typeof process !== 'undefined' && process.env.WORKER_URL)
    ? process.env.WORKER_URL
    : 'https://achswap-ai-worker.freefirebangladeshofficial01.workers.dev',

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
 *   1. Runtime override: window.__ACHSWAP_AI_WORKER_URL__
 *   2. Build-time Docusaurus custom field (if injected)
 *   3. Default in AI_CONFIG
 */
export function getWorkerUrl(): string {
  // Build-time injection via DefinePlugin (from root .env or WORKER_URL env)
  let url = '';
  if (typeof process !== 'undefined' && process.env.WORKER_URL) {
    url = process.env.WORKER_URL;
  } else if (typeof window !== 'undefined') {
    // @ts-ignore - optional global escape hatch
    const runtime = (window as any).__ACHSWAP_AI_WORKER_URL__;
    if (runtime) url = runtime;
  } else {
    url = AI_CONFIG.WORKER_URL;
  }
  // Ensure no trailing slash
  return url.replace(/\/$/, '');
}

