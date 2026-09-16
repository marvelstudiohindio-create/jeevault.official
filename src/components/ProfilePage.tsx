import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Building2,
  Target,
  Edit3,
  TrendingUp,
  CheckCircle2,
  FileQuestion,
  Award,
  ChevronDown,
  Sparkles,
  BookOpen,
  Bookmark,
  X,
  Clock,
  LogOut,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    attempts,
    bookmarkedQuestionIds,
    questions,
    startPracticeSession,
    setCurrentView,
    logout,
  } = useApp();

  const [timeRange, setTimeRange] = useState<'Last 7 Days' | 'Last 30 Days' | 'All Time'>('Last 7 Days');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(currentUser?.name || 'Aarav Sharma');
  const [editStandard, setEditStandard] = useState(currentUser?.standard || '12');
  const [editInstitution, setEditInstitution] = useState(currentUser?.institution || 'Delhi Public School');
  const [editTarget, setEditTarget] = useState(currentUser?.targetYear || 'JEE 2027');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      standard: editStandard as '11' | '12' | 'Dropper',
      institution: editInstitution,
      targetYear: editTarget,
    });
    setIsEditModalOpen(false);
  };

  const bookmarkedQuestions = questions.filter((q) =>
    bookmarkedQuestionIds.includes(q.id)
  );

  // --- Real Dynamic Calculations from Attempts Vault ---
  const userAttempts = useMemo(() => {
    if (currentUser) {
      return attempts.filter((a) => !a.userId || a.userId === currentUser.id);
    }
    return attempts;
  }, [attempts, currentUser]);

  const now = Date.now();
  const timeRangeDays = timeRange === 'Last 7 Days' ? 7 : timeRange === 'Last 30 Days' ? 30 : 0;

  const filteredAttempts = useMemo(() => {
    if (timeRange === 'All Time') return userAttempts;
    const cutoff = now - timeRangeDays * 24 * 60 * 60 * 1000;
    return userAttempts.filter((a) => {
      const t = new Date(a.attemptedAt).getTime();
      return isNaN(t) ? true : t >= cutoff;
    });
  }, [userAttempts, timeRange, timeRangeDays, now]);

  // Previous period attempts for comparison delta
  const prevPeriodAttempts = useMemo(() => {
    if (timeRange === 'All Time' || timeRangeDays === 0) return [];
    const currentCutoff = now - timeRangeDays * 24 * 60 * 60 * 1000;
    const prevCutoff = now - 2 * timeRangeDays * 24 * 60 * 60 * 1000;
    return userAttempts.filter((a) => {
      const t = new Date(a.attemptedAt).getTime();
      return !isNaN(t) && t >= prevCutoff && t < currentCutoff;
    });
  }, [userAttempts, timeRange, timeRangeDays, now]);

  // Metric 1: Total questions attempted
  const totalAttempted = filteredAttempts.length;
  const prevTotalAttempted = prevPeriodAttempts.length;
  const attemptedDelta = prevTotalAttempted > 0
    ? Math.round(((totalAttempted - prevTotalAttempted) / prevTotalAttempted) * 100)
    : null;

  // Metric 2: Correct answers
  const totalCorrect = filteredAttempts.filter((a) => a.isCorrect).length;
  const prevTotalCorrect = prevPeriodAttempts.filter((a) => a.isCorrect).length;
  const correctDelta = prevTotalCorrect > 0
    ? Math.round(((totalCorrect - prevTotalCorrect) / prevTotalCorrect) * 100)
    : null;

  // Metric 3: Accuracy
  const accuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
  const prevAccuracy = prevTotalAttempted > 0 ? (prevTotalCorrect / prevTotalAttempted) * 100 : 0;
  const accuracyDelta = prevTotalAttempted > 0 ? (accuracy - prevAccuracy).toFixed(1) : null;
  const formattedAccuracy = `${accuracy.toFixed(1)}%`;

  // Metric 4: Overall progress
  const uniqueAttemptedCount = new Set(filteredAttempts.map((a) => a.questionId)).size;
  const totalQuestionsInVault = questions.length;
  const overallProgress = totalQuestionsInVault > 0
    ? Math.min(100, Math.round((uniqueAttemptedCount / totalQuestionsInVault) * 100))
    : totalAttempted > 0
    ? 100
    : 0;

  // Subject-wise accuracy calculation
  const questionMap = useMemo(() => {
    const map = new Map<string, (typeof questions)[0]>();
    questions.forEach((q) => map.set(q.id, q));
    return map;
  }, [questions]);

  const getSubjectStats = (subject: 'Mathematics' | 'Physics' | 'Chemistry') => {
    const subjAttempts = filteredAttempts.filter((a) => {
      const q = questionMap.get(a.questionId);
      if (q) return q.subject === subject;
      if (subject === 'Physics' && a.questionId.toLowerCase().includes('phy')) return true;
      if (subject === 'Mathematics' && a.questionId.toLowerCase().includes('math')) return true;
      if (subject === 'Chemistry' && a.questionId.toLowerCase().includes('chem')) return true;
      return false;
    });
    const count = subjAttempts.length;
    const correct = subjAttempts.filter((a) => a.isCorrect).length;
    const acc = count > 0 ? Math.round((correct / count) * 100) : 0;
    return { count, correct, accuracy: acc };
  };

  const mathStats = getSubjectStats('Mathematics');
  const phyStats = getSubjectStats('Physics');
  const chemStats = getSubjectStats('Chemistry');

  // Trend Data for the 7 points on SVG Performance Curve
  const trendPoints = useMemo(() => {
    const count = 7;
    const stepDuration = timeRange === 'Last 30 Days' ? 4 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const pts = [];
    for (let i = count - 1; i >= 0; i--) {
      const pointEnd = now - i * stepDuration;
      const pointStart = pointEnd - stepDuration;
      const dateObj = new Date(pointEnd);
      const label = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });

      const dayAttempts = userAttempts.filter((a) => {
        const t = new Date(a.attemptedAt).getTime();
        return !isNaN(t) && t >= pointStart && t < pointEnd;
      });
      const dayCorrect = dayAttempts.filter((a) => a.isCorrect).length;
      const dayAcc = dayAttempts.length > 0 ? (dayCorrect / dayAttempts.length) * 100 : 0;

      const cx = 20 + ((count - 1 - i) * (500 - 40)) / (count - 1);
      const cy = dayAttempts.length > 0 ? 140 - (dayAcc / 100) * 120 : 140;

      pts.push({
        label,
        attempts: dayAttempts.length,
        correct: dayCorrect,
        accuracy: dayAcc,
        cx,
        cy,
        hasData: dayAttempts.length > 0,
      });
    }
    return pts;
  }, [userAttempts, timeRange, now]);

  const polylinePoints = trendPoints.map((p) => `${p.cx},${p.cy}`).join(' ');
  const polygonPoints = `${trendPoints.map((p) => `${p.cx},${p.cy}`).join(' ')} 480,150 20,150`;
  const hasAnyTrendData = trendPoints.some((p) => p.hasData);

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-br from-[#0c0d2b] via-[#120f3e] to-[#0a0822] text-white p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* User Hero Card matching screenshot */}
        <div className="relative rounded-3xl bg-[#131540]/80 border-2 border-indigo-900/60 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Background subtle neon glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Avatar & Profile Identifiers */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Silhouette / Avatar with neon ring matching screenshot */}
              <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-[0_0_25px_rgba(168,85,247,0.5)]">
                <img
                  src={
                    currentUser?.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                  }
                  alt={currentUser?.name}
                  className="w-full h-full rounded-full object-cover bg-slate-950"
                />
              </div>

              {/* Name & Educational Tags */}
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
                    {currentUser?.name || 'Aarav Sharma'}
                  </h2>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    id="profile-btn-edit"
                    className="p-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-cyan-300 border border-indigo-700/50 transition-colors"
                    title="Edit profile information"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* 3 Info Badges matching screenshot */}
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  {/* Standard */}
                  <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-indigo-950/70 border border-indigo-800/60">
                    <div className="p-1.5 rounded-xl bg-blue-600/30 text-blue-400">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                        Standard
                      </span>
                      <span className="text-xs font-bold text-slate-100">
                        Class {currentUser?.standard || '12'}
                      </span>
                    </div>
                  </div>

                  {/* Institution */}
                  <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-indigo-950/70 border border-indigo-800/60">
                    <div className="p-1.5 rounded-xl bg-purple-600/30 text-purple-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                        Institution
                      </span>
                      <span className="text-xs font-bold text-slate-100">
                        {currentUser?.institution || 'Delhi Public School'}
                      </span>
                    </div>
                  </div>

                  {/* Target Year */}
                  <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-indigo-950/70 border border-indigo-800/60">
                    <div className="p-1.5 rounded-xl bg-cyan-600/30 text-cyan-400">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                        Target
                      </span>
                      <span className="text-xs font-bold text-slate-100">
                        {currentUser?.targetYear || 'JEE 2027'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Motivational quote & Sign Out matching screenshot */}
            <div className="flex flex-col lg:items-end items-center text-center lg:text-right gap-3">
              <div>
                <p className="text-sm font-semibold italic text-purple-200/90 max-w-xs">
                  "Small steps everyday lead to big results."
                </p>
                <div className="w-16 h-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 mt-2 mx-auto lg:ml-auto"></div>
              </div>

              <button
                onClick={logout}
                id="profile-btn-signout"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 hover:text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                title="Sign out of your account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards: Progress Analysis & Bookmarks Vault */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => setCurrentView('progress')}
            className="group p-5 rounded-2xl bg-gradient-to-br from-[#0e102f] to-[#151945] border border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-all duration-200 shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Detailed Progress Analysis
                </h4>
                <p className="text-xs text-slate-400">
                  {totalAttempted} Questions Attempted • {formattedAccuracy} Accuracy
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              <span>View</span>
              <span>→</span>
            </span>
          </div>

          <div
            onClick={() => setCurrentView('bookmarks')}
            className="group p-5 rounded-2xl bg-gradient-to-br from-[#0e102f] to-[#1e1738] border border-amber-500/30 hover:border-amber-400 cursor-pointer transition-all duration-200 shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 group-hover:scale-105 transition-transform">
                <Bookmark className="w-5 h-5 fill-amber-400/30" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Saved Bookmarks Vault
                </h4>
                <p className="text-xs text-slate-400">
                  {bookmarkedQuestions.length} Questions Saved for Revision
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              <span>Open</span>
              <span>→</span>
            </span>
          </div>
        </div>

        {/* Progress Analysis Section Header */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-wide text-white">
              Progress Analysis
            </h3>
          </div>

          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="appearance-none pl-4 pr-9 py-2 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-xs font-bold text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>All Time</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* 4 Metric Cards matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Questions Attempted */}
          <div className="p-5 rounded-2xl bg-[#141642]/80 border border-indigo-900/60 backdrop-blur-xl shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-3">
              <FileQuestion className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-400 block">
              Total Questions Attempted
            </span>
            <div className="text-3xl font-black font-['Outfit'] text-white mt-1">
              {totalAttempted}
            </div>
            {attemptedDelta !== null ? (
              <span
                className={`text-[11px] font-bold ${
                  attemptedDelta >= 0 ? 'text-cyan-400' : 'text-rose-400'
                } mt-1.5 inline-flex items-center gap-1`}
              >
                {attemptedDelta >= 0 ? `↑ +${attemptedDelta}%` : `↓ ${attemptedDelta}%`}{' '}
                <span className="text-slate-500 font-normal">vs prev period</span>
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-400 mt-1.5 inline-flex items-center gap-1">
                {totalAttempted > 0 ? '● Recorded across tests' : 'No attempts logged yet'}
              </span>
            )}
          </div>

          {/* Card 2: Correct Answers */}
          <div className="p-5 rounded-2xl bg-[#141642]/80 border border-indigo-900/60 backdrop-blur-xl shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-400 block">
              Correct Answers
            </span>
            <div className="text-3xl font-black font-['Outfit'] text-white mt-1">
              {totalCorrect}
            </div>
            {correctDelta !== null ? (
              <span
                className={`text-[11px] font-bold ${
                  correctDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                } mt-1.5 inline-flex items-center gap-1`}
              >
                {correctDelta >= 0 ? `↑ +${correctDelta}%` : `↓ ${correctDelta}%`}{' '}
                <span className="text-slate-500 font-normal">vs prev period</span>
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-400 mt-1.5 inline-flex items-center gap-1">
                {totalAttempted > 0 ? `${totalAttempted - totalCorrect} incorrect` : 'Ready for practice'}
              </span>
            )}
          </div>

          {/* Card 3: Accuracy */}
          <div className="p-5 rounded-2xl bg-[#141642]/80 border border-indigo-900/60 backdrop-blur-xl shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-3 font-mono font-bold">
              %
            </div>
            <span className="text-xs font-medium text-slate-400 block">
              Accuracy
            </span>
            <div className="text-3xl font-black font-['Outfit'] text-cyan-300 mt-1">
              {totalAttempted > 0 ? formattedAccuracy : '0.0%'}
            </div>
            {accuracyDelta !== null ? (
              <span
                className={`text-[11px] font-bold ${
                  Number(accuracyDelta) >= 0 ? 'text-cyan-400' : 'text-rose-400'
                } mt-1.5 inline-flex items-center gap-1`}
              >
                {Number(accuracyDelta) >= 0 ? `↑ +${accuracyDelta}%` : `↓ ${accuracyDelta}%`}{' '}
                <span className="text-slate-500 font-normal">vs prev period</span>
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-400 mt-1.5 inline-flex items-center gap-1">
                {totalAttempted > 0 ? 'Live accuracy score' : 'Start tests to calculate'}
              </span>
            )}
          </div>

          {/* Card 4: Overall Progress */}
          <div className="p-5 rounded-2xl bg-[#141642]/80 border border-indigo-900/60 backdrop-blur-xl shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-400 block">
              Overall Progress
            </span>
            <div className="text-3xl font-black font-['Outfit'] text-white mt-1">
              {overallProgress}%
            </div>
            <span className="text-[11px] font-medium text-slate-400 mt-1.5 inline-flex items-center gap-1">
              {uniqueAttemptedCount} of {totalQuestionsInVault > 0 ? totalQuestionsInVault : 'vault'} solved
            </span>
          </div>
        </div>

        {/* Lower Row: Performance Trend & Subject-wise Accuracy matching screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
          {/* Left Chart: Performance Trend (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#131540]/80 border-2 border-indigo-900/60 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <h4 className="text-base font-bold text-white">Performance Trend</h4>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold">
                {totalAttempted > 0 ? `${formattedAccuracy} Current` : 'No Data Yet'}
              </span>
            </div>

            {/* SVG Trend Graph matching screenshot with dynamic points */}
            <div className="relative w-full h-48 sm:h-52 flex flex-col justify-end">
              <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(99, 102, 241, 0.15)" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(99, 102, 241, 0.15)" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(99, 102, 241, 0.15)" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(99, 102, 241, 0.15)" strokeDasharray="3 3" />

                {/* Gradient area fill & polyline */}
                {hasAnyTrendData ? (
                  <>
                    <polygon points={polygonPoints} fill="url(#trendGradient)" />
                    <polyline
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={polylinePoints}
                      filter="drop-shadow(0px 0px 8px rgba(56, 189, 248, 0.8))"
                    />
                  </>
                ) : (
                  <text
                    x="250"
                    y="80"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="12"
                    fontFamily="inherit"
                  >
                    No test attempts recorded in this time range
                  </text>
                )}

                {/* Data points */}
                {trendPoints.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.cx}
                    cy={pt.cy}
                    r={idx === trendPoints.length - 1 && pt.hasData ? 6 : 4}
                    fill={pt.hasData ? '#38bdf8' : '#334155'}
                    stroke={idx === trendPoints.length - 1 && pt.hasData ? '#ffffff' : '#0c0d2b'}
                    strokeWidth="2"
                    className={idx === trendPoints.length - 1 && pt.hasData ? 'animate-pulse' : ''}
                  />
                ))}
              </svg>

              {/* X Axis Dates matching screenshot */}
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2 px-2">
                {trendPoints.map((pt, idx) => (
                  <span
                    key={idx}
                    className={idx === trendPoints.length - 1 ? 'text-cyan-300 font-bold' : ''}
                  >
                    {pt.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Chart: Subject-wise Accuracy (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#131540]/80 border-2 border-indigo-900/60 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-cyan-400" />
              <h4 className="text-base font-bold text-white">Subject-wise Accuracy</h4>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 my-auto">
              {/* Circular Overall Ring Gauge matching screenshot */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#1e1b4b"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#radialAcc)"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - Math.min(1, Math.max(0, accuracy / 100)))}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="radialAcc" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d946ef" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black font-['Outfit'] text-white">
                    {totalAttempted > 0 ? formattedAccuracy : '0.0%'}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400">
                    Overall
                  </span>
                </div>
              </div>

              {/* Progress Bars for 3 Subjects */}
              <div className="w-full flex flex-col gap-3">
                {/* Mathematics */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5 text-slate-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500"></span>
                      Mathematics
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-fuchsia-400 font-mono font-bold">{mathStats.accuracy}%</span>
                      <span className="text-[10px] text-slate-400">
                        ({mathStats.correct}/{mathStats.count})
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-indigo-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-fuchsia-600 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${mathStats.accuracy}%` }}
                    ></div>
                  </div>
                </div>

                {/* Physics */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5 text-slate-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                      Physics
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-blue-300 font-mono font-bold">{phyStats.accuracy}%</span>
                      <span className="text-[10px] text-slate-400">
                        ({phyStats.correct}/{phyStats.count})
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-indigo-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${phyStats.accuracy}%` }}
                    ></div>
                  </div>
                </div>

                {/* Chemistry */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="flex items-center gap-1.5 text-slate-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                      Chemistry
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-cyan-300 font-mono font-bold">{chemStats.accuracy}%</span>
                      <span className="text-[10px] text-slate-400">
                        ({chemStats.correct}/{chemStats.count})
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-indigo-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${chemStats.accuracy}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookmarked Questions Quick Revisit Section */}
        {bookmarkedQuestions.length > 0 && (
          <div className="rounded-3xl bg-[#131540]/80 border-2 border-indigo-900/60 p-6 backdrop-blur-xl shadow-xl mt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-400 fill-current" />
                <h4 className="text-base font-bold text-white">
                  Saved & Bookmarked Questions ({bookmarkedQuestions.length})
                </h4>
              </div>
              <button
                onClick={() =>
                  startPracticeSession(bookmarkedQuestions, 'Bookmarked Questions Review')
                }
                className="px-4 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition-colors"
              >
                Re-attempt Bookmarks ➔
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bookmarkedQuestions.map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-800/40 text-xs flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-cyan-300">{q.subject}</span>
                    <span>{q.chapter}</span>
                  </div>
                  <p className="text-slate-200 font-medium line-clamp-2">
                    {q.questionText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#16143c] border-2 border-purple-500/40 p-6 text-white shadow-2xl">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-['Outfit'] mb-4">Edit Profile Details</h3>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-indigo-950/80 border border-indigo-700/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Standard / Class
                </label>
                <select
                  value={editStandard}
                  onChange={(e) => setEditStandard(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-indigo-950/80 border border-indigo-700/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                  <option value="Dropper">Dropper / Repeater</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Institution / Coaching
                </label>
                <input
                  type="text"
                  value={editInstitution}
                  onChange={(e) => setEditInstitution(e.target.value)}
                  placeholder="PW / Allen / Aakash / Sri Chaitanya / School"
                  className="w-full px-3.5 py-2 rounded-xl bg-indigo-950/80 border border-indigo-700/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Target Exam & Year
                </label>
                <input
                  type="text"
                  value={editTarget}
                  onChange={(e) => setEditTarget(e.target.value)}
                  placeholder="JEE 2026 or JEE 2027"
                  className="w-full px-3.5 py-2 rounded-xl bg-indigo-950/80 border border-indigo-700/50 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
