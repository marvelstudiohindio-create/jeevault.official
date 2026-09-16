import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Crown,
  CheckCircle2,
  HelpCircle,
  CreditCard,
  Sparkles,
  FileText,
  Shield,
  Send,
  MessageSquare,
  Lock,
  Zap,
  LogOut,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SettingsPage: React.FC = () => {
  const {
    currentUser,
    upgradePlan,
    submitSupportTicket,
    supportTickets,
    logout,
  } = useApp();

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'plans' | 'support'>('plans');

  const handleUpgrade = (plan: 'Standard' | 'Standard Pro') => {
    upgradePlan(plan);
    try {
      confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    submitSupportTicket(ticketSubject, ticketMessage);
    setTicketSubject('');
    setTicketMessage('');
    setTicketSuccess(true);
    setTimeout(() => setTicketSuccess(false), 5000);
  };

  const currentPlan = currentUser?.plan || 'Free';

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-br from-[#0c0d2b] via-[#120f3e] to-[#0a0822] text-white p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* Header matching screenshot */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Account Management
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-white">
            Settings & Subscription
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 mt-1">
            Manage your subscription tiers, unlock JEEVault Special 50 & PDFs, and connect with 24/7 academic support.
          </p>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#13153c] border border-indigo-900/60 w-fit flex-wrap">
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'plans'
                ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Subscription Plans
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'support'
                ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Customer Support
          </button>
        </div>

        {activeTab === 'plans' && (
          <div className="flex flex-col gap-6">
            {/* Current Active Plan Status Banner */}
            <div className="p-4 sm:p-6 rounded-3xl bg-[#141644]/90 border-2 border-indigo-800/60 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/30">
                  <Crown className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-purple-300 uppercase tracking-widest block">
                    Current Active Membership
                  </span>
                  <h3 className="text-xl font-extrabold text-white">
                    {currentPlan === 'Standard Pro'
                      ? '⭐ Standard Pro (Full Special 50 & PDF Codex Active)'
                      : currentPlan === 'Standard'
                      ? '📘 Standard Membership (₹49/Year)'
                      : 'Free Trial Edition'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                  Status: Active
                </span>
              </div>
            </div>

            {/* Plans Grid matching requirement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plan 1: Standard (₹49/year) */}
              <div
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-xl border-2 transition-all ${
                  currentPlan === 'Standard'
                    ? 'border-cyan-400 bg-indigo-950/60 shadow-[0_0_40px_rgba(6,182,212,0.25)]'
                    : 'border-indigo-900/60 bg-[#12143b]/60 hover:border-indigo-700'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      Essential Prep
                    </span>
                    {currentPlan === 'Standard' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/40">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-black font-['Outfit'] text-white">
                    Standard
                  </h3>
                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-4xl font-black text-white">₹49</span>
                    <span className="text-xs font-medium text-slate-400">/year</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    Ideal for students looking for structured chapter-wise drill tests and foundational practice.
                  </p>

                  <div className="space-y-3 border-t border-indigo-900/60 pt-6">
                    <div className="flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Full access to 10,000+ JEE Mains questions</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Level 1, Level 2, and Level 3 Chapter Sets</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Performance trend & accuracy analytics</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Standard answer keys & solutions</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-slate-500">
                      <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                      <span>JEEVault Special 50 questions (Pro only)</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-slate-500">
                      <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                      <span>Direct In-App PDF view & offline notes</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => handleUpgrade('Standard')}
                    disabled={currentPlan === 'Standard'}
                    className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      currentPlan === 'Standard'
                        ? 'bg-indigo-950 text-slate-400 border border-indigo-800/60 cursor-default'
                        : 'bg-indigo-900/80 hover:bg-indigo-800 text-white border border-indigo-700'
                    }`}
                  >
                    {currentPlan === 'Standard' ? 'Current Active Tier' : 'Choose Standard (₹49/yr)'}
                  </button>
                </div>
              </div>

              {/* Plan 2: Standard Pro (₹99/year) matching user requirement */}
              <div
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-xl border-2 transition-all ${
                  currentPlan === 'Standard Pro'
                    ? 'border-fuchsia-400 bg-purple-950/70 shadow-[0_0_50px_rgba(217,70,239,0.35)]'
                    : 'border-fuchsia-500/60 bg-gradient-to-b from-[#1d1045] to-[#120b33] shadow-2xl'
                }`}
              >
                {/* Recommended Badge */}
                <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  RECOMMENDED
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono font-bold text-fuchsia-300 uppercase tracking-wider">
                      Rank Booster Pro
                    </span>
                  </div>

                  <h3 className="text-2xl font-black font-['Outfit'] text-white flex items-center gap-2">
                    Standard Pro
                    <Crown className="w-5 h-5 text-yellow-400" />
                  </h3>
                  <div className="flex items-baseline gap-1 my-3">
                    <span className="text-4xl font-black text-white">₹99</span>
                    <span className="text-xs font-medium text-slate-300">/year</span>
                  </div>
                  <p className="text-xs text-purple-200/90 leading-relaxed mb-6">
                    The complete arsenal: Includes the famous JEEVault Special 50 question sets and full in-app PDF codex.
                  </p>

                  <div className="space-y-3 border-t border-purple-900/60 pt-6">
                    <div className="flex items-start gap-2.5 text-xs text-purple-100 font-semibold">
                      <Sparkles className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
                      <span>Access JEEVault Special 50 Curated Master Questions</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-purple-100 font-semibold">
                      <FileText className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                      <span>Direct In-App PDF View & Formula Codex</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-purple-200">
                      <CheckCircle2 className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
                      <span>All JEE Mains & Advanced Chapter Questions</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-purple-200">
                      <CheckCircle2 className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
                      <span>10-Year Authenticated PYQs (2015-2024)</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-purple-200">
                      <CheckCircle2 className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
                      <span>Priority 24/7 Academic Mentor Support</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => handleUpgrade('Standard Pro')}
                    disabled={currentPlan === 'Standard Pro'}
                    id="btn-upgrade-pro"
                    className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      currentPlan === 'Standard Pro'
                        ? 'bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-700/50 cursor-default'
                        : 'bg-gradient-to-r from-fuchsia-600 via-pink-600 to-purple-600 hover:brightness-110 text-white shadow-lg shadow-fuchsia-600/40 hover:scale-[1.02]'
                    }`}
                  >
                    {currentPlan === 'Standard Pro' ? 'Active Membership ⭐' : 'Upgrade to Standard Pro (₹99/yr)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          /* Customer Support Form matching user requirement */
          <div className="rounded-3xl bg-[#131540]/80 border-2 border-indigo-900/60 p-6 sm:p-8 backdrop-blur-2xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-2xl bg-blue-600/20 text-cyan-300 border border-blue-500/30">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-['Outfit'] text-white">
                  Customer Support & Doubt Desk
                </h3>
                <p className="text-xs text-purple-300/80">
                  Have a question regarding subscription, question error, or academic guidance? Our team answers within 2 hours.
                </p>
              </div>
            </div>

            {ticketSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold mb-6 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Ticket registered successfully! Our academic support manager will reach you via registered email.</span>
              </div>
            )}

            <form onSubmit={handleSupportSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Issue Topic / Subject
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Question error in Rotation Motion / Subscription upgrade help"
                  className="w-full px-4 py-2.5 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Message Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Provide complete details so we can resolve your issue rapidly..."
                  className="w-full p-4 rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  id="support-submit-btn"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Support Ticket</span>
                </button>
              </div>
            </form>

            {/* Existing Tickets */}
            {supportTickets.length > 0 && (
              <div className="mt-8 border-t border-indigo-900/60 pt-6">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 mb-3">
                  Your Recent Support Tickets
                </h4>
                <div className="space-y-2">
                  {supportTickets.map((st) => (
                    <div
                      key={st.id}
                      className="p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-800/40 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white block">{st.subject}</span>
                        <span className="text-[11px] text-slate-400">{st.message}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {st.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Account Session & Sign Out Section */}
        <div className="rounded-3xl bg-[#121438]/80 border-2 border-indigo-900/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Active Session</h4>
              <p className="text-xs text-slate-400">
                Logged in as <span className="text-slate-200 font-medium">{currentUser?.email || 'Student'}</span> ({currentUser?.role === 'admin' ? 'Administrator' : 'Student'})
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            id="settings-btn-signout"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 hover:text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of JEEVault</span>
          </button>
        </div>
      </div>
    </div>
  );
};
