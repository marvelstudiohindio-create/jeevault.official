import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  ChevronRight,
  Target,
  Award,
  Zap,
  Clock,
  Layers,
  BarChart3,
} from 'lucide-react';
import studentImg from '../assets/images/jee_student_study_1789567923394.jpg';

export const LandingPage: React.FC = () => {
  const {
    setIsAuthModalOpen,
    setAuthMode,
    isLoggedIn,
    setCurrentView,
    setActiveSubject,
  } = useApp();

  const handleStartJourney = () => {
    if (isLoggedIn) {
      setCurrentView('home');
    } else {
      setAuthMode('signup');
      setIsAuthModalOpen(true);
    }
  };

  const handleExploreSubject = (subject: 'Physics' | 'Chemistry' | 'Mathematics') => {
    setActiveSubject(subject);
    if (isLoggedIn) {
      setCurrentView('chapters');
    } else {
      setAuthMode('login');
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-[#fafbfd] text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* ========================================================================= */}
      {/* HERO SECTION - Responsive Desktop (16:9) / Tablet Portrait / Mobile     */}
      {/* ========================================================================= */}
      <section className="relative w-full border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-[#f4f7fb]">
        {/* Subtle decorative background glow (pure light theme) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/70 to-transparent pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
          {/* DESKTOP (lg:): 2-Column Grid | TABLET & MOBILE (<lg): Ordered Single Column */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
            
            {/* LEFT / PRIMARY COLUMN (Desktop Left, Tablet/Mobile Top Flow) */}
            <div className="lg:col-span-7 flex flex-col items-start w-full">
              
              {/* 1. BADGE */}
              <div
                id="hero-badge"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs sm:text-xs font-bold uppercase tracking-wider shadow-2xs mb-4 sm:mb-5"
              >
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span>STUDY &bull; PRACTICE &bull; CRACK</span>
              </div>

              {/* 2. MAIN HEADING */}
              <div id="hero-heading" className="w-full flex flex-col tracking-tight font-['Outfit'] select-none">
                <span
                  className="font-extrabold text-slate-900 leading-[1.08] uppercase"
                  style={{ fontSize: 'clamp(2rem, 5.2vw, 4.25rem)' }}
                >
                  MAKE YOUR
                </span>
                <span
                  className="font-black leading-[1.08] uppercase mt-1 text-slate-900"
                  style={{ fontSize: 'clamp(2.1rem, 5.6vw, 4.5rem)' }}
                >
                  <span className="text-blue-600 drop-shadow-2xs">JEE JOURNEY</span>{' '}
                  <span className="text-slate-900">EASE</span>
                </span>
              </div>

              {/* 3. SUPPORTING TEXT */}
              <p
                id="hero-description"
                className="text-slate-600 font-normal leading-relaxed max-w-2xl mt-4 sm:mt-5"
                style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)' }}
              >
                Access all important JEE questions with special 50 questions and all PYQs.
              </p>

              {/* 4. THREE FEATURE CARDS */}
              <div
                id="feature-cards-container"
                className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mt-6 sm:mt-8"
              >
                {/* Feature Card 1: All Important JEE Questions */}
                <div
                  id="feature-study"
                  onClick={handleStartJourney}
                  className="group relative flex flex-col p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer text-left"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                      Study
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    All Important JEE Questions
                  </h3>
                  <p className="text-xs sm:text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Chapter-wise, topic-wise, fully organized.
                  </p>
                </div>

                {/* Feature Card 2: Special 50 Questions */}
                <div
                  id="feature-practice"
                  onClick={handleStartJourney}
                  className="group relative flex flex-col p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all duration-200 cursor-pointer text-left"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-200">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
                      Practice
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug">
                    Special 50 Questions
                  </h3>
                  <p className="text-xs sm:text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Curated high-yield questions for better practice.
                  </p>
                </div>

                {/* Feature Card 3: All PYQs (Past Year) */}
                <div
                  id="feature-crack"
                  onClick={handleStartJourney}
                  className="group relative flex flex-col p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 cursor-pointer text-left sm:col-span-2 lg:col-span-1"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                      Crack
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug">
                    All PYQs (Past Year)
                  </h3>
                  <p className="text-xs sm:text-xs text-slate-500 mt-1.5 leading-relaxed">
                    From JEE Mains &amp; Advanced, year-wise.
                  </p>
                </div>
              </div>

              {/* 5. PRIMARY CTA */}
              <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-7 sm:mt-9">
                <button
                  id="hero-cta-btn"
                  onClick={handleStartJourney}
                  className="group inline-flex items-center justify-center gap-2.5 min-h-[48px] px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer font-['Outfit']"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* 6. SUBTLE TAGLINE (Visible on desktop below CTA, or below image on mobile/tablet) */}
              <div
                id="hero-tagline-desktop"
                className="hidden lg:flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 mt-5 select-none"
              >
                <span className="text-slate-700">Better Practice</span>
                <span className="text-blue-500">&rarr;</span>
                <span className="text-slate-700">Higher Scores</span>
                <span className="text-blue-500">&rarr;</span>
                <span className="text-blue-700 font-bold underline decoration-blue-500 underline-offset-4">
                  Your Dream IIT
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN (DESKTOP) / IN-FLOW VISUAL (TABLET PORTRAIT & MOBILE) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center w-full mt-4 lg:mt-0">
              {/* Student Visual Card */}
              <div
                id="hero-student-card"
                className="relative w-full max-w-md sm:max-w-lg lg:max-w-none rounded-3xl bg-white border border-slate-200/90 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Educational Student Image */}
                <div className="relative w-full aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    id="hero-student-img"
                    src={studentImg}
                    alt="JEE Aspirant studying dedicatedly with physics and math notes"
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                    loading="eager"
                  />
                  {/* Subtle clean gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Overlaid Badge on bottom of image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold">
                      <GraduationCap className="w-4 h-4 text-blue-400" />
                      <span>Dedicated Preparation</span>
                    </div>
                    <div className="flex items-center gap-1 bg-blue-600/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs">
                      <span>Target JEE 2026-27</span>
                    </div>
                  </div>
                </div>

                {/* Micro-metrics bar below image */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
                  <div className="flex flex-col py-1">
                    <span className="text-base sm:text-lg font-black text-slate-900 font-['Outfit']">10,000+</span>
                    <span className="text-[11px] text-slate-500 font-medium">Curated Qs</span>
                  </div>
                  <div className="flex flex-col py-1 border-x border-slate-100">
                    <span className="text-base sm:text-lg font-black text-blue-600 font-['Outfit']">2015-24</span>
                    <span className="text-[11px] text-slate-500 font-medium">Real PYQs</span>
                  </div>
                  <div className="flex flex-col py-1">
                    <span className="text-base sm:text-lg font-black text-emerald-600 font-['Outfit']">100%</span>
                    <span className="text-[11px] text-slate-500 font-medium">Solutions</span>
                  </div>
                </div>
              </div>

              {/* Tagline display for Mobile & Tablet (placed cleanly below the image) */}
              <div
                id="hero-tagline-mobile"
                className="flex lg:hidden items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 mt-6 select-none text-center flex-wrap"
              >
                <span>Better Practice</span>
                <span className="text-blue-500">&rarr;</span>
                <span>Higher Scores</span>
                <span className="text-blue-500">&rarr;</span>
                <span className="text-blue-700 font-bold underline decoration-blue-500 underline-offset-4">
                  Your Dream IIT
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* STRUCTURED SUBJECT EXPLORER (Physics, Chemistry, Mathematics)           */}
      {/* ========================================================================= */}
      <section className="w-full py-12 sm:py-16 md:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div className="max-w-xl">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Comprehensive Syllabus
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] mt-1 tracking-tight">
                Master All 3 Core JEE Subjects
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Structured by Class 11 &amp; 12 syllabus, weighted by JEE Mains and Advanced exam patterns.
              </p>
            </div>
            <button
              onClick={handleStartJourney}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 self-start md:self-auto cursor-pointer"
            >
              <span>Explore Complete Question Bank</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Physics Card */}
            <div
              onClick={() => handleExploreSubject('Physics')}
              className="group p-6 rounded-2xl bg-[#fbfcfe] border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Physics
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    28 Chapters
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Mechanics, Electrodynamics, Optics, Modern Physics &amp; Thermodynamics with detailed diagrams.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Start Physics Practice</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Chemistry Card */}
            <div
              onClick={() => handleExploreSubject('Chemistry')}
              className="group p-6 rounded-2xl bg-[#fbfcfe] border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    Chemistry
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                    30 Chapters
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Physical, Organic, and Inorganic Chemistry with reaction mechanisms and periodic trends.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                <span>Start Chemistry Practice</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Mathematics Card */}
            <div
              onClick={() => handleExploreSubject('Mathematics')}
              className="group p-6 rounded-2xl bg-[#fbfcfe] border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Mathematics
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    26 Chapters
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Calculus, Coordinate Geometry, Vectors, Algebra &amp; Trigonometry with rigorous problem sets.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>Start Mathematics Practice</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3-STEP JEE METHODOLOGY                                                  */}
      {/* ========================================================================= */}
      <section className="w-full py-12 sm:py-16 md:py-20 bg-slate-50/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Proven Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] mt-1 tracking-tight">
              Designed For High-Percentile Consistency
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Every question in JEEVault is categorized into 3 progressive tiers to guarantee conceptual mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col items-start">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center mb-4 font-['Outfit']">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">1. Foundation &bull; Level 1</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Direct NCERT applications, formula drills, and standard JEE Mains single-concept questions to build speed and accuracy.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col items-start">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-white font-bold flex items-center justify-center mb-4 font-['Outfit']">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">2. Mastery &bull; Special 50</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Carefully selected top 50 challenging multi-concept problems per chapter that frequently appear in top percentile shifts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col items-start">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center mb-4 font-['Outfit']">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">3. Exam Temperament &bull; PYQs</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Official JEE Mains and JEE Advanced question papers with real exam timers, negative marking simulation, and step solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FINAL CALL TO ACTION (Clean, Minimal, Non-Cluttered)                     */}
      {/* ========================================================================= */}
      <section className="w-full py-12 sm:py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 font-['Outfit'] tracking-tight">
            Ready to Accelerate Your JEE Preparation?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mt-3">
            Join thousands of serious aspirants practicing structured questions daily.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStartJourney}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all cursor-pointer font-['Outfit']"
            >
              Start Your Journey &rarr;
            </button>
            {!isLoggedIn && (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-semibold text-sm transition-colors cursor-pointer"
              >
                Already have an account? Log in
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MINIMAL FOOTER                                                           */}
      {/* ========================================================================= */}
      <footer className="w-full bg-[#fafbfd] py-8 sm:py-10 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-['Outfit'] text-sm">JEEVault</span>
            <span>&bull;</span>
            <span>Study &bull; Practice &bull; Crack</span>
          </div>

          <div className="flex items-center gap-6">
            <span>JEE Mains &amp; Advanced 2026-27</span>
            <span>&bull;</span>
            <span>Physics &bull; Chemistry &bull; Mathematics</span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} JEEVault. Built for serious aspirants.
          </div>
        </div>
      </footer>
    </div>
  );
};
