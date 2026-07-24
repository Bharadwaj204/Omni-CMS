import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { BookOpen, Sparkles, Clock, ArrowRight, Loader2, Search } from 'lucide-react';

const Home = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const res = await api.get('/content/pages');
        setPages(res.data.data);
        setError(null);
      } catch (err) {
        console.error('Fetch home pages error:', err);
        setError('Unable to load content catalog from server.');
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, []);

  const filteredPages = pages.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-12 pb-16 font-sans relative">

      {/* Dynamic Grid Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10 h-[500px]"></div>

      {/* Hero Banner Section */}
      <section className="text-center max-w-3xl mx-auto pt-8 md:pt-16 space-y-6">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles size={12} className="text-violet-400" />
          <span>Interactive Learning Library</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] leading-tight">
          Advanced Physics & <br />
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-500 bg-clip-text text-transparent">
            Mathematical Notation
          </span>
        </h1>
        <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto font-medium">
          A decoupled headless CMS architecture serving mathematical equations via LaTeX, data tables, code modules, and technical documentation.
        </p>
      </section>

      {/* Search Filter Bar */}
      <div className="max-w-md mx-auto relative flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 shadow-lg focus-within:border-violet-500 transition duration-150">
        <Search size={18} className="text-zinc-500 mr-2 flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search study guides, constants, equations..."
          className="bg-transparent border-0 outline-none text-sm text-zinc-100 placeholder-zinc-500 w-full focus:ring-0"
        />
      </div>

      {/* Articles Catalog Grid Layout */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-lg font-bold text-zinc-200 flex items-center space-x-2">
            <BookOpen size={18} className="text-violet-500" />
            <span>Document Directory ({filteredPages.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-24 text-zinc-500">
            <Loader2 size={36} className="animate-spin text-violet-500 mb-3" />
            <p className="text-sm">Retrieving article metadata...</p>
          </div>
        ) : error ? (
          <div className="p-8 border border-red-900/30 bg-red-950/15 text-red-400 rounded-xl text-center text-sm">
            <p className="font-semibold">{error}</p>
            <p className="text-xs text-zinc-500 mt-1">Make sure the Express backend server is running and accessible.</p>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="border border-zinc-900 rounded-2xl p-16 text-center text-zinc-500 bg-zinc-950/30">
            <BookOpen className="mx-auto mb-3 text-zinc-700" size={36} />
            <p className="text-sm">No documentation pages found.</p>
            <p className="text-xs text-zinc-600 mt-1">Log in to the Admin Dashboard to seed or create page records.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPages.map((page) => (
              <div
                key={page._id}
                className="bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-6 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-3 font-semibold font-mono">
                    <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/25 text-violet-400">
                      /{page.slug}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{new Date(page.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition duration-150 leading-tight">
                    {page.title}
                  </h3>
                  {page.description && (
                    <p className="text-zinc-400 text-sm mt-2 leading-relaxed line-clamp-3 font-medium">
                      {page.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/60">
                  <Link
                    to={`/p/${page.slug}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-violet-400 hover:text-violet-300 transition"
                  >
                    <span>Begin Reading</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;
