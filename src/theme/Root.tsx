import React from 'react';
import { AIAssistant } from '../components/AIAssistant';

/**
 * Docusaurus Root wrapper.
 * Injects the global AchSwap AI Assistant (floating button + chat) on every page.
 */
export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      {children}
      <AIAssistant />
    </>
  );
}
