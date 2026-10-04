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
  Filter, 
  GitBranch, 
  Layers, 
  Sparkles 
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
  const [treeDisplayMode, setTreeDisplayMode] = useState('pedigree'); // 'pedigree' | 'matrix'

  const t = translations || {};

  // Group members into Generation Tiers
  const g0Members = household.members.filter(m => m.generation === 'G0');
  const g1Members = household.members.filter(m => m.generation === 'G1');
  const g2Members = household.members.filter(m => m.generation === 'G2');

  const matchesFilter = (m) => {
    if (traitFilter === 'AS') return m.genotype === 'AS';
    if (traitFilter === 'AA') return m.genotype === 'AA';
    if (traitFilter === 'HYPERTENSION') {
      return (m.chronicConditions || []).some(c => c.toLowerCase().includes('hypertension'));
    }
    return true;
  };

  const activeMember = household.members.find(m => m.id === selectedMemberId) || household.members[0];

  // Helper to render clinical pedigree node card
  const renderPedigreeCard = (m, romanId) => {
    const isSelected = activeMember?.id === m.id;
    const isDimmed = !matchesFilter(m);

    return (
      <div
        key={m.id}
        onClick={() => onSelectMember(m.id)}
        className={`relative w-[145px] xs:w-[160px] sm:w-48 md:w-52 p-2.5 sm:p-3.5 rounded-2xl transition-all cursor-pointer ${
          isSelected 
            ? 'surface-card shadow-neu-deep ring-2 ring-blue-500 scale-[1.02]' 
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
            <span className="text-[10px] font-bold font-mono text-slate-500">{romanId || m.generation}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditMember(m);
            }}
            className="p-1 rounded-md hover:bg-white/60 text-slate-500 hover:text-slate-800 transition-colors"
            title="Edit Portrait & Profile"
          >
            <Edit3 className="w-3 h-3" />
          </button>
        </div>

        {/* Portrait Avatar & Name */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div 
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden flex items-center justify-center text-base sm:text-lg font-bold text-white shadow-xs border border-white/80 bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0"
          >
            {m.avatarUrl ? (
              <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
            ) : (
              <span>{m.avatarIcon || (m.gender === 'Female' ? '👩🏿' : '👨🏿')}</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-extrabold text-xs text-slate-800 truncate leading-tight">{m.name}</h4>
            <p className="text-[10px] text-slate-500 truncate mt-0.5">{m.relation}</p>
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
          <span className={`px-1.5 py-0.5 rounded font-medium max-w-[65px] truncate ${
            m.statusNote === 'BP Watch' || m.statusNote === 'Vaccine Due'
              ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200' 
              : 'text-slate-500'
          }`}>
            {m.statusNote || 'Active'}
          </span>
        </div>

      </div>
    );
  };

  return (
    <div className="surface-card p-3 sm:p-6 space-y-4">
      
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-white/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <Dna className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">
                {t.lineageCanvas || 'Professional Clinical Pedigree Tree (DAG)'}
              </h3>
              <p className="text-xs text-slate-500">
                {t.lineageSubtitle || 'Hereditary sickle cell analysis, generational lineage & clinical custody map'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls: Mode Switcher, Zoom & Trait Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Display Mode Toggle */}
          <div className="neu-segmented p-1">
            <button
              onClick={() => setTreeDisplayMode('pedigree')}
              className={`neu-segmented-btn h-8 px-2.5 text-[11px] font-bold ${
                treeDisplayMode === 'pedigree' ? 'active shadow-neu-raised' : ''
              }`}
              title="View full clinical pedigree diagram with marriage & descent branches"
            >
              <GitBranch className="w-3.5 h-3.5 mr-1" />
              <span>Pedigree Tree</span>
            </button>
            <button
              onClick={() => setTreeDisplayMode('matrix')}
              className={`neu-segmented-btn h-8 px-2.5 text-[11px] font-bold ${
                treeDisplayMode === 'matrix' ? 'active shadow-neu-raised' : ''
              }`}
              title="View structured generational tier lanes"
            >
              <Layers className="w-3.5 h-3.5 mr-1" />
              <span>Generational Tiers</span>
            </button>
          </div>

          {/* Trait Filter */}
          <div className="neu-inset px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 h-8">
            <Filter className="w-3 h-3 text-slate-500" />
            <select
              value={traitFilter}
              onChange={(e) => setTraitFilter(e.target.value)}
              className="bg-transparent text-slate-800 outline-none font-bold cursor-pointer text-xs"
            >
              <option value="ALL">All Members</option>
              <option value="AS">Sickle Carriers (AS)</option>
              <option value="AA">Normal (AA)</option>
              <option value="HYPERTENSION">Hypertension Watch</option>
            </select>
          </div>

          {/* Zoom Buttons (for Pedigree View) */}
          {treeDisplayMode === 'pedigree' && (
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.25))}
                className="neu-icon-btn w-8 h-8 rounded-lg shadow-neu-sm"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5 text-slate-700" />
              </button>
              <button 
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.75))}
                className="neu-icon-btn w-8 h-8 rounded-lg shadow-neu-sm"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5 text-slate-700" />
              </button>
              <button 
                onClick={() => setZoomLevel(1)}
                className="neu-icon-btn w-8 h-8 rounded-lg shadow-neu-sm"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-700" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2A. MODE 1: PROFESSIONAL CLINICAL PEDIGREE TREE (DAG) */}
      {treeDisplayMode === 'pedigree' && (
        <div className="space-y-2">
          {/* Mobile Swipe Hint */}
          <div className="md:hidden flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
            <span>← Swipe horizontally or pinch to inspect nodes →</span>
            <span className="font-mono text-[10px] bg-white/70 px-2 py-0.5 rounded-full border border-slate-200">Scrollable Canvas</span>
          </div>

          <div className="neu-inset rounded-3xl p-3 sm:p-6 overflow-x-auto touch-pan-x w-full relative min-h-[460px]">
            <div 
              className="transition-transform origin-top min-w-[340px] max-w-4xl mx-auto space-y-4"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              
              {/* TIER G0: GENERATION I (GRANDPARENTS) */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="neu-pill text-[10px] font-black tracking-widest text-slate-700 shadow-neu-sm border border-white">
                    Generation I (G0) • Grandparents
                  </span>
                </div>

                {/* Nodes with Marriage Line */}
                <div className="flex items-center justify-center gap-4 sm:gap-10 py-1 relative">
                  {g0Members.map((m, idx) => renderPedigreeCard(m, `I-${idx + 1}`))}
                </div>
              </div>

              {/* ORTHOGONAL CONNECTORS: G0 Marriage Descent Line to G1 */}
              <div className="flex justify-center -my-1">
                <svg width="280" height="42" viewBox="0 0 280 42" className="overflow-visible">
                  {/* Marriage Bar connecting G0 Parents */}
                  <line x1="80" y1="0" x2="200" y2="0" stroke="#64748B" strokeWidth="2" strokeDasharray="3 2" />
                  {/* Descent Stem dropping down */}
                  <line x1="140" y1="0" x2="140" y2="24" stroke="#64748B" strokeWidth="2" />
                  {/* Connector into Femi (left branch) */}
                  <path d="M 140 24 L 95 24 L 95 42" fill="none" stroke="#64748B" strokeWidth="2" />
                  {/* Small arrow marker */}
                  <polygon points="92,40 95,44 98,40" fill="#64748B" />
                </svg>
              </div>

              {/* TIER G1: GENERATION II (PARENTS / SPOUSES) */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="neu-pill text-[10px] font-black tracking-widest text-slate-700 shadow-neu-sm border border-white">
                    Generation II (G1) • Parents & Spouses
                  </span>
                </div>

                {/* Nodes with Marriage Line */}
                <div className="flex items-center justify-center gap-4 sm:gap-10 py-1 relative">
                  {g1Members.map((m, idx) => renderPedigreeCard(m, `II-${idx + 1}`))}
                </div>
              </div>

              {/* ORTHOGONAL CONNECTORS: G1 Marriage Descent Line to G2 Children */}
              <div className="flex justify-center -my-1">
                <svg width="340" height="48" viewBox="0 0 340 48" className="overflow-visible">
                  {/* Marriage Line between Femi & Sade */}
                  <line x1="95" y1="0" x2="245" y2="0" stroke="#2563EB" strokeWidth="2.5" />
                  {/* Descent Stem from marriage */}
                  <line x1="170" y1="0" x2="170" y2="24" stroke="#2563EB" strokeWidth="2.5" />
                  {/* Sibship horizontal distribution bar */}
                  <line x1="95" y1="24" x2="245" y2="24" stroke="#2563EB" strokeWidth="2" />
                  {/* Drop-line to Child 1 (Tunde) */}
                  <line x1="95" y1="24" x2="95" y2="48" stroke="#2563EB" strokeWidth="2" />
                  <polygon points="92,44 95,48 98,44" fill="#2563EB" />
                  {/* Drop-line to Child 2 (Kehinde) */}
                  <line x1="245" y1="24" x2="245" y2="48" stroke="#2563EB" strokeWidth="2" />
                  <polygon points="242,44 245,48 248,44" fill="#2563EB" />
                </svg>
              </div>

              {/* TIER G2: GENERATION III (CHILDREN / OFFSPRING) */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="neu-pill text-[10px] font-black tracking-widest text-slate-700 shadow-neu-sm border border-white">
                    Generation III (G2) • Offspring & Dependents
                  </span>
                </div>

                {/* Children Nodes */}
                <div className="flex items-center justify-center gap-4 sm:gap-10 py-1">
                  {g2Members.map((m, idx) => renderPedigreeCard(m, `III-${idx + 1}`))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2B. MODE 2: STRUCTURED GENERATIONAL CLINICAL MATRIX */}
      {treeDisplayMode === 'matrix' && (
        <div className="space-y-4">
          
          {/* Generation 0 Section */}
          <div className="surface-card p-4 rounded-2xl border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center">I</span>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                    Generation 0 (Grandparents & Elders)
                  </h4>
                  <p className="text-[10px] text-slate-500">Maternal & Paternal ancestral health records</p>
                </div>
              </div>
              <span className="neu-pill text-[10px] font-bold bg-white text-slate-700">
                {g0Members.length} Members
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {g0Members.map((m, idx) => renderPedigreeCard(m, `I-${idx + 1}`))}
            </div>
          </div>

          {/* Generation 1 Section */}
          <div className="surface-card p-4 rounded-2xl border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-900 font-black text-xs flex items-center justify-center">II</span>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                    Generation 1 (Parents & Caretakers)
                  </h4>
                  <p className="text-[10px] text-slate-500">Custodial caregivers managing pediatric and senior regimens</p>
                </div>
              </div>
              <span className="neu-pill text-[10px] font-bold bg-white text-slate-700">
                {g1Members.length} Members
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {g1Members.map((m, idx) => renderPedigreeCard(m, `II-${idx + 1}`))}
            </div>
          </div>

          {/* Generation 2 Section */}
          <div className="surface-card p-4 rounded-2xl border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center">III</span>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                    Generation 2 (Children & Dependents)
                  </h4>
                  <p className="text-[10px] text-slate-500">EPI immunization schedules and sickle cell genotype carrier surveillance</p>
                </div>
              </div>
              <span className="neu-pill text-[10px] font-bold bg-white text-slate-700">
                {g2Members.length} Dependents
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {g2Members.map((m, idx) => renderPedigreeCard(m, `III-${idx + 1}`))}
            </div>
          </div>

        </div>
      )}

      {/* 3. CLINICAL PEDIGREE LEGEND & MENDELIAN RISK MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 pt-1 text-xs">
        
        {/* Genetic Legend (5 cols) */}
        <div className="lg:col-span-5 p-3.5 rounded-2xl neu-inset space-y-2">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
              {t.pedigreeLegend || 'Clinical Pedigree Symbols'}:
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-bold">Standard WHO / ACMG</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-500 rounded-sm inline-block bg-white shadow-xs" />
              <span>{t.maleSquare || 'Square: Male'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-500 rounded-full inline-block bg-white shadow-xs" />
              <span>{t.femaleCircle || 'Circle: Female'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-indigo-700 bg-indigo-600 rounded-sm inline-block shadow-xs" />
              <span>{t.carrierHalf || 'Solid: AS Carrier'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-400 bg-white rounded-sm inline-block shadow-xs" />
              <span>{t.normalSolid || 'Outline: AA Normal'}</span>
            </div>
          </div>
        </div>

        {/* Mendelian Risk Matrix & Counseling (7 cols) */}
        <div className="lg:col-span-7 p-3.5 rounded-2xl surface-card space-y-2 border border-blue-200/70 bg-gradient-to-br from-blue-50/40 to-white">
          <div className="flex items-center justify-between border-b border-blue-100 pb-1.5 text-blue-800">
            <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider">
              <Dna className="w-4 h-4 text-blue-600" />
              <span>{t.carrierRiskNotice || 'Mendelian Sickle Cell Risk Analysis'}:</span>
            </div>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              0% SS Disease Risk
            </span>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            Femi (AA) × Sade (AS) parental cross has <strong>50% probability of AS carrier offspring</strong> (Tunde) and <strong>50% probability of AA normal offspring</strong> (Kehinde). Pre-marital genotype compatibility confirmed.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono font-bold">
            <span className="bg-white text-blue-700 px-2 py-0.5 rounded-lg border border-blue-200 shadow-2xs">
              HbAA × HbAS Cross
            </span>
            <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200">
              50% Normal (HbAA)
            </span>
            <span className="bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-lg border border-indigo-200">
              50% Carrier (HbAS)
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
