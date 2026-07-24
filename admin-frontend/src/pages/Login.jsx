import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, clearAuthError } from '../store/slices/authSlice';
import { ShieldAlert, Lock, Mail, Loader2 } from 'lucide-react';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear errors when mounting
    dispatch(clearAuthError());
    setValidationError('');

    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!emailOrUsername.trim() || !password) {
      setValidationError('Please fill in all credentials.');
      return;
    }

    dispatch(loginAdmin({ emailOrUsername, password }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative z-10">
        
        {/* Brand Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-violet-500/10 mb-4">
            C
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Administrator Portal</h2>
          <p className="text-sm text-zinc-400 mt-1.5">Sign in to manage dynamic content blocks</p>
        </div>

        {/* Status Alerts */}
        {(validationError || error) && (
          <div className="mb-6 p-3.5 bg-red-950/20 border border-red-900/40 text-red-400 rounded-lg flex items-start space-x-2.5 text-xs">
            <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Authentication Error</p>
              <p className="mt-0.5 opacity-90">{validationError || error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email or Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <Mail size={16} />
              </span>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:outline-none rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 transition"
                placeholder="admin@cms.com"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:outline-none rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 transition"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-violet-600/15 disabled:opacity-50 disabled:hover:bg-violet-600"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Demo Credentials Notice */}
        <div className="mt-8 pt-6 border-t border-zinc-800 text-center text-xs text-zinc-500">
          <p>Demo credentials seeded automatically:</p>
          <p className="mt-1 font-mono text-[11px] text-zinc-400">admin@cms.com / adminpassword123</p>
        </div>

      </div>
    </div>
  );
};

export default Login;
