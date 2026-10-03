import React, { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  QrCode, 
  HeartPulse, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Dna, 
  Activity, 
  Calendar, 
  Plus, 
  Edit3,
  Camera,
  Sparkles,
  Baby,
  UserCheck,
  Stethoscope,
  Info,
  Lock,
  Filter
} from 'lucide-react';
import ProfessionalFamilyTree from './ProfessionalFamilyTree';

export default function CircleView({
  household,
  selectedMemberId,
  onSelectMember,
  onOpenICE,
  onOpenAddMember,
  onEditMember,
  currentUser,
  currentLang = 'en',
  translations
}) {
  const [activeTab, setActiveTab] = useState('LINEAGE'); // 'LINEAGE' | 'MEMBERS'
  const t = translations || {};

  // Determine user role perspective
  const role = currentUser?.role || '';
  const isChew = role.includes('CHEW') || role.includes('Community Health');
  const isDoctor = role.includes('Emergency') || role.includes('Clinician') || role.includes('Cardiologist');
  const isSenior = role.includes('Elder') || role.includes('Dependent') || currentUser?.name?.includes('Baba');

  // Filter visible members based on user role
  const visibleMembers = React.useMemo(() => {
    if (isChew) {
      // CHEW nurse: Pediatric & maternal care (G2 children and Sade)
      return household.members.filter(m => m.generation === 'G2' || m.id === 'mem_sade' || m.relation?.includes('Mother') || m.relation?.includes('Wife'));
    }
    if (isSenior) {
      // Elder dependent: Only Baba's own records
      return household.members.filter(m => m.id === 'mem_baba' || m.relation?.includes('Grandfather'));
    }
    return household.members;
  }, [household.members, isChew, isSenior]);

  // Selected member or default
  const activeMember = visibleMembers.find(m => m.id === selectedMemberId) || visibleMembers[0] || household.members[0];

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200">
      
      {/* 1. ROLE PERSPECTIVE NOTIFICATION BANNER (Minimalist Monochrome) */}
      {isChew && (
        <div className="bg-zinc-100 border border-zinc-200 text-zinc-900 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block uppercase tracking-wider text-[11px] text-zinc-950">
                {t.chewPerspective || 'CHEW Maternal & Child Health Mode Active'}
              </span>
              <p className="text-[11px] text-zinc-600 font-medium">
                {t.chewNotice || 'Filtered to G2 pediatric dependents (Tunde, Kehinde) & maternal records (Sade). G0 elder profiles restricted.'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase bg-zinc-900 text-white px-2.5 py-0.5 rounded-full flex-shrink-0">
            PHC Scope
          </span>
        </div>
      )}

      {isDoctor && (
        <div className="bg-zinc-900 border border-zinc-900 text-white p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white text-zinc-950 flex items-center justify-center flex-shrink-0 font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block uppercase tracking-wider text-[11px] text-white">
                {t.doctorPerspective || 'Emergency Clinician / Trauma Triage Mode'}
              </span>
              <p className="text-[11px] text-zinc-300 font-medium">
                {t.doctorNotice || 'Zero-click access to blood group, sickle cell genotype, drug allergies, and offline resuscitation orders.'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase bg-white text-zinc-950 px-2.5 py-0.5 rounded-full flex-shrink-0">
            Trauma ICE
          </span>
        </div>
      )}

      {isSenior && (
        <div className="bg-zinc-100 border border-zinc-200 text-zinc-900 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center flex-shrink-0">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block uppercase tracking-wider text-[11px] text-zinc-950">
                {t.seniorPerspective || 'Personal Senior Health Portal (Baba Adeyemi)'}
              </span>
              <p className="text-[11px] text-zinc-600 font-medium">
                {t.seniorNotice || 'Personal hypertension tracking, daily Losartan / Amlodipine regimen, and personal ICE emergency card.'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase bg-zinc-900 text-white px-2.5 py-0.5 rounded-full flex-shrink-0">
            G0 Senior
          </span>
        </div>
      )}

      {/* 2. EMERGENCY QUICK-ACTION STRIP (Section 2.2 Wireframe - Minimalist Inverted Black) */}
      <div className="bg-zinc-950 text-white rounded-2xl p-4 shadow-card border border-zinc-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white text-zinc-950 px-2 py-0.5 rounded-md">
                <ShieldAlert className="w-3 h-3 text-zinc-950" />
                {t.emergencyPass || 'EMERGENCY HEALTH PASS'}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {activeMember?.name} ({activeMember?.generation})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold pt-0.5">
              <span className="text-white">{t.bloodGroup || 'Blood'}: <span className="bg-zinc-800 text-zinc-100 px-1.5 py-0.2 rounded font-mono font-bold">{activeMember?.bloodGroup}</span></span>
              <span className="text-zinc-600">•</span>
              <span className="text-white">{t.genotype || 'Genotype'}: <span className="bg-zinc-800 text-zinc-100 px-1.5 py-0.2 rounded font-mono font-bold">{activeMember?.genotype}</span></span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300 font-medium">Allergies: {activeMember?.allergies?.join(', ') || 'None'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditMember?.(activeMember)}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 border border-zinc-700 transition-all cursor-pointer"
              title="Edit Member Photo & Profile"
            >
              <Camera className="w-3.5 h-3.5 text-zinc-300" />
              <span>{t.editPhoto || 'Edit Photo'}</span>
            </button>

            <button
              onClick={() => onOpenICE(activeMember)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-xs active:scale-95 transition-all touch-target cursor-pointer border border-white"
              title="Launch Air-gapped Offline QR Emergency Medical Pass"
            >
              <QrCode className="w-4 h-4 text-zinc-950" />
              <span>{t.showQr || 'SHOW QR PASS'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. FAMILY HEALTH COMPLETENESS MATRIX (FR-11) */}
      {!isSenior && (
        <div className="surface-card p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-950" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                {t.completenessIndex || 'Family Health Completeness Index'}
              </h2>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-900 border border-zinc-200">
              {household.completenessScore || 88}% {t.percentComplete || 'Complete'}
            </span>
          </div>

          {/* Minimalist Monochrome Progress Bar */}
          <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden mb-3 border border-zinc-200">
            <div 
              className="bg-zinc-950 h-full rounded-full transition-all duration-500"
              style={{ width: `${household.completenessScore || 88}%` }}
            />
          </div>

          {/* Actionable Alert Chips */}
          <div className="space-y-1.5">
            {household.pendingAlerts?.map(alert => (
              <div 
                key={alert.id}
                className="flex items-start gap-2 p-2.5 rounded-xl text-xs bg-zinc-50 text-zinc-900 border border-zinc-200"
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-zinc-700" />
                <div className="flex-1">
                  <span className="font-semibold">{alert.text}</span>
                </div>
                <button 
                  onClick={() => onSelectMember(alert.memberId)}
                  className="text-[10px] font-bold uppercase tracking-wider underline hover:text-black cursor-pointer"
                >
                  {t.inspect || 'Inspect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VIEW TOGGLE: VISUAL PEDIGREE DAG vs MEMBER ROSTER */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
          <button
            onClick={() => setActiveTab('LINEAGE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'LINEAGE' 
                ? 'bg-zinc-950 text-white shadow-xs' 
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            {t.lineageCanvas || 'Visual Lineage Graph (DAG)'}
          </button>
          <button
            onClick={() => setActiveTab('MEMBERS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'MEMBERS' 
                ? 'bg-zinc-950 text-white shadow-xs' 
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            {t.memberRoster || 'Member Roster'} ({visibleMembers.length})
          </button>
        </div>

        {!isSenior && (
          <button
            onClick={onOpenAddMember}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white shadow-xs transition-colors cursor-pointer border border-zinc-900"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addDependent || 'Add Dependent'}</span>
          </button>
        )}
      </div>

      {/* 5A. PROFESSIONAL CLINICAL PEDIGREE TREE COMPONENT */}
      {activeTab === 'LINEAGE' && (
        <ProfessionalFamilyTree
          household={{
            ...household,
            members: visibleMembers
          }}
          selectedMemberId={activeMember?.id}
          onSelectMember={onSelectMember}
          onEditMember={onEditMember}
          translations={translations}
        />
      )}

      {/* 5B. MEMBER ROSTER LIST WITH PHOTOS & EDIT PROFILE */}
      {activeTab === 'MEMBERS' && (
        <div className="space-y-3">
          {visibleMembers.map(member => (
            <div
              key={member.id}
              onClick={() => onSelectMember(member.id)}
              className={`surface-card p-4 cursor-pointer transition-all hover:border-zinc-400 border ${
                activeMember?.id === member.id ? 'ring-1 ring-zinc-950 border-zinc-950 bg-zinc-50/50' : 'border-zinc-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Member Photo / Minimalist Avatar */}
                  <div className="relative">
                    {member.avatarUrl ? (
                      <img 
                        src={member.avatarUrl} 
                        alt={member.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-zinc-300 shadow-xs" 
                      />
                    ) : (
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-xs border border-zinc-300 bg-zinc-900"
                      >
                        {member.avatarIcon || (member.firstName?.[0] || 'A')}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-zinc-950 text-white px-1.5 py-0.2 rounded border border-white">
                      {member.generation}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-zinc-950">{member.name}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
                        {member.statusNote || 'Active'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">
                      {member.relation} • Born: {member.dob}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditMember?.(member);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold flex items-center gap-1 transition-colors border border-zinc-200 cursor-pointer"
                    title="Edit Profile & Photo"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{t.editProfile || 'Edit Profile'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenICE(member);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border border-zinc-900"
                    title="Open Offline Emergency Pass"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>ICE PASS</span>
                  </button>
                </div>
              </div>

              {/* Clinical Attributes Strip */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-zinc-100 text-center text-xs">
                <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 block font-medium">{t.bloodGroup || 'Blood Group'}</span>
                  <span className="font-bold text-zinc-950 font-mono">{member.bloodGroup}</span>
                </div>
                <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 block font-medium">{t.genotype || 'Genotype'}</span>
                  <span className="font-bold text-zinc-950 font-mono">
                    {member.genotype}
                  </span>
                </div>
                <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 block font-medium">{t.resuscitation || 'Resuscitation'}</span>
                  <span className="font-semibold text-zinc-950 truncate block">
                    {member.resuscitationOrder || 'Full Code'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. INSPECTED MEMBER CLINICAL DOSSIER */}
      {activeMember && (
        <div className="surface-card p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-3">
              {/* Photo */}
              {activeMember.avatarUrl ? (
                <img 
                  src={activeMember.avatarUrl} 
                  alt={activeMember.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-zinc-300 shadow-xs" 
                />
              ) : (
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-xs border border-zinc-300 bg-zinc-900"
                >
                  {activeMember.avatarIcon || (activeMember.firstName?.[0] || 'A')}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-zinc-950">
                    {activeMember.name}
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                    {activeMember.generation}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  {activeMember.relation} • {activeMember.gender || 'Not specified'} • Born: {activeMember.dob}
                </p>
              </div>
            </div>

            <button
              onClick={() => onEditMember?.(activeMember)}
              className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-xs flex items-center gap-1.5 border border-zinc-300 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t.editProfile || 'Edit Profile & Photo'}</span>
            </button>
          </div>

          {/* Chronic Conditions & Allergies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                Known Drug Allergies
              </span>
              <span className="font-semibold text-zinc-900">
                {activeMember.allergies && activeMember.allergies.length > 0 
                  ? activeMember.allergies.join(', ') 
                  : 'No known drug allergies (NKDA)'}
              </span>
            </div>

            <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                Chronic Clinical Conditions
              </span>
              <span className="font-semibold text-zinc-900">
                {activeMember.chronicConditions && activeMember.chronicConditions.length > 0 
                  ? activeMember.chronicConditions.join(', ') 
                  : 'None registered'}
              </span>
            </div>
          </div>

          {/* Active Prescriptions / Clinical Regimen */}
          {activeMember.regimen && activeMember.regimen.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 block">
                {t.activeRegimen || 'Active Clinical Regimen'}:
              </span>
              <div className="space-y-1.5">
                {activeMember.regimen.map((med, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
                    <div>
                      <span className="font-bold text-zinc-900">{med.name}</span>
                      <span className="text-zinc-500 block text-[11px]">{med.dosage}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800">
                      {med.supplyRemainingDays} days left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vaccines Due (If Child G2) */}
          {activeMember.vaccinesDue && activeMember.vaccinesDue.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 block">
                {t.vaccineMilestones || 'Vaccination Milestones'}:
              </span>
              <div className="space-y-1.5">
                {activeMember.vaccinesDue.map(vac => (
                  <div 
                    key={vac.id} 
                    className={`flex items-start justify-between p-2.5 rounded-xl text-xs border ${
                      vac.completed 
                        ? 'bg-zinc-50 text-zinc-900 border-zinc-200' 
                        : 'bg-zinc-100 text-zinc-950 font-bold border-zinc-300'
                    }`}
                  >
                    <div>
                      <span className="font-bold block">{vac.name}</span>
                      <span className="text-[10px] text-zinc-500 block">{vac.notes || `Completed on ${vac.completedDate}`}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {vac.completed ? `✓ ${t.completed || 'Completed'}` : (t.overdue || 'Overdue')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
