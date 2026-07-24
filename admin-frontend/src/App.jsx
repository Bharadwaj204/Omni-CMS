import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadAdminProfile } from './store/slices/authSlice';

// Components & Pages
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PageBuilder from './pages/PageBuilder';
import { Loader2 } from 'lucide-react';

// Guard wrapper to protect routing paths
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token, isLoading } = useSelector((state) => state.auth);
  
  if (isLoading && !token) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-500">
        <Loader2 size={36} className="animate-spin text-violet-500 mb-2" />
        <span className="text-sm">Verifying administration access...</span>
      </div>
    );
  }

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  return <Sidebar>{children}</Sidebar>;
};

const App = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(loadAdminProfile());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Private Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-page" 
          element={
            <ProtectedRoute>
              <PageBuilder />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-page/:slug" 
          element={
            <ProtectedRoute>
              <PageBuilder />
            </ProtectedRoute>
          } 
        />

        {/* Dynamic Fallback redirection */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
