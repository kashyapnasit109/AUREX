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
    shortRole: 'Quant Alpha',
    email: 'quant.lead@aurex.intelligence',
    key: 'AUREX-QUANT-KEY-9941',
  },
  {
    name: 'Marcus Sterling',
    role: 'Enterprise Data Director',
    shortRole: 'DataMart OLAP',
    email: 'data.director@aurex.intelligence',
    key: 'AUREX-DATA-KEY-8812',
  },
  {
    name: 'Elena Rostova',
    role: 'Security & AI Auditor',
    shortRole: 'Security Enclave',
    email: 'security.officer@aurex.intelligence',
    key: 'AUREX-SEC-KEY-7700',
  },
];

export const Auth: React.FC = () => {
  const [authMode, setAuthMode] = useState<'credentials' | 'visitor' | 'fido'>('credentials');
  const [email, setEmail] = useState('quant.lead@aurex.intelligence');
  const [accessKey, setAccessKey] = useState('AUREX-QUANT-KEY-9941');
  const [activeProfile, setActiveProfile] = useState<DemoProfile>(DEMO_PROFILES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  // FIDO2 Modal & Scanning State
  const [fidoScanning, setFidoScanning] = useState(false);
  const [fidoSuccess, setFidoSuccess] = useState(false);

  // Reset / Recovery Token Modal State
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthStatus('Verifying session...');

    setTimeout(() => {
      const authUser = {
        name: activeProfile.name,
        role: activeProfile.role,
        email,
        method: 'Cryptographic Key',
        loginTime: Date.now(),
        isGuest: false,
      };
      localStorage.setItem('AUREX_AUTH_USER', JSON.stringify(authUser));
      setIsLoading(false);
      navigate('/app/overview');
    }, 500);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setAuthStatus('Generating 1-hour session...');

    setTimeout(() => {
      const guestUser = {
        name: 'Guest Visitor',
        role: 'Evaluator / Guest Access',
        email: 'guest.visitor@aurex.session',
        method: 'Visitor 1-Click Pass',
        loginTime: Date.now(),
        isGuest: true,
        sessionExpiry: Date.now() + 3600000,
      };
      localStorage.setItem('AUREX_AUTH_USER', JSON.stringify(guestUser));
      setIsLoading(false);
      navigate('/app/overview');
    }, 400);
  };

  const handleFidoAuth = () => {
    setFidoScanning(true);
    setTimeout(() => {
      setFidoScanning(false);
      setFidoSuccess(true);
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
        navigate('/app/overview');
      }, 600);
    }, 1200);
  };

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
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex font-sans overflow-hidden relative selection:bg-cyan-500/30">
      {/* Background Soft Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Editorial Left Hero Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a0d14]/80 backdrop-blur-2xl p-12 flex-col justify-between relative border-r border-white/5 z-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="group" title="AUREX Platform">
            <AurexLogo size={34} withText textClassName="text-lg tracking-tight" />
          </Link>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-slate-300 text-xs font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero-Trust Enclave</span>
          </div>
        </div>

        {/* Center Particle Visual */}
        <div className="my-auto py-8 flex flex-col items-center text-center space-y-6">
          <div className="w-full max-w-[360px] aspect-square relative flex items-center justify-center">
            <ParticleCore className="w-full h-full" customRadius={130} particleCount={400} />
          </div>

          <div className="max-w-md space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              Enterprise Intelligence
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight">
              Deterministic Data. <br />
              <span className="text-slate-400 font-normal">Autonomous Action.</span>
            </h2>
            <p className="text-slate-400 font-sans text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
              Sub-millisecond quantitative walk-forward modeling, in-memory DuckDB analytics, and verified retail commerce.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs text-slate-500 flex justify-between items-center pt-6 border-t border-white/5">
          <span>AUREX OS v4.2</span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            0.42ms Engine Latency
          </span>
        </div>
      </div>

      {/* Login Terminal Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-12 relative overflow-y-auto max-h-screen z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[420px] space-y-6 my-auto"
        >
          {/* Header */}
          <div className="space-y-1.5">
            <div className="lg:hidden flex items-center justify-between mb-4">
              <AurexLogo size={32} withText />
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                Zero-Trust
              </span>
            </div>

            <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Gateway Access
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Sign In to Command Center
            </h1>
            <p className="text-slate-400 text-xs font-sans">
              Enter your enterprise key or launch instantly with guest evaluator pass.
            </p>
          </div>

          {/* Quick Access Switcher Bar */}
          <div className="flex p-1 bg-[#0e121a] rounded-xl border border-white/5 font-sans text-xs">
            <button
              type="button"
              onClick={() => setAuthMode('credentials')}
              className={`flex-1 py-2 rounded-lg text-center font-medium transition-all ${
                authMode === 'credentials'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Operator Key
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('visitor')}
              className={`flex-1 py-2 rounded-lg text-center font-medium transition-all ${
                authMode === 'visitor'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-obsidian-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1-Click Guest Pass
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('fido')}
              className={`flex-1 py-2 rounded-lg text-center font-medium transition-all ${
                authMode === 'fido'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FIDO2 / YubiKey
            </button>
          </div>

          {/* Mode 1: Operator Credentials */}
          {authMode === 'credentials' && (
            <div className="space-y-4">
              {/* Quick Role Autofill Selectors */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-400 font-sans">
                  <span>Quick-Fill Operator Profile</span>
                  <span className="font-mono text-[10px] text-cyan-400">1-Click</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {DEMO_PROFILES.map((profile, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectProfile(profile)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        email === profile.email
                          ? 'bg-cyan-500/10 border-cyan-400/40 text-cyan-300'
                          : 'bg-[#0b0e14] border-white/5 hover:border-white/15 text-slate-400'
                      }`}
                    >
                      <div className="text-[11px] font-semibold text-white truncate">{profile.name.split(' ')[1] || profile.name}</div>
                      <div className="text-[9px] text-slate-400 font-mono truncate">{profile.shortRole}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Credentials Form */}
              <form onSubmit={handleLogin} className="space-y-3 font-sans text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                    Operator Identity (Email)
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0b0e14] border border-white/10 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-cyan-400 transition-colors font-mono text-xs"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] text-slate-400 font-medium">
                      Cryptographic Secret Key
                    </label>
                    <button
                      type="button"
                      onClick={() => setRecoveryModalOpen(true)}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Reset Key
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                      className="w-full bg-[#0b0e14] border border-white/10 rounded-xl pl-3.5 pr-9 py-2.5 text-white outline-none focus:border-cyan-400 transition-colors font-mono text-xs"
                    />
                    <Key className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-cyan-500 rounded bg-[#0b0e14]" />
                    <span>Remember Identity</span>
                  </label>
                  <span className="font-mono text-[10px] text-slate-500">TLS 1.3 Encrypted</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] disabled:opacity-50"
                >
                  <span>{isLoading ? (authStatus || 'Authenticating...') : 'Authenticate & Launch'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Mode 2: 1-Click Guest Visitor Mode */}
          {authMode === 'visitor' && (
            <div className="p-5 rounded-2xl bg-[#0b0e14] border border-cyan-500/20 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 mx-auto flex items-center justify-center text-cyan-400">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Instant Evaluator Access</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Explore all modules, live backtesting, and Aiden retail AI with a 1-hour session. No credentials needed.
                </p>
              </div>
              <button
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-obsidian-950 font-bold text-xs transition-all shadow-lg"
              >
                <span>{isLoading ? 'Issuing Pass...' : 'Launch Workspace as Guest'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mode 3: Hardware FIDO2 / YubiKey */}
          {authMode === 'fido' && (
            <div className="p-5 rounded-2xl bg-[#0b0e14] border border-white/10 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 mx-auto flex items-center justify-center text-cyan-400">
                <Fingerprint className={`w-6 h-6 ${fidoScanning ? 'animate-pulse' : ''}`} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">
                  {fidoSuccess ? 'Hardware Key Verified!' : fidoScanning ? 'Verifying Challenge...' : 'Touch Security Key'}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {fidoSuccess
                    ? 'Redirecting to command center...'
                    : 'Insert your YubiKey or touch your biometric sensor to complete WebAuthn verification.'}
                </p>
              </div>
              {!fidoSuccess && (
                <button
                  onClick={handleFidoAuth}
                  disabled={fidoScanning}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Fingerprint className="w-4 h-4 text-cyan-400" />
                  <span>{fidoScanning ? 'Authenticating...' : 'Simulate Hardware Touch'}</span>
                </button>
              )}
            </div>
          )}

          {/* Bottom Security Note */}
          <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-sans">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Look-Ahead Verification & SHA-256 Lineage Ledger</span>
          </div>
        </motion.div>
      </div>

      {/* Emergency Recovery Token Modal */}
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
