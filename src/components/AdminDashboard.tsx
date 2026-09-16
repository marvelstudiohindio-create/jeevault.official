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
  Copy,
  Image as ImageIcon,
  Lightbulb,
  X,
  AlertTriangle,
  CheckSquare,
  Square,
  RotateCcw,
} from 'lucide-react';
import { Question, SubjectId, ExamCategory, QuestionLevel, Difficulty, StudyPDF } from '../types';
import { CHAPTERS_DATA } from '../lib/mockData';
import { uploadPdfToSupabase, normalizeChapterName } from '../lib/supabase';
import { MathRenderer } from './MathRenderer';

export const AdminDashboard: React.FC = () => {
  const {
    chapters,
    addChapter,
    deleteChapter,
    reorderChapter,
    questions,
    addQuestion,
    updateQuestion,
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

  // Search & Detailed Filter States for questions
  const [qSearch, setQSearch] = useState('');
  const [qFilterSubject, setQFilterSubject] = useState<SubjectId | 'All'>('All');
  const [qFilterChapter, setQFilterChapter] = useState<string>('All');
  const [qFilterLevel, setQFilterLevel] = useState<QuestionLevel | 'All'>('All');
  const [qFilterExamCategory, setQFilterExamCategory] = useState<ExamCategory | 'All'>('All');
  const [qFilterQuestionType, setQFilterQuestionType] = useState<string>('All');
  const [qFilterStatus, setQFilterStatus] = useState<'All' | 'Published' | 'Draft'>('All');

  // Question Management & Modals
  const [viewingQuestion, setViewingQuestion] = useState<Question | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deleteConfirmQId, setDeleteConfirmQId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qActionMsg, setQActionMsg] = useState('');

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

  const handleCopyId = (id: string) => {
    try {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleToggleStatus = async (q: Question) => {
    const currentStatus = (q as any).status || 'Published';
    const newStatus = currentStatus === 'Draft' ? 'Published' : 'Draft';
    await updateQuestion(q.id, { status: newStatus } as any);
    setQActionMsg(`Question status updated to ${newStatus}`);
    setTimeout(() => setQActionMsg(''), 3000);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmQId) return;
    await deleteQuestion(deleteConfirmQId);
    setDeleteConfirmQId(null);
    if (viewingQuestion?.id === deleteConfirmQId) setViewingQuestion(null);
    if (editingQuestion?.id === deleteConfirmQId) setEditingQuestion(null);
    setQActionMsg('Question deleted from Vault.');
    setTimeout(() => setQActionMsg(''), 3000);
  };

  const handleSaveQuestionEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    await updateQuestion(editingQuestion.id, editingQuestion);
    setQActionMsg(`Question updated successfully in Supabase Vault!`);
    if (viewingQuestion?.id === editingQuestion.id) {
      setViewingQuestion(editingQuestion);
    }
    setEditingQuestion(null);
    setTimeout(() => setQActionMsg(''), 3500);
  };

  const resetQuestionFilters = () => {
    setQSearch('');
    setQFilterSubject('All');
    setQFilterChapter('All');
    setQFilterLevel('All');
    setQFilterExamCategory('All');
    setQFilterQuestionType('All');
    setQFilterStatus('All');
  };

  // Available chapters based on selected subject for question filter dropdown
  const availableFilterChapters = Array.from(
    new Set([
      ...(qFilterSubject === 'All'
        ? (Object.values(chapters) as any[]).flatMap((chs: any) => (Array.isArray(chs) ? chs.map((c: any) => c.name) : []))
        : ((chapters[qFilterSubject] || []) as any[]).map((c: any) => c.name)),
      ...questions
        .filter((q) => qFilterSubject === 'All' || q.subject === qFilterSubject)
        .map((q) => q.chapter)
        .filter(Boolean),
    ])
  ).sort();

  const filteredQuestions = questions.filter((q) => {
    // 1. Search Query across text, chapter, subject, ID, key formula, and solution
    if (qSearch.trim()) {
      const s = qSearch.toLowerCase().trim();
      const matchText = (q.questionText || '').toLowerCase().includes(s);
      const matchChapter = (q.chapter || '').toLowerCase().includes(s);
      const matchSubject = (q.subject || '').toLowerCase().includes(s);
      const matchId = (q.id || '').toLowerCase().includes(s);
      const matchFormula = (q.keyFormula || '').toLowerCase().includes(s);
      const matchSol = (q.solutionText || '').toLowerCase().includes(s);
      if (!matchText && !matchChapter && !matchSubject && !matchId && !matchFormula && !matchSol) {
        return false;
      }
    }

    // 2. Subject filter
    if (qFilterSubject !== 'All' && q.subject !== qFilterSubject) return false;

    // 3. Chapter filter (normalized matching)
    if (qFilterChapter !== 'All' && normalizeChapterName(q.chapter) !== normalizeChapterName(qFilterChapter)) {
      return false;
    }

    // 4. Level filter
    if (qFilterLevel !== 'All' && q.level !== qFilterLevel) return false;

    // 5. Exam Category filter
    if (qFilterExamCategory !== 'All' && q.examCategory !== qFilterExamCategory) return false;

    // 6. Question Type filter
    if (qFilterQuestionType !== 'All' && (q.questionType || 'Single Correct') !== qFilterQuestionType) {
      return false;
    }

    // 7. Status filter
    if (qFilterStatus !== 'All') {
      const isDraft = (q as any).status === 'Draft';
      if (qFilterStatus === 'Published' && isDraft) return false;
      if (qFilterStatus === 'Draft' && !isDraft) return false;
    }

    return true;
  });

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
            {/* Status notification toast */}
            {qActionMsg && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-lg animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{qActionMsg}</span>
                </div>
                <button
                  onClick={() => setQActionMsg('')}
                  className="text-emerald-400 hover:text-emerald-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Header with Search & Primary Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={qSearch}
                  onChange={(e) => setQSearch(e.target.value)}
                  placeholder="Search by text, ID, formula, chapter, or solution..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                {qSearch && (
                  <button
                    onClick={() => setQSearch('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {(qSearch ||
                  qFilterSubject !== 'All' ||
                  qFilterChapter !== 'All' ||
                  qFilterLevel !== 'All' ||
                  qFilterExamCategory !== 'All' ||
                  qFilterQuestionType !== 'All' ||
                  qFilterStatus !== 'All') && (
                  <button
                    onClick={resetQuestionFilters}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Reset all filters"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Filters</span>
                  </button>
                )}

                <button
                  onClick={() => setIsAddingQuestion(!isAddingQuestion)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingQuestion ? 'Close Form' : 'Add New Question'}</span>
                </button>
              </div>
            </div>

            {/* Filter Ribbon: Subject, Chapter, Level, Exam Category, Question Type, Status */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-300">Filter Question Bank</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-300">
                  Showing {filteredQuestions.length} of {questions.length} questions
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {/* Subject */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    Subject
                  </label>
                  <select
                    value={qFilterSubject}
                    onChange={(e) => {
                      setQFilterSubject(e.target.value as any);
                      setQFilterChapter('All');
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-indigo-950 border border-indigo-800 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="All">All Subjects</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>

                {/* Chapter */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    Chapter
                  </label>
                  <select
                    value={qFilterChapter}
                    onChange={(e) => setQFilterChapter(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-indigo-950 border border-indigo-800 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer truncate"
                  >
                    <option value="All">All Chapters</option>
                    {availableFilterChapters.map((chName) => (
                      <option key={chName} value={chName}>
                        {chName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    Level
                  </label>
                  <select
                    value={qFilterLevel}
                    onChange={(e) => setQFilterLevel(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-indigo-950 border border-indigo-800 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="All">All Levels</option>
                    <option value="Level 1">Level 1</option>
                    <option value="Level 2">Level 2</option>
                    <option value="Level 3">Level 3</option>
                    <option value="JEEVault 50 Special">JEEVault 50 Special</option>
                  </select>
                </div>

                {/* Exam Category */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    Exam Category
                  </label>
                  <select
                    value={qFilterExamCategory}
                    onChange={(e) => setQFilterExamCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-indigo-950 border border-indigo-800 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="JEE Advanced">JEE Advanced</option>
                    <option value="JEE Mains">JEE Mains</option>
                    <option value="PYQ">PYQ</option>
                  </select>
                </div>

                {/* Question Type */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    Type
                  </label>
                  <select
                    value={qFilterQuestionType}
                    onChange={(e) => setQFilterQuestionType(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-indigo-950 border border-indigo-800 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="All">All Types</option>
                    <option value="Single Correct">Single Correct</option>
                    <option value="Multiple Correct">Multiple Correct</option>
                    <option value="Integer Type">Integer Type</option>
                    <option value="Comprehension">Comprehension</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    Status
                  </label>
                  <select
                    value={qFilterStatus}
                    onChange={(e) => setQFilterStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-indigo-950 border border-indigo-800 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Active Filter summary line */}
              {(qFilterSubject !== 'All' ||
                qFilterChapter !== 'All' ||
                qFilterLevel !== 'All' ||
                qFilterExamCategory !== 'All') && (
                <div className="pt-2 border-t border-indigo-900/40 flex items-center gap-2 flex-wrap text-xs text-slate-300">
                  <span className="text-slate-400 text-[11px]">Filtered:</span>
                  {qFilterSubject !== 'All' && (
                    <span className="px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-semibold">
                      Subject: {qFilterSubject}
                    </span>
                  )}
                  {qFilterChapter !== 'All' && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[11px] font-semibold">
                      Chapter: {qFilterChapter}
                    </span>
                  )}
                  {qFilterLevel !== 'All' && (
                    <span className="px-2 py-0.5 rounded-md bg-fuchsia-950/80 border border-fuchsia-500/40 text-fuchsia-300 text-[11px] font-semibold">
                      Level: {qFilterLevel}
                    </span>
                  )}
                  {qFilterExamCategory !== 'All' && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-950/80 border border-blue-500/40 text-blue-300 text-[11px] font-semibold">
                      Exam: {qFilterExamCategory}
                    </span>
                  )}
                  <span className="text-emerald-400 font-bold ml-auto text-[11px]">
                    {filteredQuestions.length} matching question{filteredQuestions.length === 1 ? '' : 's'}
                  </span>
                </div>
              )}
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

            {/* Questions Table with Full Metadata & Status Toggle */}
            <div className="rounded-3xl bg-[#121438]/80 border-2 border-indigo-900/60 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-200">
                  <thead className="bg-[#0e102d] text-slate-400 uppercase font-mono border-b border-indigo-900/80 text-[11px]">
                    <tr>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Question Text / Preview</th>
                      <th className="p-3.5">Subject</th>
                      <th className="p-3.5">Chapter</th>
                      <th className="p-3.5">Level & Difficulty</th>
                      <th className="p-3.5">Exam Category</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Diagrams</th>
                      <th className="p-3.5">Created Date</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-950/60">
                    {filteredQuestions.map((q) => {
                      const hasQuestionImg = !!(q.imageUrl || (q.images && q.images.length > 0));
                      const hasSolutionImg = !!(q.solutionImageUrl || (q.solutionImages && q.solutionImages.length > 0));
                      const isPublished = (q as any).status !== 'Draft';
                      const isCopied = copiedId === q.id;

                      return (
                        <tr key={q.id} className="hover:bg-indigo-950/40 transition-colors">
                          {/* 1. Question ID with copy button */}
                          <td className="p-3.5 align-top">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="font-mono text-[11px] text-slate-400 bg-slate-900/90 border border-slate-800 px-1.5 py-0.5 rounded"
                                title={`Full ID: ${q.id}`}
                              >
                                {q.id.length > 10 ? `${q.id.slice(0, 8)}...` : q.id}
                              </span>
                              <button
                                onClick={() => handleCopyId(q.id)}
                                className="p-1 rounded text-slate-500 hover:text-cyan-300 transition-colors cursor-pointer"
                                title="Copy Question ID"
                              >
                                {isCopied ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* 2. Question Preview */}
                          <td className="p-3.5 align-top max-w-xs">
                            {q.passage && (
                              <span className="inline-block px-1.5 py-0.5 mb-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[10px] font-mono">
                                Passage Attached
                              </span>
                            )}
                            <p className="line-clamp-2 text-slate-200 leading-relaxed font-medium">
                              {q.questionText}
                            </p>
                          </td>

                          {/* 3. Subject */}
                          <td className="p-3.5 align-top">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                q.subject === 'Physics'
                                  ? 'bg-cyan-950/70 border border-cyan-400/30 text-cyan-300'
                                  : q.subject === 'Chemistry'
                                  ? 'bg-violet-950/70 border border-violet-400/30 text-violet-300'
                                  : 'bg-amber-950/70 border border-amber-400/30 text-amber-300'
                              }`}
                            >
                              {q.subject}
                            </span>
                          </td>

                          {/* 4. Chapter */}
                          <td className="p-3.5 align-top font-medium text-slate-300 max-w-[180px]">
                            {editingQId === q.id ? (
                              <input
                                type="text"
                                value={editLocChapter}
                                onChange={(e) => setEditLocChapter(e.target.value)}
                                className="px-2 py-1 rounded bg-indigo-950 border border-cyan-400 text-xs w-full"
                              />
                            ) : (
                              <span className="line-clamp-2">{q.chapter}</span>
                            )}
                          </td>

                          {/* 5. Level & Difficulty */}
                          <td className="p-3.5 align-top">
                            <div className="flex flex-col gap-1 items-start">
                              <span className="text-[10px] text-fuchsia-300 font-mono font-bold bg-fuchsia-950/60 border border-fuchsia-400/20 px-2 py-0.5 rounded">
                                {q.level}
                              </span>
                              <span className="text-[9px] text-slate-400 font-medium">
                                {q.difficulty || 'Standard'}
                              </span>
                            </div>
                          </td>

                          {/* 6. Exam Category */}
                          <td className="p-3.5 align-top">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                q.examCategory === 'JEE Advanced'
                                  ? 'bg-blue-950 border border-blue-600/40 text-blue-300'
                                  : q.examCategory === 'PYQ'
                                  ? 'bg-emerald-950 border border-emerald-600/40 text-emerald-300'
                                  : 'bg-indigo-950 border border-indigo-700/50 text-indigo-200'
                              }`}
                            >
                              {q.examCategory}
                            </span>
                          </td>

                          {/* 7. Question Type */}
                          <td className="p-3.5 align-top">
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
                              {q.questionType || 'Single Correct'}
                            </span>
                          </td>

                          {/* 8. Status with 1-click toggle */}
                          <td className="p-3.5 align-top">
                            <button
                              onClick={() => handleToggleStatus(q)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                isPublished
                                  ? 'bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/80'
                                  : 'bg-amber-950/70 border border-amber-500/30 text-amber-300 hover:bg-amber-900/80'
                              }`}
                              title="Click to toggle status (Published / Draft)"
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isPublished ? 'bg-emerald-400' : 'bg-amber-400'
                                }`}
                              />
                              <span>{isPublished ? 'Published' : 'Draft'}</span>
                            </button>
                          </td>

                          {/* 9. Diagrams Indicators */}
                          <td className="p-3.5 align-top">
                            <div className="flex flex-col gap-1">
                              {hasQuestionImg ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-400/20 px-1.5 py-0.5 rounded">
                                  <ImageIcon className="w-3 h-3 text-cyan-400 shrink-0" />
                                  <span>Question Fig</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-500">-</span>
                              )}
                              {hasSolutionImg && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-950/60 border border-amber-400/20 px-1.5 py-0.5 rounded">
                                  <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
                                  <span>Solution Fig</span>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 10. Created Date */}
                          <td className="p-3.5 align-top font-mono text-[10px] text-slate-400">
                            {q.pyqYear || 'Sep 16, 2026'}
                          </td>

                          {/* 11. Actions */}
                          <td className="p-3.5 align-top text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Details */}
                              <button
                                onClick={() => setViewingQuestion(q)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-indigo-900 transition-colors cursor-pointer"
                                title="View full question & solution details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit Question */}
                              <button
                                onClick={() => setEditingQuestion(q)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-indigo-900 transition-colors cursor-pointer"
                                title="Edit Question"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Question with Confirmation */}
                              <button
                                onClick={() => setDeleteConfirmQId(q.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-indigo-900 transition-colors cursor-pointer"
                                title="Delete Question from Supabase Vault"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredQuestions.length === 0 && (
                      <tr>
                        <td colSpan={11} className="p-10 text-center text-slate-400">
                          <p className="font-bold text-sm text-slate-300">
                            No Questions Match the Selected Filters
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Try resetting your filters or search keywords.
                          </p>
                          <button
                            onClick={resetQuestionFilters}
                            className="mt-3 px-4 py-1.5 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-cyan-300 text-xs font-semibold cursor-pointer"
                          >
                            Reset All Filters
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal 1: Question Details View Modal */}
            {viewingQuestion && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-[#0d0f2a] border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-5 text-slate-200 animate-in fade-in">
                  {/* Modal Header */}
                  <div className="flex items-start justify-between border-b border-indigo-900/60 pb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400/30 text-xs font-bold">
                          {viewingQuestion.subject}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-400/30 text-xs font-mono font-bold">
                          {viewingQuestion.examCategory}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-400/30 text-xs font-mono font-bold">
                          {viewingQuestion.level}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700/50 text-xs font-mono">
                          {viewingQuestion.questionType || 'Single Correct'}
                        </span>
                      </div>
                      <h3 className="text-lg font-black font-['Outfit'] text-white">
                        {viewingQuestion.chapter}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono text-slate-400">
                          ID: {viewingQuestion.id}
                        </span>
                        <button
                          onClick={() => handleCopyId(viewingQuestion.id)}
                          className="text-slate-400 hover:text-cyan-300"
                          title="Copy ID"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setViewingQuestion(null)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-950 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Passage if present */}
                  {viewingQuestion.passage && (
                    <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Comprehension Passage</span>
                      </div>
                      <div className="text-xs text-slate-200 leading-relaxed">
                        <MathRenderer text={viewingQuestion.passage} />
                      </div>
                    </div>
                  )}

                  {/* Question Statement */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Problem Statement
                    </span>
                    <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-900/60 text-sm sm:text-base text-white leading-relaxed">
                      <MathRenderer text={viewingQuestion.questionText} />
                    </div>
                  </div>

                  {/* Question Diagram(s) */}
                  {(viewingQuestion.imageUrl ||
                    (viewingQuestion.images && viewingQuestion.images.length > 0)) && (
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Question Figure & Diagrams</span>
                      </span>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-indigo-900/60 flex flex-col items-center gap-3">
                        {viewingQuestion.imageUrl && (
                          <div className="relative group max-h-72 overflow-hidden rounded-xl bg-white/5 p-2">
                            <img
                              src={viewingQuestion.imageUrl}
                              alt="Question Diagram"
                              className="max-h-64 object-contain rounded-lg"
                            />
                            <a
                              href={viewingQuestion.imageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/70 text-cyan-300 hover:text-white"
                              title="Open original image"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                        {viewingQuestion.images &&
                          viewingQuestion.images
                            .filter((img) => img !== viewingQuestion.imageUrl)
                            .map((imgUrl, i) => (
                              <div key={i} className="relative group max-h-72 overflow-hidden rounded-xl bg-white/5 p-2">
                                <img
                                  src={imgUrl}
                                  alt={`Diagram ${i + 2}`}
                                  className="max-h-64 object-contain rounded-lg"
                                />
                                <a
                                  href={imgUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/70 text-cyan-300 hover:text-white"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            ))}
                      </div>
                    </div>
                  )}

                  {/* Options */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Options & Verified Answer
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {viewingQuestion.options.map((opt, idx) => {
                        const isCorrect =
                          idx === viewingQuestion.correctOptionIndex ||
                          (viewingQuestion.correctOptionIndices &&
                            viewingQuestion.correctOptionIndices.includes(idx));

                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                              isCorrect
                                ? 'bg-emerald-950/60 border-emerald-400/50 text-white font-medium shadow-sm'
                                : 'bg-indigo-950/30 border-indigo-900/40 text-slate-300'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                                isCorrect
                                  ? 'bg-emerald-400 text-slate-950'
                                  : 'bg-indigo-900 text-slate-400'
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <div className="flex-1">
                              <MathRenderer text={opt} />
                            </div>
                            {isCorrect && (
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider shrink-0">
                                Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {viewingQuestion.integerAnswer !== undefined && (
                      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 font-bold">
                        Integer Answer: {viewingQuestion.integerAnswer}
                      </div>
                    )}
                  </div>

                  {/* Key Formula */}
                  {viewingQuestion.keyFormula && (
                    <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex flex-col gap-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Core Physical Formula & Identity</span>
                      </span>
                      <div className="text-xs text-cyan-100 font-mono">
                        <MathRenderer text={viewingQuestion.keyFormula} />
                      </div>
                    </div>
                  )}

                  {/* Stepwise Solution */}
                  {viewingQuestion.solutionText && (
                    <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 flex flex-col gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>Detailed Step-by-Step Solution</span>
                      </span>
                      <div className="text-xs text-slate-200 leading-relaxed">
                        <MathRenderer text={viewingQuestion.solutionText} />
                      </div>
                    </div>
                  )}

                  {/* Solution Diagram(s) */}
                  {(viewingQuestion.solutionImageUrl ||
                    (viewingQuestion.solutionImages && viewingQuestion.solutionImages.length > 0)) && (
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Solution Diagrams & Graphs</span>
                      </span>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-indigo-900/60 flex flex-col items-center gap-3">
                        {viewingQuestion.solutionImageUrl && (
                          <img
                            src={viewingQuestion.solutionImageUrl}
                            alt="Solution Diagram"
                            className="max-h-64 object-contain rounded-lg"
                          />
                        )}
                        {viewingQuestion.solutionImages &&
                          viewingQuestion.solutionImages
                            .filter((img) => img !== viewingQuestion.solutionImageUrl)
                            .map((imgUrl, i) => (
                              <img
                                key={i}
                                src={imgUrl}
                                alt={`Solution Diagram ${i + 2}`}
                                className="max-h-64 object-contain rounded-lg"
                              />
                            ))}
                      </div>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-indigo-900/60 flex-wrap gap-2">
                    <button
                      onClick={() => handleToggleStatus(viewingQuestion)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-950 border border-indigo-800 text-slate-300 hover:text-white cursor-pointer"
                    >
                      Status: {(viewingQuestion as any).status === 'Draft' ? 'Draft (Click to Publish)' : 'Published (Click to Draft)'}
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingQuestion(viewingQuestion);
                          setViewingQuestion(null);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Question</span>
                      </button>
                      <button
                        onClick={() => setViewingQuestion(null)}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-900 hover:bg-indigo-800 text-white cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal 2: Edit Question Modal */}
            {editingQuestion && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <form
                  onSubmit={handleSaveQuestionEdits}
                  className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-[#0d0f2a] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-4 text-slate-200 animate-in fade-in"
                >
                  <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3">
                    <h3 className="text-base font-black font-['Outfit'] text-cyan-300">
                      Edit Question ({editingQuestion.id.slice(0, 8)}...)
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingQuestion(null)}
                      className="p-1 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Subject</label>
                      <select
                        value={editingQuestion.subject}
                        onChange={(e) =>
                          setEditingQuestion({ ...editingQuestion, subject: e.target.value as SubjectId })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                      >
                        <option>Physics</option>
                        <option>Chemistry</option>
                        <option>Mathematics</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Exam Category</label>
                      <select
                        value={editingQuestion.examCategory}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            examCategory: e.target.value as ExamCategory,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                      >
                        <option>JEE Mains</option>
                        <option>JEE Advanced</option>
                        <option>PYQ</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Level</label>
                      <select
                        value={editingQuestion.level}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            level: e.target.value as QuestionLevel,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                      >
                        <option>Level 1</option>
                        <option>Level 2</option>
                        <option>Level 3</option>
                        <option>JEEVault 50 Special</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Difficulty</label>
                      <select
                        value={editingQuestion.difficulty || 'Standard'}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            difficulty: e.target.value as Difficulty,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                      >
                        <option>Basic</option>
                        <option>Standard</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                  </div>

                  {/* Chapter */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Chapter</label>
                    <input
                      type="text"
                      required
                      value={editingQuestion.chapter}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, chapter: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                    />
                  </div>

                  {/* Question Statement */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Question Statement</label>
                    <textarea
                      required
                      rows={3}
                      value={editingQuestion.questionText}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, questionText: e.target.value })
                      }
                      className="w-full p-3 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                    />
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {editingQuestion.options.map((opt, i) => (
                      <div key={i}>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">
                          Option {String.fromCharCode(65 + i)}
                        </label>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...editingQuestion.options];
                            newOpts[i] = e.target.value;
                            setEditingQuestion({ ...editingQuestion, options: newOpts });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Correct Option Index & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Correct Option</label>
                      <select
                        value={editingQuestion.correctOptionIndex}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            correctOptionIndex: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                      >
                        {editingQuestion.options.map((_, i) => (
                          <option key={i} value={i}>
                            Option {String.fromCharCode(65 + i)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Publishing Status</label>
                      <select
                        value={(editingQuestion as any).status || 'Published'}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            status: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* Formula & Solution */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Key Formula & Theory Summary
                    </label>
                    <input
                      type="text"
                      value={editingQuestion.keyFormula || ''}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, keyFormula: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white mb-2"
                    />
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Detailed Stepwise Solution
                    </label>
                    <textarea
                      rows={3}
                      value={editingQuestion.solutionText || ''}
                      onChange={(e) =>
                        setEditingQuestion({ ...editingQuestion, solutionText: e.target.value })
                      }
                      className="w-full p-3 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                    />
                  </div>

                  {/* Diagram Image URLs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Question Diagram URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={editingQuestion.imageUrl || ''}
                        onChange={(e) =>
                          setEditingQuestion({ ...editingQuestion, imageUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Solution Diagram URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={editingQuestion.solutionImageUrl || ''}
                        onChange={(e) =>
                          setEditingQuestion({ ...editingQuestion, solutionImageUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-indigo-950 border border-indigo-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-indigo-900/60">
                    <button
                      type="button"
                      onClick={() => setEditingQuestion(null)}
                      className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider"
                    >
                      Save Changes to Vault
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Modal 3: Delete Confirmation Dialog */}
            {deleteConfirmQId && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[#0d0f2a] border border-red-500/50 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-slate-200 animate-in fade-in">
                  <div className="flex items-center gap-3 text-red-400">
                    <AlertTriangle className="w-6 h-6 shrink-0" />
                    <h3 className="text-base font-black font-['Outfit']">
                      Confirm Question Deletion
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Are you sure you want to delete question{' '}
                    <span className="font-mono text-cyan-300 font-bold">{deleteConfirmQId}</span>?
                    This will remove the question permanently from the database.
                  </p>
                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      onClick={() => setDeleteConfirmQId(null)}
                      className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-indigo-950 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                    >
                      Yes, Delete Question
                    </button>
                  </div>
                </div>
              </div>
            )}
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
