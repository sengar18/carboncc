// ==============================================================================
// CARBONSCOUT INDIA — APPLICATION HEADER / NAVBAR
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import { Leaf, ShieldCheck, Compass, LayoutDashboard, Cpu } from 'lucide-react';
import { NavbarSettingsTrigger } from './navbar-settings-trigger';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-800 transition">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">CarbonScout</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  India
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Opportunity Intelligence Platform</p>
            </div>
          </Link>
        </div>

        {/* Navigation links & Mock indicator */}
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/assessment"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-emerald-700 transition"
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>New Assessment</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-emerald-700 transition"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-500" />
            <span>Admin CRM</span>
          </Link>

          {/* Mode Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mock Mode: Zero-Credit</span>
          </div>

          <NavbarSettingsTrigger />

          <Link
            href="/assessment"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition shadow-xs"
          >
            Start Screening
          </Link>
        </nav>
      </div>
    </header>
  );
}
