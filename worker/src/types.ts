// Shared types for AchSwap AI Worker

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CurrentPageContext {
  title?: string;
  url?: string;
  heading?: string;
  section?: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  currentPage?: CurrentPageContext;
}

export interface RetrievedChunk {
  content: string;
  metadata: {
    title: string;
    heading: string;
    url: string;
    filePath: string;
    breadcrumb: string;
  };
  score?: number;
}

export interface Env {
  // Secrets
  CHAT_API: string; // OpenRouter key - set via dashboard secret
  QDRANT_API_KEY?: string;

  // Vars
  QDRANT_URL: string;
  QDRANT_COLLECTION: string;
  OPENROUTER_BASE_URL: string;
  OPENROUTER_MODEL: string;

  // Bindings
  AI: Ai; // Cloudflare Workers AI binding
}

// Minimal shape for Workers AI embedding result
export interface EmbeddingResult {
  data: number[][];
  shape: number[];
}
