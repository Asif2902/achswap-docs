/**
 * Utilities for streaming the Cerebras (OpenAI-compatible) response back to the browser.
 */

export function createStreamingResponse(cerebrasStream: ReadableStream<Uint8Array>): Response {
  const { readable, writable } = new TransformStream({
    async transform(chunk, controller) {
      const text = new TextDecoder().decode(chunk);

      // OpenAI / Cerebras streaming format is SSE:
      // data: {"id":"...","choices":[{"delta":{"content":"..."}}], ...}
      // We extract only the content tokens and forward them as simple SSE events
      // so the frontend can consume easily.

      const lines = text.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;

        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') {
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          continue;
        }

        try {
          const json = JSON.parse(data);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) {
            // Forward as clean event
            const payload = JSON.stringify({ type: 'token', content: delta });
            controller.enqueue(new TextEncoder().encode(`data: ${payload}\n\n`));
          }
        } catch {
          // ignore parse errors on partial chunks
        }
      }
    },
  });

  // Pipe the original stream through our transformer
  cerebrasStream.pipeTo(writable).catch(() => {
    /* stream ended or aborted */
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

export async function callCerebrasStream(
  env: { CEREBRAS_BASE_URL: string; CEREBRAS_MODEL: string; CHAT_API: string },
  messages: Array<{ role: string; content: string }>
): Promise<ReadableStream<Uint8Array>> {
  const url = `${env.CEREBRAS_BASE_URL.replace(/\/$/, '')}/chat/completions`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.CHAT_API}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.CEREBRAS_MODEL,
      messages,
      stream: true,
      temperature: 0.15, // low temp = more factual
      top_p: 0.9,
      max_tokens: 1400,
      stop: null,
    }),
  });

  if (!res.ok || !res.body) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Cerebras error ${res.status}: ${errText}`);
  }

  return res.body;
}
