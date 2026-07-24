import React from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Plus, 
  Type, 
  AlignLeft, 
  List as ListIcon, 
  Table as TableIcon, 
  Percent, 
  Code2,
  Sparkles
} from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const BlockBuilder = ({ blocks = [], setBlocks }) => {

  const addBlock = (type) => {
    let defaultData = {};
    switch (type) {
      case 'header':
        defaultData = { text: 'New Header Section' };
        break;
      case 'paragraph':
        defaultData = { text: 'Write your rich text content here...' };
        break;
      case 'list':
        defaultData = { items: ['First list item', 'Second list item'] };
        break;
      case 'table':
        defaultData = { 
          headers: ['Column 1', 'Column 2'], 
          rows: [['Row 1 Cell 1', 'Row 1 Cell 2'], ['Row 2 Cell 1', 'Row 2 Cell 2']] 
        };
        break;
      case 'equation':
        defaultData = { equation: '\\int_a^b f(x) dx = F(b) - F(a)', displayMode: true };
        break;
      case 'code':
        defaultData = { code: 'print("Hello, CMS!")', language: 'python' };
        break;
      default:
        defaultData = {};
    }

    const newBlock = {
      id: 'temp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      type,
      data: defaultData,
      order: blocks.length
    };

    setBlocks([...blocks, newBlock]);
  };

  const deleteBlock = (id) => {
    const filtered = blocks.filter(b => b._id !== id && b.id !== id);
    // Reorder remaining blocks
    const updated = filtered.map((block, index) => ({
      ...block,
      order: index
    }));
    setBlocks(updated);
  };

  const moveBlock = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const result = [...blocks];
    
    // Swap elements
    const temp = result[index];
    result[index] = result[newIndex];
    result[newIndex] = temp;

    // Update their order property
    const updated = result.map((block, idx) => ({
      ...block,
      order: idx
    }));

    setBlocks(updated);
  };

  const updateBlockData = (index, newData) => {
    const updated = [...blocks];
    updated[index] = {
      ...updated[index],
      data: {
        ...updated[index].data,
        ...newData
      }
    };
    setBlocks(updated);
  };

  // Helper parser for inline latex in paragraph preview
  const parseInlineMath = (text = '') => {
    if (!text) return '';
    const parts = text.split(/(\$[^\$]+\$)/g);
    return parts.map((part, index) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1);
        try {
          return <InlineMath key={index} math={math} />;
        } catch (e) {
          return <span key={index} className="text-red-500">{part}</span>;
        }
      }
      return part;
    });
  };

  return (
    <div className="space-y-6">
      {/* Block List Wrapper */}
      <div className="space-y-4">
        {blocks.length === 0 ? (
          <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center text-zinc-500">
            <Sparkles className="mx-auto mb-3 text-zinc-600" size={32} />
            <p className="text-sm">No content blocks added yet.</p>
            <p className="text-xs text-zinc-600 mt-1">Select a block type below to begin compiling content.</p>
          </div>
        ) : (
          blocks.map((block, index) => (
            <div 
              key={block._id || block.id} 
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700/60 transition-all duration-200"
            >
              {/* Block Header Toolbar */}
              <div className="bg-zinc-900/80 px-4 py-2.5 border-b border-zinc-800/80 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <div className="flex items-center space-x-2">
                  <span className="h-5 w-5 rounded bg-zinc-850 flex items-center justify-center text-violet-400 font-mono text-[10px]">
                    {index + 1}
                  </span>
                  <span className="text-zinc-300">{block.type} Block</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button 
                    type="button"
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-zinc-800 hover:text-zinc-200 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move Block Up"
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === blocks.length - 1}
                    className="p-1 hover:bg-zinc-800 hover:text-zinc-200 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move Block Down"
                  >
                    <ArrowDown size={15} />
                  </button>
                  <span className="w-px h-4 bg-zinc-800 mx-1"></span>
                  <button 
                    type="button"
                    onClick={() => deleteBlock(block._id || block.id)}
                    className="p-1 hover:bg-red-950/45 hover:text-red-400 text-zinc-500 rounded transition-colors duration-150"
                    title="Delete Block"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Block Editors */}
              <div className="p-4 bg-zinc-900/35">
                {/* 1. HEADER BLOCK */}
                {block.type === 'header' && (
                  <div className="space-y-2">
                    <label className="block text-xs text-zinc-400 font-medium">Header Text</label>
                    <input 
                      type="text"
                      value={block.data.text || ''}
                      onChange={(e) => updateBlockData(index, { text: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-violet-500"
                      placeholder="Enter heading title..."
                    />
                  </div>
                )}

                {/* 2. PARAGRAPH BLOCK */}
                {block.type === 'paragraph' && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs text-zinc-400 font-medium">Body Paragraph</label>
                        <span className="text-[10px] text-zinc-500">Wrap LaTeX in dollar signs: $E=mc^2$</span>
                      </div>
                      <textarea
                        value={block.data.text || ''}
                        onChange={(e) => updateBlockData(index, { text: e.target.value })}
                        rows={4}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-violet-500 font-sans"
                        placeholder="Enter text paragraph content..."
                      />
                    </div>
                    {/* Live Preview */}
                    <div className="bg-zinc-950/50 border border-zinc-800/40 rounded-lg p-3 text-sm text-zinc-300 font-sans leading-relaxed">
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block mb-1">Live Parsed Preview:</span>
                      {parseInlineMath(block.data.text)}
                    </div>
                  </div>
                )}

                {/* 3. LIST BLOCK */}
                {block.type === 'list' && (
                  <div className="space-y-3">
                    <label className="block text-xs text-zinc-400 font-medium">List Items</label>
                    <div className="space-y-2">
                      {(block.data.items || []).map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center space-x-2">
                          <span className="h-2 w-2 rounded-full bg-violet-500 flex-shrink-0"></span>
                          <input 
                            type="text"
                            value={item || ''}
                            onChange={(e) => {
                              const newItems = [...block.data.items];
                              newItems[itemIdx] = e.target.value;
                              updateBlockData(index, { items: newItems });
                            }}
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:border-violet-500"
                            placeholder={`Item ${itemIdx + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = block.data.items.filter((_, i) => i !== itemIdx);
                              updateBlockData(index, { items: newItems });
                            }}
                            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded"
                            title="Remove Item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        updateBlockData(index, { items: [...(block.data.items || []), 'New item content'] });
                      }}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-xs text-violet-400 border border-zinc-800 transition"
                    >
                      <Plus size={12} />
                      <span>Add List Item</span>
                    </button>
                  </div>
                )}

                {/* 4. TABLE BLOCK */}
                {block.type === 'table' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs text-zinc-400 font-medium">Data Table Editor</label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newHeaders = [...block.data.headers, `Col ${block.data.headers.length + 1}`];
                            const newRows = block.data.rows.map(row => [...row, '']);
                            updateBlockData(index, { headers: newHeaders, rows: newRows });
                          }}
                          className="px-2 py-1 rounded bg-zinc-850 border border-zinc-800 hover:bg-zinc-800 text-[10px] text-zinc-300"
                        >
                          + Add Column
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (block.data.headers.length <= 1) return;
                            const newHeaders = block.data.headers.slice(0, -1);
                            const newRows = block.data.rows.map(row => row.slice(0, -1));
                            updateBlockData(index, { headers: newHeaders, rows: newRows });
                          }}
                          className="px-2 py-1 rounded bg-zinc-850 border border-zinc-800 hover:bg-zinc-800 text-[10px] text-zinc-300"
                        >
                          - Remove Column
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-zinc-800/80 rounded-lg">
                      <table className="min-w-full divide-y divide-zinc-800 bg-zinc-950">
                        <thead>
                          <tr className="bg-zinc-900/60 divide-x divide-zinc-800">
                            {block.data.headers.map((header, hIdx) => (
                              <th key={hIdx} className="px-2 py-1.5 text-left text-xs font-semibold text-zinc-400">
                                <input 
                                  type="text"
                                  value={header}
                                  onChange={(e) => {
                                    const newHeaders = [...block.data.headers];
                                    newHeaders[hIdx] = e.target.value;
                                    updateBlockData(index, { headers: newHeaders });
                                  }}
                                  className="w-full bg-transparent border-0 font-medium text-zinc-200 focus:ring-1 focus:ring-violet-500 rounded px-1 py-0.5 text-xs text-center"
                                />
                              </th>
                            ))}
                            <th className="w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-850">
                          {block.data.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="divide-x divide-zinc-850 hover:bg-zinc-900/30">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-1">
                                  <input 
                                    type="text"
                                    value={cell}
                                    onChange={(e) => {
                                      const newRows = [...block.data.rows];
                                      newRows[rIdx] = [...newRows[rIdx]];
                                      newRows[rIdx][cIdx] = e.target.value;
                                      updateBlockData(index, { rows: newRows });
                                    }}
                                    className="w-full bg-transparent border-0 focus:ring-1 focus:ring-violet-500 rounded px-1 py-0.5 text-xs text-zinc-300"
                                  />
                                </td>
                              ))}
                              <td className="p-1 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newRows = block.data.rows.filter((_, idx) => idx !== rIdx);
                                    updateBlockData(index, { rows: newRows });
                                  }}
                                  className="p-1 text-zinc-500 hover:text-red-400"
                                  title="Delete Row"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newRow = Array(block.data.headers.length).fill('');
                        updateBlockData(index, { rows: [...block.data.rows, newRow] });
                      }}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-xs text-violet-400 border border-zinc-800 transition"
                    >
                      <Plus size={12} />
                      <span>Add Table Row</span>
                    </button>
                  </div>
                )}

                {/* 5. EQUATION BLOCK */}
                {block.type === 'equation' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs text-zinc-400 font-medium">LaTeX Equation</label>
                      <label className="flex items-center space-x-2 text-xs text-zinc-400 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={block.data.displayMode || false}
                          onChange={(e) => updateBlockData(index, { displayMode: e.target.checked })}
                          className="rounded border-zinc-800 bg-zinc-950 text-violet-600 focus:ring-0"
                        />
                        <span>Block display mode</span>
                      </label>
                    </div>
                    <textarea 
                      value={block.data.equation || ''}
                      onChange={(e) => updateBlockData(index, { equation: e.target.value })}
                      rows={2}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-violet-500 font-mono"
                      placeholder="e.g. \\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}"
                    />
                    {/* Live Equation Render */}
                    {block.data.equation && (
                      <div className="bg-zinc-950/50 border border-zinc-800/40 rounded-lg p-4 flex flex-col items-center justify-center overflow-x-auto text-zinc-200">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono self-start mb-2">Live Equation Rendering:</span>
                        <div className="my-2 py-1 max-w-full">
                          {block.data.displayMode ? (
                            <BlockMath math={block.data.equation} />
                          ) : (
                            <p className="flex items-center gap-2">
                              <span className="text-xs text-zinc-500 font-mono">[Inline]:</span>
                              <InlineMath math={block.data.equation} />
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 6. CODE BLOCK */}
                {block.type === 'code' && (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="block text-xs text-zinc-400 font-medium">Code Snippet (Documentation)</label>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-zinc-500 font-medium">Language:</span>
                        <select 
                          value={block.data.language || 'python'}
                          onChange={(e) => updateBlockData(index, { language: e.target.value })}
                          className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 rounded px-2.5 py-1 focus:outline-none focus:border-violet-500"
                        >
                          <option value="python">Python</option>
                          <option value="javascript">JavaScript</option>
                          <option value="html">HTML</option>
                          <option value="css">CSS</option>
                          <option value="cpp">C++</option>
                          <option value="bash">Bash / Shell</option>
                        </select>
                      </div>
                    </div>
                    <textarea 
                      value={block.data.code || ''}
                      onChange={(e) => updateBlockData(index, { code: e.target.value })}
                      rows={5}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-violet-500 font-mono"
                      placeholder="Paste technical code block here..."
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Block Toolbar Buttons */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Add Content Block</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <button
            type="button"
            onClick={() => addBlock('header')}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-zinc-800 hover:border-violet-500/50 hover:bg-violet-950/10 text-zinc-300 hover:text-violet-400 transition group"
          >
            <Type size={20} className="mb-1 text-zinc-500 group-hover:text-violet-400" />
            <span className="text-[11px] font-medium">Header</span>
          </button>
          <button
            type="button"
            onClick={() => addBlock('paragraph')}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-zinc-800 hover:border-violet-500/50 hover:bg-violet-950/10 text-zinc-300 hover:text-violet-400 transition group"
          >
            <AlignLeft size={20} className="mb-1 text-zinc-500 group-hover:text-violet-400" />
            <span className="text-[11px] font-medium">Paragraph</span>
          </button>
          <button
            type="button"
            onClick={() => addBlock('list')}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-zinc-800 hover:border-violet-500/50 hover:bg-violet-950/10 text-zinc-300 hover:text-violet-400 transition group"
          >
            <ListIcon size={20} className="mb-1 text-zinc-500 group-hover:text-violet-400" />
            <span className="text-[11px] font-medium">List</span>
          </button>
          <button
            type="button"
            onClick={() => addBlock('table')}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-zinc-800 hover:border-violet-500/50 hover:bg-violet-950/10 text-zinc-300 hover:text-violet-400 transition group"
          >
            <TableIcon size={20} className="mb-1 text-zinc-500 group-hover:text-violet-400" />
            <span className="text-[11px] font-medium">Table</span>
          </button>
          <button
            type="button"
            onClick={() => addBlock('equation')}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-zinc-800 hover:border-violet-500/50 hover:bg-violet-950/10 text-zinc-300 hover:text-violet-400 transition group"
          >
            <Percent size={20} className="mb-1 text-zinc-500 group-hover:text-violet-400" />
            <span className="text-[11px] font-medium">Equation</span>
          </button>
          <button
            type="button"
            onClick={() => addBlock('code')}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-zinc-800 hover:border-violet-500/50 hover:bg-violet-950/10 text-zinc-300 hover:text-violet-400 transition group"
          >
            <Code2 size={20} className="mb-1 text-zinc-500 group-hover:text-violet-400" />
            <span className="text-[11px] font-medium">Code</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockBuilder;
