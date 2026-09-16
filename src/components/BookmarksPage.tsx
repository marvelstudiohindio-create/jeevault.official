import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bookmark,
  Search,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Trash2,
  Play,
  ArrowRight,
  TrendingUp,
  User,
  Filter,
} from 'lucide-react';
import { SubjectId, Question } from '../types';

export const BookmarksPage: React.FC = () => {
  const {
    currentUser,
    bookmarkedQuestionIds,
    questions,
    toggleBookmark,
    startPracticeSession,
    setCurrentView,
  } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSolutionId, setExpandedSolutionId] = useState<string | null>(null);

  // Get all bookmarked questions for this user
  const bookmarkedQuestions = useMemo(() => {
    return questions.filter((q) => bookmarkedQuestionIds.includes(q.id));
  }, [questions, bookmarkedQuestionIds]);

  // Filtered by subject and search
  const filteredQuestions = useMemo(() => {
    return bookmarkedQuestions.filter((q) => {
      const qSub = (q.subject || '').toLowerCase();
      const matchesSubject =
        selectedSubject === 'All' || qSub === selectedSubject.toLowerCase();
      const qText = (q.questionText || '').toLowerCase();
      const qCh = (q.chapter || '').toLowerCase();
      const qPyq = q.pyqYear ? String(q.pyqYear).toLowerCase() : '';
      const sQuery = searchQuery.trim().toLowerCase();

      const matchesSearch =
        sQuery === '' ||
        qText.includes(sQuery) ||
        qCh.includes(sQuery) ||
        qPyq.includes(sQuery);

      return matchesSubject && matchesSearch;
    });
  }, [bookmarkedQuestions, selectedSubject, searchQuery]);

  const subjectCounts = useMemo(() => {
    const counts = {
      All: bookmarkedQuestions.length,
      Physics: 0,
      Chemistry: 0,
      Mathematics: 0,
    };
    bookmarkedQuestions.forEach((q) => {
      if (q.subject === 'Physics') counts.Physics += 1;
      else if (q.subject === 'Chemistry') counts.Chemistry += 1;
      else if (q.subject === 'Mathematics') counts.Mathematics += 1;
    });
    return counts;
  }, [bookmarkedQuestions]);

  const handleStartPracticeWithBookmarks = () => {
    if (filteredQuestions.length > 0) {
      startPracticeSession(filteredQuestions);
    }
  };

  const handlePracticeSingle = (q: Question) => {
    startPracticeSession([q]);
  };

  return (
    <div className="min-h-screen bg-[#07091e] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Title and User Context */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-950/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Bookmark className="w-5 h-5 fill-amber-400/30" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
                Bookmarked Questions
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Personalized revision vault for{' '}
              <span className="text-cyan-300 font-semibold">{currentUser?.name || 'Student'}</span>{' '}
              — saved during practice sessions and tests
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center flex-wrap gap-2.5">
            {filteredQuestions.length > 0 && (
              <button
                id="bookmarks-btn-start-practice"
                onClick={handleStartPracticeWithBookmarks}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Re-Attempt All ({filteredQuestions.length})</span>
              </button>
            )}

            <button
              onClick={() => setCurrentView('progress')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0e102f] hover:bg-indigo-950/80 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Progress Analysis</span>
            </button>

            <button
              onClick={() => setCurrentView('profile')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 text-slate-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span>My Profile</span>
            </button>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0c0e29] p-4 rounded-2xl border border-indigo-900/60">
          {/* Subject Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {(['All', 'Physics', 'Chemistry', 'Mathematics'] as const).map((sub) => {
              const count = subjectCounts[sub];
              const isSelected = selectedSubject === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-indigo-950/60 hover:bg-indigo-900/60 text-slate-300 border border-indigo-800/50'
                  }`}
                >
                  <span>{sub}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected ? 'bg-black/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapter or concept..."
              className="w-full bg-[#080a21] border border-indigo-900/70 focus:border-amber-400/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredQuestions.length === 0 ? (
          <div className="py-16 px-6 rounded-3xl bg-[#0c0e29] border border-indigo-900/60 text-center max-w-xl mx-auto shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-lg shadow-amber-500/10">
              <Bookmark className="w-8 h-8 fill-amber-400/30" />
            </div>

            <h3 className="text-xl font-bold font-['Outfit'] text-white">
              {bookmarkedQuestions.length === 0
                ? 'No Bookmarked Questions Yet'
                : 'No Questions Match Your Filter'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 mt-2 mb-6 leading-relaxed max-w-md mx-auto">
              {bookmarkedQuestions.length === 0
                ? 'During practice sessions and tests, click the 🔖 Bookmark button on any challenging question to save it here for targeted revision.'
                : 'Try changing the subject filter or clearing your search query to see other saved questions.'}
            </p>

            <button
              onClick={() => setCurrentView('home')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <span>Explore Question Vault</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Bookmarked Questions List */
          <div className="space-y-4">
            {filteredQuestions.map((q, index) => {
              const isSolutionOpen = expandedSolutionId === q.id;

              return (
                <div
                  key={q.id}
                  className="p-6 rounded-3xl bg-[#0c0e29] border border-indigo-900/60 hover:border-amber-500/40 shadow-xl transition-all"
                >
                  {/* Card Header Tags */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-indigo-950/80">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        #{index + 1}
                      </span>

                      {/* Subject Tag */}
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          q.subject === 'Physics'
                            ? 'bg-cyan-950/60 border border-cyan-500/30 text-cyan-300'
                            : q.subject === 'Chemistry'
                            ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
                            : 'bg-fuchsia-950/60 border border-fuchsia-500/30 text-fuchsia-300'
                        }`}
                      >
                        {q.subject}
                      </span>

                      {/* Chapter Badge */}
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-950/70 border border-indigo-800/50 text-slate-300">
                        {q.chapter}
                      </span>

                      {/* PYQ Year */}
                      {q.pyqYear && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-950/50 border border-amber-500/30 text-amber-300">
                          {q.pyqYear}
                        </span>
                      )}

                      {/* Difficulty */}
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/70 text-slate-300">
                        {q.difficulty}
                      </span>
                    </div>

                    {/* Remove Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(q.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-semibold transition-all cursor-pointer"
                      title="Remove from bookmarks"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  {/* Question Statement */}
                  <div className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed mb-4 whitespace-pre-line">
                    {q.questionText}
                  </div>

                  {/* Multiple Choice Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctOptionIndex;
                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-colors ${
                            isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                              : 'bg-indigo-950/30 border-indigo-900/40 text-slate-300'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-indigo-900/70 text-slate-400'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="mt-0.5 leading-relaxed">{opt}</span>
                          {isCorrect && (
                            <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                              Correct
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Expandable Solution Box */}
                  {isSolutionOpen && (
                    <div className="mt-4 p-5 rounded-2xl bg-[#080a22] border border-cyan-500/30 animate-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center gap-2 mb-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        <span>Stepwise Verified Solution</span>
                      </div>

                      {q.keyFormula && (
                        <div className="mb-3 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs font-mono text-cyan-200">
                          <span className="font-bold text-cyan-400">Core Formula: </span>
                          {q.keyFormula}
                        </div>
                      )}

                      <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                        {q.solutionText}
                      </div>
                    </div>
                  )}

                  {/* Card Footer Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-indigo-950/70 mt-4">
                    <button
                      onClick={() =>
                        setExpandedSolutionId(isSolutionOpen ? null : q.id)
                      }
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      {isSolutionOpen ? 'Hide Detailed Solution' : 'View Detailed Solution'}
                    </button>

                    <button
                      onClick={() => handlePracticeSingle(q)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Attempt Question</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
