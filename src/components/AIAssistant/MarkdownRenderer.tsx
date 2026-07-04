import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  // Add copy buttons to code blocks after render
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pres = container.querySelectorAll('pre');
    pres.forEach((pre) => {
      if (pre.querySelector('.ai-copy-btn')) return; // already has

      const codeEl = pre.querySelector('code');
      const text = codeEl?.textContent || pre.textContent || '';

      const btn = document.createElement('button');
      btn.className = 'ai-copy-btn';
      btn.setAttribute('aria-label', 'Copy code');
      btn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
      `;

      btn.onclick = async (e) => {
        e.stopImmediatePropagation();
        try {
          await navigator.clipboard.writeText(text);
          const orig = btn.innerHTML;
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
          setTimeout(() => {
            if (btn.parentNode) btn.innerHTML = orig;
          }, 1400);
        } catch {
          // fallback
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
      };

      pre.style.position = 'relative';
      pre.appendChild(btn);
    });
  }, [content]);

  return (
    <div ref={containerRef} className="ai-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Make links open safely
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
          // Basic table styling is handled via CSS
          table: ({ node, ...props }) => (
            <div className="ai-table-wrapper">
              <table {...props} />
            </div>
          ),
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
