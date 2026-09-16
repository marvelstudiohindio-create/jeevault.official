import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Search, Layers, ChevronRight, FileText, BookOpen } from 'lucide-react';
import { normalizeChapterName } from '../lib/supabase';

export const ChapterListPage: React.FC = () => {
  const {
    activeSubject,
    activeCategory,
    activePyqExam,
    setActiveChapter,
    setCurrentView,
    openActionPopup,
    chapters: allChapters,
    questions,
    pdfs,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  const chapters = allChapters[activeSubject] || [];
  const filteredChapters = chapters.filter((ch) =>
    ch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isPyq = activeCategory === 'PYQ';
  const categoryBadge = isPyq ? `PYQ (${activePyqExam})` : activeCategory;

  const handleChapterClick = (chapterName: string) => {
    setActiveChapter(chapterName);
    if (isPyq) {
      openActionPopup({
        subject: activeSubject,
        category: 'PYQ',
        chapter: chapterName,
        isPyq: true,
      });
    } else {
      setCurrentView('levels');
    }
  };

  return (
    <main
      className="relative w-full min-h-[calc(100vh-64px)] bg-[#070a18] text-white py-6 px-4 sm:px-8 overflow-x-hidden"
      aria-label={`${activeSubject} Chapters Directory`}
    >
      {/* Subtle controlled ambient backdrop lighting */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col gap-6 relative z-10">
        {/* Header bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                if (isPyq) setCurrentView('pyq-select');
                else setCurrentView('subject');
              }}
              className="w-10 h-10 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 shrink-0"
              title="Back"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] uppercase tracking-wider text-white">
                  {activeSubject} Chapters
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-400/30 text-cyan-300 font-bold">
                  {categoryBadge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Select a chapter to access practice questions, formula codex, and past year solutions.
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search chapters..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
        </header>

        {/* Chapters Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {filteredChapters.map((ch, idx) => {
            const chQuestionsCount = questions.filter(
              (q) => q.subject === activeSubject && normalizeChapterName(q.chapter) === normalizeChapterName(ch.name)
            ).length;
            const chPdfsCount = pdfs.filter(
              (p) => p.subject === activeSubject && normalizeChapterName(p.chapter) === normalizeChapterName(ch.name)
            ).length;

            return (
              <article
                key={ch.id}
                onClick={() => handleChapterClick(ch.name)}
                className="group p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-900/95 border border-slate-800 hover:border-cyan-400/60 backdrop-blur-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/40 flex flex-col justify-between min-h-[145px]"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-300 px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-400/30">
                    CH-{String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-slate-800/80 group-hover:bg-cyan-400/20 flex items-center justify-center transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>

                <div className="my-2">
                  <h2 className="text-base font-bold text-white group-hover:text-cyan-100 transition-colors line-clamp-2">
                    {ch.name}
                  </h2>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/70">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    <span>{chQuestionsCount} {chQuestionsCount === 1 ? 'Question' : 'Questions'}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{chPdfsCount} {chPdfsCount === 1 ? 'PDF' : 'PDFs'}</span>
                  </span>
                </div>
              </article>
            );
          })}
        </section>

        {filteredChapters.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-sm bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p>No chapters found matching "{searchTerm}".</p>
          </div>
        )}
      </div>
    </main>
  );
};
