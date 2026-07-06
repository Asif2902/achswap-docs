/**
 * Utilities for streaming the LLM (OpenAI-compatible via OpenRouter) response back to the browser.
 */

export function createStreamingResponse(llmStream: ReadableStream<Uint8Array>): Response {
  let buffer = '';

  const { readable, writable } = new TransformStream({
    async transform(chunk, controller) {
      buffer += new TextDecoder().decode(chunk);

      // OpenAI-compatible streaming format is SSE:
      // data: {"id":"...","choices":[{"delta":{"content":"..."}}], ...}
      // We extract only the content tokens and forward them as simple SSE events
      // so the frontend can consume easily.
      // Buffer to handle chunks that split lines mid-SSE.

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';  // keep last partial line for next chunk

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
    flush(controller) {
      // Process any remaining buffer at end of stream
      if (buffer.trim()) {
        const trimmed = buffer.trim();
        if (trimmed.startsWith('data:')) {
          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') {
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          } else {
            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) {
                const payload = JSON.stringify({ type: 'token', content: delta });
                controller.enqueue(new TextEncoder().encode(`data: ${payload}\n\n`));
              }
            } catch {}
          }
        }
      }
    }
  });

  // Pipe the original stream through our transformer
  llmStream.pipeTo(writable).catch(() => {
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

export async function callLLMStream(
  env: { OPENROUTER_BASE_URL: string; OPENROUTER_MODEL: string; CHAT_API: string },
  messages: Array<{ role: string; content: string }>
): Promise<ReadableStream<Uint8Array>> {
  const url = `${env.OPENROUTER_BASE_URL.replace(/\/$/, '')}/chat/completions`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.CHAT_API}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://docs.achswap.app', // Optional, for OpenRouter rankings
      'X-Title': 'AchSwap AI', // Optional, for OpenRouter rankings
    },
    body: JSON.stringify({
      model: env.OPENROUTER_MODEL,
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
    throw new Error(`OpenRouter error ${res.status}: ${errText}`);
  }

  return res.body;
}
