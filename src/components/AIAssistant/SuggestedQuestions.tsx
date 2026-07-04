import React from 'react';
import { AI_CONFIG } from '../../lib/aiConfig';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export default function SuggestedQuestions({ onSelect, disabled }: SuggestedQuestionsProps): JSX.Element {
  const questions = AI_CONFIG.SUGGESTED_QUESTIONS;

  return (
    <div className="ai-suggestions">
      <div className="ai-suggestions-label">Try asking:</div>
      <div className="ai-suggestions-grid">
        {questions.map((q, idx) => (
          <button
            key={idx}
            className="ai-suggestion-chip"
            onClick={() => onSelect(q)}
            disabled={disabled}
            type="button"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
