import React, { useState } from 'react';
import { Sparkles, User, ChevronDown, LogOut } from 'lucide-react';

const Navbar = ({ user, onLogout, onAuth }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      <nav className="h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-6 z-50 relative">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-violet-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            AI Reader
          </span>
        </div>

        {/* Right Section */}
        <div>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-2xl transition-colors border border-transparent hover:border-white/10"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                  <User className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden py-2 z-50">
                  <div className="px-4 py-2 border-b border-white/10 mb-2 sm:hidden">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-white/5 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onAuth(true)}
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-4 py-2"
              >
                Log in
              </button>
              <button
                onClick={() => onAuth(false)}
                className="text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-5 py-2 transition-all hover:scale-105"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
