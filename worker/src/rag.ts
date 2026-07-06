import type { Env, RetrievedChunk, ChatRequest } from './types';

const EMBEDDING_MODEL = '@cf/baai/bge-small-en-v1.5';
const DEFAULT_TOP_K = 10; // increased for better recall

export async function embedQuery(env: Env, text: string): Promise<number[]> {
  if (!env.AI) {
    throw new Error("Workers AI binding 'AI' is missing. In the Cloudflare dashboard, go to Settings > Bindings > Add binding > AI (variable name must be 'AI').");
  }

  // Use Cloudflare's free hosted embedding - identical model family to indexing
  const result = await env.AI.run(EMBEDDING_MODEL as any, {
    text: [text],
  });

  // Workers AI returns { data: number[][], shape: [...] } or similar
  if (result && Array.isArray((result as any).data)) {
    return (result as any).data[0];
  }
  // Fallback shape
  if (Array.isArray(result)) return result as number[];
  throw new Error('Unexpected embedding result shape from Workers AI');
}

export async function searchQdrant(
  env: Env,
  vector: number[],
  topK = DEFAULT_TOP_K
): Promise<RetrievedChunk[]> {
  const collection = env.QDRANT_COLLECTION;
  const url = `${env.QDRANT_URL.replace(/\/$/, '')}/collections/${collection}/points/search`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (env.QDRANT_API_KEY) {
    headers['api-key'] = env.QDRANT_API_KEY;
  }

  const body = {
    vector,
    limit: topK,
    with_payload: true,
    // score_threshold removed to allow more results (even lower similarity)
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Qdrant search failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as any;
  const points = json.result || json.points || [];

  const results = points
    .map((p: any) => ({
      content: p.payload?.content ?? '',
      metadata: {
        title: p.payload?.title ?? 'Untitled',
        heading: p.payload?.heading ?? '',
        url: p.payload?.url ?? '',
        filePath: p.payload?.filePath ?? '',
        breadcrumb: p.payload?.breadcrumb ?? '',
      },
      score: p.score,
    }))
    .filter((c: RetrievedChunk) => c.content && c.content.length > 12);

  console.log('Qdrant search returned', results.length, 'results with scores:', results.map(r => r.score ? r.score.toFixed(3) : 'n/a'));
  return results;
}

export function buildQueryText(userMessage: string, currentPage?: ChatRequest['currentPage']): string {
  let q = userMessage.trim();

  if (currentPage?.title) {
    q = `Current page: ${currentPage.title}. ${q}`;
  }
  if (currentPage?.heading) {
    q += ` (section: ${currentPage.heading})`;
  }
  return q;
}

/**
 * Format retrieved docs into clean context block for the LLM.
 * Includes source references so model can be transparent.
 */
export function formatContextForPrompt(chunks: RetrievedChunk[]): string {
  if (!chunks.length) {
    return 'No relevant documentation sections were found for this query.';
  }

  return chunks
    .map((chunk, index) => {
      const src = chunk.metadata.url ? `Source: ${chunk.metadata.url}` : '';
      const head = chunk.metadata.heading ? `## ${chunk.metadata.heading}` : '';
      const bc = chunk.metadata.breadcrumb ? `Breadcrumb: ${chunk.metadata.breadcrumb}` : '';

      return [
        `--- DOCUMENT SECTION ${index + 1} ---`,
        bc,
        head,
        chunk.content.trim(),
        src,
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n\n');
}
