import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo (left) */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            PrepAI
          </span>
        </Link>

        {/* Nav Links (center, hidden md:flex) */}
        <div className="hidden md:flex items-center space-x-1">
          <Link
            to="/dashboard"
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Dashboard
          </Link>
          {token ? (
            <Link
              to="/resume"
              className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Resume
            </Link>
          ) : (
            <span
              className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-400 dark:text-slate-500 cursor-not-allowed"
              title="Login to access resume evaluator"
            >
              Resume
            </span>
          )}
          <span
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-400 dark:text-slate-500 cursor-not-allowed"
            title="Coming in later phases"
          >
            Jobs
          </span>
          <span
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-400 dark:text-slate-500 cursor-not-allowed"
            title="Coming in later phases"
          >
            DSA
          </span>
          <span
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-400 dark:text-slate-500 cursor-not-allowed"
            title="Coming in later phases"
          >
            Interview
          </span>
        </div>

        {/* Right side: Dark mode + Auth */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {token && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {getInitials(user.name)}
                </div>
                <span className="hidden sm:inline-block text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 mr-1" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {user.email}
                    </p>
                    <span className="inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                      {user.role}
                    </span>
                  </div>
                  <div className="pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl px-4 py-2 text-sm hover:shadow-lg hover:shadow-indigo-500/30 hover:opacity-95 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
