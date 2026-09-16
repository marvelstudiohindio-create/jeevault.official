import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Maximize2,
  Minimize2,
  ArrowLeft,
  Eye,
  RotateCcw,
  Sparkles,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AttemptPage: React.FC = () => {
  const {
    activeAttemptSession,
    endPracticeSession,
    recordAttempt,
    bookmarkedQuestionIds,
    toggleBookmark,
    activeSubject,
    activeCategory,
    activeChapter,
  } = useApp();

  const questionsList: Question[] = activeAttemptSession?.questions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({});
  const [showSolution, setShowSolution] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [bookmarkFeedback, setBookmarkFeedback] = useState<string | null>(null);

  // Timer tick
  useEffect(() => {
    if (questionsList.length === 0) return;
    const timer = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [questionsList.length]);

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questionsList[currentIndex];
  const isBookmarked = bookmarkedQuestionIds.includes(currentQ?.id);
  const selectedOption = selectedAnswers[currentQ?.id];
  const isChecked = checkedAnswers[currentQ?.id] !== undefined;
  const isCorrect = selectedOption === currentQ?.correctOptionIndex;

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIdx,
    }));
  };

  const handleCheckAnswer = () => {
    if (selectedOption === undefined) return;
    const correct = selectedOption === currentQ.correctOptionIndex;
    setCheckedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: correct,
    }));
    setShowSolution(true);
    recordAttempt(currentQ.id, selectedOption, correct, timerSeconds);

    if (correct) {
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  const handleClearResponse = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
    setCheckedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
    setShowSolution(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Stats calculation
  const totalAttempted = Object.keys(selectedAnswers).length;
  const totalCorrect = Object.values(checkedAnswers).filter(Boolean).length;
  const totalIncorrect = Object.values(checkedAnswers).filter((v) => v === false).length;

  if (questionsList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0c0d29] via-[#110e3d] to-[#090a1e] text-white flex flex-col font-sans select-none">
        <div className="w-full px-4 sm:px-8 py-3.5 border-b border-indigo-950/80 bg-[#090b20]/90 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={endPracticeSession}
              id="attempt-empty-exit"
              className="p-2 rounded-xl bg-indigo-950 border border-indigo-800/40 text-slate-300 hover:text-white hover:bg-indigo-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-lg font-black font-['Outfit'] text-white">
              JEE<span className="text-cyan-400">Vault</span>
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center p-8 rounded-3xl bg-[#13153c]/90 border border-indigo-800/60 shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-indigo-900/40 border border-indigo-700/50 flex items-center justify-center mx-auto mb-4 text-cyan-300">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No Questions Uploaded Yet</h2>
            <p className="text-sm text-indigo-300/80 mb-6 leading-relaxed">
              There are currently no practice questions uploaded for this chapter or level. Questions can be added directly via the Admin Dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={endPracticeSession}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-bold text-sm shadow-lg cursor-pointer transition-all"
              >
                Back to Chapters
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0d29] via-[#110e3d] to-[#090a1e] text-white flex flex-col font-sans select-none">
      {/* Top Test Header matching reference screenshot */}
      <div className="w-full px-4 sm:px-8 py-3.5 border-b border-indigo-950/80 bg-[#090b20]/90 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={endPracticeSession}
            id="attempt-btn-exit"
            className="p-2 rounded-xl bg-indigo-950 border border-indigo-800/40 text-slate-300 hover:text-white hover:bg-indigo-900 transition-colors"
            title="Exit practice test"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-fuchsia-500 p-0.5 shadow-sm">
              <div className="w-full h-full bg-[#0c0e29] rounded-[7px] flex items-center justify-center">
                <span className="text-xs font-black text-cyan-300">JV</span>
              </div>
            </div>
            <span className="text-lg font-black font-['Outfit'] text-white hidden sm:inline">
              JEE<span className="text-cyan-400">Vault</span>
            </span>
          </div>

          {/* Breadcrumbs matching reference screenshot */}
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-200">
            <span className="px-2.5 py-0.5 rounded bg-indigo-950 border border-indigo-700/40">
              {currentQ?.examCategory || activeCategory}
            </span>
            <span className="text-indigo-500">|</span>
            <span className="text-cyan-300 font-bold">
              {currentQ?.subject || activeSubject}
            </span>
            <span className="hidden md:inline text-indigo-400">
              ({currentQ?.chapter || activeChapter})
            </span>
          </div>
        </div>

        {/* Stopwatch Timer matching screenshot `00:00:40` */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-sm font-bold shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          <button
            onClick={() => setIsTestSubmitted(true)}
            id="attempt-btn-submit"
            className="hidden sm:inline-flex px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Area: Question Details, Options, & Solution */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-5xl mx-auto w-full">
          {/* Question Card matching screenshot */}
          <div className="rounded-3xl bg-[#13153c]/85 border-2 border-indigo-900/60 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative">
            {/* Top question badge bar */}
            <div className="flex items-center justify-between border-b border-indigo-900/50 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                {/* Number Badge `45` */}
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-lg font-black text-white shadow-inner font-mono">
                  {currentQ?.questionNumber || currentIndex + 1}
                </div>
                {/* Difficulty Badge `MEDIUM` */}
                <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-fuchsia-950/60 border border-fuchsia-500/40 text-fuchsia-300">
                  {currentQ?.difficulty === 'Standard' ? 'MEDIUM' : currentQ?.difficulty}
                </span>
                {currentQ?.pyqYear && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                    {currentQ.pyqYear}
                  </span>
                )}
              </div>

              {/* Right utility icons: Bookmark, Grid, Fullscreen */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (currentQ?.id) {
                      toggleBookmark(currentQ.id);
                      setBookmarkFeedback(isBookmarked ? 'Removed from bookmarks' : 'Question added to bookmarks');
                      setTimeout(() => setBookmarkFeedback(null), 2500);
                    }
                  }}
                  id="attempt-btn-bookmark"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isBookmarked
                      ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                      : 'bg-indigo-950/60 border-indigo-800/50 text-slate-300 hover:text-white hover:border-indigo-600'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark this question for revision'}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>

                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-slate-400 hover:text-white lg:hidden"
                  title="Toggle question grid"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-slate-400 hover:text-white"
                  title="Toggle fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed font-['Plus_Jakarta_Sans'] mb-8">
              {currentQ?.questionText}
            </div>

            {/* 4 Options matching screenshot with styled radio circles */}
            <div className="flex flex-col gap-3.5 mb-8">
              {currentQ?.options?.map((optionText, optIdx) => {
                const optLetter = String.fromCharCode(65 + optIdx); // A, B, C, D
                const isSelected = selectedOption === optIdx;
                const isCorrectOption = optIdx === currentQ.correctOptionIndex;

                let borderStyle = 'border-indigo-900/60 bg-indigo-950/30 hover:border-indigo-600/60';
                let circleStyle = 'bg-indigo-950 border-indigo-700 text-indigo-300';

                if (isChecked) {
                  if (isCorrectOption) {
                    borderStyle = 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(34,211,238,0.2)]';
                    circleStyle = 'bg-cyan-400 text-slate-950 font-bold';
                  } else if (isSelected && !isCorrectOption) {
                    borderStyle = 'border-pink-500 bg-pink-950/40 shadow-[0_0_20px_rgba(236,72,153,0.2)]';
                    circleStyle = 'bg-pink-500 text-white font-bold';
                  }
                } else if (isSelected) {
                  borderStyle = 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]';
                  circleStyle = 'bg-cyan-400 text-slate-950 font-bold';
                }

                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${borderStyle}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${circleStyle}`}
                    >
                      {optLetter}
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-slate-200">
                      {optionText}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions Bar matching reference */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-indigo-900/60">
              <button
                onClick={() => {
                  if (currentIndex > 0) {
                    setCurrentIndex(currentIndex - 1);
                    setShowSolution(false);
                  }
                }}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-slate-200 text-xs font-bold uppercase tracking-wider border border-indigo-800/40 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedOption !== undefined && !isChecked && (
                  <button
                    onClick={handleCheckAnswer}
                    id="attempt-btn-check"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:brightness-110 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-purple-600/40 transition-all cursor-pointer"
                  >
                    Check Answer
                  </button>
                )}

                {isChecked && (
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-wider uppercase transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showSolution ? 'Hide Solution' : 'View Solution'}</span>
                  </button>
                )}

                {selectedOption !== undefined && (
                  <button
                    onClick={handleClearResponse}
                    className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-slate-400 hover:text-white"
                    title="Clear response"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => {
                    if (currentQ?.id) {
                      toggleBookmark(currentQ.id);
                      setBookmarkFeedback(isBookmarked ? 'Removed from bookmarks' : 'Question added to bookmarks');
                      setTimeout(() => setBookmarkFeedback(null), 2500);
                    }
                  }}
                  id="attempt-bottom-btn-bookmark"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isBookmarked
                      ? 'bg-amber-500/25 border-amber-400/80 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-indigo-950/60 border-indigo-800/40 text-slate-400 hover:text-slate-200 hover:border-indigo-700'
                  }`}
                  title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  if (currentIndex < questionsList.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                    setShowSolution(false);
                  }
                }}
                disabled={currentIndex === questionsList.length - 1}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:brightness-110 text-white text-xs font-extrabold uppercase tracking-wider shadow-md disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Step-by-Step Solution Card */}
            {showSolution && (
              <div className="mt-8 p-6 rounded-2xl bg-[#0e102f] border-2 border-cyan-500/40 animate-in slide-in-from-bottom duration-300 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-cyan-300 font-mono">
                      Stepwise Verified Solution
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">
                    Correct Option: {String.fromCharCode(65 + currentQ.correctOptionIndex)}
                  </span>
                </div>

                {currentQ.keyFormula && (
                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono text-cyan-200 mb-3">
                    <span className="font-bold text-cyan-400">Core Formula: </span>
                    {currentQ.keyFormula}
                  </div>
                )}

                <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                  {currentQ.solutionText}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Palette Panel matching reference screenshot */}
        <div
          className={`w-full lg:w-80 border-l border-indigo-950/80 bg-[#0c0e2c]/90 backdrop-blur-xl p-6 flex flex-col justify-between transition-all duration-300 ${
            isSidebarOpen ? 'block' : 'hidden lg:flex'
          }`}
        >
          <div>
            {/* Status Legend matching screenshot */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                <span className="text-xs text-slate-300 font-medium">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-pink-500 shadow-sm shadow-pink-500/50"></div>
                <span className="text-xs text-slate-300 font-medium">Incorrect</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-indigo-900 border border-indigo-700"></div>
                <span className="text-xs text-slate-400 font-medium">Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50"></div>
                <span className="text-xs text-amber-300 font-medium">Bookmarked</span>
              </div>
            </div>

            {/* Question Numbers Grid (1 to 46+) matching screenshot */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Question Palette
              </span>
              <span className="text-xs font-mono text-cyan-300 font-bold">
                {totalAttempted} / {questionsList.length} Answered
              </span>
            </div>

            {/* 6-column number grid */}
            <div className="grid grid-cols-6 gap-2 max-h-[380px] overflow-y-auto pr-1">
              {Array.from({ length: Math.max(questionsList.length, 46) }).map((_, idx) => {
                const questionAtIndex = questionsList[idx];
                const qNum = idx + 1;
                const isCurrent = idx === currentIndex;

                let pillColor = 'bg-indigo-950/60 border-indigo-800/40 text-slate-400';

                const isQBookmarked = Boolean(questionAtIndex && bookmarkedQuestionIds.includes(questionAtIndex.id));

                if (questionAtIndex) {
                  const ans = selectedAnswers[questionAtIndex.id];
                  const chk = checkedAnswers[questionAtIndex.id];

                  if (chk === true) {
                    pillColor = 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(34,211,238,0.4)]';
                  } else if (chk === false) {
                    pillColor = 'bg-pink-500 text-white font-bold shadow-[0_0_10px_rgba(236,72,153,0.4)]';
                  } else if (ans !== undefined) {
                    pillColor = 'bg-cyan-500 text-slate-950 font-bold';
                  } else if (isQBookmarked) {
                    pillColor = 'bg-amber-950/40 border-amber-500/70 text-amber-300 font-bold';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (idx < questionsList.length) {
                        setCurrentIndex(idx);
                        setShowSolution(false);
                      }
                    }}
                    className={`relative h-9 rounded-xl border text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${pillColor} ${
                      isCurrent
                        ? 'ring-2 ring-fuchsia-400 scale-105 border-white text-white font-black'
                        : 'hover:border-indigo-500'
                    }`}
                    title={isQBookmarked ? `Question ${qNum} (Bookmarked)` : `Question ${qNum}`}
                  >
                    {qNum}
                    {isQBookmarked && (
                      <span
                        className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-950 shadow-xs shadow-amber-400"
                        title="Bookmarked"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Submit / Finish Test Button */}
          <div className="pt-4 border-t border-indigo-900/60 mt-4">
            <button
              onClick={() => setIsTestSubmitted(true)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              Finish & Review Test
            </button>
          </div>
        </div>
      </div>

      {/* Test Submission Summary Modal */}
      {isTestSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#141238] border-2 border-purple-500/50 p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-400 to-fuchsia-500 p-1 mx-auto mb-4 shadow-lg shadow-purple-600/30">
              <div className="w-full h-full bg-[#0c0e29] rounded-[22px] flex items-center justify-center">
                <Award className="w-8 h-8 text-yellow-300" />
              </div>
            </div>

            <h3 className="text-2xl font-black font-['Outfit'] text-white">
              Practice Session Completed!
            </h3>
            <p className="text-xs text-purple-300/80 mt-1">
              Time spent: {formatTimer(timerSeconds)}
            </p>

            <div className="grid grid-cols-3 gap-3 my-6">
              <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-800/50">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Attempted</span>
                <span className="text-xl font-black text-white">{totalAttempted}</span>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
                <span className="text-[10px] text-cyan-300 font-bold block uppercase">Correct</span>
                <span className="text-xl font-black text-cyan-300">{totalCorrect}</span>
              </div>
              <div className="p-3 rounded-2xl bg-pink-950/40 border border-pink-500/30">
                <span className="text-[10px] text-pink-300 font-bold block uppercase">Accuracy</span>
                <span className="text-xl font-black text-pink-300">
                  {totalAttempted > 0 ? ((totalCorrect / totalAttempted) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={endPracticeSession}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/40 transition-all"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => setIsTestSubmitted(false)}
                className="w-full py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
              >
                Continue Reviewing Questions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bookmark Feedback Toast */}
      {bookmarkFeedback && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-400 text-slate-950 font-bold text-xs shadow-2xl shadow-amber-400/40 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Bookmark className="w-4 h-4 fill-slate-950" />
          <span>{bookmarkFeedback}</span>
        </div>
      )}
    </div>
  );
};
