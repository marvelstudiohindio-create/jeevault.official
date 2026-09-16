import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mail,
  ArrowRight,
  Lock,
  User,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  BookOpen,
  GraduationCap,
  Sparkles,
  Atom,
  Check,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    loginWithEmail,
    loginWithGoogle,
    resetPassword,
  } = useApp();

  // Local state
  const [internalMode, setInternalMode] = useState<'login' | 'signup' | 'forgot'>(authMode);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Keep internal mode in sync with context when modal opens or authMode changes
  React.useEffect(() => {
    if (isAuthModalOpen) {
      setInternalMode(authMode);
      setErrorMessage('');
      setSuccessMessage('');
      setPassword('');
      setConfirmPassword('');
    }
  }, [isAuthModalOpen, authMode]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const switchMode = (newMode: 'login' | 'signup' | 'forgot') => {
    setInternalMode(newMode);
    if (newMode === 'login' || newMode === 'signup') {
      setAuthMode(newMode);
    }
    setErrorMessage('');
    setSuccessMessage('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Handle Forgot Password flow
    if (internalMode === 'forgot') {
      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        return;
      }
      setIsLoading(true);
      try {
        const res = await resetPassword(email);
        if (res.success) {
          setSuccessMessage(res.message || 'Password reset link sent to your email.');
        } else {
          setErrorMessage(res.error || 'Unable to send password reset link.');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to send reset link.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Validation for Login and Signup
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (internalMode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }

      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);

    try {
      const isSignUp = internalMode === 'signup';
      const res = await loginWithEmail(
        email.trim(),
        password,
        isSignUp ? fullName.trim() : undefined,
        isSignUp
      );

      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
      } else {
        // Success - modal is automatically closed by AppContext, or close it here
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setErrorMessage(res.error || 'Google Authentication failed.');
      } else {
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google Auth encountered an error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Modal Card Container */}
      <div
        id="auth-modal-card"
        className="relative w-full max-w-md md:max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col md:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ============================================================ */}
        {/* LEFT SIDE: Educational JEE Theme (Desktop & Tablet only)   */}
        {/* ============================================================ */}
        <div className="hidden md:flex md:w-5/12 lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900 p-8 lg:p-10 flex-col justify-between relative overflow-hidden text-white select-none">
          {/* Subtle Background Academic Grids & Glows */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          {/* Top Brand Identity */}
          <div className="relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner">
                <svg
                  viewBox="0 0 32 32"
                  className="w-5 h-5 fill-none stroke-current"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 4 L28 25 L4 25 Z" />
                  <circle cx="16" cy="18" r="3" fill="currentColor" />
                </svg>
              </div>
              <div>
                <div className="flex items-baseline leading-none">
                  <span className="text-2xl font-black font-['Outfit'] text-white tracking-tight">
                    JEE
                  </span>
                  <span className="text-2xl font-black font-['Outfit'] text-blue-200 tracking-tight">
                    Vault
                  </span>
                </div>
                <span className="text-[10px] font-bold text-blue-200/80 tracking-widest uppercase font-mono mt-0.5 block">
                  SINCE 2026
                </span>
              </div>
            </div>

            {/* Motivational Tagline */}
            <div className="mt-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-blue-100 backdrop-blur-sm mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Premier JEE Preparation Platform
              </span>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight font-['Outfit']">
                Your JEE Journey Starts Here
              </h2>
              <p className="text-sm text-blue-100/90 mt-2 leading-relaxed font-normal">
                Study smarter. Practice better. Crack JEE with confidence.
              </p>
            </div>
          </div>

          {/* Center Educational Composition */}
          <div className="relative z-10 my-6">
            {/* Visual Formula & Topic Badges */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center shrink-0 text-blue-200">
                  <Atom className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-bold flex items-center justify-between">
                    <span>Physics & Mechanics</span>
                    <span className="font-mono text-[11px] text-blue-200">F = dp/dt</span>
                  </div>
                  <span className="text-[11px] text-blue-100/70">100% Concept-tested PYQs</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-200">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-bold flex items-center justify-between">
                    <span>Mathematics & Calculus</span>
                    <span className="font-mono text-[11px] text-indigo-200">∫ f(x) dx</span>
                  </div>
                  <span className="text-[11px] text-blue-100/70">Step-by-step verified solutions</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-200">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-bold flex items-center justify-between">
                    <span>Chemistry Modules</span>
                    <span className="font-mono text-[11px] text-emerald-200">pH = -log[H+]</span>
                  </div>
                  <span className="text-[11px] text-blue-100/70">Organic, Inorganic & Physical</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Highlights */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-blue-100">
            <div className="flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-emerald-300" />
              <span>10,000+ Curated PYQs</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Full Mains & Advanced</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT SIDE: Clean Authentication Form (Desktop, Tablet, Mobile) */}
        {/* ============================================================ */}
        <div className="w-full md:w-7/12 lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-y-auto">
          <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto">
            {/* Mobile / Header Brand */}
            <div className="flex items-center justify-between mb-5 md:mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                  <svg
                    viewBox="0 0 32 32"
                    className="w-4 h-4 fill-none stroke-current"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 4 L28 25 L4 25 Z" />
                    <circle cx="16" cy="18" r="3" fill="currentColor" />
                  </svg>
                </div>
                <div className="flex items-baseline">
                  <span className="text-xl font-black font-['Outfit'] text-blue-600 tracking-tight">
                    JEE
                  </span>
                  <span className="text-xl font-black font-['Outfit'] text-slate-900 tracking-tight">
                    Vault
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono bg-slate-100 px-2.5 py-1 rounded-md">
                SINCE 2026
              </span>
            </div>

            {/* Heading & Subtitle */}
            <div className="mb-6">
              {internalMode === 'login' && (
                <>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
                    Welcome Back!
                  </h1>
                  <p className="text-sm text-slate-500 mt-1.5">
                    Sign in to continue your JEE journey.
                  </p>
                </>
              )}

              {internalMode === 'signup' && (
                <>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
                    Create Your Account
                  </h1>
                  <p className="text-sm text-slate-500 mt-1.5">
                    Start your JEE preparation journey with JEEVault.
                  </p>
                </>
              )}

              {internalMode === 'forgot' && (
                <>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
                    Reset Your Password
                  </h1>
                  <p className="text-sm text-slate-500 mt-1.5">
                    Enter your registered email to receive a password reset link.
                  </p>
                </>
              )}
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div
                id="auth-error-alert"
                className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-150"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span className="flex-1 font-medium leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div
                id="auth-success-alert"
                className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-150"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span className="flex-1 font-medium leading-relaxed">{successMessage}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name field (Sign Up only) */}
              {internalMode === 'signup' && (
                <div>
                  <label
                    htmlFor="auth-fullname"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      id="auth-fullname"
                      type="text"
                      required
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Imtiaz Ahmed"
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Address field */}
              <div>
                <label
                  htmlFor="auth-email"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    id="auth-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                  />
                </div>
              </div>

              {/* Password field (Login and Signup) */}
              {internalMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="auth-password"
                      className="text-xs font-semibold text-slate-700"
                    >
                      Password
                    </label>
                    {internalMode === 'login' && (
                      <button
                        type="button"
                        id="auth-forgot-password-link"
                        onClick={() => switchMode('forgot')}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete={internalMode === 'login' ? 'current-password' : 'new-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-12 pl-10 pr-11 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                    />
                    <button
                      type="button"
                      id="auth-toggle-pwd-visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password field (Sign Up only) */}
              {internalMode === 'signup' && (
                <div>
                  <label
                    htmlFor="auth-confirm-password"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      id="auth-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-12 pl-10 pr-11 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                    />
                    <button
                      type="button"
                      id="auth-toggle-confirm-pwd-visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 font-['Outfit']"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Please wait...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {internalMode === 'login' && 'Sign In'}
                      {internalMode === 'signup' && 'Create Account'}
                      {internalMode === 'forgot' && 'Send Reset Link'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Social Divider & Google Button (Not shown for forgot password) */}
            {internalMode !== 'forgot' && (
              <>
                <div className="flex items-center my-4 sm:my-5">
                  <div className="flex-1 border-t border-slate-200" />
                  <span className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    OR
                  </span>
                  <div className="flex-1 border-t border-slate-200" />
                </div>

                <button
                  id="auth-google-btn"
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-semibold text-sm transition-all flex items-center justify-center gap-3 shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </>
            )}

            {/* Bottom Mode Switcher */}
            <div className="mt-5 text-center text-xs sm:text-sm">
              {internalMode === 'login' && (
                <p className="text-slate-600 font-medium">
                  Don't have an account?{' '}
                  <button
                    id="auth-switch-to-signup"
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    Sign Up →
                  </button>
                </p>
              )}

              {internalMode === 'signup' && (
                <p className="text-slate-600 font-medium">
                  Already have an account?{' '}
                  <button
                    id="auth-switch-to-login"
                    type="button"
                    onClick={() => switchMode('login')}
                    className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    Sign In →
                  </button>
                </p>
              )}

              {internalMode === 'forgot' && (
                <button
                  id="auth-back-to-login"
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  ← Back to Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
