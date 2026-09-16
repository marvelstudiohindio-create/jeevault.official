import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { SubjectId } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Compass,
  Bookmark,
  FileText,
  HelpCircle,
  X,
  Sparkles,
} from 'lucide-react';

interface SubjectItem {
  id: SubjectId;
  name: string;
  domainNumber: string;
  badge: string;
  description: string;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  iconBg: string;
}

const SUBJECTS: SubjectItem[] = [
  {
    id: 'Mathematics',
    name: 'Mathematics',
    domainNumber: 'DOMAIN 01',
    badge: 'Calculus · Algebra · 3D',
    description: 'Master analytical problem-solving, functions, coordinate geometry, and calculus.',
    accentColor: 'from-violet-500/25 via-purple-900/35 to-slate-950',
    borderColor: 'border-violet-500/40',
    glowColor: 'rgba(139, 92, 246, 0.25)',
    iconBg: 'bg-violet-950/50 text-violet-300 border-violet-500/30',
  },
  {
    id: 'Physics',
    name: 'Physics',
    domainNumber: 'DOMAIN 02',
    badge: 'Mechanics · Electrodynamics · Optics',
    description: 'Develop deep conceptual intuition for physical mechanics, waves, and field theory.',
    accentColor: 'from-cyan-500/25 via-blue-900/35 to-slate-950',
    borderColor: 'border-cyan-400/50',
    glowColor: 'rgba(6, 182, 212, 0.28)',
    iconBg: 'bg-cyan-950/50 text-cyan-300 border-cyan-400/35',
  },
  {
    id: 'Chemistry',
    name: 'Chemistry',
    domainNumber: 'DOMAIN 03',
    badge: 'Organic · Physical · Inorganic',
    description: 'Systematize reaction mechanisms, thermodynamics, kinetics, and periodic trends.',
    accentColor: 'from-amber-500/25 via-orange-950/35 to-slate-950',
    borderColor: 'border-amber-400/40',
    glowColor: 'rgba(245, 158, 11, 0.22)',
    iconBg: 'bg-amber-950/50 text-amber-300 border-amber-400/30',
  },
];

export const SubjectCarousel: React.FC = () => {
  const {
    setActiveSubject,
    setCurrentView,
    questions,
    bookmarkedQuestionIds,
    pdfs,
  } = useApp();

  const [activeIndex, setActiveIndex] = useState(1); // Default to Physics (Domain 02)
  const [isQuickHelpOpen, setIsQuickHelpOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const prevSubject = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? SUBJECTS.length - 1 : prev - 1));
  }, []);

  const nextSubject = useCallback(() => {
    setActiveIndex((prev) => (prev === SUBJECTS.length - 1 ? 0 : prev + 1));
  }, []);

  // Keyboard navigation support (ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSubject();
      } else if (e.key === 'ArrowRight') {
        nextSubject();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSubject, nextSubject]);

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    // Only trigger if horizontal swipe is significantly stronger than vertical scroll
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX > 0) {
        nextSubject();
      } else {
        prevSubject();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleCardClick = (index: number) => {
    if (index === activeIndex) {
      setActiveSubject(SUBJECTS[index].id);
      setCurrentView('subject');
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <main
      className="relative w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-between py-5 sm:py-8 px-3 sm:px-6 overflow-x-hidden select-none bg-[#070a18]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="JEEVault Domain Selector"
    >
      {/* Subtle controlled ambient backdrop lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[700px] h-[320px] sm:h-[400px] bg-gradient-to-r from-blue-600/10 via-cyan-500/12 to-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      {/* 1. Page Header Intro */}
      <header className="text-center z-10 max-w-2xl px-2 my-1 sm:my-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-['Outfit'] tracking-wider text-white uppercase drop-shadow-sm">
          Select Your Domain
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1 sm:mt-1.5 leading-relaxed">
          Choose a subject to explore your JEE question bank
        </p>
      </header>

      {/* 2. 3D Slidable Domain Stage */}
      <section
        className="relative w-full max-w-5xl h-[420px] sm:h-[470px] md:h-[500px] flex items-center justify-center perspective-[1100px] z-10"
        aria-roledescription="3D Carousel"
      >
        {SUBJECTS.map((item, index) => {
          let offset = index - activeIndex;
          if (offset < -1) offset += SUBJECTS.length;
          if (offset > 1) offset -= SUBJECTS.length;

          const isCenter = offset === 0;
          const isLeft = offset === -1;
          const isRight = offset === 1;

          // Responsive 3D transform computation
          let transformStyle = '';
          let zIndex = 10;
          let opacityStyle = 'opacity-45 hover:opacity-75';

          if (prefersReducedMotion) {
            // Simplified 2D transition for reduced motion
            if (isCenter) {
              transformStyle = 'translateX(0) scale(1)';
              zIndex = 30;
              opacityStyle = 'opacity-100';
            } else if (isLeft) {
              transformStyle = 'translateX(-45%) scale(0.85)';
              zIndex = 20;
            } else if (isRight) {
              transformStyle = 'translateX(45%) scale(0.85)';
              zIndex = 20;
            } else {
              transformStyle = 'scale(0.5)';
              opacityStyle = 'opacity-0 pointer-events-none';
            }
          } else {
            // High-fidelity 3D carousel
            if (isCenter) {
              transformStyle = 'translate3d(0, 0, 70px) scale(1)';
              zIndex = 30;
              opacityStyle = 'opacity-100 cursor-default';
            } else if (isLeft) {
              transformStyle = 'translate3d(calc(-50% - 30px), 0, -60px) scale(0.83) rotateY(16deg)';
              zIndex = 20;
            } else if (isRight) {
              transformStyle = 'translate3d(calc(50% + 30px), 0, -60px) scale(0.83) rotateY(-16deg)';
              zIndex = 20;
            } else {
              transformStyle = 'translate3d(0, 0, -120px) scale(0.6)';
              opacityStyle = 'opacity-0 pointer-events-none';
            }
          }

          return (
            <article
              key={item.id}
              onClick={() => handleCardClick(index)}
              style={{
                transform: transformStyle,
                zIndex,
                boxShadow: isCenter
                  ? `0 18px 50px -10px ${item.glowColor}, 0 0 25px rgba(6, 182, 212, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.12)`
                  : '0 12px 30px -10px rgba(0, 0, 0, 0.65)',
                transition: prefersReducedMotion
                  ? 'opacity 300ms ease, transform 300ms ease'
                  : 'transform 550ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease, box-shadow 500ms ease',
              }}
              className={`absolute w-[265px] xs:w-[285px] sm:w-[315px] md:w-[335px] h-[375px] xs:h-[395px] sm:h-[435px] md:h-[460px] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 flex flex-col justify-between items-center text-center cursor-pointer backdrop-blur-xl border ${
                isCenter
                  ? `${item.borderColor} bg-slate-900/90`
                  : 'border-slate-800/80 bg-slate-950/80'
              } ${opacityStyle} bg-gradient-to-b ${item.accentColor} overflow-hidden`}
              aria-current={isCenter ? 'true' : 'false'}
              tabIndex={isCenter ? 0 : -1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(index);
                }
              }}
            >
              {/* Subtle glass reflection highlight */}
              <div className="absolute -top-24 -left-24 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />

              {/* Card Top Metadata: Domain # & Status Badge */}
              <div className="w-full flex items-center justify-between z-10">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-400">
                  {item.domainNumber}
                </span>
                {isCenter ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-400/15 text-cyan-300 text-[10px] font-bold tracking-wide border border-cyan-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    ACTIVE
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-500 group-hover:text-slate-300">
                    TAP TO FOCUS
                  </span>
                )}
              </div>

              {/* Subject Visual Emblem */}
              <div className="my-auto flex flex-col items-center justify-center gap-3 sm:gap-4 z-10 w-full">
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center border transition-transform duration-500 ${
                    item.iconBg
                  } ${isCenter ? 'scale-105 shadow-inner' : 'scale-90'}`}
                >
                  {/* Mathematics Icon: Clean Mathematical Pi & Integral geometry */}
                  {item.id === 'Mathematics' && (
                    <div className="relative flex items-center justify-center w-full h-full">
                      <svg viewBox="0 0 64 64" className="w-12 h-12 sm:w-14 sm:h-14 text-violet-300 drop-shadow">
                        {/* Integral symbol motif */}
                        <path
                          d="M18 16 C 18 10, 24 10, 24 14 L 20 48 C 20 54, 14 54, 14 50"
                          fill="none"
                          stroke="rgba(196, 181, 253, 0.35)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        {/* Pi symbol */}
                        <path
                          d="M24 24 L 46 24"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M29 24 L 27 46 C 27 47, 26 48, 24 48"
                          stroke="currentColor"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M41 24 L 41 45 C 41 47, 43 47, 45 46"
                          stroke="currentColor"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Physics Icon: Atomic Orbital Mechanics */}
                  {item.id === 'Physics' && (
                    <div className="relative flex items-center justify-center w-full h-full">
                      <svg
                        viewBox="0 0 100 100"
                        className={`w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 text-cyan-300 drop-shadow ${
                          isCenter ? 'animate-spin-slow' : ''
                        }`}
                        style={{ animationDuration: '24s' }}
                      >
                        <ellipse
                          cx="50"
                          cy="50"
                          rx="40"
                          ry="15"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.8"
                          strokeDasharray="4 2"
                        />
                        <ellipse
                          cx="50"
                          cy="50"
                          rx="40"
                          ry="15"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.8"
                          strokeDasharray="4 2"
                          transform="rotate(60 50 50)"
                        />
                        <ellipse
                          cx="50"
                          cy="50"
                          rx="40"
                          ry="15"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.8"
                          strokeDasharray="4 2"
                          transform="rotate(120 50 50)"
                        />
                        <circle cx="50" cy="50" r="6" fill="#22d3ee" />
                      </svg>
                    </div>
                  )}

                  {/* Chemistry Icon: Modern Laboratory Flask & Molecule */}
                  {item.id === 'Chemistry' && (
                    <div className="relative flex items-center justify-center w-full h-full">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-11 h-11 sm:w-13 sm:h-13 text-amber-300 drop-shadow"
                      >
                        <path d="M10 2v6.5L4.5 19a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 8.5V2" />
                        <path d="M9 2h6" />
                        <path d="M6.5 17h11" strokeDasharray="2 2" />
                        <circle cx="10" cy="18.5" r="1" fill="currentColor" />
                        <circle cx="14" cy="17.5" r="0.75" fill="currentColor" />
                        <circle cx="12" cy="14" r="0.6" fill="currentColor" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Subject Name & Topics Metadata */}
                <div className="flex flex-col items-center max-w-full">
                  <h2 className="text-xl xs:text-2xl sm:text-3xl font-black font-['Outfit'] tracking-tight text-white drop-shadow-sm">
                    {item.name}
                  </h2>
                  <p className="text-[11px] sm:text-xs font-semibold text-cyan-200/80 mt-1 tracking-wide">
                    {item.badge}
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-2 line-clamp-2 max-w-[240px] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom Action Area */}
              <div className="w-full z-10 mt-2">
                {isCenter ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(index);
                    }}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>Explore Questions</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(index);
                    }}
                    className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Select {item.name}</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {/* 3. Carousel Navigation Controls */}
      <nav
        className="flex flex-col items-center gap-2.5 sm:gap-3 z-20 my-2 sm:my-3"
        aria-label="Carousel navigation"
      >
        <div className="flex items-center gap-5 sm:gap-6">
          {/* Previous Button */}
          <button
            type="button"
            onClick={prevSubject}
            id="carousel-btn-prev"
            aria-label="Previous Subject"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Pagination Indicators [● ━━━ ●] */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/90 backdrop-blur-md">
            {SUBJECTS.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to ${item.name}`}
                  aria-current={isActive ? 'true' : 'false'}
                  className={`transition-all duration-300 rounded-full cursor-pointer min-h-[14px] flex items-center justify-center ${
                    isActive
                      ? 'w-7 sm:w-8 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-xs shadow-cyan-400/50'
                      : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              );
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={nextSubject}
            id="carousel-btn-next"
            aria-label="Next Subject"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Subtle helper instruction */}
        <span className="text-[10px] sm:text-xs font-mono font-medium tracking-widest text-slate-500 uppercase select-none">
          SWIPE TO SELECT SUBJECT
        </span>
      </nav>

      {/* 4. Right-Side Floating Control (Clean, subtle, non-intrusive) */}
      <aside className="fixed bottom-5 right-4 sm:right-6 md:right-8 z-30">
        <button
          type="button"
          onClick={() => setIsQuickHelpOpen(!isQuickHelpOpen)}
          id="dashboard-floating-control"
          aria-label="Quick Study Overview"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-400/60 text-slate-300 hover:text-cyan-300 shadow-xl backdrop-blur-md flex items-center justify-center transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-cyan-400"
          title="Quick Study Overview"
        >
          {isQuickHelpOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          )}
        </button>

        {/* Quick Popover Menu */}
        {isQuickHelpOpen && (
          <div
            id="dashboard-quick-popover"
            className="absolute bottom-12 right-0 w-64 sm:w-72 rounded-2xl bg-[#090d24]/95 border border-slate-700/80 shadow-2xl p-4 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200"
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold font-['Outfit'] text-white uppercase tracking-wider">
                  Quick Study Hub
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickHelpOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
                aria-label="Close menu"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300 font-medium">Question Bank</span>
                <span className="font-mono font-bold text-cyan-400">
                  {questions.length} Questions
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300 font-medium">Study PDFs</span>
                <span className="font-mono font-bold text-purple-400">
                  {pdfs.length} Files
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300 font-medium">Bookmarked</span>
                <span className="font-mono font-bold text-amber-400">
                  {bookmarkedQuestionIds.length} Saved
                </span>
              </div>

              <div className="pt-2 mt-1 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsQuickHelpOpen(false);
                    setCurrentView('profile');
                  }}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 text-slate-200 text-center font-medium transition-colors"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsQuickHelpOpen(false);
                    setCurrentView('settings');
                  }}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 text-slate-200 text-center font-medium transition-colors"
                >
                  Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </main>
  );
};
