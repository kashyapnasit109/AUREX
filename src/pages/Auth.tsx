import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Fingerprint,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ParticleCore } from '../components/canvas/ParticleCore';
import { AurexLogo } from '../components/brand/AurexLogo';

export const Auth: React.FC = () => {
  const [email, setEmail] = useState('operator@aurex.intelligence');
  const [accessKey, setAccessKey] = useState('••••••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/app/overview');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-obsidian-900 text-slate-100 flex font-sans overflow-hidden bg-grain">
      {/* Editorial Left Hero Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-obsidian-950 p-12 flex-col justify-between relative border-r border-white/10">
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="group" title="AUREX Platform">
            <AurexLogo size={34} withText textClassName="text-lg" />
          </Link>

          {/* Theme-Matching Enclave Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-sans font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enclave: Isolated & Encrypted</span>
          </div>
        </div>

        {/* Well-Proportioned Center Particle Orbitor */}
        <div className="relative z-10 my-auto py-8 flex flex-col items-center text-center space-y-6">
          <div className="w-full max-w-[420px] aspect-square relative flex items-center justify-center">
            <ParticleCore className="w-full h-full" customRadius={140} particleCount={480} />
          </div>

          <div className="max-w-md space-y-3">
            <h2 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight leading-tight">
              Institutional Access <br />
              <span className="text-slate-400 font-normal">to Unified Intelligence.</span>
            </h2>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              Strict role-based access for quantitative strategists, enterprise data architects, and executive officers.
            </p>
          </div>
        </div>

        <div className="relative z-10 font-mono text-xs text-slate-400 flex justify-between items-center pt-6 border-t border-white/5">
          <span>AUREX Cognitive Shell v4.2</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
            Latency: 0.42ms
          </span>
        </div>
      </div>

      {/* Login Terminal Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Header */}
          <div className="space-y-2">
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <AurexLogo size={32} withText />
            </div>

            <span className="text-xs uppercase tracking-wider text-lime-400 bg-lime-500/10 px-3 py-1 rounded-full border border-lime-500/20 font-sans font-semibold">
              Authentication Enclave
            </span>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight pt-2">
              Sign In to Command Center
            </h1>
            <p className="text-slate-300 font-sans text-xs sm:text-sm">
              Enter authorized enterprise credentials or authenticate with FIDO2 / Biometrics.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-xs text-slate-300 uppercase mb-1.5 font-medium">
                Operator Identity (Email / ID)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-obsidian-850 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-lime-500 transition-colors font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 uppercase mb-1.5 font-medium">
                Cryptographic Key / Secret
              </label>
              <input
                type="password"
                required
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full bg-obsidian-850 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-lime-500 transition-colors font-mono text-xs"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="accent-lime-500 rounded bg-obsidian-850"
                />
                <span>Hardware Token Remembered</span>
              </label>
              <a href="#" className="text-lime-400 hover:underline">
                Reset Key
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-obsidian-950 font-bold font-sans text-xs transition-all shadow-lime-glow disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Cryptographic Session...' : 'Authenticate & Launch'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Biometric SSO option */}
          <div className="pt-6 border-t border-white/5 text-center space-y-3 font-sans">
            <button
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => navigate('/app/overview'), 500);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-white/10 text-slate-200 text-xs transition-all font-medium"
            >
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              <span>Authenticate via FIDO2 / YubiKey</span>
            </button>

            <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Session protected by Zero Look-Ahead Verification & SHA-256 Audit Trail</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
