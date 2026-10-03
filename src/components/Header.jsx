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
  ChevronDown
} from 'lucide-react';

export default function Header({
  household,
  currentUser,
  isOffline,
  onChangeLanguage,
  onResetData,
  onLogout,
  onNavigateLanding,
  onOpenAlerts
}) {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const languages = [
    { code: 'en', name: 'English (UK / West Africa)' },
    { code: 'pcm', name: 'Nigerian Pidgin (Vernacular)' },
    { code: 'yo', name: 'Èdè Yorùbá' },
    { code: 'ha', name: 'Harshen Hausa' },
    { code: 'ig', name: 'Asụsụ Igbo' },
  ];

  const pendingAlertCount = household.pendingAlerts?.length || 2;

  return (
    <header className="sticky top-0 z-30 bg-chalk/90 backdrop-blur-md border-b border-borderRule px-4 py-3 shadow-subtle" role="banner">
      <div className="flex items-center justify-between gap-2">
        
        {/* 1. BRAND IDENTITY & HOME CLICK */}
        <button
          onClick={onNavigateLanding}
          className="flex items-center gap-2.5 min-w-0 text-left group touch-target cursor-pointer hover:opacity-95 transition-opacity"
          title="Return to FamilyHealth Product Showcase & Overview"
        >
          <div className="w-10 h-10 rounded-2xl bg-terracotta flex items-center justify-center text-white shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black text-charcoal tracking-tight leading-none group-hover:text-terracotta transition-colors">
                FamilyHealth
              </h1>
              <span className="text-[9px] uppercase font-black bg-terracotta-container text-terracotta px-1.5 py-0.2 rounded-full border border-terracotta/20">
                AFRICA
              </span>
            </div>
            <p className="text-[11px] text-charcoal-muted font-medium truncate mt-0.5">
              Circle: <span className="font-bold text-charcoal">{household.head}</span>
            </p>
          </div>
        </button>

        {/* 2. ACTION CONTROLS & STATUS */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          
          {/* Offline / Synced Indicator (Section 1.2 NFR Resilience) */}
          <div 
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${
              isOffline 
                ? 'bg-amber-100 text-amber-900 border-amber-300' 
                : 'bg-forest-light text-forest border-forest/30'
            }`}
            title={isOffline ? 'Offline SQLCipher queue active.' : 'Synced to GCP Edge PoP (Lagos). AES-256-GCM Zero-Knowledge.'}
          >
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-600 animate-pulse' : 'bg-forest'}`} />
            <span className="hidden sm:inline">
              {isOffline ? 'Offline (SQLCipher)' : 'Synced (Edge PoP)'}
            </span>
          </div>

          {/* Pending Alerts Counter Pill */}
          <button
            onClick={onOpenAlerts}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emergency-container text-emergency border border-emergency/25 text-xs font-black hover:bg-emergency hover:text-white transition-colors"
            title={`${pendingAlertCount} actionable alerts in your family health circle`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alerts ({pendingAlertCount})</span>
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
              className="w-9 h-9 rounded-2xl bg-terracotta text-white font-black text-xs shadow-xs flex items-center justify-center border-2 border-white touch-target cursor-pointer hover:scale-105 transition-transform"
              style={{ backgroundColor: currentUser?.avatarBg || '#C85A32' }}
              title={`Logged in as ${currentUser?.name || 'Femi Adeyemi'}`}
              aria-label="User Account Menu"
            >
              {currentUser?.name?.[0] || 'F'}
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-lifted border border-borderRule py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                  
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
