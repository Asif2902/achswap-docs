import React from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import type { AIMessage } from '../../lib/aiClient';

interface MessageProps {
  message: AIMessage;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  onCopy?: () => void;
}

export default function Message({ message, isStreaming, onRegenerate, onCopy }: MessageProps): JSX.Element {
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      if (onCopy) onCopy();
    } catch {
      // silent
    }
  };

  return (
    <div className={`ai-message ${isUser ? 'ai-message--user' : 'ai-message--assistant'}`}>
      {!isUser && (
        <div className="ai-avatar">
          <img src="/img/achswap-logo.png" alt="AchSwap" width={18} height={18} />
        </div>
      )}

      <div className="ai-message-bubble">
        {isUser ? (
          <div className="ai-user-text">{message.content}</div>
        ) : (
          <>
            <MarkdownRenderer content={message.content} />
            {isStreaming && <span className="ai-stream-cursor" />}
          </>
        )}

        {!isUser && !isStreaming && (
          <div className="ai-message-actions">
            <button
              onClick={handleCopy}
              className="ai-action-btn"
              title="Copy message"
              aria-label="Copy message"
            >
              <Copy size={14} />
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="ai-action-btn"
                title="Regenerate response"
                aria-label="Regenerate response"
              >
                <RefreshCw size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
