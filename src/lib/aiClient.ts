import { AI_CONFIG, getWorkerUrl } from './aiConfig';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CurrentPageInfo {
  title?: string;
  url?: string;
  heading?: string;
  section?: string;
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onDone: () => void;
  onError: (error: Error) => void;
}

let abortController: AbortController | null = null;

/**
 * Send a chat request and stream tokens back.
 * This is the ONLY place the browser talks to the AI backend.
 */
export async function streamChat(
  messages: AIMessage[],
  currentPage: CurrentPageInfo | undefined,
  callbacks: StreamCallbacks
): Promise<void> {
  // Abort any previous stream
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();

  const payload = {
    messages,
    currentPage: currentPage || undefined,
  };

  try {
    const res = await fetch(`${getWorkerUrl()}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: abortController.signal,
    });

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => '');
      let msg = text || `Request failed with status ${res.status}`;
      try {
        const parsed = JSON.parse(text);
        if (parsed.error) msg = parsed.error;
      } catch {}
      throw new Error(msg);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Parse SSE lines
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // keep last partial line

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;

        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') {
          callbacks.onDone();
          return;
        }

        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'token' && typeof parsed.content === 'string') {
            callbacks.onToken(parsed.content);
          }
        } catch {
          // ignore malformed partial JSON
        }
      }
    }

    callbacks.onDone();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      callbacks.onDone();
      return;
    }
    callbacks.onError(err instanceof Error ? err : new Error(String(err)));
  } finally {
    abortController = null;
  }
}

export function stopGeneration() {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
}

/**
 * Utility to capture current documentation page context.
 * Works on both docs pages and elsewhere.
 */
export function getCurrentPageContext(): CurrentPageInfo {
  if (typeof window === 'undefined') return {};

  const pathname = window.location.pathname;
  const hash = window.location.hash;

  // Try to get best title
  let title =
    document.querySelector('h1')?.textContent?.trim() ||
    document.title.split('|')[0]?.trim() ||
    undefined;

  // Attempt to get active heading from TOC or current hash
  let heading: string | undefined;

  if (hash) {
    const el = document.querySelector(hash);
    if (el) {
      heading = el.textContent?.trim() || undefined;
    }
  }

  if (!heading) {
    // Try active TOC link
    const activeToc = document.querySelector('.table-of-contents__link--active');
    if (activeToc) heading = activeToc.textContent?.trim() || undefined;
  }

  return {
    title,
    url: pathname + (hash || ''),
    heading,
  };
}
