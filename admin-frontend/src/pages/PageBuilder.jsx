import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  fetchPageBySlug, 
  createPage, 
  updatePage, 
  clearPageStatus, 
  resetCurrentPage 
} from '../store/slices/pagesSlice';
import BlockBuilder from '../components/BlockBuilder';
import api from '../utils/api';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Sparkles, 
  Eye, 
  Edit3, 
  FileText,
  AlertTriangle,
  Wand2,
  X
} from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const PageBuilder = () => {
  const { slug: urlSlug } = useParams();
  const isEditMode = !!urlSlug;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentPage, isActionLoading, isLoading, error, actionSuccess } = useSelector((state) => state.pages);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [blocks, setBlocks] = useState([]);
  
  // UI Tabs State: 'edit' or 'preview'
  const [activeTab, setActiveTab] = useState('edit');
  const [autoSlug, setAutoSlug] = useState(!isEditMode);

  // AI Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Load page if in Edit Mode
  useEffect(() => {
    dispatch(clearPageStatus());
    if (isEditMode) {
      dispatch(fetchPageBySlug(urlSlug));
    } else {
      dispatch(resetCurrentPage());
      setTitle('');
      setSlug('');
      setDescription('');
      setBlocks([]);
      setAutoSlug(true);
    }
  }, [isEditMode, urlSlug, dispatch]);

  // Sync Form State when currentPage is loaded
  useEffect(() => {
    if (isEditMode && currentPage) {
      setTitle(currentPage.title);
      setSlug(currentPage.slug);
      setDescription(currentPage.description || '');
      // Sort blocks by order before mounting in editor state
      const sorted = [...currentPage.blocks].sort((a, b) => a.order - b.order);
      setBlocks(sorted);
      setAutoSlug(false);
    }
  }, [currentPage, isEditMode]);

  // Handle Action Redirection
  useEffect(() => {
    if (actionSuccess) {
      dispatch(clearPageStatus());
      dispatch(resetCurrentPage());
      navigate('/');
    }
  }, [actionSuccess, dispatch, navigate]);

  // Kebab-case Slug generator
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove special characters
      .replace(/[\s_]+/g, '-')   // replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, '');  // trim hyphens
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (autoSlug) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (e) => {
    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
    setAutoSlug(false);
  };

  const handleAiGenerate = async (e) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setIsGeneratingAi(true);
    setAiError(null);

    try {
      const response = await api.post('/content/ai-generate', { topic: aiTopic });
      if (response.data && response.data.success) {
        const { title: genTitle, slug: genSlug, description: genDesc, blocks: genBlocks } = response.data.data;
        setTitle(genTitle);
        setSlug(genSlug);
        setDescription(genDesc);
        setBlocks(genBlocks);
        setAutoSlug(false);
        setShowAiModal(false);
        setAiTopic('');
      }
    } catch (err) {
      console.error('AI Generation Error:', err);
      setAiError(err.response?.data?.message || 'Failed to generate page using AI');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Page Title is required');
      return;
    }
    if (!slug.trim()) {
      alert('Page Slug endpoint is required');
      return;
    }

    const payload = {
      title,
      slug: slug.trim().toLowerCase(),
      description,
      blocks: blocks.map((b, idx) => {
        // Strip out temporary client IDs like 'temp-...' before sending to Mongoose
        const cleanBlock = { ...b, order: idx };
        if (cleanBlock.id && cleanBlock.id.startsWith('temp-')) {
          delete cleanBlock.id;
        }
        return cleanBlock;
      })
    };

    if (isEditMode && currentPage) {
      dispatch(updatePage({ id: currentPage._id, pageData: payload }));
    } else {
      dispatch(createPage(payload));
    }
  };

  // Inline formula renderer for Preview Tab
  const renderParagraphWithMath = (text = '') => {
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-zinc-500">
        <Loader2 size={36} className="animate-spin text-violet-500 mb-3" />
        <p className="text-sm">Loading page builder state...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans pb-16">
      
      {/* Top Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-5 gap-4">
        <div className="flex items-center space-x-3">
          <Link 
            to="/" 
            className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 rounded-xl transition"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {isEditMode ? `Edit: ${currentPage?.title || 'Page'}` : 'Create Dynamic Page'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isEditMode ? 'Modify existing page modules' : 'Configure layout metadata & content blocks'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* AI Generator Trigger Button */}
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20"
          >
            <Sparkles size={16} className="animate-pulse text-amber-300" />
            <span>Generate with AI</span>
          </button>

          {/* Save Page Button */}
          <button
            onClick={handleSave}
            disabled={isActionLoading}
            className="flex items-center space-x-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-violet-600/15 disabled:opacity-55"
          >
            {isActionLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>{isEditMode ? 'Update Page' : 'Publish Page'}</span>
          </button>
        </div>
      </div>

      {/* AI Page Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                  <Wand2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI Page Content Generator</h3>
                  <p className="text-xs text-zinc-400">Specify any scientific, engineering, or code topic</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAiModal(false)}
                className="p-1.5 text-zinc-500 hover:text-zinc-200 rounded-lg hover:bg-zinc-800"
              >
                <X size={18} />
              </button>
            </div>

            {aiError && (
              <div className="p-3 bg-red-950/30 border border-red-900/50 text-red-400 rounded-xl text-xs">
                {aiError}
              </div>
            )}

            <form onSubmit={handleAiGenerate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs text-zinc-400 font-medium">Topic or Prompt Subject</label>
                <input 
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. Neural Networks & Backpropagation, Special Relativity, Data Structures..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-violet-500"
                  autoFocus
                />
              </div>

              {/* Sample Topic Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-zinc-500 font-medium block">Quick Prompt Suggestions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Neural Networks & Gradient Descent',
                    'Special Relativity',
                    'Asynchronous JavaScript & Promises',
                    'Quantum Wave Equations'
                  ].map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAiTopic(sample)}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded-lg text-xs transition"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 rounded-xl hover:bg-zinc-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingAi || !aiTopic.trim()}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50"
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Synthesizing Blocks...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Generate Full Page</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error notification banner */}
      {error && (
        <div className="p-4 bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl flex items-start space-x-3 text-sm">
          <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Action Failed</p>
            <p className="mt-0.5 opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* Two Columns: Form metadata & Block Manager / Preview tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Column 1: Page Settings/Metadata (sticky on large viewport) */}
        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-5 lg:sticky lg:top-6">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-850 pb-2">Page Settings</h3>
          
          <div className="space-y-4">
            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="block text-xs text-zinc-400 font-medium">Page Title</label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Physics Quantum Postulates"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            {/* Slug Endpoint Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs text-zinc-400 font-medium">Slug Endpoint</label>
                {!isEditMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setAutoSlug(!autoSlug);
                      if (!autoSlug) {
                        setSlug(generateSlug(title));
                      }
                    }}
                    className={`text-[10px] font-semibold transition ${autoSlug ? 'text-violet-400 hover:text-violet-300' : 'text-zinc-500 hover:text-zinc-400'}`}
                  >
                    {autoSlug ? 'Manual Input' : 'Sync Title'}
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 text-xs font-mono select-none">
                  /
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="quantum-postulates"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-6 pr-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-violet-500 font-mono transition"
                />
              </div>
            </div>

            {/* Description Area */}
            <div className="space-y-1.5">
              <label className="block text-xs text-zinc-400 font-medium">Short Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A summary of this content section..."
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Column 2 & 3: Tabs Container (Block Editor vs Live Render) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Tabs Selector Toggle */}
          <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex items-center">
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'edit' ? 'bg-violet-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Edit3 size={14} />
              <span>Assemble Blocks ({blocks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'preview' ? 'bg-violet-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Eye size={14} />
              <span>Live Render Mockup</span>
            </button>
          </div>

          {/* Tab Content Display */}
          {activeTab === 'edit' ? (
            <BlockBuilder blocks={blocks} setBlocks={setBlocks} />
          ) : (
            /* Render Live Preview Mockup card styling replicating public-frontend rendering */
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6 text-zinc-100 min-h-[400px]">
              
              {/* Preview Document Header */}
              <div className="border-b border-zinc-800 pb-5 mb-6">
                <span className="text-[10px] text-violet-400 uppercase tracking-widest font-semibold px-2.5 py-1 rounded bg-violet-500/10 border border-violet-500/20">
                  Public Render Preview
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight leading-tight">
                  {title || 'Untitled Dynamic Page'}
                </h1>
                {description && (
                  <p className="text-sm md:text-base text-zinc-400 mt-2 font-medium">
                    {description}
                  </p>
                )}
              </div>

              {/* Blocks Loop */}
              {blocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-600 text-center">
                  <FileText size={40} className="mb-2 opacity-50" />
                  <p className="text-sm">Empty document body.</p>
                  <p className="text-xs">Blocks created in the Editor tab will display here.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {blocks.map((block, idx) => {
                    switch (block.type) {
                      case 'header':
                        return (
                          <h2 key={idx} className="text-xl md:text-2xl font-bold tracking-tight text-white mt-8 border-l-2 border-violet-500 pl-3">
                            {block.data.text}
                          </h2>
                        );

                      case 'paragraph':
                        return (
                          <p key={idx} className="text-sm md:text-base leading-relaxed text-zinc-300 font-normal">
                            {renderParagraphWithMath(block.data.text)}
                          </p>
                        );

                      case 'list':
                        return (
                          <ul key={idx} className="list-disc pl-6 space-y-2 text-zinc-300 text-sm md:text-base">
                            {(block.data.items || []).map((item, itemIdx) => (
                              <li key={itemIdx} className="marker:text-violet-500 pl-1">
                                {renderParagraphWithMath(item)}
                              </li>
                            ))}
                          </ul>
                        );

                      case 'equation':
                        return (
                          <div key={idx} className="my-6 p-4 bg-zinc-950 border border-zinc-800 rounded-xl overflow-x-auto text-zinc-200 flex flex-col items-center justify-center">
                            {block.data.equation ? (
                              block.data.displayMode ? (
                                <BlockMath math={block.data.equation} />
                              ) : (
                                <div className="text-center font-mono">
                                  <InlineMath math={block.data.equation} />
                                </div>
                              )
                            ) : (
                              <span className="text-xs text-zinc-600">No formula specified</span>
                            )}
                          </div>
                        );

                      case 'table':
                        const headers = block.data.headers || [];
                        const rows = block.data.rows || [];
                        return (
                          <div key={idx} className="overflow-x-auto border border-zinc-800 rounded-xl my-6">
                            <table className="min-w-full divide-y divide-zinc-800 bg-zinc-950 text-sm">
                              <thead className="bg-zinc-900/60">
                                <tr>
                                  {headers.map((h, hIdx) => (
                                    <th key={hIdx} className="px-5 py-3 text-left font-semibold uppercase text-zinc-400 tracking-wider">
                                      {renderParagraphWithMath(h)}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-850 divide-x-0">
                                {rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-zinc-900/10">
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="px-5 py-3.5 text-zinc-300 font-medium whitespace-nowrap">
                                        {renderParagraphWithMath(cell)}
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
                          <div key={idx} className="my-6 border border-zinc-850 bg-zinc-950 rounded-xl overflow-hidden font-mono text-xs">
                            <div className="bg-zinc-900/80 px-4 py-2 border-b border-zinc-850 text-zinc-400 flex items-center justify-between font-sans">
                              <span>Code Reference ({block.data.language || 'text'})</span>
                            </div>
                            <pre className="p-4 overflow-x-auto text-zinc-300 whitespace-pre">
                              <code>{block.data.code}</code>
                            </pre>
                          </div>
                        );

                      default:
                        return (
                          <div key={idx} className="p-3 bg-yellow-950/20 text-yellow-500 text-xs rounded border border-yellow-900/40">
                            Unknown block format
                          </div>
                        );
                    }
                  })}
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default PageBuilder;
