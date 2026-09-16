import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  FileQuestion,
  FileText,
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Shield,
  Search,
  Database,
  Crown,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  Upload,
  RefreshCw,
  Eye,
  FileCheck,
  Check,
  BookOpen,
  Filter,
  ArrowUp,
  ArrowDown,
  FolderPlus,
} from 'lucide-react';
import { Question, SubjectId, ExamCategory, QuestionLevel, StudyPDF } from '../types';
import { CHAPTERS_DATA } from '../lib/mockData';
import { uploadPdfToSupabase } from '../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const {
    chapters,
    addChapter,
    deleteChapter,
    reorderChapter,
    questions,
    addQuestion,
    deleteQuestion,
    updateQuestionLocation,
    pdfs,
    addPdf,
    deletePdf,
    setActivePdf,
    allUsers,
    refreshGenuineUsers,
    isSyncingWithSupabase,
    updateUserRoleAndPlan,
    updateUserPlan,
    supportTickets,
    updateTicketStatus,
  } = useApp();

  const totalChaptersCount =
    (chapters.Mathematics?.length || 0) +
    (chapters.Physics?.length || 0) +
    (chapters.Chemistry?.length || 0);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'chapters' | 'questions' | 'pdfs' | 'users' | 'support' | 'supabase'
  >('overview');

  // Chapter Management State
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newChapterSubject, setNewChapterSubject] = useState<SubjectId>('Physics');
  const [newChapterName, setNewChapterName] = useState('');
  const [newChapterClass, setNewChapterClass] = useState('Class 11');
  const [newChapterDescription, setNewChapterDescription] = useState('');
  const [newChapterPosition, setNewChapterPosition] = useState<'end' | 'start'>('end');
  const [chapterFilterSubject, setChapterFilterSubject] = useState<SubjectId | 'All'>('All');
  const [chapterSearchTerm, setChapterSearchTerm] = useState('');
  const [chapterActionMessage, setChapterActionMessage] = useState('');
  const [deleteConfirmChapterId, setDeleteConfirmChapterId] = useState<string | null>(null);

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newChapterName.trim();
    if (!trimmed) return;

    addChapter(newChapterSubject, trimmed, {
      classLevel: newChapterClass,
      description: newChapterDescription.trim(),
      position: newChapterPosition === 'start' ? 0 : undefined,
    });

    setChapterActionMessage(`Chapter "${trimmed}" successfully added to ${newChapterSubject}!`);
    setNewChapterName('');
    setNewChapterDescription('');
    setIsAddingChapter(false);
    setTimeout(() => setChapterActionMessage(''), 4000);
  };

  // Question Form state
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [qSubject, setQSubject] = useState<SubjectId>('Physics');
  const [qExamCategory, setQExamCategory] = useState<ExamCategory>('JEE Mains');
  const [qChapter, setQChapter] = useState('Kinematics & Motion in 1D/2D');
  const [qCustomChapter, setQCustomChapter] = useState(false);
  const [qLevel, setQLevel] = useState<QuestionLevel>('Level 2');
  const [qDifficulty, setQDifficulty] = useState<'Basic' | 'Standard' | 'Advanced'>('Standard');
  const [qText, setQText] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [qCorrectIdx, setQCorrectIdx] = useState(0);
  const [qKeyFormula, setQKeyFormula] = useState('');
  const [qSolution, setQSolution] = useState('');
  const [qPyqYear, setQPyqYear] = useState('');

  // Search in questions
  const [qSearch, setQSearch] = useState('');

  // PDF Form state with Hierarchical Structure: Subject -> Exam/PYQ -> Chapter -> Level
  const [isAddingPdf, setIsAddingPdf] = useState(false);
  const [pdfSubject, setPdfSubject] = useState<SubjectId>('Physics');
  const [pdfExamCategory, setPdfExamCategory] = useState<ExamCategory>('JEE Mains');
  const [pdfChapter, setPdfChapter] = useState<string>(() => {
    return CHAPTERS_DATA['Physics']?.[0]?.name || 'Kinematics & Motion in 1D/2D';
  });
  const [isCustomChapter, setIsCustomChapter] = useState(false);
  const [pdfCustomChapter, setPdfCustomChapter] = useState('');
  const [pdfLevel, setPdfLevel] = useState<string>('Level 2');
  const [pdfPyqYear, setPdfPyqYear] = useState<string>('2024');
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfDescription, setPdfDescription] = useState('');
  const [pdfPages, setPdfPages] = useState<number>(6);
  const [pdfIsProOnly, setPdfIsProOnly] = useState<boolean>(true);
  const [pdfUploadMethod, setPdfUploadMethod] = useState<'file' | 'url'>('file');
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [pdfDirectUrl, setPdfDirectUrl] = useState('');
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState('');

  // PDF Filters
  const [pdfFilterSubject, setPdfFilterSubject] = useState<string>('All');
  const [pdfFilterExam, setPdfFilterExam] = useState<string>('All');
  const [pdfSearch, setPdfSearch] = useState('');

  // Edit Question Location State
  const [editingQId, setEditingQId] = useState<string | null>(null);
  const [editLocSubject, setEditLocSubject] = useState<SubjectId>('Physics');
  const [editLocChapter, setEditLocChapter] = useState('');
  const [editLocLevel, setEditLocLevel] = useState<QuestionLevel>('Level 2');

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText || !opt0 || !opt1) return;

    await addQuestion({
      subject: qSubject,
      examCategory: qExamCategory,
      chapter: qChapter,
      level: qLevel,
      difficulty: qDifficulty,
      questionText: qText,
      options: [opt0, opt1, opt2 || 'None of these', opt3 || 'Cannot be determined'],
      correctOptionIndex: qCorrectIdx,
      keyFormula: qKeyFormula,
      solutionText: qSolution,
      pyqYear: qPyqYear || undefined,
    });

    // Reset
    setQText('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setQKeyFormula('');
    setQSolution('');
    setQPyqYear('');
    setIsAddingQuestion(false);
  };

  const handleCreatePdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfTitle.trim()) return;

    let finalFileUrl = pdfDirectUrl.trim();
    let fileSizeBytes = selectedPdfFile?.size;

    if (pdfUploadMethod === 'file' && selectedPdfFile) {
      setIsUploadingPdf(true);
      setUploadStatusMsg('Uploading PDF to Supabase Storage...');
      try {
        const cloudUrl = await uploadPdfToSupabase(selectedPdfFile);
        if (cloudUrl) {
          finalFileUrl = cloudUrl;
          setUploadStatusMsg('Successfully uploaded to Cloud Storage!');
        } else {
          finalFileUrl = URL.createObjectURL(selectedPdfFile);
        }
      } catch (err) {
        console.warn('PDF upload error, using local url:', err);
        finalFileUrl = URL.createObjectURL(selectedPdfFile);
      } finally {
        setIsUploadingPdf(false);
      }
    }

    if (!finalFileUrl) {
      finalFileUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    }

    const finalChapter = isCustomChapter && pdfCustomChapter.trim()
      ? pdfCustomChapter.trim()
      : pdfChapter;

    const finalLevelOrYear = pdfExamCategory === 'PYQ'
      ? (pdfPyqYear || '2024')
      : pdfLevel;

    await addPdf({
      title: pdfTitle.trim(),
      subject: pdfSubject,
      chapter: finalChapter,
      examCategory: pdfExamCategory,
      levelOrYear: finalLevelOrYear,
      fileUrl: finalFileUrl,
      pageCount: Number(pdfPages) || 1,
      fileSizeBytes,
      isProOnly: pdfIsProOnly,
      description: pdfDescription.trim() || undefined,
    });

    // Reset Form
    setPdfTitle('');
    setPdfDescription('');
    setPdfDirectUrl('');
    setSelectedPdfFile(null);
    setUploadStatusMsg('');
    setIsAddingPdf(false);
  };

  const handleSaveLocation = (qId: string) => {
    updateQuestionLocation(qId, editLocSubject, editLocChapter, editLocLevel);
    setEditingQId(null);
  };

  const filteredQuestions = questions.filter(
    (q) => {
      const qSearchLower = (qSearch || '').toLowerCase();
      return (
        (q.questionText || '').toLowerCase().includes(qSearchLower) ||
        (q.chapter || '').toLowerCase().includes(qSearchLower) ||
        (q.subject || '').toLowerCase().includes(qSearchLower)
      );
    }
  );

  return (
    <div className="min-h-[calc(100vh-70px)] bg-[#0a0c20] text-white p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-950/80 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] tracking-wide text-white">
                  JEEVault Master Command
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-mono font-bold border border-pink-500/40 uppercase">
                  Owner Superadmin
                </span>
              </div>
              <p className="text-xs text-purple-300/80 mt-0.5">
                Full governance of questions, PDFs, student subscription tiers & customer support.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-indigo-950/60">
          {[
            { id: 'overview', label: 'Overview & Metrics', icon: <Layers className="w-4 h-4" /> },
            { id: 'chapters', label: `Chapters (${totalChaptersCount})`, icon: <BookOpen className="w-4 h-4" /> },
            { id: 'questions', label: `Questions (${questions.length})`, icon: <FileQuestion className="w-4 h-4" /> },
            { id: 'pdfs', label: `PDFs & Notes (${pdfs.length})`, icon: <FileText className="w-4 h-4" /> },
            { id: 'users', label: `Students & Tiers (${allUsers.length})`, icon: <Users className="w-4 h-4" /> },
            { id: 'support', label: `Support Tickets (${supportTickets.length})`, icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'supabase', label: 'Supabase SQL Backend', icon: <Database className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-purple-900/90 text-white border border-purple-500/40 shadow-md shadow-purple-950'
                  : 'text-slate-400 hover:text-white hover:bg-indigo-950/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Stat 1: Total Users */}
              <div className="p-6 rounded-3xl bg-[#121438]/80 border-2 border-indigo-900/60 shadow-xl">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono uppercase font-bold text-slate-400">Total Students</span>
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-4xl font-black font-['Outfit'] text-white">
                  {allUsers.length}
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Registered JEE Aspirants
                </span>
              </div>

              {/* Stat 2: Chapters */}
              <div
                onClick={() => setActiveTab('chapters')}
                className="p-6 rounded-3xl bg-[#121438]/80 border-2 border-indigo-900/60 hover:border-violet-500/50 shadow-xl cursor-pointer transition-all hover:scale-[1.01]"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono uppercase font-bold text-slate-400">Curriculum</span>
                  <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-4xl font-black font-['Outfit'] text-white">
                  {totalChaptersCount}
                </div>
                <span className="text-[11px] text-violet-300 mt-2 block">
                  Chapters in Syllabus →
                </span>
              </div>

              {/* Stat 3: Questions */}
              <div className="p-6 rounded-3xl bg-[#121438]/80 border-2 border-indigo-900/60 shadow-xl">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono uppercase font-bold text-slate-400">Total Questions</span>
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                    <FileQuestion className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-4xl font-black font-['Outfit'] text-white">
                  {questions.length}
                </div>
                <span className="text-[11px] text-cyan-400 mt-2 block">
                  10,000+ Scalable Vault Capacity
                </span>
              </div>

              {/* Stat 4: PDFs */}
              <div className="p-6 rounded-3xl bg-[#121438]/80 border-2 border-indigo-900/60 shadow-xl">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono uppercase font-bold text-slate-400">PDF Sheets</span>
                  <div className="p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-300">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-4xl font-black font-['Outfit'] text-white">
                  {pdfs.length}
                </div>
                <span className="text-[11px] text-fuchsia-300 mt-2 block">
                  Formula Codices & PYQs
                </span>
              </div>

              {/* Stat 5: Support */}
              <div className="p-6 rounded-3xl bg-[#121438]/80 border-2 border-indigo-900/60 shadow-xl">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono uppercase font-bold text-slate-400">Open Tickets</span>
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-4xl font-black font-['Outfit'] text-white">
                  {supportTickets.filter((t) => t.status === 'Open').length}
                </div>
                <span className="text-[11px] text-amber-300 mt-2 block">
                  Requires Mentor Action
                </span>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Quick Content Ingestion</h3>
                <p className="text-xs text-purple-200/80">
                  Add chapters, practice problems, or formula PDFs directly into any subject.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => {
                    setActiveTab('chapters');
                    setIsAddingChapter(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Chapter</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('questions');
                    setIsAddingQuestion(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Question</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('pdfs');
                    setIsAddingPdf(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: CHAPTERS & CURRICULUM MANAGEMENT */}
        {activeTab === 'chapters' && (
          <div className="flex flex-col gap-6">
            {chapterActionMessage && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{chapterActionMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setChapterActionMessage('')}
                  className="text-emerald-400 hover:text-emerald-200 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-['Outfit'] text-white">
                  Curriculum & Chapters Management
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Organize syllabus structure, reorder chapters, and expand curriculum for Mathematics, Physics & Chemistry.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddingChapter(!isAddingChapter)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                    isAddingChapter
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white'
                  }`}
                >
                  <Plus className={`w-4 h-4 transition-transform ${isAddingChapter ? 'rotate-45' : ''}`} />
                  <span>{isAddingChapter ? 'Close Form' : 'Add Chapter'}</span>
                </button>
              </div>
            </div>

            {/* Add Chapter Form Panel */}
            {isAddingChapter && (
              <form
                onSubmit={handleCreateChapter}
                className="p-6 rounded-3xl bg-[#121438]/90 border border-violet-500/40 shadow-2xl flex flex-col gap-5 backdrop-blur-md"
              >
                <div className="flex items-center justify-between border-b border-indigo-950 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300">
                      <FolderPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Add New Chapter to Syllabus</h3>
                      <p className="text-xs text-slate-400">
                        This chapter will immediately become available in the student dashboard, questions, and PDF codices.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingChapter(false)}
                    className="text-slate-400 hover:text-white text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Subject Selection */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Subject
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Physics', 'Chemistry', 'Mathematics'] as SubjectId[]).map((subj) => (
                        <button
                          key={subj}
                          type="button"
                          onClick={() => setNewChapterSubject(subj)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            newChapterSubject === subj
                              ? 'bg-violet-600/30 border-violet-400 text-violet-200'
                              : 'bg-indigo-950/60 border-indigo-900/60 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{subj === 'Physics' ? '⚛️' : subj === 'Chemistry' ? '🧪' : '📐'}</span>
                          <span className="truncate">{subj}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Class Level */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Academic Class
                    </label>
                    <select
                      value={newChapterClass}
                      onChange={(e) => setNewChapterClass(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white focus:outline-none focus:border-violet-400"
                    >
                      <option value="Class 11">Class 11 (Foundation)</option>
                      <option value="Class 12">Class 12 (Advanced)</option>
                      <option value="General">General / Combined</option>
                    </select>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1.5">
                      Syllabus Placement
                    </label>
                    <select
                      value={newChapterPosition}
                      onChange={(e) => setNewChapterPosition(e.target.value as 'end' | 'start')}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white focus:outline-none focus:border-violet-400"
                    >
                      <option value="end">Append at End of Chapter List</option>
                      <option value="start">Insert at Top (Chapter #1)</option>
                    </select>
                  </div>
                </div>

                {/* Chapter Name */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Chapter Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newChapterName}
                    onChange={(e) => setNewChapterName(e.target.value)}
                    placeholder="e.g. Rotational Dynamics & Moment of Inertia, or Matrices and Determinants"
                    className="w-full px-4 py-2.5 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                  />
                </div>

                {/* Topics / Description */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Core Topics / Chapter Summary (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={newChapterDescription}
                    onChange={(e) => setNewChapterDescription(e.target.value)}
                    placeholder="Brief outline of syllabus topics covered (e.g. Torque, Angular Momentum, Pure Rolling, Radius of Gyration)..."
                    className="w-full p-3 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingChapter(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-violet-900/30"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save & Publish Chapter</span>
                  </button>
                </div>
              </form>
            )}

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e102d] border border-indigo-950">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {(['All', 'Physics', 'Chemistry', 'Mathematics'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setChapterFilterSubject(s)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      chapterFilterSubject === s
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-indigo-950'
                    }`}
                  >
                    {s === 'All' ? 'All Subjects' : s}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={chapterSearchTerm}
                  onChange={(e) => setChapterSearchTerm(e.target.value)}
                  placeholder="Filter chapters by title..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                />
              </div>
            </div>

            {/* Chapters Directory */}
            <div className="flex flex-col gap-6">
              {(['Physics', 'Chemistry', 'Mathematics'] as SubjectId[])
                .filter((s) => chapterFilterSubject === 'All' || chapterFilterSubject === s)
                .map((subj) => {
                  const subjectChapters = (chapters[subj] || []).filter((ch) =>
                    (ch.name || '').toLowerCase().includes((chapterSearchTerm || '').toLowerCase())
                  );

                  return (
                    <div key={subj} className="flex flex-col gap-3">
                      <div className="flex items-center justify-between border-b border-indigo-950 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-white flex items-center gap-2">
                            <span>{subj === 'Physics' ? '⚛️' : subj === 'Chemistry' ? '🧪' : '📐'}</span>
                            <span>{subj}</span>
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-slate-400 border border-indigo-900 font-mono">
                            {subjectChapters.length} Chapters
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setNewChapterSubject(subj);
                            setIsAddingChapter(true);
                          }}
                          className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to {subj}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {subjectChapters.map((ch, idx) => {
                          const chQuestions = questions.filter(
                            (q) => q.subject === subj && q.chapter.toLowerCase() === ch.name.toLowerCase()
                          ).length;
                          const chPdfs = pdfs.filter(
                            (p) => p.subject === subj && p.chapter.toLowerCase() === ch.name.toLowerCase()
                          ).length;

                          const isConfirmingDelete = deleteConfirmChapterId === ch.id;

                          return (
                            <div
                              key={ch.id}
                              className="p-4 rounded-2xl bg-[#0f1130] border border-indigo-900/60 hover:border-indigo-700/80 flex flex-col justify-between gap-3 transition-all"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2.5">
                                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-indigo-950/80 px-2 py-1 rounded-md border border-indigo-900 shrink-0">
                                    #{idx + 1}
                                  </span>
                                  <div>
                                    <h4 className="text-sm font-bold text-white">{ch.name}</h4>
                                    {ch.description && (
                                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                                        {ch.description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-950/80 border border-violet-500/30 text-violet-300 shrink-0">
                                  {ch.classLevel || 'Class 12'}
                                </span>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-indigo-950/80 text-[11px] text-slate-400">
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1 text-cyan-300">
                                    <FileQuestion className="w-3.5 h-3.5" />
                                    <span>{chQuestions} Qs</span>
                                  </span>
                                  <span className="flex items-center gap-1 text-fuchsia-300">
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>{chPdfs} PDFs</span>
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {/* Reorder Buttons */}
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => reorderChapter(subj, ch.id, 'up')}
                                    className={`p-1.5 rounded-lg border transition-all ${
                                      idx === 0
                                        ? 'opacity-30 cursor-not-allowed border-transparent'
                                        : 'bg-indigo-950 hover:bg-indigo-900 text-slate-300 border-indigo-800'
                                    }`}
                                    title="Move Chapter Up"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === subjectChapters.length - 1}
                                    onClick={() => reorderChapter(subj, ch.id, 'down')}
                                    className={`p-1.5 rounded-lg border transition-all ${
                                      idx === subjectChapters.length - 1
                                        ? 'opacity-30 cursor-not-allowed border-transparent'
                                        : 'bg-indigo-950 hover:bg-indigo-900 text-slate-300 border-indigo-800'
                                    }`}
                                    title="Move Chapter Down"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete Chapter */}
                                  {!isConfirmingDelete ? (
                                    <button
                                      type="button"
                                      onClick={() => setDeleteConfirmChapterId(ch.id)}
                                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 transition-all ml-1 cursor-pointer"
                                      title="Delete Chapter"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <div className="flex items-center gap-1 ml-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          deleteChapter(subj, ch.id);
                                          setDeleteConfirmChapterId(null);
                                          setChapterActionMessage(`Deleted chapter "${ch.name}" from ${subj}`);
                                          setTimeout(() => setChapterActionMessage(''), 3000);
                                        }}
                                        className="px-2 py-1 rounded bg-red-600 text-white text-[10px] font-bold"
                                      >
                                        Confirm
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setDeleteConfirmChapterId(null)}
                                        className="px-1.5 py-1 rounded bg-slate-800 text-slate-300 text-[10px]"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {subjectChapters.length === 0 && (
                          <div className="col-span-full text-center py-6 text-slate-500 text-xs bg-indigo-950/20 rounded-xl border border-dashed border-indigo-900/40">
                            No chapters found matching filter.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Tab 2: QUESTIONS MANAGEMENT */}
        {activeTab === 'questions' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={qSearch}
                  onChange={(e) => setQSearch(e.target.value)}
                  placeholder="Search questions by text or chapter..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                onClick={() => setIsAddingQuestion(!isAddingQuestion)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingQuestion ? 'Close Form' : 'Add New Question'}</span>
              </button>
            </div>

            {/* Add Question Form */}
            {isAddingQuestion && (
              <form
                onSubmit={handleCreateQuestion}
                className="p-6 rounded-3xl bg-[#131540] border-2 border-cyan-500/40 shadow-2xl flex flex-col gap-4 animate-in fade-in"
              >
                <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3">
                  <h3 className="text-base font-black font-['Outfit'] text-cyan-300">
                    Create & Place Question
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Will be stored in Supabase / Local Storage
                  </span>
                </div>

                {/* Target Location dropdowns matching requirement */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Subject</label>
                    <select
                      value={qSubject}
                      onChange={(e) => setQSubject(e.target.value as SubjectId)}
                      className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white focus:outline-none"
                    >
                      <option>Physics</option>
                      <option>Chemistry</option>
                      <option>Mathematics</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Exam Category</label>
                    <select
                      value={qExamCategory}
                      onChange={(e) => setQExamCategory(e.target.value as ExamCategory)}
                      className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white focus:outline-none"
                    >
                      <option>JEE Mains</option>
                      <option>JEE Advanced</option>
                      <option>PYQ</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-300 block">Chapter</label>
                      <button
                        type="button"
                        onClick={() => setQCustomChapter(!qCustomChapter)}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                      >
                        {qCustomChapter ? 'Select from Syllabus' : '+ Custom Chapter'}
                      </button>
                    </div>
                    {!qCustomChapter ? (
                      <select
                        value={qChapter}
                        onChange={(e) => setQChapter(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                      >
                        {(chapters[qSubject] || []).map((ch) => (
                          <option key={ch.id} value={ch.name}>
                            {ch.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        required
                        value={qChapter}
                        onChange={(e) => setQChapter(e.target.value)}
                        placeholder="Enter chapter name..."
                        className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Level</label>
                    <select
                      value={qLevel}
                      onChange={(e) => setQLevel(e.target.value as QuestionLevel)}
                      className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white focus:outline-none"
                    >
                      <option>Level 1</option>
                      <option>Level 2</option>
                      <option>Level 3</option>
                      <option>JEEVault 50 Special</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Question Statement</label>
                  <textarea
                    required
                    rows={3}
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    placeholder="Enter complete physical / mathematical problem text..."
                    className="w-full p-3 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white focus:outline-none"
                  />
                </div>

                {/* 4 Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Option A</label>
                    <input
                      type="text"
                      required
                      value={opt0}
                      onChange={(e) => setOpt0(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Option B</label>
                    <input
                      type="text"
                      required
                      value={opt1}
                      onChange={(e) => setOpt1(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Option C</label>
                    <input
                      type="text"
                      value={opt2}
                      onChange={(e) => setOpt2(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Option D</label>
                    <input
                      type="text"
                      value={opt3}
                      onChange={(e) => setOpt3(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Correct index & solutions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Correct Option
                    </label>
                    <select
                      value={qCorrectIdx}
                      onChange={(e) => setQCorrectIdx(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                    >
                      <option value={0}>Option A</option>
                      <option value={1}>Option B</option>
                      <option value={2}>Option C</option>
                      <option value={3}>Option D</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={qDifficulty}
                      onChange={(e) => setQDifficulty(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                    >
                      <option>Basic</option>
                      <option>Standard</option>
                      <option>Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      PYQ Year (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. JEE Mains 2024 (Shift 1)"
                      value={qPyqYear}
                      onChange={(e) => setQPyqYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Key Formula & Stepwise Solution
                  </label>
                  <input
                    type="text"
                    placeholder="Formula summary (e.g. F = m·a)"
                    value={qKeyFormula}
                    onChange={(e) => setQKeyFormula(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white mb-2"
                  />
                  <textarea
                    rows={2}
                    placeholder="Complete detailed explanation for students..."
                    value={qSolution}
                    onChange={(e) => setQSolution(e.target.value)}
                    className="w-full p-3 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingQuestion(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider"
                  >
                    Save Question to Vault
                  </button>
                </div>
              </form>
            )}

            {/* Questions Table */}
            <div className="rounded-3xl bg-[#121438]/80 border-2 border-indigo-900/60 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-200">
                  <thead className="bg-[#0e102d] text-slate-400 uppercase font-mono border-b border-indigo-900/80">
                    <tr>
                      <th className="p-4">Subject & Level</th>
                      <th className="p-4">Chapter</th>
                      <th className="p-4">Question Preview</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-950/60">
                    {filteredQuestions.map((q) => (
                      <tr key={q.id} className="hover:bg-indigo-950/40 transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-cyan-300 block">{q.subject}</span>
                          <span className="text-[10px] text-fuchsia-300 font-mono">{q.level}</span>
                        </td>
                        <td className="p-4 font-medium text-slate-300">
                          {editingQId === q.id ? (
                            <input
                              type="text"
                              value={editLocChapter}
                              onChange={(e) => setEditLocChapter(e.target.value)}
                              className="px-2 py-1 rounded bg-indigo-950 border border-cyan-400 text-xs"
                            />
                          ) : (
                            q.chapter
                          )}
                        </td>
                        <td className="p-4 max-w-xs truncate text-slate-300">
                          {q.questionText}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-700/50 text-[10px] font-mono">
                            {q.examCategory}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {editingQId === q.id ? (
                              <button
                                onClick={() => handleSaveLocation(q.id)}
                                className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[10px]"
                              >
                                Save Location
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingQId(q.id);
                                  setEditLocSubject(q.subject);
                                  setEditLocChapter(q.chapter);
                                  setEditLocLevel(q.level);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-indigo-900"
                                title="Edit question location"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => deleteQuestion(q.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-indigo-900"
                              title="Delete Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {questions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                          <p className="font-bold text-sm text-slate-300">No Questions in Database</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Click "+ Add New Question" above to insert genuine questions into Supabase.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: PDF MANAGEMENT WITH FULL HIERARCHY (Subject -> Exam/PYQ -> Chapter -> Level) */}
        {activeTab === 'pdfs' && (
          <div className="flex flex-col gap-6">
            {/* Header and Live Sync Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-black font-['Outfit'] text-white">
                    Study Documents & Chapter PDFs
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Supabase Live Sync
                  </span>
                </div>
                <p className="text-xs text-purple-300/80">
                  Add, upload, and delete PDFs. Owner actions immediately persist to Supabase Storage & Database and update live across all student views.
                </p>
              </div>

              <button
                onClick={() => setIsAddingPdf(!isAddingPdf)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:brightness-110 text-white font-extrabold text-xs shadow-lg shadow-fuchsia-600/30 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingPdf ? 'Close Uploader' : 'Upload / Add PDF'}</span>
              </button>
            </div>

            {/* Hierarchical PDF Upload Form */}
            {isAddingPdf && (
              <form
                onSubmit={handleCreatePdf}
                className="p-6 sm:p-8 rounded-3xl bg-[#131540] border-2 border-fuchsia-500/50 shadow-2xl flex flex-col gap-6 animate-in fade-in"
              >
                <div className="flex items-center justify-between border-b border-indigo-900/60 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-fuchsia-600/20 text-fuchsia-400">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-black font-['Outfit'] text-fuchsia-300">
                        Upload Chapter Study PDF
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Configure exact hierarchy: Subject → Exam/PYQ → Chapter → Level
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-[10px] font-mono text-cyan-300">
                    4-Tier Hierarchy
                  </span>
                </div>

                {/* HIERARCHY STEP 1: SUBJECT */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-mono">1</span>
                    Subject
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(['Physics', 'Chemistry', 'Mathematics'] as SubjectId[]).map((subj) => (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => {
                          setPdfSubject(subj);
                          const subjectChs = (chapters[subj] && chapters[subj].length > 0) ? chapters[subj] : (CHAPTERS_DATA[subj] || []);
                          if (subjectChs.length > 0) {
                            setPdfChapter(subjectChs[0].name);
                          }
                        }}
                        className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          pdfSubject === subj
                            ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-900/20'
                            : 'bg-[#0e102d] border-indigo-900/80 text-slate-400 hover:text-slate-200 hover:border-indigo-700'
                        }`}
                      >
                        <span>{subj === 'Physics' ? '⚛️' : subj === 'Chemistry' ? '🧪' : '📐'}</span>
                        <span>{subj}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* HIERARCHY STEP 2: EXAM / PYQ */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-mono">2</span>
                    Exam Category / Track
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(['JEE Mains', 'JEE Advanced', 'PYQ'] as ExamCategory[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setPdfExamCategory(cat)}
                        className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          pdfExamCategory === cat
                            ? 'bg-gradient-to-r from-fuchsia-600/30 to-pink-600/30 border-fuchsia-400 text-fuchsia-200 shadow-md shadow-fuchsia-900/20'
                            : 'bg-[#0e102d] border-indigo-900/80 text-slate-400 hover:text-slate-200 hover:border-indigo-700'
                        }`}
                      >
                        <span>{cat === 'JEE Mains' ? '🎯' : cat === 'JEE Advanced' ? '🏆' : '📜'}</span>
                        <span>{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* HIERARCHY STEP 3: CHAPTER */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-mono">3</span>
                      Chapter ({pdfSubject})
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomChapter(!isCustomChapter)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium underline cursor-pointer"
                    >
                      {isCustomChapter ? 'Select from Syllabus List' : '+ Enter Custom Chapter Name'}
                    </button>
                  </div>

                  {!isCustomChapter ? (
                    <select
                      value={pdfChapter}
                      onChange={(e) => setPdfChapter(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-indigo-950 border border-indigo-800 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      {((chapters[pdfSubject] && chapters[pdfSubject].length > 0) ? chapters[pdfSubject] : (CHAPTERS_DATA[pdfSubject] || [])).map((ch) => (
                        <option key={ch.id} value={ch.name}>
                          {ch.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. Advanced Rotational Dynamics & Precession"
                      value={pdfCustomChapter}
                      onChange={(e) => setPdfCustomChapter(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-indigo-950 border border-indigo-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  )}
                </div>

                {/* HIERARCHY STEP 4: LEVEL / PYQ YEAR */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-mono">4</span>
                    {pdfExamCategory === 'PYQ' ? 'Target PYQ Exam Year' : 'Difficulty & Study Level'}
                  </label>

                  {pdfExamCategory === 'PYQ' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['2024', '2023', '2022', '2021', '2020', '2019', '2015-2024 Solved Pack'].map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setPdfPyqYear(yr)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            pdfPyqYear === yr
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                              : 'bg-indigo-950 border-indigo-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'Level 1', label: 'Level 1 (Foundation)' },
                        { id: 'Level 2', label: 'Level 2 (Mains Target)' },
                        { id: 'Level 3', label: 'Level 3 (Advanced Deep-Dive)' },
                        { id: 'JEEVault 50 Special', label: 'JEEVault 50 Special' },
                      ].map((lvl) => (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setPdfLevel(lvl.id)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            pdfLevel === lvl.id
                              ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                              : 'bg-indigo-950 border-indigo-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {lvl.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* PDF SOURCE: FILE UPLOAD OR CLOUD URL */}
                <div className="flex flex-col gap-2 pt-2 border-t border-indigo-900/60">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200">
                      PDF Document Source
                    </label>
                    <div className="flex rounded-xl bg-indigo-950 p-1 border border-indigo-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setPdfUploadMethod('file')}
                        className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          pdfUploadMethod === 'file'
                            ? 'bg-fuchsia-600 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Upload Local PDF File
                      </button>
                      <button
                        type="button"
                        onClick={() => setPdfUploadMethod('url')}
                        className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          pdfUploadMethod === 'url'
                            ? 'bg-fuchsia-600 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Direct URL Link
                      </button>
                    </div>
                  </div>

                  {pdfUploadMethod === 'file' ? (
                    <div className="p-4 rounded-2xl bg-indigo-950/60 border-2 border-dashed border-indigo-700/70 hover:border-fuchsia-500 transition-all flex flex-col items-center justify-center gap-2 text-center">
                      <input
                        type="file"
                        id="pdf-file-upload-input"
                        accept="application/pdf,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedPdfFile(file);
                            if (!pdfTitle) {
                              const autoName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                              setPdfTitle(autoName);
                            }
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="pdf-file-upload-input"
                        className="flex flex-col items-center gap-2 cursor-pointer w-full py-4"
                      >
                        <div className="p-3 rounded-full bg-fuchsia-500/20 text-fuchsia-300">
                          <Upload className="w-6 h-6" />
                        </div>
                        {selectedPdfFile ? (
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                              <Check className="w-4 h-4" /> Selected: {selectedPdfFile.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {(selectedPdfFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for Cloud Sync
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-white">
                              Click or Drag & Drop PDF here
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Uploads directly to Supabase Storage bucket (`jeevault-pdfs`)
                            </span>
                          </div>
                        )}
                      </label>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        placeholder="https://.../notes.pdf or Cloud Storage Direct URL"
                        value={pdfDirectUrl}
                        onChange={(e) => setPdfDirectUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-indigo-950 border border-indigo-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  )}

                  {uploadStatusMsg && (
                    <div className="text-[11px] text-cyan-300 font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>{uploadStatusMsg}</span>
                    </div>
                  )}
                </div>

                {/* TITLE & META FIELDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-indigo-900/60">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Document Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kinematics Special 50 Codex & Solutions"
                      value={pdfTitle}
                      onChange={(e) => setPdfTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Page Count
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={pdfPages}
                      onChange={(e) => setPdfPages(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* ACCESS TIER TOGGLE */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-950/60 border border-indigo-800">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Pro Membership Exclusive
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Require Standard Pro (₹99) subscription to unlock this PDF
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={pdfIsProOnly}
                    onChange={(e) => setPdfIsProOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-fuchsia-500 bg-indigo-900 border-indigo-700 cursor-pointer"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingPdf(false)}
                    className="px-5 py-2.5 rounded-xl border border-indigo-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploadingPdf}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:brightness-110 text-white font-black text-xs shadow-lg shadow-fuchsia-600/30 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUploadingPdf ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Uploading to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save & Live Publish PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* FILTER & SEARCH BAR FOR PDF LIBRARY */}
            <div className="p-4 rounded-2xl bg-[#121438]/80 border border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-1">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                {['All', 'Physics', 'Chemistry', 'Mathematics'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPdfFilterSubject(s)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      pdfFilterSubject === s
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-indigo-950 text-slate-400 hover:text-white border border-indigo-800/80'
                    }`}
                  >
                    {s}
                  </button>
                ))}
                <span className="text-indigo-700 hidden sm:inline">|</span>
                {['All', 'JEE Mains', 'JEE Advanced', 'PYQ'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPdfFilterExam(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      pdfFilterExam === cat
                        ? 'bg-fuchsia-500 text-white font-black'
                        : 'bg-indigo-950 text-slate-400 hover:text-white border border-indigo-800/80'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search PDFs..."
                  value={pdfSearch}
                  onChange={(e) => setPdfSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* PDF DOCUMENTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pdfs
                .filter((pdf) => {
                  const matchSub = pdfFilterSubject === 'All' || pdf.subject === pdfFilterSubject;
                  const matchExam = pdfFilterExam === 'All' || pdf.examCategory === pdfFilterExam;
                  const matchSearch =
                    !pdfSearch ||
                    (pdf.title || '').toLowerCase().includes(pdfSearch.toLowerCase()) ||
                    (pdf.chapter || '').toLowerCase().includes(pdfSearch.toLowerCase());
                  return matchSub && matchExam && matchSearch;
                })
                .map((pdf) => (
                  <div
                    key={pdf.id}
                    className="p-5 rounded-3xl bg-[#121438]/90 border border-indigo-900/60 hover:border-fuchsia-500/50 flex flex-col justify-between transition-all group shadow-lg"
                  >
                    <div>
                      {/* Top bar with icon and delete button */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="p-2.5 rounded-2xl bg-fuchsia-600/20 text-fuchsia-300 border border-fuchsia-500/30">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          {pdf.isProOnly && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold font-mono">
                              PRO
                            </span>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(`Delete PDF "${pdf.title}" from Supabase?`)) {
                                deletePdf(pdf.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete PDF (Live Supabase Sync)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Hierarchy breadcrumb */}
                      <div className="mt-3.5 mb-1.5">
                        <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono text-cyan-400 font-bold">
                          <span>{pdf.subject}</span>
                          <span className="text-slate-600">→</span>
                          <span>{pdf.examCategory}</span>
                          <span className="text-slate-600">→</span>
                          <span className="text-fuchsia-300">{pdf.levelOrYear || 'Level 2'}</span>
                        </div>
                        <h4 className="font-bold text-sm text-white mt-1 line-clamp-2 group-hover:text-fuchsia-200 transition-colors">
                          {pdf.title}
                        </h4>
                        <span className="text-xs text-slate-400 block mt-0.5 line-clamp-1">
                          {pdf.chapter}
                        </span>
                      </div>
                    </div>

                    {/* Footer with page count and actions */}
                    <div className="pt-3 mt-3 border-t border-indigo-950/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {pdf.pageCount} Pages
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActivePdf(pdf)}
                          className="px-3 py-1 rounded-xl bg-fuchsia-600/30 hover:bg-fuchsia-600 text-fuchsia-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                        <a
                          href={pdf.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-indigo-950 transition-colors"
                          title="Open direct file link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {pdfs.length === 0 && (
              <div className="p-12 rounded-3xl bg-[#121438]/50 border-2 border-dashed border-indigo-900/60 text-center flex flex-col items-center gap-3">
                <FileText className="w-8 h-8 text-slate-500" />
                <span className="text-sm font-bold text-slate-300">No PDFs Uploaded Yet</span>
                <p className="text-xs text-slate-500 max-w-sm">
                  Click "Upload / Add PDF" above to upload your first study material or problem pack to Supabase.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: GENUINE USERS & PLAN ELEVATION (Strictly genuine users from Supabase) */}
        {activeTab === 'users' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-black font-['Outfit'] text-white">
                    Genuine Student Roster ({allUsers.length} Genuine Users)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                    Supabase Profiles Only
                  </span>
                </div>
                <p className="text-xs text-purple-300/80">
                  Showing genuine registered accounts fetched from your Supabase database. All artificial mock user accounts have been deleted.
                </p>
              </div>

              <button
                onClick={() => refreshGenuineUsers()}
                disabled={isSyncingWithSupabase}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-950 border border-indigo-800 hover:border-cyan-400 text-cyan-300 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWithSupabase ? 'animate-spin' : ''}`} />
                <span>{isSyncingWithSupabase ? 'Syncing...' : 'Refresh from Supabase'}</span>
              </button>
            </div>

            <div className="rounded-3xl bg-[#121438]/80 border-2 border-indigo-900/60 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-200">
                  <thead className="bg-[#0e102d] text-slate-400 uppercase font-mono border-b border-indigo-900/80">
                    <tr>
                      <th className="p-4">Genuine Student Account</th>
                      <th className="p-4">Class & Target</th>
                      <th className="p-4">System Role</th>
                      <th className="p-4">Current Membership</th>
                      <th className="p-4">Admin Change Plan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-950/60">
                    {allUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-indigo-950/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow">
                              {u.name.slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-white block">{u.name}</span>
                              <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-200 font-medium">Class {u.standard || '12'}</span>
                          <span className="text-[11px] text-slate-400 block">{u.targetYear || 'JEE 2026'}</span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => {
                              const newRole = u.role === 'admin' ? 'student' : 'admin';
                              updateUserRoleAndPlan(u.id, newRole, u.plan);
                            }}
                            className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase cursor-pointer border transition-all ${
                              u.role === 'admin'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                            }`}
                            title="Click to toggle Admin / Student role"
                          >
                            {u.role === 'admin' ? '👑 Admin' : 'Student'}
                          </button>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase ${
                              u.plan === 'Standard Pro'
                                ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40'
                                : u.plan === 'Standard'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {u.plan}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={u.plan}
                            onChange={(e) => updateUserPlan(u.id, e.target.value as any)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                          >
                            <option value="Free">Free</option>
                            <option value="Standard">Standard (₹49)</option>
                            <option value="Standard Pro">Standard Pro (₹99)</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {allUsers.length === 0 && (
                <div className="p-10 text-center flex flex-col items-center gap-2">
                  <Users className="w-8 h-8 text-slate-500" />
                  <span className="text-sm font-bold text-slate-300">
                    No Genuine Users Registered Yet in Supabase
                  </span>
                  <p className="text-xs text-slate-500 max-w-md">
                    All artificial mock users have been removed. When real students register or log in via Supabase, their profiles will automatically sync and display in this table.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: SUPPORT TICKETS */}
        {activeTab === 'support' && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Student Inquiries & Academic Help Desk</h3>
              <p className="text-xs text-purple-300/80">
                Resolve question ambiguities, formula clarifications, and subscription issues.
              </p>
            </div>

            <div className="space-y-3">
              {supportTickets.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl bg-[#121438]/80 border border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="max-w-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-sm">{t.subject}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        by {t.userEmail}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{t.message}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={t.status}
                      onChange={(e) => updateTicketStatus(t.id, e.target.value as any)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-950 border border-indigo-800 text-xs font-bold text-white"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: SUPABASE BACKEND CONNECTIVITY */}
        {activeTab === 'supabase' && (
          <div className="p-6 rounded-3xl bg-[#121438]/80 border-2 border-indigo-900/60 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Supabase Backend Configuration
                </h3>
                <p className="text-xs text-slate-400">
                  Configured for Vercel Deployment with Supabase Database, Auth & Storage.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-800/40">
                <span className="text-xs font-bold text-cyan-300 block mb-1">
                  1. Environment Variables in Vercel
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                  Add the following environment variables in your Vercel Project Settings:
                </p>
                <div className="p-3 rounded-xl bg-black/50 font-mono text-[11px] text-emerald-400 space-y-1">
                  <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
                  <div>VITE_SUPABASE_ANON_KEY=eyJhbGciOi...</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-800/40">
                <span className="text-xs font-bold text-fuchsia-300 block mb-1">
                  2. SQL Schema Ready
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                  A complete, migration-ready SQL script exists in your workspace at <code className="text-cyan-300">/supabase-schema.sql</code>.
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    ✓ RLS Security Policies
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold">
                    ✓ Mock Data Seeder Included
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
