import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  X,
  User,
  Settings,
  Home,
  ShieldCheck,
  LogOut,
  GraduationCap,
  Sparkles,
  BookOpen,
  Target,
  Trophy,
  TrendingUp,
  Bookmark,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    isLoggedIn,
    setIsAuthModalOpen,
    setAuthMode,
    logout,
    bookmarkedQuestionIds,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isLanding = currentView === 'landing';
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 12) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on view change or resize
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentView]);

  const handleNavClick = (sectionId?: string) => {
    setMobileMenuOpen(false);
    if (!isLanding) {
      setCurrentView('landing');
      setTimeout(() => {
        if (sectionId) {
          const el = document.getElementById(sectionId);
          el?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 80);
    } else {
      if (sectionId) {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // --- LIGHT NAVBAR FOR LANDING PAGE ---
  if (isLanding) {
    return (
      <header
        className={`w-full z-50 sticky top-0 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/90'
            : 'bg-white/90 backdrop-blur-sm border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            id="nav-brand-logo"
            onClick={() => handleNavClick()}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              <svg viewBox="0 0 32 32" className="w-5 h-5 sm:w-6 sm:h-6 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4 L28 25 L4 25 Z" />
                <circle cx="16" cy="18" r="3" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline leading-none">
                <span className="text-xl sm:text-2xl font-black font-['Outfit'] text-blue-600 tracking-tight">
                  JEE
                </span>
                <span className="text-xl sm:text-2xl font-black font-['Outfit'] text-slate-900 tracking-tight">
                  Vault
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase font-mono mt-0.5">
                Practice &bull; Crack
              </span>
            </div>
          </div>

          {/* Center Navigation (Desktop & Tablet) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-slate-600">
            <button
              id="nav-link-home"
              onClick={() => handleNavClick()}
              className="px-3.5 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer font-semibold text-slate-900"
            >
              Home
            </button>
            <button
              id="nav-link-study"
              onClick={() => handleNavClick('feature-study')}
              className="px-3.5 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Study
            </button>
            <button
              id="nav-link-practice"
              onClick={() => handleNavClick('feature-practice')}
              className="px-3.5 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Practice
            </button>
            <button
              id="nav-link-crack"
              onClick={() => handleNavClick('feature-crack')}
              className="px-3.5 py-2 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Crack
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <button
                  id="nav-btn-dashboard"
                  onClick={() => setCurrentView('home')}
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Enter Study Dashboard
                </button>
                <div
                  onClick={() => setCurrentView('profile')}
                  className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:ring-2 hover:ring-blue-400 transition-all"
                  title={currentUser?.name}
                >
                  <img
                    src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={currentUser?.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            ) : (
              <>
                <button
                  id="nav-btn-login"
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  id="nav-btn-signup"
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4.5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer font-['Outfit']"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Upper Controls: Login, Sign Up and Hamburger Toggle */}
          <div className="flex items-center sm:hidden gap-1.5">
            {!isLoggedIn ? (
              <div className="flex items-center gap-1">
                <button
                  id="nav-mobile-login"
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  id="nav-mobile-signup"
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors cursor-pointer font-['Outfit']"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <button
                id="nav-mobile-dashboard"
                onClick={() => setCurrentView('home')}
                className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer"
              >
                Dashboard
              </button>
            )}
            <button
              id="nav-mobile-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div
            id="nav-mobile-drawer"
            className="sm:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200"
          >
            <div className="flex flex-col gap-1 text-base font-medium text-slate-700">
              <button
                onClick={() => handleNavClick()}
                className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-50 hover:text-blue-600 text-left font-semibold text-slate-900"
              >
                <span>Home</span>
              </button>
              <button
                onClick={() => handleNavClick('feature-study')}
                className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-50 hover:text-blue-600 text-left"
              >
                <span>Study</span>
                <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">All Questions</span>
              </button>
              <button
                onClick={() => handleNavClick('feature-practice')}
                className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-50 hover:text-blue-600 text-left"
              >
                <span>Practice</span>
                <span className="text-xs bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded">Special 50</span>
              </button>
              <button
                onClick={() => handleNavClick('feature-crack')}
                className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-50 hover:text-blue-600 text-left"
              >
                <span>Crack</span>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded">All PYQs</span>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-2.5">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setCurrentView('home')}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-bold text-center text-sm shadow-sm"
                  >
                    Enter Study Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentView('profile')}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-center text-sm hover:bg-slate-50"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={logout}
                    className="w-full py-2.5 px-4 rounded-xl text-red-600 font-semibold text-center text-sm hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border border-slate-300 text-slate-800 font-semibold text-center text-sm hover:bg-slate-50 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthMode('signup');
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-center text-sm shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    );
  }

  // --- DARK DASHBOARD NAVBAR (FOR ACTIVE STUDY SESSIONS & APP SECTIONS) ---
  return (
    <header className="w-full z-40 sticky top-0 border-b border-indigo-950/80 bg-[#070a18]/90 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-17 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
          id="nav-brand-logo-dark"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 blur-[6px] opacity-60 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0a0d24] border border-cyan-500/30 flex items-center justify-center shadow-inner">
              <svg viewBox="0 0 32 32" className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:rotate-6 transition-transform duration-300">
                <defs>
                  <linearGradient id="vaultGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" />
                    <stop offset="60%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <path
                  d="M16 4 L28 25 L4 25 Z"
                  fill="none"
                  stroke="url(#vaultGradDark)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="16" cy="18" r="3.2" fill="#00f0ff" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline leading-none">
              <span className="text-xl sm:text-2xl font-black font-['Outfit'] text-cyan-400 tracking-tight">
                JEE
              </span>
              <span className="text-xl sm:text-2xl font-black font-['Outfit'] text-white tracking-tight">
                Vault
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.25em] text-indigo-300/80 font-mono mt-0.5">
              PORTAL
            </span>
          </div>
        </div>

        {/* Desktop / Tablet Navigation Controls */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {isLoggedIn ? (
            <nav className="flex items-center gap-1.5 lg:gap-2 text-sm font-semibold">
              {isAdmin && (
                <button
                  id="nav-btn-admin"
                  onClick={() => setCurrentView('admin')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    currentView === 'admin'
                      ? 'bg-purple-600/90 text-white shadow-md shadow-purple-600/30 border border-purple-400/40'
                      : 'bg-purple-950/40 text-purple-300 border border-purple-500/25 hover:bg-purple-900/40'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-pink-300" />
                  <span>Admin</span>
                </button>
              )}

              <button
                id="nav-btn-home"
                onClick={() => setCurrentView('home')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currentView === 'home' || currentView === 'subject' || currentView === 'chapters' || currentView === 'levels'
                    ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/40 shadow-xs shadow-cyan-500/10 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                id="nav-btn-progress"
                onClick={() => setCurrentView('progress')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currentView === 'progress'
                    ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/40 font-bold shadow-xs shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
                title="View detailed performance analysis"
              >
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Progress Analysis</span>
              </button>

              <button
                id="nav-btn-bookmarks"
                onClick={() => setCurrentView('bookmarks')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currentView === 'bookmarks'
                    ? 'text-amber-300 bg-amber-950/50 border border-amber-500/40 font-bold shadow-xs shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
                title="View your saved & bookmarked questions"
              >
                <Bookmark className={`w-4 h-4 ${bookmarkedQuestionIds.length > 0 ? 'text-amber-400 fill-amber-400/40' : 'text-slate-400'}`} />
                <span>Bookmarks</span>
                {bookmarkedQuestionIds.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black bg-amber-500/25 text-amber-300 border border-amber-500/40">
                    {bookmarkedQuestionIds.length}
                  </span>
                )}
              </button>

              <button
                id="nav-btn-settings"
                onClick={() => setCurrentView('settings')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  currentView === 'settings'
                    ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/40 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>

              {/* Profile Avatar & Sign Out */}
              <div className="flex items-center gap-3 pl-3 border-l border-indigo-950/80">
                <div
                  id="nav-avatar-profile"
                  onClick={() => setCurrentView('profile')}
                  className={`cursor-pointer flex items-center gap-2 p-0.5 rounded-full transition-all group ${
                    currentView === 'profile'
                      ? 'ring-2 ring-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                      : 'hover:ring-2 hover:ring-cyan-400/70'
                  }`}
                  title={`View profile of ${currentUser?.name || 'User'}`}
                >
                  <img
                    src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={currentUser?.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover border border-cyan-500/30 group-hover:brightness-110"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <button
                  id="nav-btn-logout"
                  onClick={logout}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/25 text-red-300 hover:text-red-100 text-xs font-medium transition-all cursor-pointer"
                  title="Sign out of JEEVault"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-1.5 text-sm font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-all"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Header Controls */}
        <div className="flex md:hidden items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              className="px-2 py-1 rounded-md bg-purple-950/60 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider"
            >
              Admin
            </button>
          )}

          {isLoggedIn && (
            <div
              onClick={() => setCurrentView('profile')}
              className="cursor-pointer p-0.5 rounded-full hover:ring-2 hover:ring-cyan-400 transition-all"
            >
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'User'}
                className="w-7 h-7 rounded-full object-cover border border-cyan-500/30"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            id="nav-dark-mobile-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer for Dashboard */}
      {mobileMenuOpen && (
        <div
          id="nav-dark-mobile-drawer"
          className="md:hidden border-t border-indigo-950/90 bg-[#080b20]/98 backdrop-blur-2xl px-4 py-4 shadow-2xl animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col gap-1.5 text-sm font-medium text-slate-300">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${
                currentView === 'home'
                  ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/40 font-bold'
                  : 'hover:bg-slate-800/40 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('progress');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${
                currentView === 'progress'
                  ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/40 font-bold'
                  : 'hover:bg-slate-800/40 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Progress Analysis</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('bookmarks');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${
                currentView === 'bookmarks'
                  ? 'text-amber-300 bg-amber-950/50 border border-amber-500/40 font-bold'
                  : 'hover:bg-slate-800/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>Bookmarks</span>
              </div>
              {bookmarkedQuestionIds.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {bookmarkedQuestionIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setCurrentView('profile');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${
                currentView === 'profile'
                  ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/40 font-bold'
                  : 'hover:bg-slate-800/40 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('settings');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${
                currentView === 'settings'
                  ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/40 font-bold'
                  : 'hover:bg-slate-800/40 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  setCurrentView('admin');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${
                  currentView === 'admin'
                    ? 'text-purple-300 bg-purple-950/50 border border-purple-500/40 font-bold'
                    : 'hover:bg-slate-800/40 hover:text-purple-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-pink-400" />
                <span>Admin Portal</span>
              </button>
            )}

            <div className="pt-2 mt-2 border-t border-indigo-950/80 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-red-950/40 border border-red-500/25 text-red-300 hover:text-red-100 text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
