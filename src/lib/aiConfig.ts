/**
 * AchSwap AI Assistant Configuration
 *
 * Update WORKER_URL before deploying to production.
 * - Development: http://localhost:8787 (run `wrangler dev` inside /worker)
 * - Production: Your deployed Cloudflare Worker URL
 *
 * NEVER put any API keys here.
 *
 * TIP: After changing this, run `npm run build` to verify.
 */

export const AI_CONFIG = {
  /**
   * The base URL of your Cloudflare Worker.
   * All chat traffic goes exclusively through this endpoint.
   */
  WORKER_URL: 'http://localhost:8787',

  // UI behavior
  MAX_HISTORY_TURNS: 10,
  STREAM_TIMEOUT_MS: 45000,

  // Suggested prompts shown before first message
  SUGGESTED_QUESTIONS: [
    'How do swaps work?',
    'Explain the Aggregator',
    'Explain V2 vs V3 vs V4',
    'Explain RWA',
    'How do I add liquidity?',
    'How do I remove liquidity?',
    'Explain routing and smart routing',
    'Explain Exact Output swaps',
    'SDK Integration examples',
    'API examples',
    'How do I connect a wallet?',
    'What networks are supported?',
    'Explain fees and fee structure',
    'What are pools?',
    'How does gasless swap work?',
    'What is AchMarket?',
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
  if (typeof window !== 'undefined') {
    // @ts-ignore - optional global escape hatch
    const runtime = (window as any).__ACHSWAP_AI_WORKER_URL__;
    if (runtime) return runtime;
  }
  // Note: full Docusaurus context injection can be added in Root if desired.
  return AI_CONFIG.WORKER_URL;
}

