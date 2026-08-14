import React from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import {
  Activity,
  Terminal,
  Database,
  MessageSquare,
  Shield,
  ShieldCheck,
  Cpu,
  Radio,
} from 'lucide-react';
import { TickerTape } from './TickerTape';
import { AurexLogo } from '../brand/AurexLogo';

export const AppShell: React.FC = () => {
  const location = useLocation();

  const getBreadcrumb = () => {
    switch (location.pathname) {
      case '/app/overview':
        return { domain: 'Executive', title: 'Tri-Domain Command Center' };
      case '/app/quant':
        return { domain: 'Quantitative', title: 'Quant Studio — Strategy Backtesting' };
      case '/app/datamart':
        return { domain: 'Enterprise', title: 'DataMart Analytics Explorer' };
      case '/app/aiden':
        return { domain: 'Retail AI', title: 'Aiden Grounded Intelligence' };
      default:
        return { domain: 'Platform', title: 'System Overview' };
    }
  };

  const breadcrumb = getBreadcrumb();

  return (
    <div className="flex h-screen w-full bg-obsidian-900 text-slate-100 overflow-hidden font-sans select-none">
      {/* Persistent Left Nav Rail */}
      <aside className="w-18 md:w-20 border-r border-white/10 flex flex-col items-center py-6 justify-between shrink-0 bg-obsidian-950/80 backdrop-blur-xl z-30">
        {/* Brand Icon */}
        <div className="flex flex-col items-center gap-6">
          <Link
            to="/"
            className="flex items-center justify-center transition-all group"
            title="Return to AUREX Home"
          >
            <AurexLogo size={36} />
          </Link>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-3">
            <AppNavItem to="/app/overview" icon={<Activity className="w-5 h-5" />} label="Overview" />
            <AppNavItem to="/app/quant" icon={<Terminal className="w-5 h-5" />} label="Quant Studio" />
            <AppNavItem to="/app/datamart" icon={<Database className="w-5 h-5" />} label="DataMart" />
            <AppNavItem to="/app/aiden" icon={<MessageSquare className="w-5 h-5" />} label="Aiden AI" />
            <div className="w-6 h-px bg-white/10 my-1 mx-auto" />
            <AppNavItem to="/security" icon={<Shield className="w-5 h-5" />} label="Zero-Bias Trust" />
          </nav>
        </div>

        {/* Bottom System Telemetry Indicator */}
        <div className="flex flex-col items-center gap-3 font-mono">
          <div className="p-2 rounded-xl bg-obsidian-850 border border-white/10 text-lime-400" title="Core Online">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
        </div>
      </aside>

      {/* Main Operating Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Global Live Telemetry Ticker */}
        <TickerTape />

        {/* Top Command Bar without AI Command Palette search */}
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

          {/* Clean Enterprise Status Telemetry */}
          <div className="flex items-center gap-3 text-xs font-sans">
            {/* Look-Ahead Bias Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Look-Ahead Bias: Enforced</span>
            </div>

            {/* Ingestion Stream Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[11px]">
              <Cpu className="w-3.5 h-3.5" />
              <span>4.89 PFLOPS Core</span>
            </div>

            {/* Live Environment Badge */}
            <div className="flex items-center gap-2 text-xs text-slate-300 border border-white/10 bg-obsidian-850 px-3.5 py-1.5 rounded-full font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
              <span>PROD • US-EAST</span>
            </div>
          </div>
        </header>

        {/* Dynamic Screen Content */}
        <main className="flex-1 overflow-y-auto bg-obsidian-900 bg-grain relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

interface AppNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const AppNavItem: React.FC<AppNavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative p-3 rounded-2xl flex items-center justify-center transition-all duration-200 group ${
          isActive
            ? 'bg-lime-500 text-obsidian-950 shadow-lime-glow'
            : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
        }`
      }
      title={label}
    >
      {({ isActive }) => (
        <>
          {icon}
          {isActive && (
            <span className="absolute -left-3 w-1 h-6 bg-lime-400 rounded-r-full shadow-lime-glow" />
          )}
          <span className="absolute left-full ml-4 px-2.5 py-1 bg-obsidian-850 border border-white/10 rounded-lg text-xs font-sans text-slate-200 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-2xl">
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
};
