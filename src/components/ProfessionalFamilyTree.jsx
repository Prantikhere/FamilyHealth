import React, { useState } from 'react';
import { 
  Users, 
  Dna, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldAlert, 
  Heart, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Edit3, 
  Camera, 
  Info,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function ProfessionalFamilyTree({
  household,
  selectedMemberId,
  onSelectMember,
  onEditMember,
  translations
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [traitFilter, setTraitFilter] = useState('ALL'); // 'ALL' | 'AS' | 'AA' | 'HYPERTENSION'

  const t = translations || {};

  // Group members into Generation Tiers
  const g0Members = household.members.filter(m => m.generation === 'G0');
  const g1Members = household.members.filter(m => m.generation === 'G1');
  const g2Members = household.members.filter(m => m.generation === 'G2');

  const matchesFilter = (m) => {
    if (traitFilter === 'AS') return m.genotype === 'AS';
    if (traitFilter === 'AA') return m.genotype === 'AA';
    if (traitFilter === 'HYPERTENSION') return (m.chronicConditions || []).some(c => c.toLowerCase().includes('hypertension'));
    return true;
  };

  const activeMember = household.members.find(m => m.id === selectedMemberId) || household.members[0];

  return (
    <div className="surface-card p-4 sm:p-6 space-y-4 border-2 border-borderRule">
      
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderRule pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-terracotta text-white flex items-center justify-center shadow-xs">
              <Dna className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-charcoal">
              {t.lineageCanvas || 'Professional Clinical Pedigree Tree (DAG)'}
            </h3>
          </div>
          <p className="text-xs text-charcoal-muted mt-0.5">
            {t.lineageSubtitle || 'Generational lineage, genetic sickle cell risk, and clinical custody map'}
          </p>
        </div>

        {/* Action Controls: Zoom & Trait Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Trait Filter */}
          <div className="flex items-center gap-1 bg-sand p-1 rounded-xl text-[11px] font-bold">
            <Filter className="w-3.5 h-3.5 text-charcoal-muted ml-1" />
            <select
              value={traitFilter}
              onChange={(e) => setTraitFilter(e.target.value)}
              className="bg-transparent text-charcoal outline-none font-bold cursor-pointer"
            >
              <option value="ALL">All Members</option>
              <option value="AS">Sickle Carriers (AS)</option>
              <option value="AA">Normal (AA)</option>
              <option value="HYPERTENSION">Hypertension Watch</option>
            </select>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 bg-sand p-1 rounded-xl">
            <button 
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.25))}
              className="p-1 rounded-lg hover:bg-sand-variant text-charcoal"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.75))}
              className="p-1 rounded-lg hover:bg-sand-variant text-charcoal"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setZoomLevel(1)}
              className="p-1 rounded-lg hover:bg-sand-variant text-charcoal"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. PEDIGREE GRAPH CANVAS */}
      <div className="bg-chalk rounded-2xl p-4 sm:p-6 border border-borderRule overflow-x-auto relative min-h-[380px]">
        <div 
          className="transition-transform origin-top min-w-[560px] space-y-6"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          
          {/* TIER G0: GRANDPARENTS */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-charcoal-muted bg-sand px-2.5 py-0.5 rounded-full">
                Generation 0 (Grandparents)
              </span>
            </div>

            <div className="flex items-center justify-center gap-8 sm:gap-14 py-2">
              {g0Members.map(m => {
                const isSelected = activeMember?.id === m.id;
                const isDimmed = !matchesFilter(m);

                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectMember(m.id)}
                    className={`relative w-44 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-terracotta bg-terracotta-light shadow-lifted scale-105' 
                        : 'border-borderRule bg-white hover:border-terracotta/50 shadow-xs'
                    } ${isDimmed ? 'opacity-35 grayscale' : ''}`}
                  >
                    {/* Clinical Pedigree Symbol (Square for Male, Circle for Female) */}
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <div className="flex items-center gap-1.5">
                        <div 
                          className={`w-4 h-4 border-2 flex items-center justify-center text-[8px] font-black ${
                            m.gender === 'Female' ? 'rounded-full' : 'rounded-sm'
                          } ${
                            m.genotype === 'AS' 
                              ? 'bg-ochre-container border-ochre text-ochre' 
                              : m.genotype === 'SS' 
                              ? 'bg-emergency-container border-emergency text-emergency' 
                              : 'border-forest bg-forest-container text-forest'
                          }`}
                          title={m.gender === 'Female' ? 'Pedigree Symbol: Female (Circle)' : 'Pedigree Symbol: Male (Square)'}
                        >
                          {m.gender === 'Female' ? '♀' : '♂'}
                        </div>
                        <span className="text-[10px] font-black text-charcoal-muted">{m.generation}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditMember(m);
                        }}
                        className="p-1 rounded-md hover:bg-sand text-charcoal-muted hover:text-terracotta"
                        title="Edit Portrait & Profile"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Portrait Avatar & Name */}
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center text-lg font-black text-white shadow-xs border border-white flex-shrink-0"
                        style={{ backgroundColor: m.avatarBg || '#C85A32' }}
                      >
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{m.avatarIcon || (m.gender === 'Female' ? '👵🏿' : '👴🏿')}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-xs text-charcoal truncate">{m.name}</h4>
                        <p className="text-[10px] text-charcoal-muted truncate">{m.relation}</p>
                      </div>
                    </div>

                    {/* Vitals Strip */}
                    <div className="mt-2.5 pt-2 border-t border-borderRule/70 flex items-center justify-between text-[10px] font-mono">
                      <span className="bg-sand px-1.5 py-0.5 rounded text-charcoal font-bold">{m.bloodGroup}</span>
                      <span className={`px-1.5 py-0.5 rounded font-black ${
                        m.genotype === 'AS' ? 'bg-ochre-container text-ochre' : 'bg-forest-container text-forest'
                      }`}>
                        {m.genotype}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        m.statusNote === 'BP Watch' ? 'bg-emergency-container text-emergency' : 'text-charcoal-muted'
                      }`}>
                        {m.statusNote}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Orthogonal SVG Lineage Connector (G0 -> G1) */}
          <div className="flex justify-center -my-2">
            <svg width="220" height="32" viewBox="0 0 220 32" className="overflow-visible stroke-charcoal-muted/60 stroke-[1.8] fill-none">
              <line x1="50" y1="0" x2="50" y2="12" />
              <line x1="170" y1="0" x2="170" y2="12" />
              <line x1="50" y1="12" x2="170" y2="12" />
              <line x1="110" y1="12" x2="110" y2="32" />
            </svg>
          </div>

          {/* TIER G1: PARENTS & SELF */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-charcoal-muted bg-sand px-2.5 py-0.5 rounded-full">
                Generation 1 (Parents / Self)
              </span>
            </div>

            <div className="flex items-center justify-center gap-8 sm:gap-14 py-2">
              {g1Members.map(m => {
                const isSelected = activeMember?.id === m.id;
                const isDimmed = !matchesFilter(m);

                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectMember(m.id)}
                    className={`relative w-44 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-terracotta bg-terracotta-light shadow-lifted scale-105' 
                        : 'border-borderRule bg-white hover:border-terracotta/50 shadow-xs'
                    } ${isDimmed ? 'opacity-35 grayscale' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <div className="flex items-center gap-1.5">
                        <div 
                          className={`w-4 h-4 border-2 flex items-center justify-center text-[8px] font-black ${
                            m.gender === 'Female' ? 'rounded-full' : 'rounded-sm'
                          } ${
                            m.genotype === 'AS' 
                              ? 'bg-ochre-container border-ochre text-ochre' 
                              : 'border-forest bg-forest-container text-forest'
                          }`}
                        >
                          {m.gender === 'Female' ? '♀' : '♂'}
                        </div>
                        <span className="text-[10px] font-black text-charcoal-muted">{m.generation}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditMember(m);
                        }}
                        className="p-1 rounded-md hover:bg-sand text-charcoal-muted hover:text-terracotta"
                        title="Edit Portrait & Profile"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center text-lg font-black text-white shadow-xs border border-white flex-shrink-0"
                        style={{ backgroundColor: m.avatarBg || '#1B2A4A' }}
                      >
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{m.avatarIcon || (m.gender === 'Female' ? '👩🏿' : '👨🏿')}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-xs text-charcoal truncate">{m.name}</h4>
                        <p className="text-[10px] text-charcoal-muted truncate">{m.relation}</p>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-borderRule/70 flex items-center justify-between text-[10px] font-mono">
                      <span className="bg-sand px-1.5 py-0.5 rounded text-charcoal font-bold">{m.bloodGroup}</span>
                      <span className={`px-1.5 py-0.5 rounded font-black ${
                        m.genotype === 'AS' ? 'bg-ochre-container text-ochre' : 'bg-forest-container text-forest'
                      }`}>
                        {m.genotype}
                      </span>
                      <span className="text-[9px] font-black uppercase text-terracotta">
                        {m.id === 'mem_femi' ? 'Head' : 'Spouse'}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Orthogonal SVG Lineage Connector (G1 -> G2) */}
          <div className="flex justify-center -my-2">
            <svg width="240" height="32" viewBox="0 0 240 32" className="overflow-visible stroke-charcoal-muted/60 stroke-[1.8] fill-none">
              <line x1="60" y1="0" x2="60" y2="12" />
              <line x1="180" y1="0" x2="180" y2="12" />
              <line x1="60" y1="12" x2="180" y2="12" />
              <line x1="120" y1="12" x2="120" y2="22" />
              <line x1="60" y1="22" x2="180" y2="22" />
              <line x1="60" y1="22" x2="60" y2="32" />
              <line x1="180" y1="22" x2="180" y2="32" />
            </svg>
          </div>

          {/* TIER G2: CHILDREN */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-charcoal-muted bg-sand px-2.5 py-0.5 rounded-full">
                Generation 2 (Children / Wards)
              </span>
            </div>

            <div className="flex items-center justify-center gap-8 sm:gap-14 py-2">
              {g2Members.map(m => {
                const isSelected = activeMember?.id === m.id;
                const isDimmed = !matchesFilter(m);

                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectMember(m.id)}
                    className={`relative w-44 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-terracotta bg-terracotta-light shadow-lifted scale-105' 
                        : 'border-borderRule bg-white hover:border-terracotta/50 shadow-xs'
                    } ${isDimmed ? 'opacity-35 grayscale' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <div className="flex items-center gap-1.5">
                        <div 
                          className={`w-4 h-4 border-2 flex items-center justify-center text-[8px] font-black ${
                            m.gender === 'Female' ? 'rounded-full' : 'rounded-sm'
                          } ${
                            m.genotype === 'AS' 
                              ? 'bg-ochre-container border-ochre text-ochre' 
                              : 'border-forest bg-forest-container text-forest'
                          }`}
                        >
                          {m.gender === 'Female' ? '♀' : '♂'}
                        </div>
                        <span className="text-[10px] font-black text-charcoal-muted">{m.generation}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditMember(m);
                        }}
                        className="p-1 rounded-md hover:bg-sand text-charcoal-muted hover:text-terracotta"
                        title="Edit Portrait & Profile"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center text-lg font-black text-white shadow-xs border border-white flex-shrink-0"
                        style={{ backgroundColor: m.avatarBg || '#C85A32' }}
                      >
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{m.avatarIcon || (m.gender === 'Female' ? '👧🏿' : '👦🏿')}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-xs text-charcoal truncate">{m.name}</h4>
                        <p className="text-[10px] text-charcoal-muted truncate">{m.relation}</p>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-borderRule/70 flex items-center justify-between text-[10px] font-mono">
                      <span className="bg-sand px-1.5 py-0.5 rounded text-charcoal font-bold">{m.bloodGroup}</span>
                      <span className={`px-1.5 py-0.5 rounded font-black ${
                        m.genotype === 'AS' ? 'bg-ochre-container text-ochre' : 'bg-forest-container text-forest'
                      }`}>
                        {m.genotype}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        m.statusNote === 'Vaccine Due' ? 'bg-emergency-container text-emergency' : 'text-forest'
                      }`}>
                        {m.statusNote}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* 3. CLINICAL PEDIGREE LEGEND & MENDELIAN RISK MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
        
        {/* Genetic Legend */}
        <div className="p-3.5 rounded-2xl bg-sand/70 border border-borderRule space-y-2">
          <span className="font-black text-charcoal text-[11px] uppercase tracking-wider block">
            {t.pedigreeLegend || 'Clinical Pedigree Symbols'}:
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-charcoal-muted font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-charcoal rounded-sm inline-block" />
              <span>{t.maleSquare || 'Square: Male'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-charcoal rounded-full inline-block" />
              <span>{t.femaleCircle || 'Circle: Female'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-ochre bg-ochre-container rounded-sm inline-block" />
              <span>{t.carrierHalf || 'Ochre: AS Carrier'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-forest bg-forest-container rounded-sm inline-block" />
              <span>{t.normalSolid || 'Forest: AA Normal'}</span>
            </div>
          </div>
        </div>

        {/* Mendelian Counseling */}
        <div className="p-3.5 rounded-2xl bg-chalk border border-borderRule space-y-1.5">
          <div className="flex items-center gap-1.5 text-terracotta">
            <Dna className="w-4 h-4" />
            <span className="font-black text-[11px] uppercase tracking-wider">
              {t.carrierRiskNotice || 'Mendelian Sickle Cell Risk'}:
            </span>
          </div>
          <p className="text-[11px] text-charcoal-muted leading-relaxed">
            Femi (AA) × Sade (AS) union has <strong>50% probability of AS carrier offspring</strong> and <strong>0% probability of SS disease</strong>. Pre-marital counseling verified for next generation.
          </p>
        </div>

      </div>

    </div>
  );
}
