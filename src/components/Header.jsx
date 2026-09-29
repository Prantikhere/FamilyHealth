import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  Download, 
  RefreshCw, 
  Languages, 
  QrCode,
  HeartPulse
} from 'lucide-react';

export default function Header({ 
  household, 
  isOffline, 
  onOpenExport, 
  onOpenTrust,
  onResetData,
  onChangeLanguage 
}) {
  const [showLangMenu, setShowLangMenu] = useState(false);

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
                AfriHealth
              </h1>
              <span className="text-[10px] uppercase font-bold bg-emerald-light text-emerald-primary px-1.5 py-0.5 rounded-full border border-emerald-primary/20">
                PWA
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
              {isOffline ? 'Offline' : 'Local Safe'}
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
                  Audio Guidance Language
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
                    {household.language === l.code && <span className="text-emerald-primary">✓</span>}
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
        </div>
      </div>
    </header>
  );
}
