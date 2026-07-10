import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, User, BarChart2, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getInitials } from '../utils/formatters';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Brand */}
        <button
          onClick={() => navigate('/app')}
          className="flex items-center gap-2 font-bold text-slate-800 hover:text-indigo-600 transition-colors duration-200 ease-out"
        >
          <div className="p-1.5 bg-indigo-600 rounded-lg">
            <BarChart2 size={18} className="text-white" />
          </div>
          <span className="text-lg">Fintrak</span>
        </button>

        {/* Right side: Theme toggle + User menu */}
        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* User menu */}
          {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors duration-200 ease-out"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {getInitials(user.name)}
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                {user.name}
              </span>
              <ChevronDown
                size={15}
                className={`text-slate-500 transition-transform duration-200 ease-out ${menuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-dropdown">
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                {/* Items */}
                <div className="p-1">
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/app/profile'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-200 ease-out"
                  >
                    <User size={15} />
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-200 ease-out"
                  >
                    <LogOut size={15} />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </header>
  );
}