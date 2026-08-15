import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Shield,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Save,
  Sparkles,
  Terminal,
  Database,
  Lock,
  Edit3
} from 'lucide-react';

import { Link } from 'react-router-dom';

export const Profile: React.FC = () => {
  const [user, setUser] = useState<any>({
    name: 'Admin Operator',
    email: 'admin@aurex.intelligence',
    role: 'Executive Operator',
    orgId: 'ORG-AUREX-CORE',
    bio: 'Lead Quantitative Analyst & Enterprise System Operator.',
    department: 'Quantitative Trading & AI Intelligence',
    loginTime: Date.now()
  });

  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [departmentInput, setDepartmentInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('AUREX_AUTH_USER');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setNameInput(parsed.name || 'Admin Operator');
        setEmailInput(parsed.email || 'admin@aurex.intelligence');
        setRoleInput(parsed.role || 'Executive Operator');
        setDepartmentInput(parsed.department || 'Quantitative Trading & AI Intelligence');
        setBioInput(parsed.bio || 'Lead Quantitative Analyst & Enterprise System Operator.');
      } else {
        setNameInput('Admin Operator');
        setEmailInput('admin@aurex.intelligence');
        setRoleInput('Executive Operator');
        setDepartmentInput('Quantitative Trading & AI Intelligence');
        setBioInput('Lead Quantitative Analyst & Enterprise System Operator.');
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      name: nameInput.trim(),
      email: emailInput.trim(),
      role: roleInput.trim(),
      department: departmentInput.trim(),
      bio: bioInput.trim()
    };
    setUser(updatedUser);
    localStorage.setItem('AUREX_AUTH_USER', JSON.stringify(updatedUser));
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-lime-400 uppercase tracking-widest mb-1">
            <User className="w-3.5 h-3.5" />
            <span>User Identity & Security Management</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Operator Profile & Identity
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage your credentials, platform permissions, and review security health metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/app/settings"
            className="px-4 py-2.5 rounded-xl bg-obsidian-850 border border-white/10 hover:border-lime-500/40 text-slate-300 hover:text-white font-medium text-xs flex items-center gap-2 transition-all shadow-glass"
          >
            <Lock className="w-3.5 h-3.5 text-lime-400" />
            <span>2FA & Organization Settings</span>
          </Link>
        </div>
      </div>

      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5 shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Profile changes saved successfully to your identity profile!</span>
        </motion.div>
      )}

      {/* Main Profile Identity Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Summary */}
        <div className="lg:col-span-1 bg-obsidian-850 border border-white/10 rounded-2xl p-6 space-y-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-lime-500 via-emerald-400 to-cyan-400 p-0.5 shadow-lime-glow">
                <div className="w-full h-full bg-obsidian-950 rounded-[14px] flex items-center justify-center text-white font-display text-3xl font-bold uppercase">
                  {user.name ? user.name.slice(0, 2) : 'AO'}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-lime-500 border-2 border-obsidian-950 flex items-center justify-center text-obsidian-950" title="Identity Verified">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{user.name}</h2>
              <p className="text-xs text-lime-400 font-mono mt-0.5">{user.role || 'Executive Operator'}</p>
              <p className="text-xs text-slate-400 font-sans mt-1">{user.email}</p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/25 text-[11px] font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> 2FA Verified
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[11px] font-mono flex items-center gap-1">
                <Building2 className="w-3 h-3" /> {user.orgId || 'ORG-AUREX'}
              </span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-3 text-xs font-sans text-slate-400">
            <div className="flex justify-between items-center">
              <span>Department</span>
              <strong className="text-slate-200">{user.department || 'Quant Intelligence'}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span>Status</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Session
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Joined</span>
              <strong className="text-slate-200 font-mono">August 2026</strong>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Editable Details & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Editable Identity Details Panel */}
          <div className="bg-obsidian-850 border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-lime-400" />
                <h3 className="text-base font-bold text-white">Identity Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile Details'}
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase text-[11px] mb-1 font-medium">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full bg-obsidian-950 border border-white/10 disabled:opacity-60 rounded-xl p-3 pl-10 text-white outline-none focus:border-lime-400 transition-colors"
                    />
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase text-[11px] mb-1 font-medium">Work Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled={!isEditing}
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-obsidian-950 border border-white/10 disabled:opacity-60 rounded-xl p-3 pl-10 text-white outline-none focus:border-lime-400 transition-colors"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase text-[11px] mb-1 font-medium">Role & Title</label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={roleInput}
                      onChange={(e) => setRoleInput(e.target.value)}
                      className="w-full bg-obsidian-950 border border-white/10 disabled:opacity-60 rounded-xl p-3 pl-10 text-white outline-none focus:border-lime-400 transition-colors"
                    />
                    <Shield className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase text-[11px] mb-1 font-medium">Department</label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={departmentInput}
                      onChange={(e) => setDepartmentInput(e.target.value)}
                      className="w-full bg-obsidian-950 border border-white/10 disabled:opacity-60 rounded-xl p-3 pl-10 text-white outline-none focus:border-lime-400 transition-colors"
                    />
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase text-[11px] mb-1 font-medium">Bio & Operating Directives</label>
                <textarea
                  rows={2}
                  disabled={!isEditing}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full bg-obsidian-950 border border-white/10 disabled:opacity-60 rounded-xl p-3 text-white outline-none focus:border-lime-400 transition-colors"
                />
              </div>

              {isEditing && (
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-lime-500 hover:bg-lime-400 text-obsidian-950 font-bold text-xs shadow-lime-glow transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              )}
            </form>
          </div>

          {/* Platform Performance & Activity Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-obsidian-850 border border-white/10 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span>AI INQUIRIES</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-2xl font-bold text-white font-mono">42</p>
              <p className="text-[10px] text-lime-400 font-sans">Grounded Core Chats</p>
            </div>

            <div className="bg-obsidian-850 border border-white/10 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span>DATAMART QUERIES</span>
                <Database className="w-3.5 h-3.5 text-lime-400" />
              </div>
              <p className="text-2xl font-bold text-white font-mono">128</p>
              <p className="text-[10px] text-slate-400 font-sans">DuckDB Executions</p>
            </div>

            <div className="bg-obsidian-850 border border-white/10 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span>QUANT BACKTESTS</span>
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-white font-mono">16</p>
              <p className="text-[10px] text-slate-400 font-sans">Strategies Tested</p>
            </div>

            <div className="bg-obsidian-850 border border-white/10 rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span>SECURITY LEVEL</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-400 font-mono">100%</p>
              <p className="text-[10px] text-emerald-400 font-sans">2FA Google Protected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
