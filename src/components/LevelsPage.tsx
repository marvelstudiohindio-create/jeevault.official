import React from 'react';
import { useApp } from '../context/AppContext';
import { QuestionLevel } from '../types';
import { ArrowLeft, BarChart3, Target, Trophy, Shield, ArrowRight } from 'lucide-react';
import { normalizeChapterName } from '../lib/supabase';

interface LevelItem {
  id: QuestionLevel;
  trackNumber: string;
  title: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  accentBorder: string;
  glowColor: string;
}

const LEVELS: LevelItem[] = [
  {
    id: 'Level 1',
    trackNumber: 'TIER 01',
    title: 'Level 1',
    badge: 'Foundation & Concepts',
    description: 'Basic single-formula problems to solidify fundamental definitions and direct formula recall.',
    icon: <BarChart3 className="w-8 h-8 text-cyan-300" />,
    accentBorder: 'hover:border-cyan-400',
    glowColor: 'rgba(6, 182, 212, 0.25)',
  },
  {
    id: 'Level 2',
    trackNumber: 'TIER 02',
    title: 'Level 2',
    badge: 'Standard JEE Mains',
    description: 'Multi-step calculation problems matching authentic NTA JEE Mains difficulty patterns.',
    icon: <Target className="w-8 h-8 text-blue-300" />,
    accentBorder: 'hover:border-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.25)',
  },
  {
    id: 'Level 3',
    trackNumber: 'TIER 03',
    title: 'Level 3',
    badge: 'Advanced Multi-Concept',
    description: 'Challenging inter-chapter synthesis problems designed for top percentiles and IIT ranks.',
    icon: <Trophy className="w-8 h-8 text-violet-300" />,
    accentBorder: 'hover:border-violet-400',
    glowColor: 'rgba(139, 92, 246, 0.25)',
  },
  {
    id: 'JEEVault 50 Special',
    trackNumber: 'TIER 04',
    title: '50 Special',
    badge: 'High Yield Master Codex',
    description: 'The top 50 hand-picked recurring patterns that carry 60%+ marks in official exam shifts.',
    icon: <Shield className="w-8 h-8 text-amber-300" />,
    accentBorder: 'hover:border-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.25)',
  },
];

export const LevelsPage: React.FC = () => {
  const {
    activeSubject,
    activeCategory,
    activeChapter,
    setActiveLevel,
    setCurrentView,
    openActionPopup,
    questions,
  } = useApp();

  const handleLevelSelect = (level: QuestionLevel) => {
    setActiveLevel(level);
    openActionPopup({
      subject: activeSubject,
      category: activeCategory,
      chapter: activeChapter,
      level,
      isPyq: false,
    });
  };

  return (
    <main
      className="relative w-full min-h-[calc(100vh-64px)] bg-[#070a18] text-white flex flex-col justify-between py-6 px-4 sm:px-8 overflow-hidden select-none"
      aria-label="Select Practice Level"
    >
      {/* Subtle controlled ambient backdrop lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[700px] h-[320px] sm:h-[400px] bg-gradient-to-r from-blue-600/10 via-cyan-500/12 to-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-20">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setCurrentView('chapters')}
            className="w-10 h-10 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            title="Back to chapters"
            aria-label="Back to chapters"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
              {activeSubject.toUpperCase()} · {activeCategory.toUpperCase()}
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-['Outfit'] tracking-wider uppercase text-white drop-shadow-sm truncate max-w-[280px] sm:max-w-md md:max-w-lg">
              {activeChapter}
            </h1>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
            SELECT DIFFICULTY
          </span>
          <span className="text-xs text-cyan-300 font-semibold block">
            4 Structured Tiers
          </span>
        </div>
      </header>

      {/* 4 Clean Glassmorphic Cards */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-6 sm:my-8 z-10">
        {LEVELS.map((lvl) => {
          const lvlQCount = questions.filter(
            (q) =>
              q.subject === activeSubject &&
              normalizeChapterName(q.chapter) === normalizeChapterName(activeChapter) &&
              q.level === lvl.id &&
              (!q.examCategory || q.examCategory === activeCategory)
          ).length;

          return (
            <article
              key={lvl.id}
              onClick={() => handleLevelSelect(lvl.id)}
              className={`group relative h-[290px] sm:h-[310px] rounded-3xl p-6 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 backdrop-blur-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900/95 hover:-translate-y-1.5 shadow-xl hover:shadow-[0_15px_35px_-10px_${lvl.glowColor}] ${lvl.accentBorder}`}
            >
              {/* Gloss reflection */}
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-3xl" />

              <div className="w-full flex justify-between items-center z-10">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                  {lvl.trackNumber}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    lvlQCount > 0
                      ? 'text-emerald-300 bg-emerald-950/70 border border-emerald-400/30'
                      : 'text-cyan-300 bg-cyan-950/60 border border-cyan-400/20'
                  }`}
                >
                  {lvlQCount > 0 ? `${lvlQCount} Qs` : 'ACTIVE'}
                </span>
              </div>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform z-10 my-1">
              {lvl.icon}
            </div>

            {/* Title & Description */}
            <div className="flex flex-col items-center z-10">
              <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-wide text-white">
                {lvl.title}
              </h2>
              <p className="text-[11px] font-bold text-cyan-200/90 mt-0.5">
                {lvl.badge}
              </p>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 px-1 mt-2">
                {lvl.description}
              </p>
            </div>

            {/* Action button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLevelSelect(lvl.id);
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-cyan-400 group-hover:bg-cyan-400 text-slate-300 group-hover:text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer z-10"
            >
              <span>Access Questions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </article>
        );
      })}
      </div>

      {/* Bottom Hint */}
      <footer className="w-full text-center text-xs text-slate-500 z-10 py-2">
        Choose your preparation tier to launch an interactive test or access verified formula & solution PDFs.
      </footer>
    </main>
  );
};
