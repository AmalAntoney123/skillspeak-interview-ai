
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onAuthClick: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
  onDashboardClick: () => void;
  hideNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onAuthClick, 
  onLogout, 
  onProfileClick, 
  onDashboardClick,
  hideNav = false
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('skillspeak_theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('skillspeak_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] transition-colors duration-300">
      {!hideNav && (
        <header className="sticky top-0 z-50 bg-[var(--header-bg)] backdrop-blur-xl border-b border-[var(--border)] h-16">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={onDashboardClick}
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">S</div>
              <span className="text-xl font-black text-[var(--text)] tracking-tighter">
                SkillSpeak
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              {user && (
                <>
                  <button onClick={onDashboardClick} className="text-xs font-bold text-[var(--muted)] hover:text-[var(--text)] uppercase tracking-widest transition-colors">Dashboard</button>
                  <button onClick={onProfileClick} className="text-xs font-bold text-[var(--muted)] hover:text-[var(--text)] uppercase tracking-widest transition-colors">Profile</button>
                </>
              )}
            </nav>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--text)] hover:bg-[var(--accent)] transition-all"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                )}
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-black text-[var(--text)] leading-none mb-1">{user.name}</p>
                    <button onClick={onLogout} className="text-[9px] text-red-400 font-bold uppercase tracking-[0.2em] hover:text-red-300 transition-colors">Terminate</button>
                  </div>
                  <div 
                    className="w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--accent)] overflow-hidden cursor-pointer hover:ring-2 ring-indigo-500 ring-offset-2 ring-offset-[var(--bg)] transition-all"
                    onClick={onProfileClick}
                  >
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              ) : (
                <button onClick={onAuthClick} className="btn-primary px-6 py-2 rounded-xl text-sm uppercase tracking-widest font-black">Sign In</button>
              )}
            </div>
          </div>
        </header>
      )}

      <main className={`flex-1 flex flex-col ${hideNav ? '' : 'py-10'}`}>
        <div className={hideNav ? 'flex-1' : 'max-w-7xl mx-auto px-6 w-full h-full'}>
          {children}
        </div>
      </main>

      {!hideNav && (
        <footer className="py-12 border-t border-[var(--border)] bg-[var(--bg)]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-[var(--muted)] text-[10px] font-black uppercase tracking-[0.3em]">© 2024 SkillSpeak Coach • Neural Interview Intelligence</p>
          </div>
        </footer>
      )}
    </div>
  );
};
