import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  Database,
  MessageSquare,
  Search,
  Server,
  Layers,
  User,
  Settings as SettingsIcon,
  LogOut,
  Sliders,
  Sparkles,
  Play,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

import { TickerTape } from './TickerTape';
import { AurexLogo } from '../brand/AurexLogo';
import { CommandPalette } from '../common/CommandPalette';

export const AppShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Sidebar expanded / collapsed state
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() => {
    try {
      return localStorage.getItem('AUREX_SIDEBAR_EXPANDED') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('AUREX_SIDEBAR_EXPANDED', String(next));
      } catch {}
      return next;
    });
  };

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
      {/* Expandable / Collapsible Left Navigation Sidebar */}
      <aside
        className={`border-r border-white/10 flex flex-col justify-between shrink-0 bg-obsidian-950/90 backdrop-blur-xl z-30 overflow-y-auto transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? 'w-64 p-4' : 'w-18 md:w-20 py-6 items-center px-2'
        }`}
      >
        {/* Top Header: Brand Logo + Collapse / Expand Toggle Button */}
        <div className="flex flex-col gap-4">
          <div className={`flex items-center ${isSidebarExpanded ? 'justify-between px-2' : 'justify-center'}`}>
            <Link
              to="/app/overview"
              className="flex items-center gap-3 transition-all group"
              title="AUREX Intelligence Center"
            >
              <AurexLogo size={34} />
              {isSidebarExpanded && (
                <div className="flex flex-col">
                  <span className="font-display font-black text-white text-base tracking-wider leading-none">
                    AUREX
                  </span>
                  <span className="text-[10px] text-lime-400 font-mono tracking-widest uppercase">
                    INTELLIGENCE
                  </span>
                </div>
              )}
            </Link>

            {isSidebarExpanded && (
              <button
                onClick={toggleSidebar}
                title="Collapse Sidebar"
                className="p-1.5 rounded-xl bg-obsidian-850 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* If collapsed, show small toggle button under logo */}
          {!isSidebarExpanded && (
            <button
              onClick={toggleSidebar}
              title="Expand Sidebar"
              className="p-2 rounded-xl bg-obsidian-850 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all mx-auto"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          )}

          {/* Navigation Rail Items */}
          <nav className="flex flex-col gap-1.5 pt-2">
            <AppNavItem
              to="/app/overview"
              icon={<Activity className="w-5 h-5 text-white shrink-0" />}
              label="Command Center"
              isExpanded={isSidebarExpanded}
            />
            <AppNavItem
              to="/app/aiden"
              icon={<MessageSquare className="w-5 h-5 text-lime-400 shrink-0" />}
              label="Aiden AI Assistant"
              isExpanded={isSidebarExpanded}
            />
            <AppNavItem
              to="/app/insights"
              icon={<Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />}
              label="Autonomous Signals"
              isExpanded={isSidebarExpanded}
            />
            <AppNavItem
              to="/app/workflows"
              icon={<Play className="w-5 h-5 text-rose-400 shrink-0" />}
              label="Workflow Engine"
              isExpanded={isSidebarExpanded}
            />
            <AppNavItem
              to="/app/datamart"
              icon={<Database className="w-5 h-5 text-cyan-400 shrink-0" />}
              label="DataMart & SQL Studio"
              isExpanded={isSidebarExpanded}
            />
            <AppNavItem
              to="/app/quant"
              icon={<Sliders className="w-5 h-5 text-purple-400 shrink-0" />}
              label="Quant Studio"
              isExpanded={isSidebarExpanded}
            />
            <AppNavItem
              to="/app/data"
              icon={<Server className="w-5 h-5 text-emerald-400 shrink-0" />}
              label="Data Hub & Ingestion"
              isExpanded={isSidebarExpanded}
            />
            <AppNavItem
              to="/app/architecture"
              icon={<Layers className="w-5 h-5 text-amber-400 shrink-0" />}
              label="System Blueprint & Docs"
              isExpanded={isSidebarExpanded}
            />

            <div className={`h-px bg-white/10 my-2 ${isSidebarExpanded ? 'mx-2' : 'w-6 mx-auto'}`} />

            <AppNavItem
              to="/app/settings"
              icon={<SettingsIcon className="w-5 h-5 text-slate-400 hover:text-white shrink-0" />}
              label="Platform Settings & 2FA"
              isExpanded={isSidebarExpanded}
            />
          </nav>
        </div>

        {/* Bottom System Telemetry Indicator */}
        <div className={`pt-4 font-mono ${isSidebarExpanded ? 'px-2' : 'flex flex-col items-center'}`}>
          <div className={`p-2.5 rounded-2xl bg-obsidian-850 border border-white/10 flex items-center gap-2.5 text-xs ${
            isSidebarExpanded ? 'justify-between' : 'justify-center'
          }`}>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
              </span>
              {isSidebarExpanded && <span className="text-white font-bold text-[11px]">Core Online</span>}
            </div>
            {isSidebarExpanded && (
              <span className="text-[10px] text-lime-400 font-mono font-semibold">
                DuckDB 1.1 Active
              </span>
            )}
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

// Nav Item Helper with Expand/Collapse Text Support
const AppNavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  isExpanded: boolean;
}> = ({ to, icon, label, isExpanded }) => (
  <NavLink
    to={to}
    title={label}
    className={({ isActive }) =>
      `rounded-2xl transition-all relative group flex items-center ${
        isExpanded ? 'px-3.5 py-2.5 gap-3' : 'p-3 justify-center'
      } ${
        isActive
          ? 'bg-lime-500/10 text-lime-400 border border-lime-500/30 shadow-[0_0_20px_rgba(212,249,56,0.15)] font-semibold'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
      }`
    }
  >
    {({ isActive }) => (
      <>
        {icon}

        {isExpanded && (
          <span className="text-xs font-semibold whitespace-nowrap truncate text-slate-200 group-hover:text-white">
            {label}
          </span>
        )}

        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-lime-400 rounded-r-full shadow-[0_0_8px_rgba(212,249,56,0.8)]" />
        )}

        {/* Tooltip on hover when collapsed */}
        {!isExpanded && (
          <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-obsidian-850 border border-white/10 text-white text-[11px] font-sans whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50">
            {label}
          </span>
        )}
      </>
    )}
  </NavLink>
);
