import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlayCircle, FileText, X, Sparkles, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const ActionPopup: React.FC = () => {
  const {
    actionPopup,
    closeActionPopup,
    currentUser,
    setCurrentView,
    startPracticeSession,
    questions,
    pdfs,
    setActivePdf,
  } = useApp();

  const [pdfNotice, setPdfNotice] = useState<string | null>(null);

  if (!actionPopup || !actionPopup.isOpen) return null;

  const { subject, category, chapter, level, isPyq } = actionPopup;
  const safeChapter = (chapter || '').trim();
  const safeSubject = subject || '';

  // Filter matching questions strictly based on genuine questions added by admin
  const filteredQuestions = questions.filter((q) => {
    if (q.subject !== safeSubject) return false;
    if ((q.chapter || '').toLowerCase() !== safeChapter.toLowerCase()) return false;
    if (level && q.level !== level) return false;
    if (isPyq && q.examCategory !== 'PYQ') return false;
    return true;
  });

  // Chapter-wide questions if specific level has none
  const chapterQuestions = questions.filter(
    (q) => q.subject === safeSubject && (q.chapter || '').toLowerCase() === safeChapter.toLowerCase()
  );

  const sessionQuestions = filteredQuestions.length > 0 
    ? filteredQuestions 
    : chapterQuestions;

  // Check matching genuine PDF
  const matchingPdf = pdfs.find(
    (p) =>
      p.subject === safeSubject &&
      (p.chapter || '').toLowerCase() === safeChapter.toLowerCase() &&
      (!level || p.levelOrYear === level || p.examCategory === category)
  ) || pdfs.find(
    (p) => p.subject === safeSubject && (p.chapter || '').toLowerCase() === safeChapter.toLowerCase()
  ) || pdfs.find(
    (p) => p.subject === safeSubject
  );

  const handleAttemptNow = () => {
    closeActionPopup();
    const title = `${subject} • ${isPyq ? 'PYQ' : level || category} (${chapter})`;
    startPracticeSession(sessionQuestions, title);
  };

  const handleViewPdf = () => {
    if (matchingPdf) {
      closeActionPopup();
      setActivePdf(matchingPdf);
    } else {
      setPdfNotice('No study PDF has been uploaded for this chapter yet. Admin can upload it via the Admin Dashboard.');
    }
  };

  const isProFeature = (level === 'JEEVault 50 Special' || isPyq) && currentUser?.plan === 'Free';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#1c1242] to-[#0d0a27] border-2 border-purple-500/40 p-7 text-white shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeActionPopup}
          className="absolute top-5 right-5 p-2 rounded-full text-purple-300 hover:text-white hover:bg-purple-900/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gloss Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-400/30 text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            {isPyq ? 'Previous Year Questions' : level || category}
          </div>
          <h3 className="text-2xl font-black font-['Outfit'] text-white">
            {chapter}
          </h3>
          <p className="text-xs text-purple-300/80 mt-1">
            {subject} • {filteredQuestions.length || sessionQuestions.length} Questions Available
          </p>
        </div>

        {/* 2 Primary Choices from user prompt: "Attempt Now" or "View PDF" */}
        <div className="flex flex-col gap-3.5">
          {/* Action 1: Attempt Now */}
          <button
            onClick={handleAttemptNow}
            id="action-btn-attempt"
            className="group w-full p-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold flex items-center justify-between shadow-lg shadow-cyan-500/30 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-950/20 text-slate-950">
                <PlayCircle className="w-6 h-6 fill-current" />
              </div>
              <div className="text-left">
                <span className="text-base font-black tracking-wide block">
                  Attempt Now
                </span>
                <span className="text-xs font-semibold text-slate-900/80">
                  Interactive test, timer & stepwise solution
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Action 2: View PDF */}
          <button
            onClick={handleViewPdf}
            id="action-btn-pdf"
            className="group w-full p-4 rounded-2xl bg-purple-900/50 hover:bg-purple-900/80 border-2 border-purple-400/40 hover:border-fuchsia-400 text-white font-extrabold flex items-center justify-between shadow-lg shadow-purple-950/50 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-purple-950 text-fuchsia-300">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="text-base font-black tracking-wide block text-white">
                  View PDF
                </span>
                <span className="text-xs font-medium text-purple-300/80">
                  {matchingPdf ? 'Open official questions & formula sheet in-app' : 'No PDF uploaded yet for this chapter'}
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 text-purple-300 group-hover:text-white transition-all" />
          </button>
        </div>

        {/* PDF Notice if no PDF available */}
        {pdfNotice && (
          <div className="mt-3 p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="flex-1">{pdfNotice}</p>
          </div>
        )}

        {/* Plan upgrade notice if user on free plan */}
        {isProFeature && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
            <span className="text-amber-300 flex items-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Standard Pro feature (₹99/yr)
            </span>
            <button
              onClick={() => {
                closeActionPopup();
                setCurrentView('settings');
              }}
              className="text-amber-400 font-bold underline hover:text-amber-300"
            >
              Upgrade
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
