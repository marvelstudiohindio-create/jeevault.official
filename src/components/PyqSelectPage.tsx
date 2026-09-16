import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, FileText, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const PyqSelectPage: React.FC = () => {
  const {
    activeSubject,
    setActivePyqExam,
    setCurrentView,
  } = useApp();

  const handleSelect = (exam: 'JEE Mains' | 'JEE Advanced') => {
    setActivePyqExam(exam);
    setCurrentView('chapters');
  };

  return (
    <main
      className="relative w-full min-h-[calc(100vh-64px)] flex flex-col justify-between py-6 px-4 sm:px-8 overflow-hidden select-none bg-[#070a18]"
      aria-label="Select PYQ Exam Track"
    >
      {/* Subtle controlled ambient backdrop lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[700px] h-[320px] sm:h-[400px] bg-gradient-to-r from-blue-600/10 via-cyan-500/12 to-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between z-20">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setCurrentView('subject')}
            className="w-10 h-10 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            title="Back to curriculum selection"
            aria-label="Back to curriculum selection"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
              {activeSubject.toUpperCase()} · PAST YEAR ARCHIVES
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-['Outfit'] tracking-wider uppercase text-white drop-shadow-sm">
              Select Examination
            </h1>
          </div>
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-widest bg-slate-900/90 border border-slate-800 text-slate-400 px-3 py-1.5 rounded-full hidden sm:inline-block">
          2018 – 2024 Past Papers
        </span>
      </header>

      {/* 2 Clean Cards: JEE Mains vs JEE Advanced */}
      <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 my-auto py-6 z-10">
        {/* Card 1: JEE MAINS */}
        <article
          onClick={() => handleSelect('JEE Mains')}
          className="group relative w-full max-w-[320px] h-[340px] rounded-3xl p-6 sm:p-7 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 backdrop-blur-xl border border-cyan-500/30 hover:border-cyan-400 bg-slate-900/80 hover:bg-slate-900/95 hover:scale-[1.02] shadow-xl hover:shadow-[0_15px_40px_-10px_rgba(6,182,212,0.3)] bg-gradient-to-b from-cyan-950/20 via-slate-950/50 to-slate-950"
        >
          {/* Top gloss */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-3xl" />

          <div className="w-full flex justify-between items-center z-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              TRACK 01
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/25">
              NTA SESSIONS
            </span>
          </div>

          <div className="flex flex-col items-center z-10 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/50 border border-cyan-400/40 flex items-center justify-center group-hover:scale-105 transition-transform mb-3">
              <div className="relative">
                <FileText className="w-8 h-8 text-cyan-300" />
                <CheckCircle className="w-4 h-4 text-cyan-400 absolute -bottom-1 -right-1 fill-[#070a18]" />
              </div>
            </div>

            <h2 className="text-2xl font-black font-['Outfit'] tracking-tight text-white">
              JEE MAINS
            </h2>
            <p className="text-[11px] font-semibold text-cyan-200/80 mt-1">
              January & April Sessions
            </p>
            <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed max-w-[220px]">
              Chapter-wise compilation of past NTA shifts with authentic keys.
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect('JEE Mains');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer z-10"
          >
            <span>Select Chapters</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </article>

        {/* Card 2: JEE ADVANCED */}
        <article
          onClick={() => handleSelect('JEE Advanced')}
          className="group relative w-full max-w-[320px] h-[340px] rounded-3xl p-6 sm:p-7 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 backdrop-blur-xl border border-violet-500/30 hover:border-violet-400 bg-slate-900/80 hover:bg-slate-900/95 hover:scale-[1.02] shadow-xl hover:shadow-[0_15px_40px_-10px_rgba(139,92,246,0.3)] bg-gradient-to-b from-violet-950/20 via-slate-950/50 to-slate-950"
        >
          {/* Top gloss */}
          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-3xl" />

          <div className="w-full flex justify-between items-center z-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              TRACK 02
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-400/10 text-violet-300 border border-violet-400/25">
              IIT ROORKEE / MADRAS
            </span>
          </div>

          <div className="flex flex-col items-center z-10 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-violet-950/50 border border-violet-400/40 flex items-center justify-center group-hover:scale-105 transition-transform mb-3">
              <div className="relative">
                <FileText className="w-8 h-8 text-violet-300" />
                <ShieldCheck className="w-4 h-4 text-violet-400 absolute -bottom-1 -right-1 fill-[#070a18]" />
              </div>
            </div>

            <h2 className="text-2xl font-black font-['Outfit'] tracking-tight text-white">
              JEE ADVANCED
            </h2>
            <p className="text-[11px] font-semibold text-violet-200/80 mt-1">
              Paper 1 & Paper 2 Comprehensive
            </p>
            <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed max-w-[220px]">
              Complete archive with multi-concept solutions and step markings.
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect('JEE Advanced');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-xs shadow-md shadow-violet-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer z-10"
          >
            <span>Select Chapters</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </article>
      </div>

      {/* Bottom helper */}
      <footer className="w-full text-center z-10 py-2">
        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
          All questions cross-verified against official answer keys
        </span>
      </footer>
    </main>
  );
};
