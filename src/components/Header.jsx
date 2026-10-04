import React, { useState } from 'react';
import { 
  HeartPulse, 
  Languages, 
  Globe2, 
  Check, 
  LogOut, 
  Bell, 
  RefreshCw,
  ChevronDown,
  Camera
} from 'lucide-react';

export default function Header({
  household,
  currentUser,
  isOffline,
  onChangeLanguage,
  onResetData,
  onLogout,
  onNavigateLanding,
  onOpenAlerts,
  onOpenOcr,
  translations
}) {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const t = translations || {};

  const languages = [
    { code: 'en', name: 'English (UK / West Africa)' },
    { code: 'pcm', name: 'Nigerian Pidgin (Vernacular)' },
    { code: 'yo', name: 'Èdè Yorùbá' },
    { code: 'ha', name: 'Harshen Hausa' },
    { code: 'ig', name: 'Asụsụ Igbo' },
  ];

  const pendingAlertCount = household.pendingAlerts?.length || 2;

  return (
    <header className="sticky top-0 z-30 bg-[#F8FAFD]/95 backdrop-blur-md border-b border-white/90 px-3 sm:px-6 lg:px-8 py-2.5 shadow-[0_4px_14px_rgba(220,228,236,0.6)]" role="banner">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* 1. BRAND IDENTITY & HOME CLICK */}
        <button
          onClick={onNavigateLanding}
          className="flex items-center gap-2 sm:gap-2.5 min-w-0 text-left group touch-target cursor-pointer hover:opacity-95 transition-opacity"
          title="Return to FamilyHealth Product Showcase & Overview"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-neu-raised flex-shrink-0 group-hover:scale-105 transition-transform border border-white/30">
            <HeartPulse className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-black text-slate-800 tracking-tight leading-none">
                FamilyHealth
              </h1>
              <span className="text-[8px] sm:text-[9px] uppercase font-black bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full border border-blue-200 shadow-xs">
                AFRICA
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5 max-w-[100px] xs:max-w-[150px] sm:max-w-none">
              Circle: <span className="font-bold text-slate-700">{household.head}</span>
            </p>
          </div>
        </button>

        {/* 2. ACTION CONTROLS & STATUS */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          
          {/* Quick OCR Scanner Button (Proportioned h-9) */}
          {onOpenOcr && (
            <button
              onClick={onOpenOcr}
              className="h-9 px-3 rounded-xl neu-btn-primary font-bold text-xs inline-flex items-center gap-1.5 transition-all touch-target"
              title="Scan clinic prescription, immunization leaflet, or receipt via WASM OCR"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">{t.scanAction || 'Scan Record (OCR)'}</span>
            </button>
          )}

          {/* Pending Alerts Counter (Proportioned h-9) */}
          <button
            onClick={onOpenAlerts}
            className="h-9 px-3 rounded-xl neu-btn font-bold text-xs inline-flex items-center gap-1.5 transition-all"
            title={`${pendingAlertCount} actionable alerts in your family health circle`}
          >
            <Bell className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">{t.alertsBadge || 'Alerts'} ({pendingAlertCount})</span>
            <span className="sm:hidden">{pendingAlertCount}</span>
          </button>

          {/* Language Selector Dropdown (Proportioned h-9) */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="h-9 px-2.5 rounded-xl neu-btn text-xs font-bold inline-flex items-center gap-1"
              aria-label="Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <span className="uppercase text-[11px] font-bold">{household.language || 'en'}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                <div className="absolute right-0 mt-2 w-56 surface-card shadow-lifted border border-white/80 py-2 z-50 text-xs animate-in fade-in duration-150">
                  <div className="px-3 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200/60 mb-1">
                    Vernacular Localization
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onChangeLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50/60 transition-colors ${
                        household.language === l.code ? 'font-bold text-blue-700 bg-blue-50/80' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.name}</span>
                      {household.language === l.code && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User Account Menu Dropdown (Proportioned w-9 h-9) */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-9 h-9 rounded-xl neu-icon-btn font-black text-xs text-blue-600 touch-target cursor-pointer"
              title={`Logged in as ${currentUser?.name || 'Femi Adeyemi'}`}
              aria-label="User Account Menu"
            >
              {currentUser?.name?.[0] || 'F'}
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-2 w-64 surface-card shadow-lifted border border-white/80 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                  
                  <div className="px-4 py-2.5 border-b border-slate-200/60">
                    <span className="font-black text-slate-900 block truncate text-sm">
                      {currentUser?.name || 'Femi Adeyemi'}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {currentUser?.email || 'femi.adeyemi@familyhealth.africa'}
                    </span>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/70 text-slate-700 border border-white shadow-xs">
                      {currentUser?.role || 'Primary Caretaker (G1)'}
                    </span>
                  </div>

                  {/* Return to Product Overview */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigateLanding();
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-white/40 text-slate-800 font-bold flex items-center gap-2 transition-colors"
                  >
                    <Globe2 className="w-4 h-4 text-slate-500" />
                    <span>Product Showcase & Overview</span>
                  </button>

                  {/* Reset Demo Data */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onResetData();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-white/40 text-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-400" />
                    <span>Reset to Initial LLD Dataset</span>
                  </button>

                  {/* Logout / Switch Account */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-white/60 text-slate-900 font-bold flex items-center gap-2 border-t border-slate-200/60 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out / Switch Account</span>
                  </button>

                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
