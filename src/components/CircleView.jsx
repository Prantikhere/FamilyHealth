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
      
      {/* 1. ROLE PERSPECTIVE NOTIFICATION BANNER */}
      {isChew && (
        <div className="bg-forest-light border-2 border-forest/30 text-forest p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-forest text-white flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black block uppercase tracking-wider text-[11px]">
                {t.chewPerspective || 'CHEW Maternal & Child Health Mode Active'}
              </span>
              <p className="text-[11px] text-forest/90 font-medium">
                {t.chewNotice || 'Filtered to G2 pediatric dependents (Tunde, Kehinde) & maternal records (Sade). G0 elder profiles restricted.'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase bg-forest text-white px-2 py-0.5 rounded-full flex-shrink-0">
            PHC Lagos
          </span>
        </div>
      )}

      {isDoctor && (
        <div className="bg-indigoVerified-container border-2 border-indigoVerified/30 text-indigoVerified p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigoVerified text-white flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black block uppercase tracking-wider text-[11px]">
                {t.doctorPerspective || 'Emergency Clinician / Trauma Triage Mode'}
              </span>
              <p className="text-[11px] text-indigoVerified/90 font-medium">
                {t.doctorNotice || 'Zero-click access to blood group, sickle cell genotype, drug allergies, and offline resuscitation orders.'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase bg-indigoVerified text-white px-2 py-0.5 rounded-full flex-shrink-0">
            Trauma ICE
          </span>
        </div>
      )}

      {isSenior && (
        <div className="bg-ochre-container border-2 border-ochre/30 text-charcoal p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-ochre text-white flex items-center justify-center flex-shrink-0">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black block uppercase tracking-wider text-[11px]">
                {t.seniorPerspective || 'Personal Senior Health Portal (Baba Adeyemi)'}
              </span>
              <p className="text-[11px] text-charcoal-muted font-medium">
                {t.seniorNotice || 'Personal hypertension tracking, daily Losartan / Amlodipine regimen, and personal ICE emergency card.'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase bg-ochre text-white px-2 py-0.5 rounded-full flex-shrink-0">
            G0 Senior
          </span>
        </div>
      )}

      {/* 2. EMERGENCY QUICK-ACTION STRIP (Section 2.2 Wireframe) */}
      <div className="bg-charcoal text-white rounded-2xl p-4 shadow-card border border-borderRule relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-terracotta/25 to-transparent pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-emergency text-white px-2 py-0.5 rounded-full animate-emergency">
                <ShieldAlert className="w-3 h-3" />
                {t.emergencyPass || 'EMERGENCY HEALTH PASS'}
              </span>
              <span className="text-xs text-sand-variant font-mono">
                {activeMember?.name} ({activeMember?.generation})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold pt-0.5">
              <span className="text-white">{t.bloodGroup || 'Blood'}: <span className="text-terracotta-container bg-terracotta/30 px-1.5 py-0.2 rounded font-black">{activeMember?.bloodGroup}</span></span>
              <span className="text-sand-variant">•</span>
              <span className="text-white">{t.genotype || 'Genotype'}: <span className="text-amber-200 font-black">{activeMember?.genotype}</span></span>
              <span className="text-sand-variant">•</span>
              <span className="text-amber-300 font-medium">Allergies: {activeMember?.allergies?.join(', ') || 'None'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditMember?.(activeMember)}
              className="px-3 py-2 rounded-xl bg-chalk/10 hover:bg-chalk/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition-all"
              title="Edit Member Photo & Profile"
            >
              <Camera className="w-3.5 h-3.5 text-sand-variant" />
              <span>{t.editPhoto || 'Edit Photo'}</span>
            </button>

            <button
              onClick={() => onOpenICE(activeMember)}
              className="px-3.5 py-2 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white font-extrabold text-xs flex items-center gap-2 shadow-md active:scale-95 transition-all touch-target"
              title="Launch Air-gapped Offline QR Emergency Medical Pass"
            >
              <QrCode className="w-4 h-4" />
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
              <Activity className="w-4 h-4 text-forest" />
              <h2 className="text-xs font-black uppercase tracking-wider text-charcoal">
                {t.completenessIndex || 'Family Health Completeness Index'}
              </h2>
            </div>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-forest-container text-forest">
              {household.completenessScore || 88}% {t.percentComplete || 'Complete'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-sand rounded-full h-2.5 overflow-hidden mb-3">
            <div 
              className="bg-forest h-full rounded-full transition-all duration-500"
              style={{ width: `${household.completenessScore || 88}%` }}
            />
          </div>

          {/* Actionable Alert Chips */}
          <div className="space-y-1.5">
            {household.pendingAlerts?.map(alert => (
              <div 
                key={alert.id}
                className={`flex items-start gap-2 p-2.5 rounded-xl text-xs ${
                  alert.urgent 
                    ? 'bg-emergency-container text-emergency border border-emergency/20' 
                    : 'bg-ochre-container text-charcoal border border-ochre/25'
                }`}
              >
                <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${alert.urgent ? 'text-emergency' : 'text-ochre'}`} />
                <div className="flex-1">
                  <span className="font-bold">{alert.text}</span>
                </div>
                <button 
                  onClick={() => onSelectMember(alert.memberId)}
                  className="text-[10px] font-black uppercase tracking-wider underline hover:opacity-80"
                >
                  {t.inspect || 'Inspect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VIEW TOGGLE: VISUAL PEDIGREE DAG vs MEMBER ROSTER */}
      <div className="flex items-center justify-between border-b border-borderRule pb-2">
        <div className="flex items-center gap-1 bg-sand p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('LINEAGE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeTab === 'LINEAGE' 
                ? 'bg-charcoal text-white shadow-xs' 
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            {t.lineageCanvas || 'Visual Lineage Graph (DAG)'}
          </button>
          <button
            onClick={() => setActiveTab('MEMBERS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeTab === 'MEMBERS' 
                ? 'bg-charcoal text-white shadow-xs' 
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            {t.memberRoster || 'Member Roster'} ({visibleMembers.length})
          </button>
        </div>

        {!isSenior && (
          <button
            onClick={onOpenAddMember}
            className="inline-flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-xl bg-forest hover:bg-forest-dark text-white shadow-xs transition-colors"
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
              className={`surface-card p-4 cursor-pointer transition-all hover:border-terracotta border-2 ${
                activeMember?.id === member.id ? 'border-terracotta ring-1 ring-terracotta bg-terracotta-light/20' : 'border-borderRule'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Member Photo / Illustrated Avatar */}
                  <div className="relative">
                    {member.avatarUrl ? (
                      <img 
                        src={member.avatarUrl} 
                        alt={member.name}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xs" 
                      />
                    ) : (
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xs border-2 border-white"
                        style={{ backgroundColor: member.avatarBg || '#C85A32' }}
                      >
                        {member.avatarIcon || (member.firstName?.[0] || 'A')}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 text-[9px] font-black bg-charcoal text-white px-1.5 py-0.2 rounded-full border border-white">
                      {member.generation}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-sm text-charcoal">{member.name}</h3>
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                        member.statusNote === 'BP Watch' || member.statusNote === 'Vaccine Due'
                          ? 'bg-emergency-container text-emergency'
                          : 'bg-forest-container text-forest'
                      }`}>
                        {member.statusNote || 'Active'}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-muted">
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
                    className="px-2.5 py-1.5 rounded-xl bg-sand hover:bg-sand-variant text-charcoal text-xs font-bold flex items-center gap-1 transition-colors border border-borderRule"
                    title="Edit Profile & Photo"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-charcoal-muted" />
                    <span>{t.editProfile || 'Edit Profile'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenICE(member);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-emergency-container text-emergency hover:bg-emergency hover:text-white text-xs font-black flex items-center gap-1 transition-colors"
                    title="Open Offline Emergency Pass"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>ICE PASS</span>
                  </button>
                </div>
              </div>

              {/* Clinical Attributes Strip */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-borderRule text-center text-xs">
                <div className="bg-sand p-1.5 rounded-xl">
                  <span className="text-[10px] text-charcoal-muted block font-bold">{t.bloodGroup || 'Blood Group'}</span>
                  <span className="font-black text-charcoal">{member.bloodGroup}</span>
                </div>
                <div className="bg-sand p-1.5 rounded-xl">
                  <span className="text-[10px] text-charcoal-muted block font-bold">{t.genotype || 'Genotype'}</span>
                  <span className={`font-black ${member.genotype === 'AS' ? 'text-ochre' : 'text-forest'}`}>
                    {member.genotype}
                  </span>
                </div>
                <div className="bg-sand p-1.5 rounded-xl">
                  <span className="text-[10px] text-charcoal-muted block font-bold">{t.resuscitation || 'Resuscitation'}</span>
                  <span className="font-extrabold text-charcoal truncate block">
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
        <div className="surface-card p-4 sm:p-5 space-y-4 border-2 border-borderRule">
          <div className="flex items-center justify-between border-b border-borderRule pb-3">
            <div className="flex items-center gap-3">
              {/* Photo */}
              {activeMember.avatarUrl ? (
                <img 
                  src={activeMember.avatarUrl} 
                  alt={activeMember.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-borderRule shadow-xs" 
                />
              ) : (
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xs border-2 border-borderRule"
                  style={{ backgroundColor: activeMember.avatarBg || '#C85A32' }}
                >
                  {activeMember.avatarIcon || (activeMember.firstName?.[0] || 'A')}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm text-charcoal">
                    {activeMember.name}
                  </h3>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-sand text-charcoal">
                    {activeMember.generation}
                  </span>
                </div>
                <p className="text-xs text-charcoal-muted">
                  {activeMember.relation} • {activeMember.gender || 'Not specified'} • Born: {activeMember.dob}
                </p>
              </div>
            </div>

            <button
              onClick={() => onEditMember?.(activeMember)}
              className="px-3 py-1.5 rounded-xl bg-terracotta-light text-terracotta hover:bg-terracotta hover:text-white font-black text-xs flex items-center gap-1.5 border border-terracotta/30 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t.editProfile || 'Edit Profile & Photo'}</span>
            </button>
          </div>

          {/* Chronic Conditions & Allergies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-sand p-3 rounded-2xl border border-borderRule">
              <span className="text-[10px] font-black uppercase text-charcoal-muted block mb-1">
                Known Drug Allergies
              </span>
              <span className="font-bold text-charcoal">
                {activeMember.allergies && activeMember.allergies.length > 0 
                  ? activeMember.allergies.join(', ') 
                  : 'No known drug allergies (NKDA)'}
              </span>
            </div>

            <div className="bg-sand p-3 rounded-2xl border border-borderRule">
              <span className="text-[10px] font-black uppercase text-charcoal-muted block mb-1">
                Chronic Clinical Conditions
              </span>
              <span className="font-bold text-charcoal">
                {activeMember.chronicConditions && activeMember.chronicConditions.length > 0 
                  ? activeMember.chronicConditions.join(', ') 
                  : 'None registered'}
              </span>
            </div>
          </div>

          {/* Active Prescriptions / Clinical Regimen */}
          {activeMember.regimen && activeMember.regimen.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-charcoal block">
                {t.activeRegimen || 'Active Clinical Regimen'}:
              </span>
              <div className="space-y-1.5">
                {activeMember.regimen.map((med, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-chalk border border-borderRule text-xs">
                    <div>
                      <span className="font-bold text-charcoal">{med.name}</span>
                      <span className="text-charcoal-muted block text-[11px]">{med.dosage}</span>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sand text-charcoal">
                      {med.supplyRemainingDays} days supply left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vaccines Due (If Child G2) */}
          {activeMember.vaccinesDue && activeMember.vaccinesDue.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-xs font-black uppercase tracking-wider text-charcoal block">
                {t.vaccineMilestones || 'Vaccination Milestones'}:
              </span>
              <div className="space-y-1.5">
                {activeMember.vaccinesDue.map(vac => (
                  <div 
                    key={vac.id} 
                    className={`flex items-start justify-between p-2.5 rounded-xl text-xs border ${
                      vac.completed 
                        ? 'bg-forest-light text-forest border-forest/20' 
                        : 'bg-emergency-container text-emergency border-emergency/25'
                    }`}
                  >
                    <div>
                      <span className="font-extrabold block">{vac.name}</span>
                      <span className="text-[10px] opacity-80 block">{vac.notes || `Completed on ${vac.completedDate}`}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider">
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
