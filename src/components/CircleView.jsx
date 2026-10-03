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
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles,
  Baby,
  UserCheck,
  Stethoscope,
  Info
} from 'lucide-react';

export default function CircleView({
  household,
  selectedMemberId,
  onSelectMember,
  onOpenICE,
  onOpenAddMember,
  onOpenTriage,
  currentLang = 'en',
  translations
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTab, setActiveTab] = useState('LINEAGE'); // 'LINEAGE' | 'MEMBERS'

  // Selected member or default primary (Femi or Baba)
  const activeMember = household.members.find(m => m.id === selectedMemberId) || household.members[0];

  // Group members by Generation tier (Section 1.1 FR-01)
  const g0Members = household.members.filter(m => m.generation === 'G0');
  const g1Members = household.members.filter(m => m.generation === 'G1');
  const g2Members = household.members.filter(m => m.generation === 'G2');

  const t = translations || {};

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200">
      
      {/* 1. EMERGENCY QUICK-ACTION STRIP (Section 2.2 Wireframe) */}
      <div className="bg-charcoal text-white rounded-2xl p-4 shadow-card border border-borderRule relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-terracotta/25 to-transparent pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-emergency text-white px-2 py-0.5 rounded-full animate-emergency">
                <ShieldAlert className="w-3 h-3" />
                {t.emergencyStrip || 'EMERGENCY HEALTH PASS'}
              </span>
              <span className="text-xs text-sand-variant font-mono">
                {activeMember?.name} ({activeMember?.generation})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold pt-0.5">
              <span className="text-white">Blood: <span className="text-terracotta-container bg-terracotta/30 px-1.5 py-0.2 rounded font-black">{activeMember?.bloodGroup}</span></span>
              <span className="text-sand-variant">•</span>
              <span className="text-white">Genotype: <span className="text-amber-200 font-black">{activeMember?.genotype}</span></span>
              <span className="text-sand-variant">•</span>
              <span className="text-amber-300 font-medium">Allergy: {activeMember?.allergies?.join(', ') || 'None'}</span>
            </div>
          </div>

          <button
            onClick={() => onOpenICE(activeMember)}
            className="self-start sm:self-center px-3.5 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-dark text-white font-extrabold text-xs flex items-center gap-2 shadow-md active:scale-95 transition-all touch-target"
            title="Launch Air-gapped Offline QR Emergency Medical Pass"
          >
            <QrCode className="w-4 h-4" />
            <span>{t.showQr || 'SHOW QR PASS'}</span>
          </button>
        </div>
      </div>

      {/* 2. FAMILY HEALTH COMPLETENESS MATRIX (FR-11 & Section 2.2) */}
      <div className="surface-card p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-forest" />
            <h2 className="text-xs font-black uppercase tracking-wider text-charcoal">
              {t.completeness || 'Family Health Completeness Index'}
            </h2>
          </div>
          <span className="text-xs font-black px-2 py-0.5 rounded-full bg-forest-container text-forest">
            {household.completenessScore || 88}% Complete
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
                Inspect
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. VIEW TOGGLE: LINEAGE DAG GRAPH vs MEMBER ROSTER */}
      <div className="flex items-center justify-between border-b border-borderRule pb-2">
        <div className="flex items-center gap-1 bg-sand p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('LINEAGE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'LINEAGE' 
                ? 'bg-charcoal text-white shadow-xs' 
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Visual Lineage Graph (DAG)
          </button>
          <button
            onClick={() => setActiveTab('MEMBERS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'MEMBERS' 
                ? 'bg-charcoal text-white shadow-xs' 
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Member Roster ({household.members.length})
          </button>
        </div>

        <button
          onClick={onOpenAddMember}
          className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-forest hover:bg-forest-dark text-white shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Dependent</span>
        </button>
      </div>

      {/* 4A. VISUAL LINEAGE GRAPH (DAG Canvas - FR-02 & Section 2.2 Wireframe) */}
      {activeTab === 'LINEAGE' && (
        <div className="surface-card p-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-charcoal-muted pb-1">
            <span className="font-bold">Generational Tiers (G0 Grandparents → G1 Parents → G2 Children)</span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.3))} 
                className="p-1 rounded bg-sand hover:bg-sand-variant text-charcoal"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.8))} 
                className="p-1 rounded bg-sand hover:bg-sand-variant text-charcoal"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setZoomLevel(1)} 
                className="p-1 rounded bg-sand hover:bg-sand-variant text-charcoal"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* DAG Tree Canvas with Pan & Zoom simulation */}
          <div 
            className="bg-chalk rounded-2xl p-4 border border-borderRule overflow-x-auto transition-transform origin-top"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            
            {/* TIER G0: GRANDPARENTS */}
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-charcoal-muted text-center">
                Generation 0 (Grandparents)
              </div>
              <div className="flex items-center justify-center gap-4 sm:gap-8 py-2">
                {g0Members.map(m => (
                  <div
                    key={m.id}
                    onClick={() => onSelectMember(m.id)}
                    className={`cursor-pointer w-36 sm:w-44 p-3 rounded-2xl border-2 transition-all ${
                      activeMember?.id === m.id 
                        ? 'border-terracotta bg-terracotta-light shadow-md' 
                        : 'border-borderRule bg-white hover:border-sand-variant'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-black text-charcoal-muted">{m.generation}</span>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                        m.statusNote === 'BP Watch' ? 'bg-emergency-container text-emergency' : 'bg-forest-container text-forest'
                      }`}>
                        {m.statusNote}
                      </span>
                    </div>
                    <div className="font-extrabold text-xs text-charcoal truncate">{m.name}</div>
                    <div className="text-[10px] text-charcoal-muted truncate">{m.relation}</div>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono">
                      <span className="bg-sand px-1.5 py-0.5 rounded text-charcoal font-bold">{m.bloodGroup}</span>
                      <span className={`px-1.5 py-0.5 rounded font-black ${
                        m.genotype === 'AS' ? 'bg-ochre-container text-ochre' : 'bg-forest-container text-forest'
                      }`}>{m.genotype}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tree Branch Connector G0 -> G1 */}
            <div className="flex justify-center my-1">
              <div className="w-0.5 h-6 bg-borderRule" />
            </div>

            {/* TIER G1: PARENTS & SELF */}
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-charcoal-muted text-center">
                Generation 1 (Parents / Self)
              </div>
              <div className="flex items-center justify-center gap-4 sm:gap-8 py-2">
                {g1Members.map(m => (
                  <div
                    key={m.id}
                    onClick={() => onSelectMember(m.id)}
                    className={`cursor-pointer w-36 sm:w-44 p-3 rounded-2xl border-2 transition-all ${
                      activeMember?.id === m.id 
                        ? 'border-terracotta bg-terracotta-light shadow-md' 
                        : 'border-borderRule bg-white hover:border-sand-variant'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-black text-charcoal-muted">{m.generation}</span>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-indigoVerified-container text-indigoVerified">
                        {m.id === 'mem_femi' ? 'Self' : 'Spouse'}
                      </span>
                    </div>
                    <div className="font-extrabold text-xs text-charcoal truncate">{m.name}</div>
                    <div className="text-[10px] text-charcoal-muted truncate">{m.relation}</div>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono">
                      <span className="bg-sand px-1.5 py-0.5 rounded text-charcoal font-bold">{m.bloodGroup}</span>
                      <span className={`px-1.5 py-0.5 rounded font-black ${
                        m.genotype === 'AS' ? 'bg-ochre-container text-ochre' : 'bg-forest-container text-forest'
                      }`}>{m.genotype}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tree Branch Connector G1 -> G2 */}
            <div className="flex justify-center my-1">
              <div className="w-0.5 h-6 bg-borderRule" />
            </div>

            {/* TIER G2: CHILDREN */}
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-charcoal-muted text-center">
                Generation 2 (Children / Wards)
              </div>
              <div className="flex items-center justify-center gap-4 sm:gap-8 py-2">
                {g2Members.map(m => (
                  <div
                    key={m.id}
                    onClick={() => onSelectMember(m.id)}
                    className={`cursor-pointer w-36 sm:w-44 p-3 rounded-2xl border-2 transition-all ${
                      activeMember?.id === m.id 
                        ? 'border-terracotta bg-terracotta-light shadow-md' 
                        : 'border-borderRule bg-white hover:border-sand-variant'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-black text-charcoal-muted">{m.generation}</span>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                        m.statusNote === 'Vaccine Due' ? 'bg-emergency-container text-emergency font-black' : 'bg-forest-container text-forest'
                      }`}>
                        {m.statusNote}
                      </span>
                    </div>
                    <div className="font-extrabold text-xs text-charcoal truncate">{m.name}</div>
                    <div className="text-[10px] text-charcoal-muted truncate">{m.relation}</div>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono">
                      <span className="bg-sand px-1.5 py-0.5 rounded text-charcoal font-bold">{m.bloodGroup}</span>
                      <span className={`px-1.5 py-0.5 rounded font-black ${
                        m.genotype === 'AS' ? 'bg-ochre-container text-ochre' : 'bg-forest-container text-forest'
                      }`}>{m.genotype}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Hereditary Risk Annotations (Sickle Cell & Hypertension) */}
          <div className="p-3.5 rounded-xl bg-sand border border-borderRule flex items-start gap-3">
            <Dna className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-extrabold text-charcoal block">Hereditary Lineage Risk Analysis</span>
              <p className="text-charcoal-muted">
                Lineage mapping confirms <strong>Sickle Cell Trait (AS)</strong> transmission from Baba (G0) and Sade (G1) to Tunde (G2). Autosomal recessive counseling recommends pre-marital genotype verification (HbAA compatibility).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4B. MEMBER ROSTER LIST */}
      {activeTab === 'MEMBERS' && (
        <div className="space-y-3">
          {household.members.map(member => (
            <div
              key={member.id}
              onClick={() => onSelectMember(member.id)}
              className={`surface-card p-4 cursor-pointer transition-all hover:border-terracotta ${
                activeMember?.id === member.id ? 'ring-2 ring-terracotta border-transparent' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xs"
                    style={{ backgroundColor: member.avatarBg || '#C85A32' }}
                  >
                    {member.firstName?.[0]}{member.lastName?.[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-sm text-charcoal">{member.name}</h3>
                      <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-sand text-charcoal">
                        {member.generation}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-muted">
                      {member.relation} • Born: {member.dob}
                    </p>
                  </div>
                </div>

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

              {/* Attributes Strip */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-borderRule text-center text-xs">
                <div className="bg-sand p-1.5 rounded-lg">
                  <span className="text-[10px] text-charcoal-muted block font-bold">Blood Group</span>
                  <span className="font-black text-charcoal">{member.bloodGroup}</span>
                </div>
                <div className="bg-sand p-1.5 rounded-lg">
                  <span className="text-[10px] text-charcoal-muted block font-bold">Genotype</span>
                  <span className={`font-black ${member.genotype === 'AS' ? 'text-ochre' : 'text-forest'}`}>
                    {member.genotype}
                  </span>
                </div>
                <div className="bg-sand p-1.5 rounded-lg">
                  <span className="text-[10px] text-charcoal-muted block font-bold">Resuscitation</span>
                  <span className="font-extrabold text-charcoal truncate block">Full Code</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. INSPECTED MEMBER CLINICAL DOSSIER */}
      {activeMember && (
        <div className="surface-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-borderRule pb-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-terracotta" />
              <h3 className="font-black text-xs uppercase tracking-wider text-charcoal">
                Active Member Dossier: {activeMember.name}
              </h3>
            </div>
            <span className="text-xs font-mono text-charcoal-muted">{activeMember.dob}</span>
          </div>

          {/* Active Prescriptions / Clinical Regimen */}
          {activeMember.regimen && activeMember.regimen.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-charcoal-muted block">Active Clinical Regimen:</span>
              {activeMember.regimen.map((med, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-chalk border border-borderRule text-xs">
                  <div>
                    <span className="font-bold text-charcoal">{med.name}</span>
                    <span className="text-charcoal-muted block text-[11px]">{med.dosage}</span>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sand text-charcoal">
                    {med.supplyRemainingDays} days left
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Vaccines Due (If Child G2) */}
          {activeMember.vaccinesDue && activeMember.vaccinesDue.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-charcoal-muted block">Vaccination Milestones:</span>
              {activeMember.vaccinesDue.map(vac => (
                <div 
                  key={vac.id} 
                  className={`flex items-start justify-between p-2 rounded-xl text-xs border ${
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
                    {vac.completed ? '✓ Completed' : 'Overdue'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
