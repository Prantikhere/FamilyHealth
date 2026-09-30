import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  Download, 
  RefreshCw, 
  Languages, 
  QrCode,
  HeartPulse,
  LogOut,
  User,
  Check
} from 'lucide-react';

export default function Header({ 
  household, 
  currentUser,
  isOffline, 
  onOpenExport, 
  onOpenTrust,
  onResetData,
  onChangeLanguage,
  onLogout,
  onNavigateLanding
}) {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ha', name: 'Hausa (Harshen)' },
    { code: 'yo', name: 'Yorùbá' },
    { code: 'ig', name: 'Asụsụ Igbo' },
    { code: 'sw', name: 'Kiswahili' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-sm" role="banner">
      <div className="flex items-center justify-between gap-2">
        {/* Brand identity & Caretaker */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-primary flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none truncate">
                SeiHealth
              </h1>
              <span className="text-[10px] uppercase font-bold bg-emerald-light text-emerald-primary px-1.5 py-0.5 rounded-full border border-emerald-primary/20">
                360° PWA
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
              Caretaker: <span className="font-semibold text-slate-700">{household.head}</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Offline Badge */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Offline / Synced Badge */}
          <div 
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
              isOffline 
                ? 'bg-amber-light text-amber-alert border-amber-300' 
                : 'bg-emerald-light text-emerald-primary border-emerald-200'
            }`}
            title={isOffline ? 'Working offline. All data saved locally to device.' : 'Connected. Local-first sync active.'}
          >
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="hidden sm:inline">
              {isOffline ? 'Offline (Local Safe)' : 'Synced 4m ago'}
            </span>
            <span className="sm:hidden">
              {isOffline ? 'Offline' : 'Local'}
            </span>
          </div>

          {/* NDPR / Trust Protocol Badge */}
          <button
            onClick={onOpenTrust}
            className="p-2 rounded-lg text-slate-600 hover:text-emerald-primary hover:bg-emerald-50 transition-colors touch-target flex items-center justify-center"
            title="NDPR Sovereign Data & Clinic Intermediary Protocol"
            aria-label="Privacy and Trust Protocol"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-primary" />
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors touch-target flex items-center justify-center"
              title="Regional Language Audio Guidance"
              aria-label="Change Language"
            >
              <Languages className="w-5 h-5" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Audio Speech Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onChangeLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                      household.language === l.code ? 'font-bold text-emerald-primary bg-emerald-50/60' : 'text-slate-700'
                    }`}
                  >
                    <span>{l.name}</span>
                    {household.language === l.code && <Check className="w-4 h-4 text-emerald-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Sovereign Data */}
          <button
            onClick={onOpenExport}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors touch-target flex items-center justify-center"
            title="Export Sovereign Health Passport"
            aria-label="Export Data"
          >
            <Download className="w-5 h-5" />
          </button>

          {/* User Account / Sign Out Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 rounded-full border-2 border-emerald-primary/40 flex items-center justify-center text-white font-bold text-xs shadow-xs"
              style={{ backgroundColor: currentUser?.avatarBg || '#047857' }}
              title={`Logged in as ${currentUser?.name || 'Amina Bello'}`}
              aria-label="User Account Menu"
            >
              {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="font-extrabold text-slate-900 block truncate">
                    {currentUser?.name || 'Amina Bello'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block truncate">
                    {currentUser?.email || 'amina@seihealth.org'}
                  </span>
                  <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-primary">
                    {currentUser?.role || 'Household Caretaker'}
                  </span>
                </div>

                {onNavigateLanding && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigateLanding();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 border-b border-slate-100 font-medium"
                  >
                    <Globe2 className="w-4 h-4 text-emerald-primary" />
                    <span>Product Showcase & Deck</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onResetData();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                  <span>Reset Demo Data</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 font-bold flex items-center gap-2 border-t border-slate-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Switch Account / Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
