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
        <img
          src="/img/achswap-logo.png"
          alt="AchSwap"
          className="ai-floating-logo"
          width={28}
          height={28}
        />
        <span className="ai-floating-label">Ask AI</span>
      </div>
    </button>
  );
}
