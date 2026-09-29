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
import BottomNav from './components/BottomNav';
import { storage } from './services/storage';

export default function App() {
  const [household, setHousehold] = useState(() => storage.load());
  const [selectedMemberId, setSelectedMemberId] = useState('ALL');
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [activeTab, setActiveTab] = useState('DASHBOARD'); // 'DASHBOARD' | 'CAPTURE' | 'MCH' | 'TREE' | 'EXPENSES'
  
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

  // Persist to local storage whenever household changes
  useEffect(() => {
    storage.save(household);
  }, [household]);

  // Filtered records based on active profile tab
  const activeRecords = useMemo(() => {
    if (selectedMemberId === 'ALL') return household.records;
    return household.records.filter((r) => r.memberId === selectedMemberId);
  }, [household.records, selectedMemberId]);

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
      // Find and mark completed
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

  return (
    <div className="app-shell bg-canvas text-slate-900">
      {/* 1. TOP HEADER & STATUS BAR */}
      <Header
        household={household}
        isOffline={isOffline}
        onOpenExport={() => setShowExportModal(true)}
        onOpenTrust={() => setShowExportModal(true)}
        onResetData={handleResetData}
        onChangeLanguage={(lang) => setHousehold(prev => ({ ...prev, language: lang }))}
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
            onOpenICE={(member) => setIceModalMember(member)}
            onNavigateCapture={() => setActiveTab('CAPTURE')}
            onNavigateMCH={() => setActiveTab('MCH')}
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
