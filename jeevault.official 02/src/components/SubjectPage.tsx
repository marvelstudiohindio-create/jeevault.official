import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { ExamCategory } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Target,
  Trophy,
  History,
  Sparkles,
} from 'lucide-react';

interface CategoryItem {
  id: ExamCategory;
  trackNumber: string;
  title: string;
  badge: string;
  description: string;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  iconBg: string;
  ctaText: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'JEE Mains',
    trackNumber: 'TRACK 01',
    title: 'JEE MAINS',
    badge: 'Formula Speed & Accuracy',
    description: 'Target 99+ percentile with high-yield conceptual speed tests, formula applications, and chapter drills.',
    accentColor: 'from-blue-500/25 via-cyan-950/35 to-slate-950',
    borderColor: 'border-cyan-400/50',
    glowColor: 'rgba(6, 182, 212, 0.28)',
    iconBg: 'bg-cyan-950/50 text-cyan-300 border-cyan-400/35',
    ctaText: 'Open Chapters',
  },
  {
    id: 'JEE Advanced',
    trackNumber: 'TRACK 02',
    title: 'JEE ADVANCED',
    badge: 'Deep Multi-Concept Reasoning',
    description: 'Conquer multi-correct, integer-type, comprehension, and matrix-match problems for top IIT ranks.',
    accentColor: 'from-violet-500/25 via-purple-950/35 to-slate-950',
    borderColor: 'border-violet-400/50',
    glowColor: 'rgba(139, 92, 246, 0.28)',
    iconBg: 'bg-violet-950/50 text-violet-300 border-violet-400/35',
    ctaText: 'Open Chapters',
  },
  {
    id: 'PYQ',
    trackNumber: 'TRACK 03',
    title: 'PYQ ARCHIVE',
    badge: '2018 - 2024 Past Papers',
    description: 'Authentic previous year question papers solved with expert shortcuts, marking schemes, and trends.',
    accentColor: 'from-amber-500/25 via-orange-950/35 to-slate-950',
    borderColor: 'border-amber-400/50',
    glowColor: 'rgba(245, 158, 11, 0.24)',
    iconBg: 'bg-amber-950/50 text-amber-300 border-amber-400/35',
    ctaText: 'Explore Past Papers',
  },
];

export const SubjectPage: React.FC = () => {
  const {
    activeSubject,
    setActiveCategory,
    setCurrentView,
  } = useApp();

  const [activeIndex, setActiveIndex] = useState(1); // Default to JEE ADVANCED (Track 02)
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

  const prevCategory = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? CATEGORIES.length - 1 : prev - 1));
  }, []);

  const nextCategory = useCallback(() => {
    setActiveIndex((prev) => (prev === CATEGORIES.length - 1 ? 0 : prev + 1));
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevCategory();
      } else if (e.key === 'ArrowRight') {
        nextCategory();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevCategory, nextCategory]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX > 0) {
        nextCategory();
      } else {
        prevCategory();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleCardClick = (index: number) => {
    if (index === activeIndex) {
      const selected = CATEGORIES[index].id;
      setActiveCategory(selected);
      if (selected === 'PYQ') {
        setCurrentView('pyq-select');
      } else {
        setCurrentView('chapters');
      }
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <main
      className="relative w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-between py-5 sm:py-7 px-3 sm:px-6 overflow-x-hidden select-none bg-[#070a18]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label={`${activeSubject} Curriculum Selector`}
    >
      {/* Subtle controlled ambient backdrop lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[700px] h-[320px] sm:h-[400px] bg-gradient-to-r from-blue-600/10 via-cyan-500/12 to-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      {/* Top Header with Back Navigation & Subject Context */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between z-20 px-2">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="w-10 h-10 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            title="Back to Domain selection"
            aria-label="Back to Domain selection"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
                DOMAIN · {activeSubject.toUpperCase()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-['Outfit'] tracking-wider uppercase text-white drop-shadow-sm">
              Select Curriculum
            </h1>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 text-xs font-medium">
          <span>Target JEE 2026</span>
        </div>
      </header>

      {/* 3D Slidable Category Stage */}
      <section
        className="relative w-full max-w-5xl h-[410px] sm:h-[460px] md:h-[485px] flex items-center justify-center perspective-[1100px] z-10 my-2 sm:my-3"
        aria-roledescription="3D Category Carousel"
      >
        {CATEGORIES.map((cat, idx) => {
          let offset = idx - activeIndex;
          if (offset < -1) offset += CATEGORIES.length;
          if (offset > 1) offset -= CATEGORIES.length;

          const isCenter = offset === 0;
          const isLeft = offset === -1;
          const isRight = offset === 1;

          // Responsive 3D transform computation
          let transformStyle = '';
          let zIndex = 10;
          let opacityStyle = 'opacity-45 hover:opacity-75';

          if (prefersReducedMotion) {
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
              key={cat.id}
              onClick={() => handleCardClick(idx)}
              style={{
                transform: transformStyle,
                zIndex,
                boxShadow: isCenter
                  ? `0 18px 50px -10px ${cat.glowColor}, 0 0 25px rgba(6, 182, 212, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.12)`
                  : '0 12px 30px -10px rgba(0, 0, 0, 0.65)',
                transition: prefersReducedMotion
                  ? 'opacity 300ms ease, transform 300ms ease'
                  : 'transform 550ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease, box-shadow 500ms ease',
              }}
              className={`absolute w-[265px] xs:w-[285px] sm:w-[315px] md:w-[335px] h-[375px] xs:h-[395px] sm:h-[435px] md:h-[460px] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 flex flex-col justify-between items-center text-center cursor-pointer backdrop-blur-xl border ${
                isCenter
                  ? `${cat.borderColor} bg-slate-900/90`
                  : 'border-slate-800/80 bg-slate-950/80'
              } ${opacityStyle} bg-gradient-to-b ${cat.accentColor} overflow-hidden`}
              aria-current={isCenter ? 'true' : 'false'}
              tabIndex={isCenter ? 0 : -1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(idx);
                }
              }}
            >
              {/* Subtle glass reflection */}
              <div className="absolute -top-24 -left-24 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />

              {/* Card Top Metadata: Track # & Status Badge */}
              <div className="w-full flex items-center justify-between z-10">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-400">
                  {cat.trackNumber}
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

              {/* Center Category Icon & Metadata */}
              <div className="my-auto flex flex-col items-center justify-center gap-3 sm:gap-4 z-10 w-full">
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl flex items-center justify-center border transition-transform duration-500 ${
                    cat.iconBg
                  } ${isCenter ? 'scale-105 shadow-inner' : 'scale-90'}`}
                >
                  {cat.id === 'JEE Mains' && (
                    <Target className="w-11 h-11 sm:w-13 sm:h-13 text-cyan-300 drop-shadow" />
                  )}
                  {cat.id === 'JEE Advanced' && (
                    <Trophy className="w-11 h-11 sm:w-13 sm:h-13 text-violet-300 drop-shadow" />
                  )}
                  {cat.id === 'PYQ' && (
                    <History className="w-11 h-11 sm:w-13 sm:h-13 text-amber-300 drop-shadow" />
                  )}
                </div>

                <div className="flex flex-col items-center max-w-full">
                  <h2 className="text-xl xs:text-2xl sm:text-3xl font-black font-['Outfit'] tracking-tight text-white drop-shadow-sm">
                    {cat.title}
                  </h2>
                  <p className="text-[11px] sm:text-xs font-semibold text-cyan-200/80 mt-1 tracking-wide">
                    {cat.badge}
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-2 line-clamp-2 max-w-[240px] leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Bottom Action CTA */}
              <div className="w-full z-10 mt-2">
                {isCenter ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(idx);
                    }}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    <span>{cat.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(idx);
                    }}
                    className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Select {cat.title}</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {/* Bottom Navigation Controls */}
      <nav
        className="flex flex-col items-center gap-2.5 sm:gap-3 z-20 my-2 sm:my-3"
        aria-label="Category Carousel Navigation"
      >
        <div className="flex items-center gap-5 sm:gap-6">
          <button
            type="button"
            onClick={prevCategory}
            id="cat-carousel-btn-prev"
            aria-label="Previous Category"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Pagination Indicators [● ━━━ ●] */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/90 backdrop-blur-md">
            {CATEGORIES.map((cat, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to ${cat.title}`}
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

          <button
            type="button"
            onClick={nextCategory}
            id="cat-carousel-btn-next"
            aria-label="Next Category"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <span className="text-[10px] sm:text-xs font-mono font-medium tracking-widest text-slate-500 uppercase select-none">
          SWIPE TO SELECT CATEGORY
        </span>
      </nav>
    </main>
  );
};
