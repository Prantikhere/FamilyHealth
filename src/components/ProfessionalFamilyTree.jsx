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
    <div className="surface-card p-4 sm:p-6 space-y-4">
      
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Dna className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {t.lineageCanvas || 'Professional Clinical Pedigree Tree (DAG)'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.lineageSubtitle || 'Generational lineage, genetic sickle cell risk, and clinical custody map'}
          </p>
        </div>

        {/* Action Controls: Zoom & Trait Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Trait Filter */}
          <div className="neu-inset px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={traitFilter}
              onChange={(e) => setTraitFilter(e.target.value)}
              className="bg-transparent text-slate-800 outline-none font-bold cursor-pointer"
            >
              <option value="ALL">All Members</option>
              <option value="AS">Sickle Carriers (AS)</option>
              <option value="AA">Normal (AA)</option>
              <option value="HYPERTENSION">Hypertension Watch</option>
            </select>
          </div>

          {/* Zoom Buttons (Proportioned Icon Buttons) */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.25))}
              className="neu-icon-btn w-8 h-8 rounded-lg shadow-neu-sm"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-slate-700" />
            </button>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.75))}
              className="neu-icon-btn w-8 h-8 rounded-lg shadow-neu-sm"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-slate-700" />
            </button>
            <button 
              onClick={() => setZoomLevel(1)}
              className="neu-icon-btn w-8 h-8 rounded-lg shadow-neu-sm"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. PEDIGREE GRAPH CANVAS (Neumorphic Inset Canvas) */}
      <div className="neu-inset rounded-3xl p-4 sm:p-6 overflow-x-auto relative min-h-[380px]">
        <div 
          className="transition-transform origin-top min-w-[560px] space-y-6"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          
          {/* TIER G0: GRANDPARENTS */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="neu-pill text-[10px] font-bold tracking-widest text-slate-600 shadow-neu-sm">
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
                    className={`relative w-44 p-3.5 rounded-2xl transition-all cursor-pointer ${
                      isSelected 
                        ? 'surface-card shadow-neu-deep ring-2 ring-blue-500 scale-105' 
                        : 'neu-btn text-left hover:shadow-neu-raised'
                    } ${isDimmed ? 'opacity-30 grayscale' : ''}`}
                  >
                    {/* Clinical Pedigree Symbol (Square for Male, Circle for Female) */}
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <div className="flex items-center gap-1.5">
                        <div 
                          className={`w-4 h-4 border-2 flex items-center justify-center text-[8px] font-black ${
                            m.gender === 'Female' ? 'rounded-full' : 'rounded-sm'
                          } ${
                            m.genotype === 'AS' 
                              ? 'bg-indigo-600 border-indigo-700 text-white' 
                              : m.genotype === 'SS' 
                              ? 'bg-rose-600 border-rose-700 text-white' 
                              : 'border-slate-400 bg-white text-slate-700'
                          }`}
                          title={m.gender === 'Female' ? 'Pedigree Symbol: Female (Circle)' : 'Pedigree Symbol: Male (Square)'}
                        >
                          {m.gender === 'Female' ? '♀' : '♂'}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">{m.generation}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditMember(m);
                        }}
                        className="p-1 rounded-md hover:bg-white/60 text-slate-500 hover:text-slate-800"
                        title="Edit Portrait & Profile"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Portrait Avatar & Name */}
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center text-lg font-bold text-white shadow-xs border border-white/80 bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0"
                      >
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{m.avatarIcon || (m.gender === 'Female' ? '👵🏿' : '👴🏿')}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-slate-800 truncate">{m.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{m.relation}</p>
                      </div>
                    </div>

                    {/* Genotype & Vitals Badges */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono">
                      <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-bold">{m.bloodGroup}</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold border ${
                        m.genotype === 'AS' 
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}>
                        {m.genotype}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-medium ${
                        m.statusNote === 'BP Watch' ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200' : 'text-slate-500'
                      }`}>
                        {m.statusNote}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* SVG Connectors G0 -> G1 */}
          <div className="flex justify-center -my-2">
            <svg width="220" height="36" className="overflow-visible">
              <line x1="50" y1="0" x2="50" y2="18" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="170" y1="0" x2="170" y2="18" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="50" y1="18" x2="170" y2="18" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="110" y1="18" x2="110" y2="36" stroke="#94A3B8" strokeWidth="1.5" />
            </svg>
          </div>

          {/* TIER G1: PARENTS & SPOUSE */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="neu-pill text-[10px] font-bold tracking-widest text-slate-600 shadow-neu-sm">
                Generation 1 (Parents / Spouses)
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
                    className={`relative w-44 p-3.5 rounded-2xl transition-all cursor-pointer ${
                      isSelected 
                        ? 'surface-card shadow-neu-deep ring-2 ring-blue-500 scale-105' 
                        : 'neu-btn text-left hover:shadow-neu-raised'
                    } ${isDimmed ? 'opacity-30 grayscale' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <div className="flex items-center gap-1.5">
                        <div 
                          className={`w-4 h-4 border-2 flex items-center justify-center text-[8px] font-black ${
                            m.gender === 'Female' ? 'rounded-full' : 'rounded-sm'
                          } ${
                            m.genotype === 'AS' 
                              ? 'bg-indigo-600 border-indigo-700 text-white' 
                              : 'border-slate-400 bg-white text-slate-700'
                          }`}
                        >
                          {m.gender === 'Female' ? '♀' : '♂'}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">{m.generation}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditMember(m);
                        }}
                        className="p-1 rounded-md hover:bg-white/60 text-slate-500 hover:text-slate-800"
                        title="Edit Portrait & Profile"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center text-lg font-bold text-white shadow-xs border border-white/80 bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0"
                      >
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{m.avatarIcon || (m.gender === 'Female' ? '👩🏿' : '👨🏿')}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-slate-800 truncate">{m.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{m.relation}</p>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono">
                      <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-bold">{m.bloodGroup}</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold border ${
                        m.genotype === 'AS' 
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}>
                        {m.genotype}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {m.id === 'mem_femi' ? 'Self' : 'Spouse'}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* SVG Connectors G1 -> G2 */}
          <div className="flex justify-center -my-2">
            <svg width="220" height="36" className="overflow-visible">
              <line x1="50" y1="0" x2="50" y2="18" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="170" y1="0" x2="170" y2="18" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="50" y1="18" x2="170" y2="18" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="110" y1="18" x2="110" y2="36" stroke="#94A3B8" strokeWidth="1.5" />
            </svg>
          </div>

          {/* TIER G2: CHILDREN */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="neu-pill text-[10px] font-bold tracking-widest text-slate-600 shadow-neu-sm">
                Generation 2 (Children / Offspring)
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
                    className={`relative w-44 p-3.5 rounded-2xl transition-all cursor-pointer ${
                      isSelected 
                        ? 'surface-card shadow-neu-deep ring-2 ring-blue-500 scale-105' 
                        : 'neu-btn text-left hover:shadow-neu-raised'
                    } ${isDimmed ? 'opacity-30 grayscale' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <div className="flex items-center gap-1.5">
                        <div 
                          className={`w-4 h-4 border-2 flex items-center justify-center text-[8px] font-black ${
                            m.gender === 'Female' ? 'rounded-full' : 'rounded-sm'
                          } ${
                            m.genotype === 'AS' 
                              ? 'bg-indigo-600 border-indigo-700 text-white' 
                              : 'border-slate-400 bg-white text-slate-700'
                          }`}
                        >
                          {m.gender === 'Female' ? '♀' : '♂'}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">{m.generation}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditMember(m);
                        }}
                        className="p-1 rounded-md hover:bg-white/60 text-slate-500 hover:text-slate-800"
                        title="Edit Portrait & Profile"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center text-lg font-bold text-white shadow-xs border border-white/80 bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0"
                      >
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{m.avatarIcon || (m.gender === 'Female' ? '👧🏿' : '👦🏿')}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-slate-800 truncate">{m.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{m.relation}</p>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono">
                      <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-bold">{m.bloodGroup}</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold border ${
                        m.genotype === 'AS' 
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}>
                        {m.genotype}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-medium ${
                        m.statusNote === 'Vaccine Due' ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200' : 'text-slate-500'
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
        <div className="p-3.5 rounded-2xl neu-inset space-y-2">
          <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
            {t.pedigreeLegend || 'Clinical Pedigree Symbols'}:
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-slate-500 rounded-sm inline-block bg-white shadow-xs" />
              <span>{t.maleSquare || 'Square: Male'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-slate-500 rounded-full inline-block bg-white shadow-xs" />
              <span>{t.femaleCircle || 'Circle: Female'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-indigo-700 bg-indigo-600 rounded-sm inline-block shadow-xs" />
              <span>{t.carrierHalf || 'Solid: AS Carrier'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-slate-400 bg-white rounded-sm inline-block shadow-xs" />
              <span>{t.normalSolid || 'Outline: AA Normal'}</span>
            </div>
          </div>
        </div>

        {/* Mendelian Counseling */}
        <div className="p-3.5 rounded-2xl surface-card space-y-1.5">
          <div className="flex items-center gap-1.5 text-blue-700">
            <Dna className="w-4 h-4" />
            <span className="font-bold text-[11px] uppercase tracking-wider">
              {t.carrierRiskNotice || 'Mendelian Sickle Cell Risk'}:
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            Femi (AA) × Sade (AS) union has <strong>50% probability of AS carrier offspring</strong> and <strong>0% probability of SS disease</strong>. Pre-marital counseling verified for next generation.
          </p>
        </div>

      </div>

    </div>
  );
}
