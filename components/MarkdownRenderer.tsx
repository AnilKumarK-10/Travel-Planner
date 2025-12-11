import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-sm prose-indigo dark:prose-invert max-w-none text-slate-700 dark:text-slate-200">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          strong: ({ children }) => <span className="font-semibold text-slate-900 dark:text-white">{children}</span>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              {children}
            </a>
          ),
          h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-4 text-slate-900 dark:text-white">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3 text-slate-900 dark:text-white">{children}</h2>,
          h3: ({ children }) => <h3 className="text-md font-bold mb-1 mt-2 text-slate-900 dark:text-white">{children}</h3>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};