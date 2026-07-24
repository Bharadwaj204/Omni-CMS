import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { 
  LayoutDashboard, 
  FilePlus2, 
  LogOut, 
  Menu, 
  X,
  FileText,
  User
} from 'lucide-react';

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    {
      name: 'Pages Dashboard',
      path: '/',
      icon: LayoutDashboard
    },
    {
      name: 'Create New Page',
      path: '/create-page',
      icon: FilePlus2
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-zinc-900 border-b border-zinc-800 px-4 py-3 text-zinc-100">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
            Admin CMS
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-medium">Control Panel</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-zinc-800 rounded">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Panel */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between transition-transform duration-300 transform
        md:translate-x-0 md:static md:inset-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Top Section */}
        <div>
          {/* Logo Brand */}
          <div className="hidden md:flex items-center space-x-3 px-6 py-6 border-b border-zinc-800/60">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-violet-500/25">
              C
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight">Admin CMS</h1>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Headless CMS Engine</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150
                    ${isActive 
                      ? 'bg-violet-600/15 text-violet-400 border-l-2 border-violet-500 shadow-sm shadow-violet-900/5' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'}
                  `}
                >
                  <Icon size={18} className={isActive ? 'text-violet-400' : 'text-zinc-400'} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin User profile & Logout */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/65">
          {admin && (
            <div className="flex items-center space-x-3 mb-4 px-2 py-1.5 rounded-lg bg-zinc-950/40 border border-zinc-800/40">
              <div className="h-8 w-8 rounded-full bg-violet-600/35 border border-violet-500/20 flex items-center justify-center text-violet-300">
                <User size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-zinc-200 truncate">{admin.username}</p>
                <p className="text-[10px] text-zinc-500 truncate">{admin.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-900/25 hover:text-red-300 text-sm font-medium transition-all duration-150"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 bg-zinc-950 min-h-screen overflow-x-hidden p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Sidebar;
