import React, { useEffect, useRef, useState } from 'react';
import { X, Send, Trash2, Square, RefreshCw } from 'lucide-react';
import Message from './Message';
import SuggestedQuestions from './SuggestedQuestions';
import { streamChat, stopGeneration, AIMessage, getCurrentPageContext, CurrentPageInfo } from '../../lib/aiClient';
import { AI_CONFIG } from '../../lib/aiConfig';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatState {
  messages: AIMessage[];
  isStreaming: boolean;
  streamingContent: string;
  error?: string;
}

export default function ChatWindow({ isOpen, onClose }: ChatWindowProps): JSX.Element | null {
  const [state, setState] = useState<ChatState>(() => {
    // Restore previous conversation (persists across page navigation / reloads)
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('achswap-ai-chat');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed?.messages)) {
            return {
              messages: parsed.messages,
              isStreaming: false,
              streamingContent: '',
            };
          }
        }
      } catch {}
    }
    return { messages: [], isStreaming: false, streamingContent: '' };
  });

  const [input, setInput] = useState('');
  const [currentPage, setCurrentPage] = useState<CurrentPageInfo>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Capture current page context when opening
  useEffect(() => {
    if (isOpen) {
      const ctx = getCurrentPageContext();
      setCurrentPage(ctx);
      // Focus input
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen]);

  // Persist messages
  useEffect(() => {
    try {
      if (state.messages.length > 0) {
        localStorage.setItem('achswap-ai-chat', JSON.stringify({ messages: state.messages }));
      }
    } catch {}
  }, [state.messages]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [state.messages, state.streamingContent]);

  const hasMessages = state.messages.length > 0 || state.streamingContent;

  const updateStreaming = (content: string) => {
    setState((s) => ({ ...s, streamingContent: content }));
  };

  const finishStream = () => {
    setState((s) => {
      if (!s.streamingContent) {
        return { ...s, isStreaming: false, streamingContent: '' };
      }
      const newMessages: AIMessage[] = [
        ...s.messages,
        { role: 'assistant', content: s.streamingContent },
      ];
      return {
        ...s,
        messages: newMessages,
        isStreaming: false,
        streamingContent: '',
      };
    });
  };

  const handleError = (err: Error) => {
    let msg = err.message || 'Something went wrong. Please try again.';

    if (msg.includes('Failed to fetch') || msg.includes('ERR_CONNECTION_REFUSED') || msg.includes('ECONNREFUSED')) {
      msg = 'Cannot connect to the AI backend. Make sure the worker is running (try `npm run dev`).';
    }

    setState((s) => ({
      ...s,
      isStreaming: false,
      streamingContent: '',
      error: msg,
    }));
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || state.isStreaming) return;

    const userMsg: AIMessage = { role: 'user', content: text.trim() };
    const newMessages = [...state.messages, userMsg];

    setState({
      messages: newMessages,
      isStreaming: true,
      streamingContent: '',
      error: undefined,
    });
    setInput('');

    await streamChat(
      newMessages,
      currentPage,
      {
        onToken: (token) => {
          setState((s) => ({
            ...s,
            streamingContent: (s.streamingContent || '') + token,
          }));
        },
        onDone: finishStream,
        onError: handleError,
      }
    );
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    sendMessage(input);
  };

  const handleSuggested = (q: string) => {
    sendMessage(q);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      if (state.isStreaming) {
        stopGeneration();
      } else {
        onClose();
      }
    }
  };

  const clearConversation = () => {
    stopGeneration();
    setState({ messages: [], isStreaming: false, streamingContent: '', error: undefined });
    setInput('');
    try {
      localStorage.removeItem('achswap-ai-chat');
    } catch {}
  };

  const stopStreaming = () => {
    stopGeneration();
    finishStream();
  };

  const regenerateLast = async () => {
    if (state.messages.length === 0 || state.isStreaming) return;

    // Remove last assistant message if present
    let history = [...state.messages];
    if (history[history.length - 1]?.role === 'assistant') {
      history = history.slice(0, -1);
    }
    if (history.length === 0) return;

    setState({
      messages: history,
      isStreaming: true,
      streamingContent: '',
      error: undefined,
    });

    await streamChat(
      history,
      currentPage,
      {
        onToken: (token) =>
          setState((s) => ({ ...s, streamingContent: (s.streamingContent || '') + token })),
        onDone: finishStream,
        onError: handleError,
      }
    );
  };

  const retryLast = () => {
    if (state.messages.length === 0) return;
    const lastUser = [...state.messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      // Remove any trailing assistant + resend
      const idx = state.messages.lastIndexOf(lastUser);
      const trimmed = state.messages.slice(0, idx + 1);
      setState({ messages: trimmed, isStreaming: true, streamingContent: '', error: undefined });

      streamChat(trimmed, currentPage, {
        onToken: (token) => updateStreaming((state.streamingContent || '') + token),
        onDone: finishStream,
        onError: handleError,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chat-overlay" onClick={onClose}>
      <div
        className="ai-chat-window"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Ask AchSwap AI"
      >
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-chat-header-left">
            <div className="ai-chat-logo">
              <img src="/img/achswap-logo.png" alt="" width={22} height={22} />
            </div>
            <div>
              <div className="ai-chat-title">Ask AchSwap AI</div>
              <div className="ai-chat-subtitle">Powered by AchSwap Documentation</div>
            </div>
          </div>

          <div className="ai-chat-header-actions">
            {hasMessages && (
              <button
                onClick={clearConversation}
                className="ai-header-btn"
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="ai-header-btn ai-header-btn--close"
              title="Close"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="ai-chat-body" ref={chatContainerRef}>
          {!hasMessages && (
            <div className="ai-welcome">
              <div className="ai-welcome-icon">
                <img src="/img/achswap-logo.png" alt="AchSwap" width={42} height={42} />
              </div>
              <h3>Hello! How can I help you today?</h3>
              <p>Ask anything about AchSwap, AchMarket, AchRWA, SDKs, contracts, or integrations.</p>
            </div>
          )}

          {/* Messages */}
          <div className="ai-messages">
            {state.messages.map((msg, index) => (
              <Message
                key={index}
                message={msg}
                onRegenerate={index === state.messages.length - 1 && msg.role === 'assistant' ? regenerateLast : undefined}
              />
            ))}

            {/* Streaming message */}
            {state.isStreaming && state.streamingContent && (
              <Message
                message={{ role: 'assistant', content: state.streamingContent }}
                isStreaming
              />
            )}

            {/* Thinking indicator */}
            {state.isStreaming && !state.streamingContent && (
              <div className="ai-thinking">
                <div className="ai-avatar">
                  <img src="/img/achswap-logo.png" alt="" width={16} height={16} />
                </div>
                <div className="ai-thinking-text">
                  Thinking<span className="ai-dots">...</span>
                </div>
              </div>
            )}

            {state.error && (
              <div className="ai-error">
                <div>{state.error}</div>
                <button onClick={retryLast} className="ai-retry-btn">
                  <RefreshCw size={14} /> Try again
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions (only when no messages yet) */}
          {!hasMessages && (
            <SuggestedQuestions onSelect={handleSuggested} disabled={state.isStreaming} />
          )}
        </div>

        {/* Input */}
        <form className="ai-chat-input" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about swaps, liquidity, SDKs, markets..."
            rows={1}
            disabled={state.isStreaming}
          />
          <div className="ai-input-actions">
            {state.isStreaming ? (
              <button
                type="button"
                onClick={stopStreaming}
                className="ai-send-btn ai-send-btn--stop"
                aria-label="Stop generation"
              >
                <Square size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="ai-send-btn"
                aria-label="Send message"
              >
                <Send size={17} />
              </button>
            )}
          </div>
        </form>

        <div className="ai-chat-footer">
          Responses are based on official AchSwap documentation only.
        </div>
      </div>
    </div>
  );
}
