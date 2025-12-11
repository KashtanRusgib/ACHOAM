import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  content: string;
  botColor?: string;
}

export const MessageContent: React.FC<Props> = ({ content, botColor = '#ddd' }) => {
  return (
    <div style={{ color: botColor, paddingLeft: '8px', borderLeft: `4px solid ${botColor}` }}>
      <ReactMarkdown
        children={content}
        components={{
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            if (!match) {
              return <code className={className} {...props}>{children}</code>;
            }
            return (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          }
        }}
      />
    </div>
  );
};
