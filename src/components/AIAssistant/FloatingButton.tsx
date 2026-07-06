import React from 'react';

interface FloatingButtonProps {
  onClick: () => void;
}

export default function FloatingButton({ onClick }: FloatingButtonProps): JSX.Element {
  return (
    <button
      className="ai-floating-btn"
      onClick={onClick}
      aria-label="Ask AchSwap AI"
      title="Ask AchSwap AI"
    >
      <div className="ai-floating-btn__inner">
        <svg
          className="ai-floating-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width={24}
          height={24}
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M14 10l-2 2-2-2" />
          <path d="M14 14l-2 2-2-2" />
        </svg>
        <span className="ai-floating-label">Ask AI</span>
      </div>
    </button>
  );
}
