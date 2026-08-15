import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Terminal,
  Database,
  MessageSquare,
  Shield,
  Radio,
  Zap,
  Sparkles,
  Search,
  Server,
  Play,
  Presentation,
  Layers,
  User,
  Settings as SettingsIcon,
  LogOut,
  Sliders
} from 'lucide-react';

import { TickerTape } from './TickerTape';
import { AurexLogo } from '../brand/AurexLogo';
import { CommandPalette } from '../common/CommandPalette';

export const AppShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({
    name: 'Admin Operator',
    role: 'Executive Operator',
    email: 'admin@aurex.intelligence'
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('AUREX_AUTH_USER');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('AUREX_AUTH_USER');
    navigate('/login');
  };

  const getBreadcrumb = () => {
    switch (location.pathname) {
      case '/app/overview':
        return { domain: 'Executive', title: 'Tri-Domain Command Center' };
      case '/app/query-studio':
      case '/app/datamart/query-studio':
        return { domain: 'DataMart Studio', title: 'Real-Time Query Studio & Pipeline' };
      case '/app/pitch':
        return { domain: 'Presentation Mode', title: 'Interactive Hackathon Pitch Deck' };
      case '/app/architecture':
        return { domain: 'Architecture', title: 'System Blueprint, Math Logics & ER Schema' };
      case '/app/intelligence':
        return { domain: 'Intelligence Core', title: 'Closed-Loop Telemetry & Convergence' };
      case '/app/insights':
        return { domain: 'Insight Engine', title: 'Autonomous Confidence-Rated Signals' };
      case '/app/quant':
        return { domain: 'Quantitative', title: 'Quant Studio — Strategy Backtesting' };
      case '/app/datamart':
        return { domain: 'Enterprise', title: 'DataMart Analytics Explorer' };
      case '/app/aiden':
        return { domain: 'Retail AI', title: 'Aiden Grounded Intelligence' };
      case '/app/data':
        return { domain: 'Architecture', title: 'Enterprise Data Hub & Quality Center' };
      case '/app/workflows':
        return { domain: 'Automation', title: 'Autonomous Workflow Engine' };
      case '/app/profile':
        return { domain: 'Identity', title: 'User Profile & Security Health' };
      case '/app/settings':
        return { domain: 'System', title: 'Platform Settings & Organization Data' };
      default:
        return { domain: 'Platform', title: 'System Overview' };
    }
  };

  const breadcrumb = getBreadcrumb();

  return (
    <div className="flex h-screen w-full bg-obsidian-900 text-slate-100 overflow-hidden font-sans select-none">
      {/* Persistent Left Nav Rail with all direct page buttons */}
      <aside className="w-18 md:w-20 border-r border-white/10 flex flex-col items-center py-6 justify-between shrink-0 bg-obsidian-950/80 backdrop-blur-xl z-30 overflow-y-auto">
        {/* Brand Icon & Main Navigation */}
        <div className="flex flex-col items-center gap-5">
          <Link
            to="/app/overview"
            className="flex items-center justify-center transition-all group"
            title="AUREX Intelligence Center"
          >
            <AurexLogo size={36} />
          </Link>

          {/* Navigation Rail Items */}
          <nav className="flex flex-col gap-2">
            <AppNavItem to="/app/overview" icon={<Activity className="w-5 h-5" />} label="Overview" />
            <AppNavItem to="/app/query-studio" icon={<Terminal className="w-5 h-5 text-cyan-400" />} label="Query Studio" />
            <AppNavItem to="/app/pitch" icon={<Presentation className="w-5 h-5 text-amber-400" />} label="Pitch Deck" />
            <AppNavItem to="/app/architecture" icon={<Layers className="w-5 h-5 text-emerald-400" />} label="System Architecture" />
            <AppNavItem to="/app/intelligence" icon={<Zap className="w-5 h-5 text-lime-400" />} label="Intelligence Core" />
            <AppNavItem to="/app/insights" icon={<Sparkles className="w-5 h-5 text-cyan-400" />} label="Insight Engine" />
            <AppNavItem to="/app/quant" icon={<Sliders className="w-5 h-5 text-purple-400" />} label="Quant Studio" />
            <AppNavItem to="/app/datamart" icon={<Database className="w-5 h-5 text-emerald-400" />} label="DataMart" />
            <AppNavItem to="/app/aiden" icon={<MessageSquare className="w-5 h-5 text-lime-400" />} label="Aiden AI" />
            <AppNavItem to="/app/data" icon={<Server className="w-5 h-5 text-indigo-400" />} label="Data Hub" />
            <AppNavItem to="/app/workflows" icon={<Play className="w-5 h-5 text-rose-400" />} label="Workflows" />
            
            <div className="w-6 h-px bg-white/10 my-1 mx-auto" />
            
            <AppNavItem to="/app/profile" icon={<User className="w-5 h-5 text-cyan-300" />} label="User Profile" />
            <AppNavItem to="/app/settings" icon={<SettingsIcon className="w-5 h-5 text-lime-300" />} label="Settings & 2FA" />
            <AppNavItem to="/security" icon={<Shield className="w-5 h-5 text-slate-400" />} label="Zero-Bias Trust" />
          </nav>
        </div>

        {/* Bottom System Telemetry Indicator */}
        <div className="flex flex-col items-center gap-3 font-mono pt-4">
          <div className="p-2 rounded-xl bg-obsidian-850 border border-white/10 text-lime-400" title="Core Online">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
        </div>
      </aside>

      {/* Main Operating Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Global Live Telemetry Ticker */}
        <TickerTape />

        {/* Top Command Bar with Command Palette Trigger */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-8 bg-obsidian-900/60 backdrop-blur-md shrink-0 z-20">
          {/* Breadcrumb Info */}
          <div className="flex items-center gap-3 text-xs font-sans">
            <span className="px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 font-semibold border border-lime-500/20 text-xs tracking-wide">
              {breadcrumb.domain}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-200 font-medium tracking-tight truncate max-w-xs md:max-w-md font-sans text-sm">
              {breadcrumb.title}
            </span>
          </div>

          {/* Command Palette Trigger Button */}
          <button
            onClick={() => setCmdPaletteOpen(true)}
            className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-xl bg-obsidian-950 border border-white/10 hover:border-lime-500/40 text-slate-400 hover:text-white transition-all text-xs font-mono"
          >
            <Search className="w-3.5 h-3.5 text-lime-400" />
            <span>Search AUREX Platform...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-obsidian-850 rounded border border-white/10 text-slate-300">
              ⌘K
            </kbd>
          </button>

          {/* Clean Enterprise Status Telemetry & User Controls */}
          <div className="flex items-center gap-3 text-xs font-sans">
            {/* User Profile & Logout Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-lime-400 text-xs font-bold font-mono">
                  {currentUser?.name ? currentUser.name[0].toUpperCase() : 'A'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight">
                    {currentUser?.name || 'Admin Operator'}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    {currentUser?.role?.split(' ')[0] || 'Operator'}
                  </div>
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-obsidian-850 border border-white/10 shadow-2xl p-2 z-50 text-xs font-sans space-y-1">
                  <div className="p-2 border-b border-white/10">
                    <div className="font-bold text-white">{currentUser?.name || 'Operator'}</div>
                    <div className="text-[10px] text-slate-400 truncate">{currentUser?.email || 'admin@aurex.intelligence'}</div>
                  </div>
                  <Link
                    to="/app/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/app/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4 text-lime-400" />
                    <span>Settings & 2FA</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Routed Page Surface */}
        <main className="flex-1 overflow-y-auto relative bg-obsidian-900">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette (⌘K) */}
      <CommandPalette isOpen={cmdPaletteOpen} onClose={() => setCmdPaletteOpen(false)} />
    </div>
  );
};

// Nav Item Helper with Tooltip
const AppNavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({
  to,
  icon,
  label,
}) => (
  <NavLink
    to={to}
    title={label}
    className={({ isActive }) =>
      `p-3 rounded-2xl transition-all relative group flex items-center justify-center ${
        isActive
          ? 'bg-lime-500/10 text-lime-400 border border-lime-500/30 shadow-[0_0_20px_rgba(212,249,56,0.15)] font-semibold'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
      }`
    }
  >
    {({ isActive }) => (
      <>
        {icon}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-lime-400 rounded-r-full shadow-[0_0_8px_rgba(212,249,56,0.8)]" />
        )}
        {/* Tooltip on hover */}
        <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-obsidian-850 border border-white/10 text-white text-[11px] font-sans whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50">
          {label}
        </span>
      </>
    )}
  </NavLink>
);
