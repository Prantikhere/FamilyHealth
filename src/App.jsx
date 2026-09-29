import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import FamilyRibbon from './components/FamilyRibbon';
import DashboardView from './components/DashboardView';
import DocumentCaptureView from './components/DocumentCaptureView';
import FamilyTreeRiskView from './components/FamilyTreeRiskView';
import MCHPortalView from './components/MCHPortalView';
import ExpenseLedgerView from './components/ExpenseLedgerView';
import EmergencyICECard from './components/EmergencyICECard';
import AddMemberModal from './components/AddMemberModal';
import DataExportModal from './components/DataExportModal';
import OnboardingModal from './components/OnboardingModal';
import LoginScreen, { DUMMY_ACCOUNTS } from './components/LoginScreen';
import BottomNav from './components/BottomNav';
import { storage } from './services/storage';

const USER_STORAGE_KEY = 'afrihealth_current_user_v1';

export default function App() {
  const [household, setHousehold] = useState(() => storage.load());
  const [selectedMemberId, setSelectedMemberId] = useState('ALL');
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [activeTab, setActiveTab] = useState('DASHBOARD'); // 'DASHBOARD' | 'CAPTURE' | 'MCH' | 'TREE' | 'EXPENSES'
  
  // Authentication & Current User State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.warn('Could not read user from localStorage:', e);
    }
    // Default to Amina Bello for seamless initial view, or null if logged out
    return DUMMY_ACCOUNTS[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Modals state
  const [iceModalMember, setIceModalMember] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

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
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [currentUser]);

  // Filtered records based on active profile tab
  const activeRecords = useMemo(() => {
    if (selectedMemberId === 'ALL') return household.records;
    return household.records.filter((r) => r.memberId === selectedMemberId);
  }, [household.records, selectedMemberId]);

  // Auth Handlers
  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    setIsAuthenticated(true);
    setActiveTab('DASHBOARD');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Handler: Add OCR/Physical document record
  const handleAddRecord = (newRec) => {
    setHousehold((prev) => ({
      ...prev,
      records: [newRec, ...prev.records],
    }));
    setActiveTab('DASHBOARD');
  };

  // Handler: Add new family member
  const handleAddMember = (newMember) => {
    setHousehold((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }));
    setShowAddMemberModal(false);
    setSelectedMemberId(newMember.id);
  };

  // Handler: Log cash expense
  const handleAddExpense = (newExpense) => {
    setHousehold((prev) => ({
      ...prev,
      records: [newExpense, ...prev.records],
    }));
  };

  // Handler: Update child vaccine status
  const handleUpdateVaccine = (memberId, vacId, completed) => {
    setHousehold((prev) => ({
      ...prev,
      members: prev.members.map((m) => {
        if (m.id === memberId && m.vaccinesDue) {
          return {
            ...m,
            vaccinesDue: m.vaccinesDue.map((v) => 
              v.id === vacId ? { ...v, completed, completedDate: completed ? new Date().toISOString().split('T')[0] : null } : v
            )
          };
        }
        return m;
      })
    }));
  };

  // Handler: Add child growth point
  const handleAddGrowthPoint = (memberId, growthPoint) => {
    setHousehold((prev) => ({
      ...prev,
      members: prev.members.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            growthRecords: [...(m.growthRecords || []), growthPoint]
          };
        }
        return m;
      })
    }));
  };

  // Handler: Dismiss / mark alert done
  const handleMarkAlertDone = (item) => {
    if (item.category === 'VACCINE' && item.memberId) {
      const vac = household.members.find(m => m.id === item.memberId)?.vaccinesDue?.find(v => item.title.includes(v.name));
      if (vac) {
        handleUpdateVaccine(item.memberId, vac.id, true);
        alert(`Recorded ${vac.name} as completed for ${item.memberName}.`);
        return;
      }
    }
    alert(`Action logged: "${item.title}" marked as resolved with community health clinic.`);
  };

  // Handler: Reset demo dataset
  const handleResetData = () => {
    if (confirm('Reset to initial household demo data?')) {
      const initial = storage.reset();
      setHousehold(initial);
      setSelectedMemberId('ALL');
      setActiveTab('DASHBOARD');
    }
  };

  // If user is not authenticated, display full Login Screen
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-shell bg-canvas text-slate-900">
      {/* 1. TOP HEADER & STATUS BAR */}
      <Header
        household={household}
        currentUser={currentUser}
        isOffline={isOffline}
        onOpenExport={() => setShowExportModal(true)}
        onOpenTrust={() => setShowExportModal(true)}
        onResetData={handleResetData}
        onChangeLanguage={(lang) => setHousehold(prev => ({ ...prev, language: lang }))}
        onLogout={handleLogout}
      />

      {/* 2. HOUSEHOLD HORIZONTAL AVATAR RIBBON */}
      <FamilyRibbon
        members={household.members}
        selectedMemberId={selectedMemberId}
        onSelectMember={(id) => setSelectedMemberId(id)}
        onOpenAddMember={() => setShowAddMemberModal(true)}
      />

      {/* 3. MAIN WORKSPACE / SCREEN SWITCHER */}
      <main className="flex-1 flex flex-col min-h-0" role="main">
        {activeTab === 'DASHBOARD' && (
          <DashboardView
            household={household}
            records={activeRecords}
            selectedMemberId={selectedMemberId}
            currentUser={currentUser}
            onOpenICE={(member) => setIceModalMember(member)}
            onNavigateCapture={() => setActiveTab('CAPTURE')}
            onNavigateMCH={() => setActiveTab('MCH')}
            onNavigateTree={() => setActiveTab('TREE')}
            onNavigateExpenses={() => setActiveTab('EXPENSES')}
            onMarkAlertDone={handleMarkAlertDone}
          />
        )}

        {activeTab === 'CAPTURE' && (
          <DocumentCaptureView
            members={household.members}
            onSave={handleAddRecord}
            onCancel={() => setActiveTab('DASHBOARD')}
          />
        )}

        {activeTab === 'MCH' && (
          <MCHPortalView
            household={household}
            onUpdateVaccine={handleUpdateVaccine}
            onAddGrowthPoint={handleAddGrowthPoint}
          />
        )}

        {activeTab === 'TREE' && (
          <FamilyTreeRiskView
            household={household}
          />
        )}

        {activeTab === 'EXPENSES' && (
          <ExpenseLedgerView
            household={household}
            onAddExpense={handleAddExpense}
          />
        )}
      </main>

      {/* 4. PERSISTENT MOBILE-FIRST BOTTOM NAVIGATION */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* 5. FULLSCREEN EMERGENCY ICE MODAL */}
      {iceModalMember && (
        <EmergencyICECard
          member={iceModalMember}
          household={household}
          onClose={() => setIceModalMember(null)}
        />
      )}

      {/* 6. ADD MEMBER MODAL */}
      {showAddMemberModal && (
        <AddMemberModal
          onClose={() => setShowAddMemberModal(false)}
          onSave={handleAddMember}
        />
      )}

      {/* 7. DATA SOVEREIGN EXPORT & NDPR MODAL */}
      {showExportModal && (
        <DataExportModal
          household={household}
          onImportData={(imported) => setHousehold(imported)}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* 8. ONBOARDING ANCHOR SETUP MODAL (IF TRIGGERED) */}
      {showOnboardingModal && (
        <OnboardingModal
          household={household}
          onComplete={(updates) => {
            setHousehold(prev => ({ ...prev, ...updates }));
            setShowOnboardingModal(false);
          }}
        />
      )}
    </div>
  );
}
