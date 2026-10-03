import React, { useState } from 'react';
import { 
  HeartPulse, 
  Wifi, 
  WifiOff, 
  Languages, 
  Globe2, 
  User, 
  Check, 
  LogOut, 
  Bell, 
  ShieldCheck, 
  RefreshCw,
  ChevronDown,
  Camera,
  Users,
  Stethoscope,
  AlertOctagon,
  UserCheck
} from 'lucide-react';
import { DUMMY_ACCOUNTS } from './LoginScreen';

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
  onSwitchUser,
  translations
}) {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const t = translations || {};

  const languages = [
    { code: 'en', name: 'English (UK / West Africa)' },
    { code: 'pcm', name: 'Nigerian Pidgin (Vernacular)' },
    { code: 'yo', name: 'Èdè Yorùbá' },
    { code: 'ha', name: 'Harshen Hausa' },
    { code: 'ig', name: 'Asụsụ Igbo' },
  ];

  const pendingAlertCount = household.pendingAlerts?.length || 2;

  // Determine role perspective short label & badge (Monochrome refinement)
  const role = currentUser?.role || '';
  let roleLabel = 'Admin';
  let roleBadgeClass = 'bg-zinc-100 text-zinc-900 border-zinc-300';

  if (role.includes('CHEW') || role.includes('Community Health')) {
    roleLabel = 'CHEW Nurse';
    roleBadgeClass = 'bg-zinc-100 text-zinc-900 border-zinc-300';
  } else if (role.includes('Emergency') || role.includes('Clinician') || role.includes('Cardiologist')) {
    roleLabel = 'ER Doctor';
    roleBadgeClass = 'bg-zinc-900 text-white border-zinc-900';
  } else if (role.includes('Elder') || role.includes('Dependent') || currentUser?.name?.includes('Baba')) {
    roleLabel = 'Senior Patient';
    roleBadgeClass = 'bg-zinc-100 text-zinc-900 border-zinc-300';
  }

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200 px-3 sm:px-4 py-2.5 shadow-xs" role="banner">
      <div className="flex items-center justify-between gap-2">
        
        {/* 1. BRAND IDENTITY & HOME CLICK */}
        <button
          onClick={onNavigateLanding}
          className="flex items-center gap-2 min-w-0 text-left group touch-target cursor-pointer hover:opacity-90 transition-opacity"
          title="Return to FamilyHealth Product Showcase & Overview"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-white shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-black text-zinc-950 tracking-tight leading-none">
                FamilyHealth
              </h1>
              <span className="text-[8px] sm:text-[9px] uppercase font-black bg-zinc-100 text-zinc-900 px-1.5 py-0.2 rounded border border-zinc-200">
                AFRICA
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 font-medium truncate mt-0.5">
              Circle: <span className="font-bold text-zinc-900">{household.head}</span>
            </p>
          </div>
        </button>

        {/* 2. ACTION CONTROLS & STATUS */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          
          {/* Quick OCR Scanner Button */}
          {onOpenOcr && (
            <button
              onClick={onOpenOcr}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs shadow-xs transition-transform active:scale-95 touch-target border border-zinc-900"
              title="Scan clinic prescription, immunization leaflet, or receipt via WASM OCR"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.scanAction || 'Scan Record (OCR)'}</span>
            </button>
          )}

          {/* Role Perspective Selector Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${roleBadgeClass}`}
              title="Change active user profile / access perspective"
              aria-label="Switch User Profile Perspective"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span className="truncate max-w-[90px] sm:max-w-none">{roleLabel}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showRoleMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowRoleMenu(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lifted border border-zinc-200 py-2 z-50 text-xs animate-in fade-in duration-150">
                  <div className="px-3 py-1.5 font-bold text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-100 mb-1">
                    Role-Based Access Perspective
                  </div>
                  {DUMMY_ACCOUNTS.map((acc, idx) => {
                    const isSelected = currentUser?.email === acc.email;
                    return (
                      <button
                        key={acc.email}
                        onClick={() => {
                          onSwitchUser?.(acc);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-zinc-50 transition-colors ${
                          isSelected ? 'bg-zinc-100 font-bold text-zinc-950' : 'text-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span 
                            className="w-6 h-6 rounded-lg bg-zinc-900 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0"
                          >
                            {acc.name[0]}
                          </span>
                          <div className="truncate">
                            <span className="font-bold block truncate leading-tight text-zinc-900">{acc.name}</span>
                            <span className="text-[10px] text-zinc-500 truncate block">{acc.badge}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-zinc-950 flex-shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Pending Alerts Counter Pill */}
          <button
            onClick={onOpenAlerts}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 text-xs font-bold transition-colors"
            title={`${pendingAlertCount} actionable alerts in your family health circle`}
          >
            <Bell className="w-3.5 h-3.5 text-zinc-600" />
            <span className="hidden sm:inline">{t.alertsBadge || 'Alerts'} ({pendingAlertCount})</span>
            <span className="sm:hidden">{pendingAlertCount}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-2.5 py-1 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold flex items-center gap-1 border border-zinc-200"
              aria-label="Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-zinc-500" />
              <span className="uppercase text-[11px] font-bold">{household.language || 'en'}</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lifted border border-zinc-200 py-2 z-50 text-xs animate-in fade-in duration-150">
                  <div className="px-3 py-1.5 font-bold text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-100 mb-1">
                    Vernacular Localization
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onChangeLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-zinc-50 transition-colors ${
                        household.language === l.code ? 'font-bold text-zinc-950 bg-zinc-100' : 'text-zinc-700'
                      }`}
                    >
                      <span>{l.name}</span>
                      {household.language === l.code && <Check className="w-4 h-4 text-zinc-950" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User Account Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-zinc-950 text-white font-bold text-xs shadow-xs flex items-center justify-center border border-zinc-200 touch-target cursor-pointer hover:scale-105 transition-transform"
              title={`Logged in as ${currentUser?.name || 'Femi Adeyemi'}`}
              aria-label="User Account Menu"
            >
              {currentUser?.name?.[0] || 'F'}
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lifted border border-borderRule py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                  
                  <div className="px-4 py-2.5 border-b border-borderRule">
                    <span className="font-black text-charcoal block truncate text-sm">
                      {currentUser?.name || 'Femi Adeyemi'}
                    </span>
                    <span className="text-[11px] text-charcoal-muted block truncate">
                      {currentUser?.email || 'femi.adeyemi@familyhealth.africa'}
                    </span>
                    <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-terracotta-container text-terracotta">
                      {currentUser?.role || 'Primary Caretaker (G1)'}
                    </span>
                  </div>

                  {/* Return to Product Overview */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigateLanding();
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-terracotta-light text-terracotta font-bold flex items-center gap-2 transition-colors"
                  >
                    <Globe2 className="w-4 h-4 text-terracotta" />
                    <span>Product Showcase & Overview</span>
                  </button>

                  {/* Reset Demo Data */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onResetData();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-sand text-charcoal flex items-center gap-2 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-charcoal-muted" />
                    <span>Reset to Initial LLD Dataset</span>
                  </button>

                  {/* Logout / Switch Account */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-emergency-container text-emergency font-bold flex items-center gap-2 border-t border-borderRule transition-colors"
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
