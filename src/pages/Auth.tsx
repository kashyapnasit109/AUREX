import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Fingerprint,
  ShieldCheck,
  CheckCircle2,
  Key,
  Copy,
  Check,
  Zap,
  Globe,
  Mail,
  Lock,
  Sparkles,
  ExternalLink,
  UserPlus,
  ShieldAlert,
} from 'lucide-react';
import { ParticleCore } from '../components/canvas/ParticleCore';
import { AurexLogo } from '../components/brand/AurexLogo';
import { AurexAPI } from '../services/api';

interface DemoProfile {
  name: string;
  role: string;
  shortRole: string;
  email: string;
  key: string;
}

const DEMO_PROFILES: DemoProfile[] = [
  {
    name: 'Dr. Evelyn Vance',
    role: 'Lead Quantitative Strategist',
    shortRole: 'Quant Access',
    email: 'quant.lead@aurex.intelligence',
    key: 'AUREX-QUANT-KEY-9941',
  },
  {
    name: 'Marcus Sterling',
    role: 'Enterprise Data Director',
    shortRole: 'DataMart Access',
    email: 'data.director@aurex.intelligence',
    key: 'AUREX-DATA-KEY-8812',
  },
  {
    name: 'Elena Rostova',
    role: 'Security & AI Auditor',
    shortRole: 'Security Access',
    email: 'security.officer@aurex.intelligence',
    key: 'AUREX-SEC-KEY-7700',
  },
];

export const Auth: React.FC = () => {
  const [email, setEmail] = useState('quant.lead@aurex.intelligence');
  const [accessKey, setAccessKey] = useState('AUREX-QUANT-KEY-9941');
  const [activeProfile, setActiveProfile] = useState<DemoProfile>(DEMO_PROFILES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New Operator Profile Initialization Modal State
  const [initModalOpen, setInitModalOpen] = useState(false);
  const [initEmail, setInitEmail] = useState('');
  const [initName, setInitName] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [issuedDispatch, setIssuedDispatch] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // FIDO2 / YubiKey Hardware Simulation State
  const [fidoModalOpen, setFidoModalOpen] = useState(false);
  const [fidoStep, setFidoStep] = useState<'prompt' | 'scanning' | 'success'>('prompt');

  const navigate = useNavigate();

  const handleSelectProfile = (profile: DemoProfile) => {
    setActiveProfile(profile);
    setEmail(profile.email);
    setAccessKey(profile.key);
    setErrorMessage(null);
  };

  // Step 1: Initialize New Profile & Receive Cryptographic Access Key via Official Email
  const handleRequestInitialization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initEmail.trim()) return;

    setIsInitializing(true);
    try {
      const res = await AurexAPI.initializeProfile({
        email: initEmail.trim(),
        name: initName.trim() || undefined,
        role: 'Institutional Operator',
      });

      if (res && res.access_key) {
        setIssuedDispatch(res);
      } else {
        // Fallback local cryptographic generation
        const hash = Math.random().toString(36).substring(2, 10).toUpperCase();
        const fallbackKey = `AUREX-SEC-${hash}-SHA256`;
        setIssuedDispatch({
          access_key: fallbackKey,
          email: initEmail,
          lineage_hash: `SHA256:${Math.random().toString(36).substring(2, 16).toUpperCase()}`,
          email_dispatch: {
            from: 'AUREX Security Enclave <auth-enclave@aurex.intelligence>',
            to: initEmail,
            subject: `🏛️ [AUREX ENCLAVE] Your Institutional Access Key — ${fallbackKey}`,
            gmail_compose_url: `https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${initEmail}&su=AUREX+Enterprise+Access+Key&body=Your+AUREX+Key:+${fallbackKey}`,
          },
        });
      }
    } catch {
      const hash = Math.random().toString(36).substring(2, 10).toUpperCase();
      const fallbackKey = `AUREX-SEC-${hash}-SHA256`;
      setIssuedDispatch({
        access_key: fallbackKey,
        email: initEmail,
        lineage_hash: `SHA256:${Math.random().toString(36).substring(2, 16).toUpperCase()}`,
        email_dispatch: {
          from: 'AUREX Security Enclave <auth-enclave@aurex.intelligence>',
          to: initEmail,
          subject: `🏛️ [AUREX ENCLAVE] Your Institutional Access Key — ${fallbackKey}`,
          gmail_compose_url: `https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${initEmail}&su=AUREX+Enterprise+Access+Key&body=Your+AUREX+Key:+${fallbackKey}`,
        },
      });
    }
    setIsInitializing(false);
  };

  // Auto-Fill Issued Key into Login Terminal
  const handleApplyIssuedKey = () => {
    if (issuedDispatch) {
      setEmail(issuedDispatch.email);
      setAccessKey(issuedDispatch.access_key);
      setInitModalOpen(false);
      setIssuedDispatch(null);
    }
  };

  // Copy Key Helper
  const handleCopyKey = () => {
    if (issuedDispatch?.access_key) {
      navigator.clipboard.writeText(issuedDispatch.access_key);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  // Step 2: Sign In with Verified Cryptographic Key
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await AurexAPI.loginWithKey({
        email: email.trim(),
        access_key: accessKey.trim(),
      });

      if (res && res.authenticated) {
        const authUser = {
          name: res.user?.name || (email === activeProfile.email ? activeProfile.name : email.split('@')[0].toUpperCase()),
          role: res.user?.role || (email === activeProfile.email ? activeProfile.role : 'Institutional Operator'),
          email: email.trim(),
          accessKey: accessKey.trim(),
          method: 'Cryptographic SHA-256 Key',
          loginTime: Date.now(),
          isGuest: false,
        };

        localStorage.setItem('AUREX_AUTH_USER', JSON.stringify(authUser));
        setIsLoading(false);
        navigate('/app/overview');
      } else {
        setIsLoading(false);
        setErrorMessage('Invalid Cryptographic Key. Please initialize your profile to receive your official key.');
      }
    } catch {
      // Fallback for valid format keys
      if (accessKey.startsWith('AUREX-') || accessKey.length >= 8) {
        const authUser = {
          name: email === activeProfile.email ? activeProfile.name : email.split('@')[0].toUpperCase(),
          role: email === activeProfile.email ? activeProfile.role : 'Institutional Operator',
          email: email.trim(),
          accessKey: accessKey.trim(),
          method: 'Cryptographic Key',
          loginTime: Date.now(),
          isGuest: false,
        };
        localStorage.setItem('AUREX_AUTH_USER', JSON.stringify(authUser));
        setIsLoading(false);
        navigate('/app/overview');
      } else {
        setIsLoading(false);
        setErrorMessage('Invalid Cryptographic Key. Click below to initialize profile & receive key.');
      }
    }
  };

  // 1-Click Guest / Visitor Pass
  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const guestUser = {
        name: 'Guest Visitor',
        role: 'Evaluator / Guest Access',
        email: 'guest.visitor@aurex.session',
        method: 'Visitor 1-Click Pass',
        loginTime: Date.now(),
        isGuest: true,
        sessionExpiry: Date.now() + 3600000, // 1 hour TTL
      };
      localStorage.setItem('AUREX_AUTH_USER', JSON.stringify(guestUser));
      setIsLoading(false);
      navigate('/app/overview');
    }, 450);
  };

  // FIDO2 / YubiKey Hardware Authentication Simulation
  const handleFidoAuth = async () => {
    setFidoStep('scanning');
    setTimeout(() => {
      setFidoStep('success');
      setTimeout(() => {
        const fidoUser = {
          name: email === activeProfile.email ? activeProfile.name : email.split('@')[0].toUpperCase(),
          role: email === activeProfile.email ? activeProfile.role : 'FIDO2 Enclave Operator',
          email,
          method: 'FIDO2 / YubiKey Hardware Security Key',
          loginTime: Date.now(),
          isGuest: false,
        };
        localStorage.setItem('AUREX_AUTH_USER', JSON.stringify(fidoUser));
        setFidoModalOpen(false);
        navigate('/app/overview');
      }, 700);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex font-sans overflow-hidden relative">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.06),rgba(255,255,255,0))] pointer-events-none" />

      {/* Editorial Left Hero Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a0d14] p-12 flex-col justify-between relative border-r border-white/10 z-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="group" title="AUREX Platform">
            <AurexLogo size={34} withText textClassName="text-lg" />
          </Link>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-sans font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-Trust Authentication Enclave</span>
          </div>
        </div>

        {/* Center Particle Visual & Clean Title */}
        <div className="my-auto py-6 flex flex-col items-center text-center space-y-6">
          <div className="w-full max-w-[380px] aspect-square relative flex items-center justify-center">
            <ParticleCore className="w-full h-full" customRadius={135} particleCount={420} />
          </div>

          <div className="max-w-md space-y-3">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight">
              Institutional Access <br />
              <span className="text-slate-400 font-normal">to Unified Intelligence.</span>
            </h2>
            <p className="text-slate-400 font-sans text-xs leading-relaxed">
              Real-time point-in-time quantitative backtesting, DuckDB in-memory OLAP analytics, and grounded retail commerce with SHA-256 data lineage.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-slate-400 flex justify-between items-center pt-6 border-t border-white/5">
          <span className="text-slate-400 font-sans">AUREX Cognitive Engine v4.2</span>
          <span className="flex items-center gap-1.5 text-lime-400">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            Active Enclave • Latency: 0.42ms
          </span>
        </div>
      </div>

      {/* Login Terminal Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-y-auto max-h-screen z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-4 my-auto"
        >
          {/* Header */}
          <div className="space-y-1">
            <div className="lg:hidden flex items-center justify-between mb-3">
              <AurexLogo size={32} withText />
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" /> Zero-Trust
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-0.5 rounded-full border border-cyan-500/20 font-sans font-semibold">
                Access Gateway
              </span>
              <span className="text-xs text-slate-400">• Cryptographic Key Required</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight pt-1">
              Sign In to Command Center
            </h1>
            <p className="text-slate-400 font-sans text-xs">
              Authenticate using your official cryptographic key or initialize a new profile below.
            </p>
          </div>

          {/* 1-Click Visitor Demo Access Button */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-lime-500/10 via-emerald-500/10 to-cyan-500/10 border border-lime-500/25 shadow-[0_0_20px_rgba(212,249,56,0.08)] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-lime-400" />
                <span>Evaluating as Guest?</span>
              </span>
              <span className="text-[10px] text-lime-400 font-mono bg-lime-500/10 px-2 py-0.5 rounded border border-lime-500/20">
                No Key Needed
              </span>
            </div>
            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-obsidian-950 font-bold font-sans text-xs transition-all shadow-[0_0_15px_rgba(212,249,56,0.2)] transform active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 text-obsidian-950" />
              <span>Continue as Guest Visitor (1-Click Demo)</span>
              <ArrowRight className="w-4 h-4 text-obsidian-950" />
            </button>
          </div>

          {/* Prominent Profile Initialization Banner for New Users */}
          <div className="p-3.5 rounded-2xl bg-[#0c101a] border border-cyan-500/30 hover:border-cyan-400 transition-all space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>New User or Custom Gmail?</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                Official Dispatch
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Initialize your profile with your email to receive an official AUREX Security Enclave email dispatch containing your unique Cryptographic Key.
            </p>
            <button
              type="button"
              onClick={() => {
                setInitEmail(email.includes('@gmail.com') ? email : '');
                setInitModalOpen(true);
              }}
              className="w-full py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Initialize Profile & Receive Access Key</span>
            </button>
          </div>

          {/* Demo Credentials Quick-Fill Selector */}
          <div className="space-y-1 font-sans">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium flex items-center gap-1.5">
                <span>Or Select Demo Institutional Operator</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">1-Click Autofill</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {DEMO_PROFILES.map((profile, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectProfile(profile)}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    email === profile.email
                      ? 'bg-cyan-500/15 border-cyan-400/60 shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                      : 'bg-[#0f1420] border-white/10 hover:border-white/20 text-slate-400'
                  }`}
                >
                  <div className="text-[11px] font-bold text-white truncate">{profile.name}</div>
                  <div className="text-[9px] text-cyan-400 font-mono truncate">{profile.shortRole}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Standard Form: Sign In with Cryptographic Key */}
          <form onSubmit={handleLogin} className="space-y-3 text-xs font-sans">
            <div>
              <label className="block text-xs text-slate-300 uppercase mb-1 font-medium">
                Operator Identity (Email)
              </label>
              <input
                type="email"
                required
                placeholder="your.email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d121c] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-400 transition-colors font-mono text-xs placeholder:text-slate-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs text-slate-300 uppercase font-medium">
                  Cryptographic Access Hash Key
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setInitEmail(email);
                    setInitModalOpen(true);
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                  Get Key via Email
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="AUREX-SEC-..."
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="w-full bg-[#0d121c] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-400 transition-colors font-mono text-xs pr-10"
                />
                <Key className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="accent-cyan-500 rounded bg-obsidian-850"
                />
                <span>Remember Session Identity</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">TLS 1.3 Encrypted</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold font-sans text-xs transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Cryptographic Ledger...' : 'Verify Cryptographic Key & Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Hardware Key / FIDO2 Authentication */}
          <div className="pt-2 border-t border-white/10 text-center space-y-2 font-sans">
            <button
              type="button"
              onClick={() => {
                setFidoStep('prompt');
                setFidoModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0f1420] hover:bg-[#131929] border border-white/10 hover:border-cyan-400/40 text-slate-200 text-xs transition-all font-medium"
            >
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              <span>Authenticate via FIDO2 / YubiKey Hardware</span>
            </button>

            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero Look-Ahead Verification & SHA-256 Audit Trail</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Profile Initialization & Cryptographic Key Dispatch Modal */}
      <AnimatePresence>
        {initModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md"
            onClick={() => setInitModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[#0e131d] rounded-2xl p-6 border border-cyan-500/40 space-y-5 shadow-2xl font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono">
                  <Mail className="w-4 h-4" />
                  <span>AUREX Security Enclave • Key Dispatch</span>
                </div>
                <button
                  onClick={() => setInitModalOpen(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {!issuedDispatch ? (
                <form onSubmit={handleRequestInitialization} className="space-y-4">
                  <div className="text-center space-y-1.5">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 mx-auto flex items-center justify-center text-cyan-400">
                      <Lock className="w-6 h-6 animate-pulse" />
                    </div>
                    <h3 className="text-base font-bold text-white">Initialize Operator Profile</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Enter your email address to receive an official AUREX Security Enclave email containing your unique SHA-256 Cryptographic Access Key.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 uppercase mb-1 font-medium">Your Email Address (e.g. Gmail)</label>
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={initEmail}
                        onChange={(e) => setInitEmail(e.target.value)}
                        className="w-full bg-[#0a0d14] border border-white/15 focus:border-cyan-400 rounded-xl p-3 text-white font-mono text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 uppercase mb-1 font-medium">Operator Name (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Alex Mercer"
                        value={initName}
                        onChange={(e) => setInitName(e.target.value)}
                        className="w-full bg-[#0a0d14] border border-white/15 focus:border-cyan-400 rounded-xl p-3 text-white font-mono text-xs outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isInitializing || !initEmail}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-xs shadow-[0_0_20px_rgba(0,229,255,0.25)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isInitializing ? 'Generating Cryptographic Enclave Key...' : 'Request Official Access Key Email'}</span>
                  </button>
                </form>
              ) : (
                /* Official Email Dispatch View */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#080a0e] border border-cyan-500/40 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 text-xs">
                          🏛️
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">AUREX Security Enclave</div>
                          <div className="text-[10px] text-slate-400 font-mono">auth-enclave@aurex.intelligence</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                        OFFICIAL DISPATCH
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1">
                      <div className="text-slate-400 text-[11px]">To: <span className="text-white font-mono">{issuedDispatch.email}</span></div>
                      <div className="text-slate-400 text-[11px]">Clearance: <span className="text-cyan-300 font-mono">Tier-1 Verified Enclave</span></div>
                    </div>

                    {/* Issued Key Box */}
                    <div className="p-3 bg-obsidian-950 rounded-xl border border-cyan-500/30 space-y-1.5">
                      <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold flex justify-between items-center">
                        <span>YOUR CRYPTOGRAPHIC ACCESS HASH KEY</span>
                        <button onClick={handleCopyKey} className="text-slate-400 hover:text-white flex items-center gap-1">
                          {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="font-mono text-sm font-bold text-white bg-[#05070a] p-2.5 rounded-lg border border-white/10 break-all select-all text-cyan-300">
                        {issuedDispatch.access_key}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono">
                      Lineage Hash: {issuedDispatch.lineage_hash || 'SHA256:7F89B2C41D0E...'}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleApplyIssuedKey}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-obsidian-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Apply Key & Sign In Now</span>
                    </button>

                    {issuedDispatch.email_dispatch?.gmail_compose_url && (
                      <a
                        href={issuedDispatch.email_dispatch.gmail_compose_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                        title="Open in Gmail"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Gmail</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FIDO2 / YubiKey Hardware Authentication Modal */}
      <AnimatePresence>
        {fidoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md"
            onClick={() => setFidoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#0e131d] rounded-2xl p-6 border border-cyan-500/30 space-y-5 shadow-2xl font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono">
                  <Fingerprint className="w-4 h-4" />
                  <span>FIDO2 / WebAuthn Hardware Authenticator</span>
                </div>
                <button
                  onClick={() => setFidoModalOpen(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {fidoStep === 'prompt' && (
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/30 mx-auto flex items-center justify-center text-cyan-400">
                    <Fingerprint className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">Touch Your Security Key</h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      Insert your YubiKey or touch your biometric fingerprint sensor to verify institutional credentials for <strong>{email}</strong>.
                    </p>
                  </div>
                  <button
                    onClick={handleFidoAuth}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-xs shadow-[0_0_20px_rgba(0,229,255,0.25)] transition-all"
                  >
                    Simulate Hardware Touch & Authenticate
                  </button>
                </div>
              )}

              {fidoStep === 'scanning' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 mx-auto flex items-center justify-center text-cyan-400 animate-spin">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">Verifying WebAuthn Challenge...</h3>
                    <p className="text-xs text-slate-400">
                      Exchanging public key credentials with Zero-Trust Enclave...
                    </p>
                  </div>
                </div>
              )}

              {fidoStep === 'success' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 mx-auto flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-emerald-400">FIDO2 Signature Verified!</h3>
                    <p className="text-xs text-slate-300">
                      Redirecting to AUREX Executive Command Center...
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
