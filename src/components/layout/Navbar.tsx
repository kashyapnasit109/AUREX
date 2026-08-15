import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X, Sparkles } from 'lucide-react';
import { AurexLogo } from '../brand/AurexLogo';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Overview', path: '/app/overview' },
    { name: 'Architecture', path: '/app/architecture' },
    { name: 'Quant Studio', path: '/app/quant' },
    { name: 'DataMart', path: '/app/datamart' },
    { name: 'Aiden AI', path: '/app/aiden' },
    { name: 'Trust & Security', path: '/security' },
  ];

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 md:px-8 pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-between w-full max-w-6xl glass-pill rounded-full px-5 py-2.5 transition-all duration-300 border border-white/10 shadow-2xl">
        {/* Custom AUREX Brand Mark */}
        <Link to="/" className="flex items-center group" title="AUREX Platform">
          <AurexLogo size={30} withText textClassName="text-sm" />
        </Link>

        {/* Center Nav Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-1 text-xs text-slate-300 font-sans">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 text-lime-400 font-medium shadow-glass-edge'
                    : 'hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Action Right */}
        <div className="flex items-center space-x-3 font-sans">
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 border border-purple-500/30 text-xs font-sans text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span className="tracking-tight text-[11px]">Crafted by <strong className="text-white font-semibold">HiVizStudios</strong></span>
          </div>

          <Link
            to="/login"
            className="hidden sm:inline-flex text-xs text-slate-300 hover:text-white px-3 py-1.5 transition-colors font-medium"
          >
            Terminal Login
          </Link>
          <Link
            to="/app/overview"
            className="inline-flex items-center space-x-1.5 bg-lime-500 hover:bg-lime-400 text-obsidian-950 px-4 py-1.5 rounded-full font-sans font-bold text-xs transition-all duration-200 shadow-lime-glow hover:scale-105 active:scale-95"
          >
            <span>Launch Platform</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="pointer-events-auto md:hidden fixed inset-x-4 top-24 glass-card rounded-2xl p-6 border border-white/10 shadow-2xl flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-200 font-sans">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-lime-400 font-medium"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 font-medium"
            >
              Terminal Login
            </Link>
          </div>
          <Link
            to="/app/overview"
            onClick={() => setMobileOpen(false)}
            className="w-full text-center bg-lime-500 text-obsidian-950 py-3 rounded-xl font-bold text-sm"
          >
            Launch Command Center
          </Link>
        </div>
      )}
    </header>
  );
};
