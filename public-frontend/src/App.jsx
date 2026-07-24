import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components & Pages
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PageDetail from './pages/PageDetail';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-violet-500/35 selection:text-white">
        
        {/* Navigation Header */}
        <Navbar />

        {/* Page Container */}
        <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/p/:slug" element={<PageDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-600 font-semibold uppercase tracking-wider">
          <p>© {new Date().getFullYear()} QuantumLab. Decoupled Content Management System.</p>
        </footer>

      </div>
    </Router>
  );
};

export default App;
