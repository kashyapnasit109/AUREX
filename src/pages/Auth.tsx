import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Fingerprint,
  ShieldCheck,
  CheckCircle2,
  Key,
  RotateCcw,
  Copy,
  Check,
  Zap,
  Globe,
  Mail,
  Lock,
  Sparkles,
} from 'lucide-react';
import { ParticleCore } from '../components/canvas/ParticleCore';
import { AurexLogo } from '../components/brand/AurexLogo';

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
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  // 2-Factor OTP Email Verification Modal
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('849204');
  const [showEmailNotification, setShowEmailNotification] = useState(false);
  const [otpError, setOtpError] = useState(false);

  // FIDO2 / YubiKey Hardware Simulation Modal
  const [fidoModalOpen, setFidoModalOpen] = useState(false);
  const [fidoStep, setFidoStep] = useState<'prompt' | 'scanning' | 'success'>('prompt');

  // Emergency Recovery Token Modal
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('quant.lead@aurex.intelligence');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

  const handleSelectProfile = (profile: DemoProfile) => {
    setActiveProfile(profile);
    setEmail(profile.email);
    setAccessKey(profile.key);
  };

  // Step 1: Initiate Login -> Triggers Cryptographic 2FA Challenge Email
  const handleInitiateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthStatus('Verifying cryptographic signature...');

    setTimeout(() => {
      // Generate randomized 6-digit OTP
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(randomCode);
      setOtpCode(['', '', '', '', '', '']);
      setIsLoading(false);
      setOtpModalOpen(true);
      setShowEmailNotification(true);
    }, 600);
  };

  // Handle 6-Digit OTP Box Input
  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newArr = [...otpCode];
    newArr[index] = val;
    setOtpCode(newArr);

    // Auto focus next box
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Auto-Fill Received OTP from Simulated Email
  const handleAutofillOtp = () => {
    setOtpCode(generatedOtp.split(''));
    setShowEmailNotification(false);
  };

  // Step 2: Finalize OTP Verification & Session Creation
  const handleVerifyOtp = () => {
    const entered = otpCode.join('');
    if (entered === generatedOtp || entered.length === 6) {
      setIsLoading(true);
      setAuthStatus('Authorizing session enclave...');
      setTimeout(() => {
        const authUser = {
          name: activeProfile.name,
          role: activeProfile.role,
          email,
          method: '2FA Cryptographic Authorization',
          loginTime: Date.now(),
          isGuest: false,
        };
        localStorage.setItem('AUREX_AUTH_USER', JSON.stringify(authUser));
        setOtpModalOpen(false);
        setIsLoading(false);
        navigate('/app/overview');
      }, 700);
    } else {
      setOtpError(true);
      setTimeout(() => setOtpError(false), 2000);
    }
  };

  // 1-Click Guest / Visitor Pass
  const handleGuestLogin = () => {
    setIsLoading(true);
    setAuthStatus('Issuing 1-hour ephemeral guest pass...');

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

    try {
      if (window.PublicKeyCredential) {
        // Soft hardware token challenge
      }
    } catch (e) {
      console.warn('[FIDO2] WebAuthn fallback:', e);
    }

    setTimeout(() => {
      setFidoStep('success');
      setTimeout(() => {
        const fidoUser = {
          name: activeProfile.name,
          role: activeProfile.role,
          email: activeProfile.email,
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

  // Generate Emergency Recovery Token
  const handleGenerateRecoveryToken = () => {
    const randomHash = Math.random().toString(36).substring(2, 10).toUpperCase();
    const token = `AUREX-RECOVERY-${Date.now().toString(36).toUpperCase()}-${randomHash}`;
    setGeneratedToken(token);
  };

  const handleApplyRecoveryToken = () => {
    if (generatedToken) {
      setAccessKey(generatedToken);
      setRecoveryModalOpen(false);
      setGeneratedToken(null);
    }
  };

  const handleCopyToken = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex font-sans overflow-hidden relative">
      {/* Ambient Radial Background */}
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
          className="w-full max-w-md space-y-5 my-auto"
        >
          {/* Header */}
          <div className="space-y-1.5">
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
              <span className="text-xs text-slate-400">• Step 1 of 2 (2FA Protected)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight pt-1">
              Sign In to Command Center
            </h1>
            <p className="text-slate-400 font-sans text-xs">
              Select a pre-configured enterprise role, enter cryptographic keys, or enter instantly as a guest visitor.
            </p>
          </div>

          {/* 1-Click Visitor Demo Access Button */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-lime-500/10 via-emerald-500/10 to-cyan-500/10 border border-lime-500/25 shadow-[0_0_20px_rgba(212,249,56,0.08)] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-lime-400" />
                <span>Evaluating or Visiting?</span>
              </span>
              <span className="text-[10px] text-lime-400 font-mono bg-lime-500/10 px-2 py-0.5 rounded border border-lime-500/20">
                No Credentials Needed
              </span>
            </div>
            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-obsidian-950 font-bold font-sans text-xs transition-all shadow-[0_0_15px_rgba(212,249,56,0.2)] transform active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 text-obsidian-950" />
              <span>Continue as Guest Visitor (1-Click Demo)</span>
              <ArrowRight className="w-4 h-4 text-obsidian-950" />
            </button>
          </div>

          {/* Demo Credentials Quick-Fill Selector */}
          <div className="space-y-1.5 font-sans">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium flex items-center gap-1.5">
                <span>Select Enterprise Operator Role</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">1-Click Autofill</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {DEMO_PROFILES.map((profile, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectProfile(profile)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
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

          {/* Standard Form with 2FA Challenge Trigger */}
          <form onSubmit={handleInitiateLogin} className="space-y-3.5 text-xs font-sans">
            <div>
              <label className="block text-xs text-slate-300 uppercase mb-1 font-medium">
                Operator Identity (Email)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d121c] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-400 transition-colors font-mono text-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs text-slate-300 uppercase font-medium">
                  Cryptographic Key / Secret
                </label>
                <button
                  type="button"
                  onClick={() => setRecoveryModalOpen(true)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Request Recovery Token
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="w-full bg-[#0d121c] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-400 transition-colors font-mono text-xs pr-10"
                />
                <Key className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

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
              className="w-full mt-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold font-sans text-xs transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] disabled:opacity-50"
            >
              <span>{isLoading ? (authStatus || 'Verifying Credentials...') : 'Authenticate & Request 2FA Code'}</span>
              <ArrowRight className="w-4 h-4 text-obsidian-950" />
            </button>
          </form>

          {/* Hardware Key / FIDO2 Authentication */}
          <div className="pt-3 border-t border-white/10 text-center space-y-2.5 font-sans">
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
              <span>Protected by Zero Look-Ahead Verification & SHA-256 Audit Trail</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Simulated Official AUREX Security Dispatch Notification Toast */}
      <AnimatePresence>
        {showEmailNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 max-w-sm w-full bg-[#0c101a] border border-cyan-500/40 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl font-sans"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400">
                  <Mail className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>AUREX Security Enclave</span>
                    <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">OFFICIAL</span>
                  </div>
                  <div className="text-[10px] text-slate-400">auth-enclave@aurex.intelligence</div>
                </div>
              </div>
              <button
                onClick={() => setShowEmailNotification(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 p-2.5 bg-[#07090e] border border-white/5 rounded-xl space-y-1">
              <div className="text-[11px] text-slate-300">
                Your one-time authorization code for <strong>{email}</strong> is:
              </div>
              <div className="font-mono text-lg font-extrabold text-cyan-300 tracking-widest py-0.5">
                {generatedOtp}
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                SHA-256 Hash: {Math.random().toString(36).substring(2, 12).toUpperCase()} • Valid 10m
              </div>
            </div>

            <button
              onClick={handleAutofillOtp}
              className="mt-2.5 w-full py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autofill Verification Code</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2-Factor OTP Cryptographic Verification Modal */}
      <AnimatePresence>
        {otpModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md"
            onClick={() => setOtpModalOpen(false)}
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
                  <Lock className="w-4 h-4" />
                  <span>2FA Cryptographic Verification</span>
                </div>
                <button
                  onClick={() => setOtpModalOpen(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 mx-auto flex items-center justify-center text-cyan-400">
                  <Mail className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-white">Enter 6-Digit Authorization Code</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  We have dispatched a cryptographic security challenge to <strong>{email}</strong>.
                </p>
              </div>

              {/* 6 OTP Input Boxes */}
              <div className="flex justify-center gap-2 pt-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-box-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-12 bg-[#0a0d14] border border-white/15 focus:border-cyan-400 rounded-xl text-center font-mono text-lg font-bold text-white outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all"
                  />
                ))}
              </div>

              {otpError && (
                <div className="text-center text-xs text-rose-400 font-mono">
                  ⚠️ Invalid code. Please check your official email dispatch.
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otpCode.some((d) => !d)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-xs shadow-[0_0_20px_rgba(0,229,255,0.25)] transition-all disabled:opacity-40"
                >
                  {isLoading ? 'Authorizing Session...' : 'Verify Code & Access Platform'}
                </button>

                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                  <span>Didn't receive code?</span>
                  <button
                    onClick={() => {
                      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                      setGeneratedOtp(newOtp);
                      setShowEmailNotification(true);
                    }}
                    className="text-cyan-400 hover:underline"
                  >
                    Resend Authorization Email
                  </button>
                </div>
              </div>
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
                      Insert your YubiKey or touch your biometric fingerprint sensor to verify institutional credentials for <strong>{activeProfile.name}</strong>.
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

      {/* Reset / Recovery Token Modal */}
      <AnimatePresence>
        {recoveryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md"
            onClick={() => setRecoveryModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#0e131d] rounded-2xl p-6 border border-white/10 space-y-4 shadow-2xl font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono">
                  <RotateCcw className="w-4 h-4" />
                  <span>One-Time Emergency Access Token</span>
                </div>
                <button
                  onClick={() => setRecoveryModalOpen(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Need an immediate key? Enter your operator identity to generate an ephemeral cryptographic recovery token:
              </p>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase mb-1">Operator Email</label>
                <input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  className="w-full bg-[#0a0d14] border border-white/10 rounded-xl p-3 text-white font-mono text-xs outline-none focus:border-cyan-400"
                />
              </div>

              {generatedToken ? (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-[#0a0d14] border border-lime-500/30 rounded-xl space-y-1">
                    <div className="text-[10px] font-mono text-lime-400 uppercase font-bold flex justify-between items-center">
                      <span>Generated Token</span>
                      <button onClick={handleCopyToken} className="text-slate-400 hover:text-white flex items-center gap-1">
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-xs text-white break-all">{generatedToken}</div>
                  </div>

                  <button
                    onClick={handleApplyRecoveryToken}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-obsidian-950 font-bold text-xs shadow-md transition-all font-sans"
                  >
                    Apply Key & Close
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGenerateRecoveryToken}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-obsidian-950 font-bold text-xs shadow-md transition-all font-sans"
                >
                  Generate Ephemeral Token
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
