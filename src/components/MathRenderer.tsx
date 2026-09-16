import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  text?: string;
  content?: string;
  className?: string;
  block?: boolean;
}

/**
 * MathRenderer: Renders text containing LaTeX expressions ($...$ for inline, $$...$$ for block).
 * Falls back cleanly to text if KaTeX encounters an unparsable segment.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({
  text,
  content,
  className = '',
  block = false,
}) => {
  const actualText = text || content || '';

  const renderedContent = useMemo(() => {
    if (!actualText) return null;

    // Check if there is any LaTeX delimiter ($ or $$)
    if (!actualText.includes('$')) {
      return actualText;
    }

    // Split by block ($$) and inline ($)
    const regex = /(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g;
    const parts = actualText.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <span
              key={index}
              className="my-2 block overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={index}>{part}</span>;
        }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: false,
            throwOnError: false,
          });
          return (
            <span
              key={index}
              className="inline-block"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={index}>{part}</span>;
        }
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  }, [text]);

  if (block) {
    return <div className={`math-content ${className}`}>{renderedContent}</div>;
  }

  return <span className={`math-content ${className}`}>{renderedContent}</span>;
};
