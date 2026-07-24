import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import BlockRenderer from '../components/BlockRenderer';
import { ArrowLeft, Loader2, Clock, BookOpen, FileWarning } from 'lucide-react';

const PageDetail = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageDetail = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/content/pages/${slug}`);
        setPage(res.data.data);
        setError(null);
        
        // Dynamically update document title for SEO best practices
        if (res.data.data && res.data.data.title) {
          document.title = `${res.data.data.title} | Learning Library`;
        }
      } catch (err) {
        console.error('Fetch page detail error:', err);
        if (err.response && err.response.status === 404) {
          setError('Article not found.');
        } else {
          setError('An error occurred loading the page content.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPageDetail();

    // Cleanup title on unmount
    return () => {
      document.title = 'Quantum & Math Learning Portal';
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-500">
        <Loader2 size={36} className="animate-spin text-violet-500 mb-3" />
        <p className="text-sm">Fetching document body...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="max-w-md mx-auto my-12 border border-zinc-900 bg-zinc-900/10 rounded-2xl p-8 text-center text-zinc-400">
        <FileWarning className="mx-auto mb-3 text-red-500" size={36} />
        <h3 className="text-lg font-bold text-white mb-2">{error || 'Article not found'}</h3>
        <p className="text-xs text-zinc-500 leading-relaxed">
          The requested path might have been deleted or the API server is unreachable.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center space-x-1.5 mt-6 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300 transition"
        >
          <ArrowLeft size={13} />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto space-y-6 pb-20 font-sans">
      
      {/* Dynamic Grid Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10 h-[500px]"></div>

      {/* Navigation Breadcrumb */}
      <div className="flex items-center space-x-2.5 text-xs font-semibold tracking-wider text-zinc-500 uppercase border-b border-zinc-900/80 pb-5">
        <Link to="/" className="hover:text-zinc-300 flex items-center space-x-1">
          <BookOpen size={13} />
          <span>Library</span>
        </Link>
        <span>/</span>
        <span className="text-violet-400 font-mono tracking-normal normal-case">/{page.slug}</span>
      </div>

      {/* Page Title & Metadata Header */}
      <header className="space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {page.title}
        </h1>
        {page.description && (
          <p className="text-base sm:text-lg text-zinc-400 font-medium leading-relaxed">
            {page.description}
          </p>
        )}
        <div className="flex items-center space-x-4 text-xs font-semibold text-zinc-500 font-mono pt-1">
          <span className="flex items-center space-x-1">
            <Clock size={12} />
            <span>Updated: {new Date(page.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </span>
        </div>
      </header>

      {/* Render Dynamic CMS Blocks */}
      <main className="mt-8 border-t border-zinc-900/60 pt-6">
        <BlockRenderer blocks={page.blocks} />
      </main>

    </article>
  );
};

export default PageDetail;
