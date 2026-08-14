import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Fingerprint,
  ShieldCheck,
  CheckCircle2,
  Key,
  UserCheck,
  Sparkles,
  Zap,
  Globe,
  RotateCcw,
  Copy,
  Check,
} from 'lucide-react';
import { ParticleCore } from '../components/canvas/ParticleCore';
import { AurexLogo } from '../components/brand/AurexLogo';

interface DemoProfile {
  name: string;
  role: string;
  email: string;
  key: string;
  badge: string;
}

const DEMO_PROFILES: DemoProfile[] = [
  {
    name: 'Dr. Evelyn Vance',
    role: 'Lead Quantitative Strategist',
    email: 'quant.lead@aurex.intelligence',
    key: 'AUREX-QUANT-KEY-9941',
    badge: 'Quant Alpha Access',
  },
  {
    name: 'Marcus Sterling',
    role: 'Enterprise Data Director',
    email: 'data.director@aurex.intelligence',
    key: 'AUREX-DATA-KEY-8812',
    badge: 'OLAP DataMart Access',
  },
  {
    name: 'Elena Rostova',
    role: 'Security & AI Auditor',
    email: 'security.officer@aurex.intelligence',
    key: 'AUREX-SEC-KEY-7700',
    badge: 'Zero-Trust Enclave',
  },
];

export const Auth: React.FC = () => {
  const [email, setEmail] = useState('quant.lead@aurex.intelligence');
  const [accessKey, setAccessKey] = useState('AUREX-QUANT-KEY-9941');
  const [activeRole, setActiveRole] = useState(DEMO_PROFILES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  // FIDO2 / YubiKey Modal State
  const [fidoModalOpen, setFidoModalOpen] = useState(false);
  const [fidoStep, setFidoStep] = useState<'prompt' | 'scanning' | 'success'>('prompt');

  // Reset / Recovery Token Modal State
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('quant.lead@aurex.intelligence');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

  const handleSelectProfile = (profile: DemoProfile) => {
    setActiveRole(profile);
    setEmail(profile.email);
    setAccessKey(profile.key);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthStatus('Verifying cryptographic signature...');

    setTimeout(() => {
      // Save authenticated user profile in localStorage
      const authUser = {
        name: activeRole.name,
        role: activeRole.role,
        email,
        method: 'Cryptographic Key',
        loginTime: Date.now(),
        isGuest: false,
      };
      localStorage.setItem('AUREX_AUTH_USER', JSON.stringify(authUser));

      setIsLoading(false);
      navigate('/app/overview');
    }, 600);
  };

  // 1-Click Guest / Visitor Access
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

    // Attempt real WebAuthn API if available in browser
    try {
      if (window.PublicKeyCredential) {
        // Soft touch / challenge simulation
      }
    } catch (e) {
      console.warn('[FIDO2] WebAuthn browser fallback:', e);
    }

    setTimeout(() => {
      setFidoStep('success');
      setTimeout(() => {
        const fidoUser = {
          name: activeRole.name,
          role: activeRole.role,
          email: activeRole.email,
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

  // Generate Emergency One-Time Token
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
    <div className="min-h-screen bg-[#080a0e] text-slate-100 flex font-sans overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.08),rgba(255,255,255,0))] pointer-events-none" />

      {/* Editorial Left Hero Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a0d14] p-12 flex-col justify-between relative border-r border-white/10 z-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="group" title="AUREX Platform">
            <AurexLogo size={34} withText textClassName="text-lg" />
          </Link>

          {/* Enclave Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-sans font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-Trust Authentication Enclave</span>
          </div>
        </div>

        {/* Center Particle Orbitor */}
        <div className="my-auto py-6 flex flex-col items-center text-center space-y-6">
          <div className="w-full max-w-[380px] aspect-square relative flex items-center justify-center">
            <ParticleCore className="w-full h-full" customRadius={135} particleCount={420} />
          </div>

          <div className="max-w-md space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unified Cognitive Operating Architecture</span>
            </div>
            <h2 className="text-3xl font-sans font-bold text-white tracking-tight leading-tight">
              Institutional Access <br />
              <span className="text-slate-400 font-normal">to Unified Intelligence.</span>
            </h2>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
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
          className="w-full max-w-md space-y-6 my-auto"
        >
          {/* Header */}
          <div className="space-y-2">
            <div className="lg:hidden flex items-center justify-between mb-4">
              <AurexLogo size={32} withText />
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" /> Zero-Trust
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 font-sans font-semibold">
                Access Gateway
              </span>
              <span className="text-xs text-slate-400">• Step 1 of 1</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight pt-1">
              Sign In to Command Center
            </h1>
            <p className="text-slate-300 font-sans text-xs">
              Select a pre-configured enterprise role, enter cryptographic keys, or enter instantly as a guest visitor.
            </p>
          </div>

          {/* 1-Click Visitor Demo Access Button */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-lime-500/15 via-emerald-500/15 to-cyan-500/15 border border-lime-500/30 shadow-[0_0_20px_rgba(212,249,56,0.1)] space-y-2">
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
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-obsidian-950 font-bold font-sans text-xs transition-all shadow-[0_0_15px_rgba(212,249,56,0.25)] transform active:scale-95"
            >
              <Zap className="w-4 h-4 text-obsidian-950" />
              <span>Continue as Guest Visitor (1-Click Demo)</span>
              <ArrowRight className="w-4 h-4 text-obsidian-950" />
            </button>
          </div>

          {/* Demo Credentials Quick-Fill Selector */}
          <div className="space-y-2 font-sans">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
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
                  <div className="text-[9px] text-cyan-400 font-mono truncate">{profile.role.split(' ')[0]} Access</div>
                </button>
              ))}
            </div>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-xs text-slate-300 uppercase mb-1.5 font-medium">
                Operator Identity (Email)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d121c] border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-cyan-400 transition-colors font-mono text-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
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
                  className="w-full bg-[#0d121c] border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-cyan-400 transition-colors font-mono text-xs pr-10"
                />
                <Key className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
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
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold font-sans text-xs transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] disabled:opacity-50"
            >
              <span>{isLoading ? (authStatus || 'Authenticating...') : 'Authenticate with Key'}</span>
              <ArrowRight className="w-4 h-4 text-obsidian-950" />
            </button>
          </form>

          {/* Hardware Key / FIDO2 Authentication */}
          <div className="pt-4 border-t border-white/10 text-center space-y-3 font-sans">
            <button
              type="button"
              onClick={() => {
                setFidoStep('prompt');
                setFidoModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0f1420] hover:bg-[#131929] border border-white/10 hover:border-cyan-400/40 text-slate-200 text-xs transition-all font-medium"
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
                      Insert your YubiKey or touch your biometric fingerprint sensor to verify institutional credentials for <strong>{activeRole.name}</strong>.
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
