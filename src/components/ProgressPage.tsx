import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  CheckCircle2,
  FileQuestion,
  Award,
  ChevronDown,
  Sparkles,
  Bookmark,
  User,
  Clock,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const {
    currentUser,
    attempts,
    bookmarkedQuestionIds,
    questions,
    setCurrentView,
    startPracticeSession,
  } = useApp();

  const [timeRange, setTimeRange] = useState<'Last 7 Days' | 'Last 30 Days' | 'All Time'>('Last 7 Days');

  // Filter attempts for this user
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

  // Previous period attempts for delta comparison
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
  const attemptedDelta =
    prevTotalAttempted > 0
      ? Math.round(((totalAttempted - prevTotalAttempted) / prevTotalAttempted) * 100)
      : null;

  // Metric 2: Correct answers
  const totalCorrect = filteredAttempts.filter((a) => a.isCorrect).length;
  const prevTotalCorrect = prevPeriodAttempts.filter((a) => a.isCorrect).length;
  const correctDelta =
    prevTotalCorrect > 0
      ? Math.round(((totalCorrect - prevTotalCorrect) / prevTotalCorrect) * 100)
      : null;

  // Metric 3: Accuracy rate
  const accuracyRate = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const prevAccuracy =
    prevTotalAttempted > 0 ? Math.round((prevTotalCorrect / prevTotalAttempted) * 100) : 0;
  const accuracyDelta = prevTotalAttempted > 0 ? accuracyRate - prevAccuracy : null;

  // Metric 4: Syllabus progress
  const totalQuestionBankSize = Math.max(questions.length, 1);
  const uniqueAttemptedQuestionIds = new Set(userAttempts.map((a) => a.questionId));
  const syllabusProgress = Math.min(
    100,
    Math.round((uniqueAttemptedQuestionIds.size / totalQuestionBankSize) * 100)
  );

  // Subject-specific accuracy calculations
  const subjectStats = useMemo(() => {
    const questionSubjectMap = new Map<string, string>();
    questions.forEach((q) => questionSubjectMap.set(q.id, q.subject));

    const stats: Record<string, { attempted: number; correct: number }> = {
      Mathematics: { attempted: 0, correct: 0 },
      Physics: { attempted: 0, correct: 0 },
      Chemistry: { attempted: 0, correct: 0 },
    };

    filteredAttempts.forEach((att) => {
      const sub = questionSubjectMap.get(att.questionId);
      if (sub && stats[sub]) {
        stats[sub].attempted += 1;
        if (att.isCorrect) stats[sub].correct += 1;
      }
    });

    return stats;
  }, [filteredAttempts, questions]);

  const mathAccuracy =
    subjectStats.Mathematics.attempted > 0
      ? Math.round((subjectStats.Mathematics.correct / subjectStats.Mathematics.attempted) * 100)
      : 0;

  const phyAccuracy =
    subjectStats.Physics.attempted > 0
      ? Math.round((subjectStats.Physics.correct / subjectStats.Physics.attempted) * 100)
      : 0;

  const chemAccuracy =
    subjectStats.Chemistry.attempted > 0
      ? Math.round((subjectStats.Chemistry.correct / subjectStats.Chemistry.attempted) * 100)
      : 0;

  // SVG trend curve points
  const trendPoints = useMemo(() => {
    const buckets = 7;
    const bucketDuration = (timeRangeDays > 0 ? timeRangeDays : 30) * 24 * 60 * 60 * 1000 / buckets;
    const points: { label: string; accuracy: number; count: number }[] = [];

    for (let i = buckets - 1; i >= 0; i--) {
      const endT = now - i * bucketDuration;
      const startT = endT - bucketDuration;
      const inBucket = userAttempts.filter((a) => {
        const t = new Date(a.attemptedAt).getTime();
        return !isNaN(t) && t >= startT && t < endT;
      });

      const correctInBucket = inBucket.filter((a) => a.isCorrect).length;
      const acc = inBucket.length > 0 ? Math.round((correctInBucket / inBucket.length) * 100) : 0;
      const d = new Date(startT);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      points.push({ label, accuracy: acc, count: inBucket.length });
    }

    return points;
  }, [userAttempts, timeRangeDays, now]);

  const pathString = useMemo(() => {
    if (trendPoints.length === 0) return '';
    const width = 600;
    const height = 180;
    const padding = 20;

    const coords = trendPoints.map((pt, idx) => {
      const x = padding + (idx / (trendPoints.length - 1)) * (width - 2 * padding);
      const y = height - padding - (pt.accuracy / 100) * (height - 2 * padding);
      return { x, y };
    });

    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const cpX = (coords[i - 1].x + coords[i].x) / 2;
      d += ` C ${cpX} ${coords[i - 1].y}, ${cpX} ${coords[i].y}, ${coords[i].x} ${coords[i].y}`;
    }
    return d;
  }, [trendPoints]);

  const areaString = useMemo(() => {
    if (!pathString || trendPoints.length === 0) return '';
    const width = 600;
    const height = 180;
    const padding = 20;
    const lastX = width - padding;
    const firstX = padding;
    const bottomY = height - padding;
    return `${pathString} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [pathString, trendPoints]);

  return (
    <div className="min-h-screen bg-[#07091e] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with Title, User Context & Quick Links */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-950/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
                Progress Analysis
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Live performance metrics, accuracy breakdown, and syllabus mastery for{' '}
              <span className="text-cyan-300 font-semibold">{currentUser?.name || 'Student'}</span>
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Time range selector */}
            <div className="relative inline-block">
              <select
                id="progress-time-range-select"
                aria-label="Filter progress analysis by time range"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="appearance-none bg-[#0e102f] border border-cyan-500/40 rounded-xl px-4 py-2 pr-9 text-xs sm:text-sm font-semibold text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer shadow-lg shadow-cyan-950/40"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="All Time">All Time</option>
              </select>
              <ChevronDown className="w-4 h-4 text-cyan-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick Button to Bookmarks */}
            <button
              id="progress-btn-goto-bookmarks"
              onClick={() => setCurrentView('bookmarks')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs shadow-amber-500/20"
              title="View your saved questions"
            >
              <Bookmark className="w-4 h-4 fill-amber-400/40 text-amber-400" />
              <span>Bookmarks ({bookmarkedQuestionIds.length})</span>
            </button>

            {/* Quick Button to Profile */}
            <button
              id="progress-btn-goto-profile"
              onClick={() => setCurrentView('profile')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 text-slate-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              title="View student profile details"
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span>Student Profile</span>
            </button>
          </div>
        </div>

        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Questions Attempted */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c0e29] to-[#12163b] border border-cyan-500/25 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Questions Attempted
              </span>
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <FileQuestion className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-white">{totalAttempted}</span>
              <span className="text-xs text-slate-400">questions</span>
            </div>
            <div className="mt-3 text-[11px] font-medium text-slate-400">
              {attemptedDelta !== null ? (
                <span className={attemptedDelta >= 0 ? 'text-emerald-400 font-bold' : 'text-pink-400 font-bold'}>
                  {attemptedDelta >= 0 ? `+${attemptedDelta}%` : `${attemptedDelta}%`}
                  <span className="text-slate-400 font-normal"> vs previous period</span>
                </span>
              ) : (
                <span>Recorded in practice vault</span>
              )}
            </div>
          </div>

          {/* Correct Answers */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c0e29] to-[#12163b] border border-emerald-500/25 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Correct Answers
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-emerald-300">{totalCorrect}</span>
              <span className="text-xs text-slate-400">/ {totalAttempted}</span>
            </div>
            <div className="mt-3 text-[11px] font-medium text-slate-400">
              {correctDelta !== null ? (
                <span className={correctDelta >= 0 ? 'text-emerald-400 font-bold' : 'text-pink-400 font-bold'}>
                  {correctDelta >= 0 ? `+${correctDelta}%` : `${correctDelta}%`}
                  <span className="text-slate-400 font-normal"> vs previous period</span>
                </span>
              ) : (
                <span>High-yield solutions verified</span>
              )}
            </div>
          </div>

          {/* Overall Accuracy Rate */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c0e29] to-[#12163b] border border-fuchsia-500/25 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Overall Accuracy
              </span>
              <div className="p-2 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-fuchsia-300">{accuracyRate}%</span>
              <span className="text-xs text-slate-400">precision</span>
            </div>
            <div className="mt-3 text-[11px] font-medium text-slate-400">
              {accuracyDelta !== null ? (
                <span className={accuracyDelta >= 0 ? 'text-emerald-400 font-bold' : 'text-pink-400 font-bold'}>
                  {accuracyDelta >= 0 ? `+${accuracyDelta}%` : `${accuracyDelta}%`}
                  <span className="text-slate-400 font-normal"> accuracy shift</span>
                </span>
              ) : (
                <span className="text-cyan-300 font-medium">Target: ≥ 85% for JEE Adv</span>
              )}
            </div>
          </div>

          {/* Syllabus Covered */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c0e29] to-[#12163b] border border-amber-500/25 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Syllabus Progress
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-amber-300">{syllabusProgress}%</span>
              <span className="text-xs text-slate-400">of repository</span>
            </div>
            <div className="mt-3 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${syllabusProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Middle Section: Visual Performance Trend + Circular Subject Accuracy */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Trend SVG Curve */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0c0e29] border border-indigo-900/60 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    Accuracy & Performance Trend
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Percentage accuracy over {timeRange.toLowerCase()}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  {trendPoints.length} Data Points
                </span>
              </div>

              {/* Responsive SVG Chart */}
              <div className="relative w-full h-48 sm:h-56 mt-2">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 600 180"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="20" y1="20" x2="580" y2="20" stroke="#1e1b4b" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="20" y1="90" x2="580" y2="90" stroke="#1e1b4b" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="20" y1="160" x2="580" y2="160" stroke="#1e1b4b" strokeWidth="1" />

                  {/* Gradient Area Fill */}
                  {areaString && <path d={areaString} fill="url(#trendGradient)" />}

                  {/* Smooth Line Path */}
                  {pathString && (
                    <path
                      d={pathString}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Data Points */}
                  {trendPoints.map((pt, idx) => {
                    const x = 20 + (idx / (trendPoints.length - 1)) * 560;
                    const y = 160 - (pt.accuracy / 100) * 140;
                    return (
                      <g key={idx} className="group cursor-pointer">
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          className="fill-[#0c0e29] stroke-cyan-400 stroke-2 hover:r-7 hover:fill-cyan-400 transition-all"
                        />
                        <title>{`${pt.label}: ${pt.accuracy}% (${pt.count} questions)`}</title>
                      </g>
                    );
                  })}
                </svg>

                {/* X-Axis Labels */}
                <div className="flex justify-between text-[10px] sm:text-xs text-slate-500 mt-2 px-3">
                  {trendPoints.map((pt, idx) => (
                    <span key={idx} className="truncate max-w-[60px] text-center font-mono">
                      {pt.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-indigo-950/80 mt-4 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                Calculated dynamically from real test submissions
              </span>
              <button
                onClick={() => setCurrentView('home')}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Practice More Questions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subject-Wise Accuracy Gauge & Bars */}
          <div className="p-6 rounded-3xl bg-[#0c0e29] border border-indigo-900/60 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-4">Subject Accuracy Breakdown</h3>

              {/* Subject Breakdown Bars */}
              <div className="space-y-4">
                {/* Mathematics */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-fuchsia-300">Mathematics</span>
                    <span className="font-mono text-white">
                      {mathAccuracy}% ({subjectStats.Mathematics.correct}/{subjectStats.Mathematics.attempted})
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-fuchsia-500 to-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${mathAccuracy}%` }}
                    />
                  </div>
                </div>

                {/* Physics */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-cyan-300">Physics</span>
                    <span className="font-mono text-white">
                      {phyAccuracy}% ({subjectStats.Physics.correct}/{subjectStats.Physics.attempted})
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${phyAccuracy}%` }}
                    />
                  </div>
                </div>

                {/* Chemistry */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-emerald-300">Chemistry</span>
                    <span className="font-mono text-white">
                      {chemAccuracy}% ({subjectStats.Chemistry.correct}/{subjectStats.Chemistry.attempted})
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${chemAccuracy}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Summary Pill Box */}
              <div className="mt-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Preparation Assessment</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {accuracyRate >= 80
                    ? 'Excellent retention and problem-solving rhythm! Focus on timed JEE Advanced multi-correct practice to maximize rank.'
                    : accuracyRate >= 50
                    ? 'Consistent foundation. Review incorrect questions in the Bookmarks vault and focus on formula retention.'
                    : 'Target key high-weightage chapters in Mathematics and Physics to build problem accuracy.'}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-indigo-950/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Total practice sessions</span>
              <span className="text-xs font-mono font-bold text-white">{userAttempts.length} logged</span>
            </div>
          </div>
        </div>

        {/* Recent Attempts Vault Table */}
        <div className="p-6 rounded-3xl bg-[#0c0e29] border border-indigo-900/60 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Recent Question Attempts
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Detailed record of questions attempted and verified solutions
              </p>
            </div>

            <button
              onClick={() => setCurrentView('home')}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:brightness-110 text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-md shadow-purple-600/30 cursor-pointer"
            >
              Start New Test
            </button>
          </div>

          {filteredAttempts.length === 0 ? (
            <div className="p-8 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-center">
              <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-300">No attempts logged in this time range</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Head to the dashboard to attempt curated JEE Main and Advanced questions.
              </p>
              <button
                onClick={() => setCurrentView('home')}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-indigo-950/90 text-slate-400 uppercase font-bold tracking-wider">
                    <th className="pb-3 px-3">Subject</th>
                    <th className="pb-3 px-3">Question ID</th>
                    <th className="pb-3 px-3">Result</th>
                    <th className="pb-3 px-3">Time Spent</th>
                    <th className="pb-3 px-3">Attempted Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-950/60">
                  {filteredAttempts.slice(0, 10).map((att) => {
                    const qObj = questions.find((q) => q.id === att.questionId);
                    const subjectName = qObj?.subjectId || 'JEE Practice';
                    const dateStr = new Date(att.attemptedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr key={att.id} className="hover:bg-indigo-950/30 transition-colors">
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                              subjectName === 'Physics'
                                ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                                : subjectName === 'Chemistry'
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                                : 'bg-fuchsia-950/60 text-fuchsia-300 border border-fuchsia-500/30'
                            }`}
                          >
                            {subjectName}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300">
                          {att.questionId.slice(0, 16)}...
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              att.isCorrect
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                                : 'bg-pink-950/60 text-pink-300 border border-pink-500/30'
                            }`}
                          >
                            {att.isCorrect ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                Correct
                              </>
                            ) : (
                              'Incorrect'
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-400">
                          {att.timeSpentSeconds}s
                        </td>
                        <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                          {dateStr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
