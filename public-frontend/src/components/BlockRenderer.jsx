import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Code Block Wrapper with clipboard copy button
const CopyCodeCard = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 border border-zinc-850 bg-zinc-950 rounded-xl overflow-hidden shadow-xl font-mono text-xs">
      {/* Code Header Bar */}
      <div className="bg-zinc-900/80 px-4 py-2.5 border-b border-zinc-850 text-zinc-400 flex items-center justify-between font-sans">
        <div className="flex items-center space-x-2">
          <Terminal size={14} className="text-violet-400" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">{language || 'text'} snippet</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-zinc-850 hover:bg-zinc-800 text-[10px] text-zinc-300 transition duration-150"
        >
          {copied ? (
            <>
              <Check size={11} className="text-green-400" />
              <span className="text-green-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={11} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code Body */}
      <pre className="p-4 overflow-x-auto text-zinc-300 leading-relaxed whitespace-pre font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const BlockRenderer = ({ blocks = [] }) => {
  // Sort blocks based on database order
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  // Helper to parse inline LaTeX wrapped in $...$
  const renderRichText = (text = '') => {
    if (!text) return '';
    const parts = text.split(/(\$[^\$]+\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1);
        try {
          return <InlineMath key={index} math={math} />;
        } catch (e) {
          return <span key={index} className="text-red-500 font-mono">{part}</span>;
        }
      }
      return part;
    });
  };

  return (
    <div className="space-y-6">
      {sortedBlocks.map((block) => {
        switch (block.type) {
          case 'header':
            return (
              <h2 
                key={block._id} 
                className="text-2xl md:text-3xl font-extrabold tracking-tight text-white border-l-4 border-violet-500 pl-4 mt-10 mb-4 font-sans scroll-mt-24"
              >
                {block.data.text}
              </h2>
            );

          case 'paragraph':
            return (
              <p 
                key={block._id} 
                className="text-zinc-300 text-base leading-relaxed text-justify sm:text-left font-sans"
              >
                {renderRichText(block.data.text)}
              </p>
            );

          case 'list':
            return (
              <ul 
                key={block._id} 
                className="list-disc pl-6 space-y-2.5 text-zinc-300 text-base font-sans my-4"
              >
                {(block.data.items || []).map((item, index) => (
                  <li key={index} className="marker:text-violet-500 pl-1.5">
                    {renderRichText(item)}
                  </li>
                ))}
              </ul>
            );

          case 'equation':
            const { equation, displayMode } = block.data;
            return (
              <div 
                key={block._id} 
                className="my-6 p-5 bg-zinc-900/40 border border-zinc-900 rounded-xl overflow-x-auto text-zinc-100 flex flex-col items-center shadow-inner"
              >
                {displayMode ? (
                  <div className="w-full text-center overflow-x-auto py-2">
                    <BlockMath math={equation} />
                  </div>
                ) : (
                  <p className="flex items-center gap-2 font-sans py-1">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">[Formula]:</span>
                    <InlineMath math={equation} />
                  </p>
                )}
              </div>
            );

          case 'table':
            const { headers = [], rows = [] } = block.data;
            return (
              <div 
                key={block._id} 
                className="overflow-x-auto my-6 border border-zinc-850 rounded-xl shadow-lg bg-zinc-950"
              >
                <table className="min-w-full divide-y divide-zinc-850 text-sm font-sans">
                  <thead className="bg-zinc-900/60">
                    <tr>
                      {headers.map((header, idx) => (
                        <th 
                          key={idx} 
                          className="px-6 py-3.5 text-left font-semibold uppercase tracking-wider text-zinc-400 text-xs"
                        >
                          {renderRichText(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850">
                    {rows.map((row, rIdx) => (
                      <tr 
                        key={rIdx} 
                        className="hover:bg-zinc-900/10 transition-colors duration-75"
                      >
                        {row.map((cell, cIdx) => (
                          <td 
                            key={cIdx} 
                            className="px-6 py-4 text-zinc-300 font-medium whitespace-nowrap"
                          >
                            {renderRichText(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'code':
            return (
              <CopyCodeCard 
                key={block._id} 
                code={block.data.code} 
                language={block.data.language} 
              />
            );

          default:
            return (
              <div 
                key={block._id} 
                className="p-3 bg-red-950/20 text-red-400 text-xs rounded border border-red-900/30 font-sans"
              >
                Unknown content block format: {block.type}
              </div>
            );
        }
      })}
    </div>
  );
};

export default BlockRenderer;
export { CopyCodeCard };
