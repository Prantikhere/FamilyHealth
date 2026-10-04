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
      
      {/* 1. ROLE PERSPECTIVE NOTIFICATION BANNER (Light Healthcare Tint) */}
      {isChew && (
        <div className="surface-card bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block uppercase tracking-wider text-[11px] text-emerald-950">
                {t.chewPerspective || 'CHEW Maternal & Child Health Mode Active'}
              </span>
              <p className="text-[11px] text-emerald-800 font-medium">
                {t.chewNotice || 'Filtered to G2 pediatric dependents (Tunde, Kehinde) & maternal records (Sade). G0 elder profiles restricted.'}
              </p>
            </div>
          </div>
          <span className="neu-pill text-[10px] font-bold uppercase bg-white text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full flex-shrink-0">
            PHC Scope
          </span>
        </div>
      )}

      {isDoctor && (
        <div className="surface-card bg-blue-50/70 border border-blue-200/80 text-blue-950 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block uppercase tracking-wider text-[11px] text-blue-950">
                {t.doctorPerspective || 'Emergency Clinician / Trauma Triage Mode'}
              </span>
              <p className="text-[11px] text-blue-800 font-medium">
                {t.doctorNotice || 'Zero-click access to blood group, sickle cell genotype, drug allergies, and offline resuscitation orders.'}
              </p>
            </div>
          </div>
          <span className="neu-pill text-[10px] font-bold uppercase bg-white text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full flex-shrink-0">
            Trauma ICE
          </span>
        </div>
      )}

      {isSenior && (
        <div className="surface-card bg-amber-50/70 border border-amber-200/80 text-amber-950 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block uppercase tracking-wider text-[11px] text-amber-950">
                {t.seniorPerspective || 'Personal Senior Health Portal (Baba Adeyemi)'}
              </span>
              <p className="text-[11px] text-amber-800 font-medium">
                {t.seniorNotice || 'Personal hypertension tracking, daily Losartan / Amlodipine regimen, and personal ICE emergency card.'}
              </p>
            </div>
          </div>
          <span className="neu-pill text-[10px] font-bold uppercase bg-white text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full flex-shrink-0">
            G0 Senior
          </span>
        </div>
      )}

      {/* 2. EMERGENCY QUICK-ACTION STRIP (Light Healthcare Elevation) */}
      <div className="surface-card rounded-3xl p-4 sm:p-5 shadow-neu-flat border border-rose-200/80 bg-gradient-to-br from-rose-50/80 via-white to-red-50/30 text-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full">
                <ShieldAlert className="w-3 h-3 text-rose-600" />
                {t.emergencyPass || 'EMERGENCY HEALTH PASS'}
              </span>
              <span className="text-xs text-slate-600 font-mono">
                {activeMember?.name} ({activeMember?.generation})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold pt-0.5">
              <span className="text-slate-800">{t.bloodGroup || 'Blood'}: <span className="bg-white text-rose-700 px-2 py-0.5 rounded-lg font-mono font-black shadow-neu-sm border border-rose-200">{activeMember?.bloodGroup}</span></span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-800">{t.genotype || 'Genotype'}: <span className="bg-white text-indigo-700 px-2 py-0.5 rounded-lg font-mono font-black shadow-neu-sm border border-indigo-200">{activeMember?.genotype}</span></span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 font-medium">Allergies: {activeMember?.allergies?.join(', ') || 'None'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onEditMember?.(activeMember)}
              className="neu-btn h-9 px-3.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 text-slate-700 transition-all cursor-pointer shadow-neu-sm"
              title="Edit Member Photo & Profile"
            >
              <Camera className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.editPhoto || 'Edit Photo'}</span>
            </button>

            <button
              onClick={() => onOpenICE(activeMember)}
              className="neu-btn-danger h-9 px-4 rounded-xl font-extrabold text-xs inline-flex items-center gap-2 shadow-neu-sm active:scale-95 transition-all touch-target cursor-pointer"
              title="Launch Air-gapped Offline QR Emergency Medical Pass"
            >
              <QrCode className="w-4 h-4 text-white" />
              <span>{t.showQr || 'SHOW QR PASS'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. FAMILY HEALTH COMPLETENESS MATRIX (FR-11 - Neumorphic Card) */}
      {!isSenior && (
        <div className="surface-card p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl neu-inset flex items-center justify-center text-slate-800">
                <Activity className="w-4 h-4 text-slate-800" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                {t.completenessIndex || 'Family Health Completeness Index'}
              </h2>
            </div>
            <span className="neu-pill text-xs font-bold shadow-neu-sm">
              {household.completenessScore || 88}% {t.percentComplete || 'Complete'}
            </span>
          </div>

          {/* Neumorphic Inset Progress Bar */}
          <div className="w-full neu-inset h-3 p-0.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 shadow-neu-sm"
              style={{ width: `${household.completenessScore || 88}%` }}
            />
          </div>

          {/* Actionable Alert Chips */}
          <div className="space-y-2 pt-1">
            {household.pendingAlerts?.map(alert => (
              <div 
                key={alert.id}
                className="flex items-center justify-between gap-2.5 p-3 rounded-2xl neu-inset text-xs text-slate-800"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                  <span className="font-semibold text-slate-800">{alert.text}</span>
                </div>
                <button 
                  onClick={() => onSelectMember(alert.memberId)}
                  className="neu-btn px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-800 cursor-pointer shadow-neu-sm flex-shrink-0"
                >
                  {t.inspect || 'Inspect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VIEW TOGGLE: VISUAL PEDIGREE DAG vs MEMBER ROSTER */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 border-b border-white/80 pb-3">
        <div className="neu-segmented p-1">
          <button
            onClick={() => setActiveTab('LINEAGE')}
            className={`neu-segmented-btn h-9 px-3.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'LINEAGE' ? 'active shadow-neu-raised' : ''
            }`}
          >
            {t.lineageCanvas || 'Visual Lineage Graph (DAG)'}
          </button>
          <button
            onClick={() => setActiveTab('MEMBERS')}
            className={`neu-segmented-btn h-9 px-3.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'MEMBERS' ? 'active shadow-neu-raised' : ''
            }`}
          >
            {t.memberRoster || 'Member Roster'} ({visibleMembers.length})
          </button>
        </div>

        {!isSenior && (
          <button
            onClick={onOpenAddMember}
            className="neu-btn-primary h-9 px-3.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 shadow-neu-primary cursor-pointer"
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleMembers.map(member => (
            <div
              key={member.id}
              onClick={() => onSelectMember(member.id)}
              className={`surface-card p-4 sm:p-5 cursor-pointer transition-all ${
                activeMember?.id === member.id ? 'shadow-neu-deep ring-2 ring-blue-500' : 'hover:shadow-neu-raised'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  {/* Member Photo / Avatar */}
                  <div className="relative">
                    {member.avatarUrl ? (
                      <img 
                        src={member.avatarUrl} 
                        alt={member.name}
                        className="w-13 h-13 rounded-2xl object-cover border-2 border-white shadow-neu-raised" 
                      />
                    ) : (
                      <div 
                        className="w-13 h-13 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-neu-raised border-2 border-white bg-gradient-to-br from-blue-500 to-indigo-600"
                      >
                        {member.avatarIcon || (member.firstName?.[0] || 'A')}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.2 rounded-full border border-white shadow-xs">
                      {member.generation}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-slate-800">{member.name}</h3>
                      <span className="neu-pill text-[9px] font-bold shadow-xs">
                        {member.statusNote || 'Active'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
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
                    className="neu-btn h-8 px-3 rounded-xl text-xs font-bold inline-flex items-center gap-1 shadow-neu-sm cursor-pointer"
                    title="Edit Profile & Photo"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.editProfile || 'Edit Profile'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenICE(member);
                    }}
                    className="neu-btn-primary h-8 px-3 rounded-xl text-xs font-extrabold inline-flex items-center gap-1 shadow-neu-sm cursor-pointer"
                    title="Open Offline Emergency Pass"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>ICE PASS</span>
                  </button>
                </div>
              </div>

              {/* Clinical Attributes Strip */}
              <div className="grid grid-cols-3 gap-2.5 mt-3.5 pt-3.5 border-t border-white/80 text-center text-xs">
                <div className="neu-inset p-2.5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 block font-medium">{t.bloodGroup || 'Blood Group'}</span>
                  <span className="font-black text-slate-900 font-mono text-sm">{member.bloodGroup}</span>
                </div>
                <div className="neu-inset p-2.5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 block font-medium">{t.genotype || 'Genotype'}</span>
                  <span className="font-black text-slate-900 font-mono text-sm">
                    {member.genotype}
                  </span>
                </div>
                <div className="neu-inset p-2.5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 block font-medium">{t.resuscitation || 'Resuscitation'}</span>
                  <span className="font-bold text-slate-800 text-[11px] truncate block">
                    {member.resuscitationOrder?.includes('Full') ? 'Full Code' : 'DNR'}
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
