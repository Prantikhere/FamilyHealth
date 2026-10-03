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
    <div className="surface-card p-4 sm:p-6 space-y-4 border border-zinc-200">
      
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
              <Dna className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-950">
              {t.lineageCanvas || 'Professional Clinical Pedigree Tree (DAG)'}
            </h3>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            {t.lineageSubtitle || 'Generational lineage, genetic sickle cell risk, and clinical custody map'}
          </p>
        </div>

        {/* Action Controls: Zoom & Trait Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Trait Filter */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl text-[11px] font-bold border border-zinc-200">
            <Filter className="w-3.5 h-3.5 text-zinc-500 ml-1" />
            <select
              value={traitFilter}
              onChange={(e) => setTraitFilter(e.target.value)}
              className="bg-transparent text-zinc-900 outline-none font-bold cursor-pointer"
            >
              <option value="ALL">All Members</option>
              <option value="AS">Sickle Carriers (AS)</option>
              <option value="AA">Normal (AA)</option>
              <option value="HYPERTENSION">Hypertension Watch</option>
            </select>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            <button 
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.25))}
              className="p-1 rounded-lg hover:bg-zinc-200 text-zinc-800 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.75))}
              className="p-1 rounded-lg hover:bg-zinc-200 text-zinc-800 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setZoomLevel(1)}
              className="p-1 rounded-lg hover:bg-zinc-200 text-zinc-800 cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. PEDIGREE GRAPH CANVAS */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-zinc-200 overflow-x-auto relative min-h-[380px]">
        <div 
          className="transition-transform origin-top min-w-[560px] space-y-6"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          
          {/* TIER G0: GRANDPARENTS */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-full">
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
                    className={`relative w-44 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-zinc-950 bg-zinc-50 shadow-md ring-1 ring-zinc-950 scale-105' 
                        : 'border-zinc-200 bg-white hover:border-zinc-400 shadow-xs'
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
                              ? 'bg-zinc-800 border-zinc-950 text-white' 
                              : m.genotype === 'SS' 
                              ? 'bg-black border-black text-white' 
                              : 'border-zinc-950 bg-white text-zinc-950'
                          }`}
                          title={m.gender === 'Female' ? 'Pedigree Symbol: Female (Circle)' : 'Pedigree Symbol: Male (Square)'}
                        >
                          {m.gender === 'Female' ? '♀' : '♂'}
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500">{m.generation}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditMember(m);
                        }}
                        className="p-1 rounded-md hover:bg-zinc-100 text-zinc-500 hover:text-zinc-950"
                        title="Edit Portrait & Profile"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Portrait Avatar & Name */}
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center text-lg font-bold text-white shadow-xs border border-zinc-200 bg-zinc-900 flex-shrink-0"
                      >
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{m.avatarIcon || (m.gender === 'Female' ? '👵🏿' : '👴🏿')}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-zinc-950 truncate">{m.name}</h4>
                        <p className="text-[10px] text-zinc-500 truncate">{m.relation}</p>
                      </div>
                    </div>

                    {/* Genotype & Vitals Badges */}
                    <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] font-mono">
                      <span className="bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded text-zinc-900 font-bold">{m.bloodGroup}</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold border ${
                        m.genotype === 'AS' 
                          ? 'bg-zinc-900 text-white border-zinc-900' 
                          : 'bg-zinc-100 text-zinc-900 border-zinc-200'
                      }`}>
                        {m.genotype}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-medium ${
                        m.statusNote === 'BP Watch' ? 'bg-zinc-100 text-zinc-950 font-bold border border-zinc-300' : 'text-zinc-500'
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
              <line x1="50" y1="0" x2="50" y2="18" stroke="#18181B" strokeWidth="1.5" />
              <line x1="170" y1="0" x2="170" y2="18" stroke="#18181B" strokeWidth="1.5" />
              <line x1="50" y1="18" x2="170" y2="18" stroke="#18181B" strokeWidth="1.5" />
              <line x1="110" y1="18" x2="110" y2="36" stroke="#18181B" strokeWidth="1.5" />
            </svg>
          </div>

          {/* TIER G1: PARENTS & SPOUSE */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-full">
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
                    className={`relative w-44 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-zinc-950 bg-zinc-50 shadow-md ring-1 ring-zinc-950 scale-105' 
                        : 'border-zinc-200 bg-white hover:border-zinc-400 shadow-xs'
                    } ${isDimmed ? 'opacity-30 grayscale' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <div className="flex items-center gap-1.5">
                        <div 
                          className={`w-4 h-4 border-2 flex items-center justify-center text-[8px] font-black ${
                            m.gender === 'Female' ? 'rounded-full' : 'rounded-sm'
                          } ${
                            m.genotype === 'AS' 
                              ? 'bg-zinc-800 border-zinc-950 text-white' 
                              : 'border-zinc-950 bg-white text-zinc-950'
                          }`}
                        >
                          {m.gender === 'Female' ? '♀' : '♂'}
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500">{m.generation}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditMember(m);
                        }}
                        className="p-1 rounded-md hover:bg-zinc-100 text-zinc-500 hover:text-zinc-950"
                        title="Edit Portrait & Profile"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center text-lg font-bold text-white shadow-xs border border-zinc-200 bg-zinc-900 flex-shrink-0"
                      >
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{m.avatarIcon || (m.gender === 'Female' ? '👩🏿' : '👨🏿')}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-zinc-950 truncate">{m.name}</h4>
                        <p className="text-[10px] text-zinc-500 truncate">{m.relation}</p>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] font-mono">
                      <span className="bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded text-zinc-900 font-bold">{m.bloodGroup}</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold border ${
                        m.genotype === 'AS' 
                          ? 'bg-zinc-900 text-white border-zinc-900' 
                          : 'bg-zinc-100 text-zinc-900 border-zinc-200'
                      }`}>
                        {m.genotype}
                      </span>
                      <span className="text-zinc-500 font-medium">
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
              <line x1="50" y1="0" x2="50" y2="18" stroke="#18181B" strokeWidth="1.5" />
              <line x1="170" y1="0" x2="170" y2="18" stroke="#18181B" strokeWidth="1.5" />
              <line x1="50" y1="18" x2="170" y2="18" stroke="#18181B" strokeWidth="1.5" />
              <line x1="110" y1="18" x2="110" y2="36" stroke="#18181B" strokeWidth="1.5" />
            </svg>
          </div>

          {/* TIER G2: CHILDREN */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-full">
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
                    className={`relative w-44 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-zinc-950 bg-zinc-50 shadow-md ring-1 ring-zinc-950 scale-105' 
                        : 'border-zinc-200 bg-white hover:border-zinc-400 shadow-xs'
                    } ${isDimmed ? 'opacity-30 grayscale' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <div className="flex items-center gap-1.5">
                        <div 
                          className={`w-4 h-4 border-2 flex items-center justify-center text-[8px] font-black ${
                            m.gender === 'Female' ? 'rounded-full' : 'rounded-sm'
                          } ${
                            m.genotype === 'AS' 
                              ? 'bg-zinc-800 border-zinc-950 text-white' 
                              : 'border-zinc-950 bg-white text-zinc-950'
                          }`}
                        >
                          {m.gender === 'Female' ? '♀' : '♂'}
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500">{m.generation}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditMember(m);
                        }}
                        className="p-1 rounded-md hover:bg-zinc-100 text-zinc-500 hover:text-zinc-950"
                        title="Edit Portrait & Profile"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center text-lg font-bold text-white shadow-xs border border-zinc-200 bg-zinc-900 flex-shrink-0"
                      >
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{m.avatarIcon || (m.gender === 'Female' ? '👧🏿' : '👦🏿')}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-zinc-950 truncate">{m.name}</h4>
                        <p className="text-[10px] text-zinc-500 truncate">{m.relation}</p>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] font-mono">
                      <span className="bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded text-zinc-900 font-bold">{m.bloodGroup}</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold border ${
                        m.genotype === 'AS' 
                          ? 'bg-zinc-900 text-white border-zinc-900' 
                          : 'bg-zinc-100 text-zinc-900 border-zinc-200'
                      }`}>
                        {m.genotype}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded font-medium ${
                        m.statusNote === 'Vaccine Due' ? 'bg-zinc-100 text-zinc-950 font-bold border border-zinc-300' : 'text-zinc-500'
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
        <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
          <span className="font-bold text-zinc-950 text-[11px] uppercase tracking-wider block">
            {t.pedigreeLegend || 'Clinical Pedigree Symbols'}:
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-600 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-zinc-950 rounded-sm inline-block bg-white" />
              <span>{t.maleSquare || 'Square: Male'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-zinc-950 rounded-full inline-block bg-white" />
              <span>{t.femaleCircle || 'Circle: Female'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-zinc-950 bg-zinc-900 rounded-sm inline-block" />
              <span>{t.carrierHalf || 'Solid: AS Carrier'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-zinc-950 bg-white rounded-sm inline-block" />
              <span>{t.normalSolid || 'Outline: AA Normal'}</span>
            </div>
          </div>
        </div>

        {/* Mendelian Counseling */}
        <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 space-y-1.5">
          <div className="flex items-center gap-1.5 text-zinc-950">
            <Dna className="w-4 h-4" />
            <span className="font-bold text-[11px] uppercase tracking-wider">
              {t.carrierRiskNotice || 'Mendelian Sickle Cell Risk'}:
            </span>
          </div>
          <p className="text-[11px] text-zinc-600 leading-relaxed">
            Femi (AA) × Sade (AS) union has <strong>50% probability of AS carrier offspring</strong> and <strong>0% probability of SS disease</strong>. Pre-marital counseling verified for next generation.
          </p>
        </div>

      </div>

    </div>
  );
}
