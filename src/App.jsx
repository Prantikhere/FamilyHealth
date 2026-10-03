import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CircleView from './components/CircleView';
import TimelineView from './components/TimelineView';
import EmergencySOSView from './components/EmergencySOSView';
import EmergencyICECard from './components/EmergencyICECard';
import AddMemberModal from './components/AddMemberModal';
import MemberProfileModal from './components/MemberProfileModal';
import OcrScannerModal from './components/OcrScannerModal';
import LoginScreen, { DUMMY_ACCOUNTS } from './components/LoginScreen';
import LandingPage from './components/LandingPage';
import BottomNav from './components/BottomNav';
import { storage } from './services/storage';
import { VERNACULAR_TRANSLATIONS } from './constants/initialData';
import { TRANSLATIONS } from './services/i18n';

const USER_STORAGE_KEY = 'familyhealth_current_user_v2';
const VIEW_MODE_KEY = 'familyhealth_view_mode_v2';

export default function App() {
  const [household, setHousehold] = useState(() => storage.load());
  const [selectedMemberId, setSelectedMemberId] = useState(() => household.members?.[0]?.id || 'mem_femi');
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  
  // Persistent 3-Hub Tabs: 'CIRCLE' | 'TIMELINE' | 'SOS' (Section 2.2 Wireframe)
  const [activeTab, setActiveTab] = useState('CIRCLE');

  // Navigation View Mode: 'LANDING' | 'LOGIN' | 'APP'
  const getInitialViewMode = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#app' || hash === '#circle' || hash === '#timeline' || hash === '#sos') return 'APP';
      if (hash === '#login') return 'LOGIN';
      if (hash === '#landing') return 'LANDING';
    }
    return 'LANDING';
  };

  const [viewMode, setViewModeState] = useState(getInitialViewMode);

  const setViewMode = (mode) => {
    setViewModeState(mode);
    if (typeof window !== 'undefined') {
      if (mode === 'APP') {
        window.location.hash = activeTab.toLowerCase();
      } else if (mode === 'LOGIN') {
        window.location.hash = 'login';
      } else {
        window.location.hash = 'landing';
      }
    }
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#circle') {
        setViewModeState('APP');
        setActiveTab('CIRCLE');
      } else if (hash === '#timeline') {
        setViewModeState('APP');
        setActiveTab('TIMELINE');
      } else if (hash === '#sos') {
        setViewModeState('APP');
        setActiveTab('SOS');
      } else if (hash === '#app') {
        setViewModeState('APP');
      } else if (hash === '#login') {
        setViewModeState('LOGIN');
      } else {
        setViewModeState('LANDING');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when tab changes in APP mode
  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab.toLowerCase();
    }
  };

  // Current User State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.warn('Could not read user from localStorage:', e);
    }
    return DUMMY_ACCOUNTS[0];
  });

  // Modals state
  const [iceModalMember, setIceModalMember] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [showOcrModal, setShowOcrModal] = useState(false);

  // Monitor network online/offline state
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Persist household to local storage
  useEffect(() => {
    storage.save(household);
  }, [household]);

  // Persist user to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Auth & View Handlers
  const handleLoginSuccess = (userObj) => {
    handleSwitchUser(userObj);
    setViewMode('APP');
    setActiveTab('CIRCLE');
  };

  const handleLogout = () => {
    setViewMode('LOGIN');
  };

  const handleSwitchUser = (userObj) => {
    setCurrentUser(userObj);
    const role = userObj?.role || '';
    if (role.includes('CHEW') || role.includes('Community Health')) {
      setSelectedMemberId('mem_tunde');
    } else if (role.includes('Elder') || role.includes('Dependent') || userObj?.name?.includes('Baba')) {
      setSelectedMemberId('mem_baba');
    } else {
      setSelectedMemberId('mem_femi');
    }
    setActiveTab('CIRCLE');
  };

  const handleSelectDemoPersona = (personaIndex) => {
    const persona = DUMMY_ACCOUNTS[personaIndex] || DUMMY_ACCOUNTS[0];
    handleSwitchUser({
      name: persona.name,
      email: persona.email,
      role: persona.role,
      badge: persona.badge,
      clinic: persona.clinic,
      avatarBg: persona.avatarBg,
      isOfflineDemo: false,
    });
    setViewMode('APP');
    setActiveTab('CIRCLE');
  };

  // Handler: Add new family member or update existing
  const handleSaveMemberProfile = (updatedMember) => {
    setHousehold((prev) => {
      const exists = prev.members.some(m => m.id === updatedMember.id);
      const newMembers = exists
        ? prev.members.map(m => m.id === updatedMember.id ? updatedMember : m)
        : [...prev.members, updatedMember];
      return {
        ...prev,
        members: newMembers,
      };
    });
    setEditingMember(null);
    setShowAddMemberModal(false);
    setSelectedMemberId(updatedMember.id);
  };

  // Handler: Save OCR extracted record
  const handleSaveOcrRecord = (newRecord) => {
    const formattedRecord = {
      id: newRecord.id || `rec_${Date.now()}`,
      memberId: newRecord.memberId || selectedMemberId,
      provenance: 'OFFICIAL_VERIFIED',
      title: `${newRecord.type || 'Prescription'}: ${newRecord.provider || 'Clinical Outpost'}`,
      issuerName: newRecord.provider || 'Lagos State Health Post',
      issuerId: 'iss_lagos_ocr_99',
      recordedDate: newRecord.date || new Date().toISOString().split('T')[0],
      category: newRecord.category || 'Medication',
      details: newRecord.details || 'Scanned record processed on-device via WASM OCR.',
      cost: Number(newRecord.cost) || 0,
      attestationSignature: 'ed25519_sig_ocr_' + Math.random().toString(36).substr(2, 8),
      voiceNote: newRecord.voiceNote,
      ocrConfidence: newRecord.confidence || 95,
      offlineCached: true,
    };

    setHousehold((prev) => ({
      ...prev,
      records: [formattedRecord, ...prev.records],
      completenessScore: Math.min(100, (prev.completenessScore || 88) + 2),
    }));
    setShowOcrModal(false);
  };

  // Handler: Reset demo dataset
  const handleResetData = () => {
    if (confirm('Reset to initial FamilyHealth LLD demo dataset?')) {
      const initial = storage.reset();
      setHousehold(initial);
      setSelectedMemberId(initial.members[0].id);
      setActiveTab('CIRCLE');
    }
  };

  // Current Translations (Unified i18n dictionary)
  const currentLang = household.language || 'en';
  const translations = useMemo(() => {
    const v1 = VERNACULAR_TRANSLATIONS[currentLang] || VERNACULAR_TRANSLATIONS['en'];
    const v2 = TRANSLATIONS[currentLang] || TRANSLATIONS['en'];
    return { ...v1, ...v2 };
  }, [currentLang]);

  // 1. LANDING PAGE VIEW (Investor & Product Overview Showcase)
  if (viewMode === 'LANDING') {
    return (
      <LandingPage
        onEnterApp={(showCredentials) => setViewMode(showCredentials ? 'LOGIN' : 'APP')}
        onSelectDemoUser={handleSelectDemoPersona}
      />
    );
  }

  // 2. LOGIN SECTION VIEW (With Demo Credentials for User Acceptance)
  if (viewMode === 'LOGIN') {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onBackToLanding={() => setViewMode('LANDING')}
      />
    );
  }

  // 3. MAIN 3-HUB APPLICATION VIEW (Section 2.2 Wireframe Topology)
  return (
    <div className="app-shell bg-canvas text-charcoal">
      
      {/* PERSISTENT TOP APP BAR */}
      <Header
        household={household}
        currentUser={currentUser}
        isOffline={isOffline}
        onChangeLanguage={(lang) => setHousehold(prev => ({ ...prev, language: lang }))}
        onResetData={handleResetData}
        onLogout={handleLogout}
        onNavigateLanding={() => setViewMode('LANDING')}
        onOpenAlerts={() => setShowAlertsModal(true)}
        onOpenOcr={() => setShowOcrModal(true)}
        translations={translations}
      />

      {/* MAIN 3-HUB WORKSPACE */}
      <main className="flex-1 px-4 pt-3 pb-8 min-h-0" role="main">
        
        {/* TAB 1: CIRCLE (Family Lineage DAG & Context Engine) */}
        {activeTab === 'CIRCLE' && (
          <CircleView
            household={household}
            selectedMemberId={selectedMemberId}
            onSelectMember={(id) => setSelectedMemberId(id)}
            onOpenICE={(member) => setIceModalMember(member)}
            onOpenAddMember={() => setShowAddMemberModal(true)}
            onEditMember={(member) => setEditingMember(member)}
            currentUser={currentUser}
            currentLang={currentLang}
            translations={translations}
          />
        )}

        {/* TAB 2: TIMELINE (Dual-Tier Chronological Ledger & Granular Transfer) */}
        {activeTab === 'TIMELINE' && (
          <TimelineView
            household={household}
            onOpenOcr={() => setShowOcrModal(true)}
            currentUser={currentUser}
            currentLang={currentLang}
            translations={translations}
          />
        )}

        {/* TAB 3: SOS (Zero-Click Crisis Health Card & Care Triage) */}
        {activeTab === 'SOS' && (
          <EmergencySOSView
            household={household}
            selectedMemberId={selectedMemberId}
            onSelectMember={(id) => setSelectedMemberId(id)}
            currentUser={currentUser}
            currentLang={currentLang}
            translations={translations}
          />
        )}

      </main>

      {/* PERSISTENT 3-HUB BOTTOM NAVIGATION (72px touch-optimized) */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        translations={translations}
      />

      {/* FULLSCREEN EMERGENCY ICE MODAL */}
      {iceModalMember && (
        <EmergencyICECard
          member={iceModalMember}
          household={household}
          onClose={() => setIceModalMember(null)}
        />
      )}

      {/* ADD / CREATE MEMBER MODAL WITH PHOTO & GENOTYPE */}
      {showAddMemberModal && (
        <MemberProfileModal
          isNew={true}
          onClose={() => setShowAddMemberModal(false)}
          onSave={handleSaveMemberProfile}
          translations={translations}
        />
      )}

      {/* EDIT INDIVIDUAL MEMBER PROFILE & PHOTO MODAL */}
      {editingMember && (
        <MemberProfileModal
          member={editingMember}
          isNew={false}
          onClose={() => setEditingMember(null)}
          onSave={handleSaveMemberProfile}
          translations={translations}
        />
      )}

      {/* OCR SCANNER MODAL */}
      {showOcrModal && (
        <OcrScannerModal
          members={household.members}
          onSaveRecord={handleSaveOcrRecord}
          onClose={() => setShowOcrModal(false)}
          translations={translations}
        />
      )}

      {/* PENDING ALERTS MODAL */}
      {showAlertsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="surface-card w-full max-w-md p-5 space-y-4 shadow-lifted">
            <div className="flex items-center justify-between border-b border-borderRule pb-2">
              <h3 className="text-sm font-black text-charcoal">Actionable Health Alerts</h3>
              <button 
                onClick={() => setShowAlertsModal(false)}
                className="text-xs font-bold text-charcoal-muted hover:text-charcoal"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-2">
              {household.pendingAlerts?.map(alert => (
                <div 
                  key={alert.id}
                  className={`p-3 rounded-xl text-xs border ${
                    alert.urgent 
                      ? 'bg-emergency-container text-emergency border-emergency/25' 
                      : 'bg-ochre-container text-charcoal border-ochre/25'
                  }`}
                >
                  <span className="font-bold block">{alert.text}</span>
                  <button
                    onClick={() => {
                      setSelectedMemberId(alert.memberId);
                      setActiveTab('CIRCLE');
                      setShowAlertsModal(false);
                    }}
                    className="text-[11px] font-black underline uppercase tracking-wider mt-1 block"
                  >
                    View in Circle Tab →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
