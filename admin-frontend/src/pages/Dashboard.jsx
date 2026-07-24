import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPages, deletePage, seedPagesDatabase } from '../store/slices/pagesSlice';
import { 
  FileText, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Search, 
  RefreshCw, 
  Database,
  Plus,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { list: pages, isLoading, isActionLoading, error } = useSelector((state) => state.pages);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchPages());
  }, [dispatch]);

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete the page: "${title}"?`)) {
      dispatch(deletePage(id));
    }
  };

  const handleSeed = () => {
    if (window.confirm('This will seed initial sample pages to your database. Proceed?')) {
      dispatch(seedPagesDatabase()).then(() => {
        dispatch(fetchPages());
      });
    }
  };

  // Filter pages by search query
  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (page.description && page.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 font-sans">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">CMS Content Manager</h2>
          <p className="text-sm text-zinc-400 mt-1">Manage and edit the block-based layout modules of the public website.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSeed}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-850 transition"
            title="Seed sample data"
          >
            <Database size={14} />
            <span>Seed Data</span>
          </button>
          <Link
            to="/create-page"
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-violet-600 rounded-xl hover:bg-violet-500 transition shadow-lg shadow-violet-600/15"
          >
            <Plus size={14} />
            <span>New Page</span>
          </Link>
        </div>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block">Total Managed Pages</span>
          <span className="text-3xl font-bold text-white block mt-1">{pages.length}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block">Target Host Server</span>
          <span className="text-sm font-medium text-zinc-300 block mt-2 font-mono truncate">localhost:5000</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-5">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block">Public Site URL</span>
          <a 
            href="http://localhost:5174" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-semibold text-violet-400 hover:text-violet-300 flex items-center space-x-1 mt-2.5"
          >
            <span>Visit Website</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Pages Filter Search Row */}
      <div className="flex items-center space-x-3 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5">
        <Search size={18} className="text-zinc-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter pages by title, slug, or content..."
          className="bg-transparent border-0 outline-none text-sm text-zinc-100 placeholder-zinc-500 w-full focus:ring-0"
        />
        {isLoading && <Loader2 size={16} className="animate-spin text-zinc-500" />}
      </div>

      {/* Pages Records Table/Card */}
      {isLoading && pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-zinc-500">
          <Loader2 size={32} className="animate-spin text-violet-500 mb-3" />
          <p className="text-sm">Fetching content records...</p>
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="border border-zinc-800 rounded-2xl p-16 text-center text-zinc-500 bg-zinc-900/10">
          <FileText className="mx-auto mb-3 text-zinc-700" size={36} />
          <p className="text-sm">No page entries matched your criteria.</p>
          <p className="text-xs text-zinc-600 mt-1">Add a new page or reset search parameters.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800/80">
              <thead className="bg-zinc-900/40">
                <tr>
                  <th scope="col" className="px-6 py-4.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Page Metadata</th>
                  <th scope="col" className="px-6 py-4.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Slug Endpoint</th>
                  <th scope="col" className="px-6 py-4.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Last Modified</th>
                  <th scope="col" className="px-6 py-4.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 bg-zinc-900/10">
                {filteredPages.map((page) => (
                  <tr key={page._id} className="hover:bg-zinc-900/30 transition-colors duration-100">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-100">{page.title}</div>
                      {page.description && (
                        <div className="text-xs text-zinc-500 truncate max-w-sm mt-0.5">{page.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-850 text-violet-400">
                        /{page.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-400">
                      {new Date(page.updatedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Live page view link */}
                        <a
                          href={`http://localhost:5174/p/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition"
                          title="Open on Live Website"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <Link
                          to={`/edit-page/${page.slug}`}
                          className="p-2 text-violet-400 hover:text-violet-300 hover:bg-violet-950/15 rounded-lg transition"
                          title="Edit page structure"
                        >
                          <Edit3 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(page._id, page.title)}
                          disabled={isActionLoading}
                          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/15 rounded-lg transition"
                          title="Delete Page"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
