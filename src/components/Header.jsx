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

  // Determine role perspective short label & badge
  const role = currentUser?.role || '';
  let roleLabel = 'Admin';
  let roleBadgeClass = 'bg-terracotta-container text-terracotta border-terracotta/20';

  if (role.includes('CHEW') || role.includes('Community Health')) {
    roleLabel = 'CHEW Nurse';
    roleBadgeClass = 'bg-forest-container text-forest border-forest/20';
  } else if (role.includes('Emergency') || role.includes('Clinician') || role.includes('Cardiologist')) {
    roleLabel = 'ER Doctor';
    roleBadgeClass = 'bg-indigoVerified-container text-indigoVerified border-indigoVerified/20';
  } else if (role.includes('Elder') || role.includes('Dependent') || currentUser?.name?.includes('Baba')) {
    roleLabel = 'Senior Patient';
    roleBadgeClass = 'bg-ochre-container text-charcoal border-ochre/25';
  }

  return (
    <header className="sticky top-0 z-30 bg-chalk/90 backdrop-blur-md border-b border-borderRule px-3 sm:px-4 py-2.5 shadow-subtle" role="banner">
      <div className="flex items-center justify-between gap-2">
        
        {/* 1. BRAND IDENTITY & HOME CLICK */}
        <button
          onClick={onNavigateLanding}
          className="flex items-center gap-2 min-w-0 text-left group touch-target cursor-pointer hover:opacity-95 transition-opacity"
          title="Return to FamilyHealth Product Showcase & Overview"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-terracotta flex items-center justify-center text-white shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-black text-charcoal tracking-tight leading-none group-hover:text-terracotta transition-colors">
                FamilyHealth
              </h1>
              <span className="text-[8px] sm:text-[9px] uppercase font-black bg-terracotta-container text-terracotta px-1.5 py-0.2 rounded-full border border-terracotta/20">
                AFRICA
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-charcoal-muted font-medium truncate mt-0.5">
              Circle: <span className="font-bold text-charcoal">{household.head}</span>
            </p>
          </div>
        </button>

        {/* 2. ACTION CONTROLS & STATUS */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          
          {/* Quick OCR Scanner Button */}
          {onOpenOcr && (
            <button
              onClick={onOpenOcr}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white font-black text-xs shadow-xs transition-transform active:scale-95 touch-target"
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
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-black border transition-all ${roleBadgeClass}`}
              title="Change active user profile / access perspective"
              aria-label="Switch User Profile Perspective"
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              <span className="truncate max-w-[90px] sm:max-w-none">{roleLabel}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showRoleMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowRoleMenu(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lifted border border-borderRule py-2 z-50 text-xs animate-in fade-in duration-150">
                  <div className="px-3 py-1 font-black text-charcoal-muted uppercase tracking-wider text-[10px] border-b border-borderRule/60 mb-1">
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
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-sand transition-colors ${
                          isSelected ? 'bg-terracotta-light/50 font-black text-charcoal' : 'text-charcoal'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span 
                            className="w-6 h-6 rounded-lg text-white font-black text-[10px] flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: acc.avatarBg || '#C85A32' }}
                          >
                            {acc.name[0]}
                          </span>
                          <div className="truncate">
                            <span className="font-extrabold block truncate leading-tight">{acc.name}</span>
                            <span className="text-[10px] text-charcoal-muted truncate block">{acc.badge}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-terracotta flex-shrink-0 ml-1" />}
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
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emergency-container text-emergency border border-emergency/25 text-xs font-black hover:bg-emergency hover:text-white transition-colors"
            title={`${pendingAlertCount} actionable alerts in your family health circle`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.alertsBadge || 'Alerts'} ({pendingAlertCount})</span>
            <span className="sm:hidden">{pendingAlertCount}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-2.5 py-1 rounded-xl bg-sand hover:bg-sand-variant text-charcoal text-xs font-bold flex items-center gap-1 border border-borderRule"
              aria-label="Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-charcoal-muted" />
              <span className="uppercase text-[11px] font-black">{household.language || 'en'}</span>
              <ChevronDown className="w-3 h-3 text-charcoal-muted" />
            </button>

            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lifted border border-borderRule py-2 z-50 text-xs animate-in fade-in duration-150">
                  <div className="px-3 py-1 font-black text-charcoal-muted uppercase tracking-wider text-[10px] border-b border-borderRule/60 mb-1">
                    Vernacular Localization
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onChangeLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-terracotta-light transition-colors ${
                        household.language === l.code ? 'font-black text-terracotta bg-terracotta-light/60' : 'text-charcoal'
                      }`}
                    >
                      <span>{l.name}</span>
                      {household.language === l.code && <Check className="w-4 h-4 text-terracotta" />}
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
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-terracotta text-white font-black text-xs shadow-xs flex items-center justify-center border-2 border-white touch-target cursor-pointer hover:scale-105 transition-transform"
              style={{ backgroundColor: currentUser?.avatarBg || '#C85A32' }}
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
