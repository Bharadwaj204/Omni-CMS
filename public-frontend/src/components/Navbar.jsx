import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, BookOpen } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/85 backdrop-blur-md border-b border-zinc-900 px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Brand logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-violet-500/10 group-hover:scale-105 transition-transform duration-200">
            ⚛️
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white block leading-tight">QuantumLab</span>
            <span className="text-[10px] text-violet-400 font-semibold tracking-wider uppercase">Interactive Learn</span>
          </div>
        </Link>

        {/* Action controls */}
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-sm font-medium text-zinc-400 hover:text-zinc-100 flex items-center space-x-1.5 transition"
          >
            <BookOpen size={15} />
            <span className="hidden sm:inline">Library</span>
          </Link>

          <span className="w-px h-4 bg-zinc-800"></span>

          {/* Direct link to Admin CMS */}
          <a
            href="https://omni-cms-admin.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition"
          >
            <Shield size={13} className="text-violet-400" />
            <span>Admin Portal</span>
          </a>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
