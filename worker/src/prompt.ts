import type { ChatMessage, CurrentPageContext, RetrievedChunk } from './types';
import { formatContextForPrompt } from './rag';

export const SYSTEM_PROMPT = `You are AchSwap AI, the official AI assistant for AchSwap, AchMarket, and AchRWA.

The ONLY source of truth for your answers is the AchSwap documentation provided in this request.

Rules you MUST follow at all times:
1. Use the supplied documentation context first and foremost. Treat it as more recent and accurate than any internal knowledge.
2. If the answer is present in the documentation context, synthesize a clear, technically accurate response from it. Combine information across multiple sections when relevant.
3. NEVER invent, guess, or hallucinate APIs, contract addresses, method names, parameters, endpoints, features, routes, SDK calls, pool addresses, fees, or any other implementation details.
4. If the requested information cannot be found in the provided documentation context, explicitly say: "The current documentation does not contain information about that." Offer to help with related documented topics instead of speculating.
5. When documentation contains code examples, tables, or step-by-step instructions, prefer quoting or closely following them.
6. Always respond in clean Markdown. Use:
   - Headings for structure
   - Bullet lists and numbered lists
   - Tables when comparing options
   - \`\`\`language fenced code blocks for any code
7. Be concise but complete. Avoid unnecessary filler.
8. When appropriate, mention the source page or section naturally (e.g. "According to the Token Swap documentation...").

You are a helpful, precise, and trustworthy assistant for developers and users of AchSwap.`;

export function buildFinalMessages(
  history: ChatMessage[],
  retrievedChunks: RetrievedChunk[],
  currentPage?: CurrentPageContext
): ChatMessage[] {
  const contextBlock = formatContextForPrompt(retrievedChunks);

  let systemContent = SYSTEM_PROMPT;

  // Inject current page awareness (without restricting retrieval)
  if (currentPage?.title || currentPage?.url) {
    const pageInfo = [
      currentPage.title && `Current documentation page: ${currentPage.title}`,
      currentPage.url && `URL: ${currentPage.url}`,
      currentPage.heading && `Active heading: ${currentPage.heading}`,
    ]
      .filter(Boolean)
      .join('\n');

    systemContent += `\n\n--- CURRENT USER CONTEXT ---\n${pageInfo}\nThe user may be asking in the context of the above page, but you must still use relevant information from the full documentation set provided below.`;
  }

  systemContent += `\n\n--- RETRIEVED DOCUMENTATION CONTEXT ---\n${contextBlock}\n--- END OF DOCUMENTATION CONTEXT ---`;

  // Always start with the strong system prompt
  const finalMessages: ChatMessage[] = [
    { role: 'system', content: systemContent },
  ];

  // Append conversation history (already validated & trimmed by caller)
  // We intentionally do NOT put context into history to avoid token bloat on every turn.
  for (const msg of history) {
    if (msg.role === 'user' || msg.role === 'assistant') {
      finalMessages.push({ role: msg.role, content: msg.content });
    }
  }

  return finalMessages;
}

/**
 * Trim conversation history to keep prompt size reasonable.
 * Keeps the most recent turns.
 */
export function trimHistory(history: ChatMessage[], maxTurns = 6): ChatMessage[] {
  // We keep pairs of user+assistant roughly
  const relevant = history.filter((m) => m.role !== 'system');
  if (relevant.length <= maxTurns) return relevant;

  return relevant.slice(-maxTurns);
}
