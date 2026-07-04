import React, { useState, useEffect, useCallback } from 'react';
import FloatingButton from './FloatingButton';
import ChatWindow from './ChatWindow';

/**
 * Global AchSwap AI Assistant
 * Renders the floating button + controlled chat window site-wide.
 */
export default function AIAssistant(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Keyboard shortcut: Cmd/Ctrl + K (or /) to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === '/' && document.activeElement?.tagName === 'BODY') {
        // Only if not typing in an input
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Close on Escape when open (handled mostly inside ChatWindow too)
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen]);

  return (
    <>
      <FloatingButton onClick={open} />
      <ChatWindow isOpen={isOpen} onClose={close} />
    </>
  );
}
