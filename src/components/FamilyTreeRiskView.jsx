import React, { useState } from 'react';
import { 
  GitFork, 
  Dna, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  HelpCircle,
  Heart,
  Activity,
  ArrowRight
} from 'lucide-react';
import { geneticsService, GENOTYPES } from '../services/genetics';

export default function FamilyTreeRiskView({ household }) {
  const [partnerGenotype1, setPartnerGenotype1] = useState('AS');
  const [partnerGenotype2, setPartnerGenotype2] = useState('AS');

  // Household hereditary risk analysis
  const riskAnalysis = geneticsService.analyzeHouseholdRisks(household.members);

  // Pre-marital / Pre-conception match calculation
  const matchResult = geneticsService.calculateOffspringRisk(partnerGenotype1, partnerGenotype2);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 pb-24">
      {/* Title & Overview */}
      <div>
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Family Health Tree & Genetic Risk</span>
          <span className="text-[10px] font-bold bg-indigo-light text-indigo-accent px-2 py-0.5 rounded-full border border-indigo-accent/20">
            Pedigree Map
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Visualize multi-generational inheritance of Sickle Cell, hypertension, and diabetes.
        </p>
      </div>

      {/* 1. INTERACTIVE SVG PEDIGREE LINAGE CANVAS */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-300 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <GitFork className="w-4 h-4 text-emerald-primary" />
            Generational Lineage Chart
          </span>
          <span className="text-[10px] text-slate-400">Touch & pan supported</span>
        </div>

        {/* SVG Pedigree Diagram Container */}
        <div className="w-full overflow-x-auto no-scrollbar py-2">
          <div className="min-w-[360px] mx-auto flex flex-col items-center">
            {/* Gen 1: Grandparents */}
            <div className="text-center mb-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                Generation I (Grandparents)
              </span>
              <div className="mt-1 flex justify-center">
                <PedigreeNode 
                  member={household.members.find(m => m.relation.includes('in-law') || m.name.includes('Fatima')) || household.members[3]} 
                />
              </div>
            </div>

            {/* Connecting Line from Gen 1 to Gen 2 */}
            <svg width="240" height="36" className="overflow-visible">
              {/* Vertical line down from Grandma */}
              <line x1="120" y1="0" x2="120" y2="18" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 3" />
              {/* Horizontal branch line */}
              <line x1="60" y1="18" x2="180" y2="18" stroke="#94A3B8" strokeWidth="2" />
              {/* Downward spurs */}
              <line x1="60" y1="18" x2="60" y2="36" stroke="#94A3B8" strokeWidth="2" />
              <line x1="180" y1="18" x2="180" y2="36" stroke="#94A3B8" strokeWidth="2" />
            </svg>

            {/* Gen 2: Parents (Spouses) */}
            <div className="w-full flex items-center justify-center gap-8">
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-400 mb-1">Caretaker (Mother)</span>
                <PedigreeNode 
                  member={household.members.find(m => m.relation.includes('Self') || m.name.includes('Amina')) || household.members[0]} 
                />
              </div>

              {/* Marriage Bar */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-rose-500">♥</span>
                <div className="w-6 h-0.5 bg-slate-400 mt-1" />
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[9px] font-bold text-slate-400 mb-1">Spouse (Father)</span>
                <PedigreeNode 
                  member={household.members.find(m => m.relation.includes('Spouse') || m.name.includes('Ibrahim')) || household.members[1]} 
                />
              </div>
            </div>

            {/* Connecting Line from Parents to Offspring */}
            <svg width="200" height="34" className="overflow-visible">
              <line x1="100" y1="0" x2="100" y2="34" stroke="#047857" strokeWidth="2.5" />
            </svg>

            {/* Gen 3: Children */}
            <div className="text-center">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                Generation III (Offspring)
              </span>
              <div className="mt-1 flex justify-center">
                <PedigreeNode 
                  member={household.members.find(m => m.relation.includes('Daughter') || m.relation.includes('Infant')) || household.members[2]} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TRAIT MATCHING MATRIX (PRE-MARITAL / CONCEPTION GENOTYPE CALCULATOR) */}
      <section className="glass-panel rounded-2xl p-4 border border-indigo-200 bg-gradient-to-br from-white/95 to-indigo-50/40 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Dna className="w-5 h-5 text-indigo-accent" />
          <h3 className="text-sm font-extrabold text-slate-900">
            Trait Matching Matrix (Pre-Marital Analyzer)
          </h3>
        </div>
        <p className="text-xs text-slate-600 mb-4">
          Calculate the statistical Mendelian risk of offspring inheriting Sickle Cell Anemia (SS) or carrier trait (AS).
        </p>

        {/* Genotype Pair Pickers */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Partner 1 Genotype
            </label>
            <select
              value={partnerGenotype1}
              onChange={(e) => setPartnerGenotype1(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-extrabold text-sm text-indigo-accent bg-white"
            >
              {GENOTYPES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-slate-200">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Partner 2 Genotype
            </label>
            <select
              value={partnerGenotype2}
              onChange={(e) => setPartnerGenotype2(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-extrabold text-sm text-indigo-accent bg-white"
            >
              {GENOTYPES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Offspring Risk Breakdown Display */}
        <div className={`p-4 rounded-xl border ${
          matchResult.riskLevel === 'CRITICAL'
            ? 'bg-rose-50 border-rose-300 text-rose-900'
            : matchResult.riskLevel === 'MODERATE'
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-emerald-50 border-emerald-300 text-emerald-900'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 font-extrabold text-xs">
              {matchResult.riskLevel === 'CRITICAL' ? (
                <ShieldAlert className="w-4 h-4 text-rose-emergency" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-primary" />
              )}
              <span>Offspring Outcome: {partnerGenotype1} × {partnerGenotype2}</span>
            </div>

            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              matchResult.riskLevel === 'CRITICAL'
                ? 'bg-rose-emergency text-white'
                : matchResult.riskLevel === 'MODERATE'
                ? 'bg-amber-500 text-white'
                : 'bg-emerald-primary text-white'
            }`}>
              {matchResult.riskLevel} RISK
            </span>
          </div>

          {/* Probabilities Grid */}
          <div className="grid grid-cols-4 gap-2 my-2 text-center">
            {Object.entries(matchResult.probabilities).map(([trait, pct]) => (
              <div key={trait} className="bg-white/80 p-2 rounded-lg border border-slate-200/80 shadow-xs">
                <span className="text-[10px] font-bold text-slate-500 block">{trait}</span>
                <span className={`text-base font-black ${
                  trait === 'SS' || trait === 'SC' 
                    ? 'text-rose-emergency' 
                    : trait === 'AS' 
                    ? 'text-amber-alert' 
                    : 'text-emerald-primary'
                }`}>
                  {pct}%
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs font-semibold mt-2 leading-relaxed">
            {matchResult.advice}
          </p>
        </div>
      </section>

      {/* 3. MULTI-GENERATIONAL CHRONIC RISK ALERTS */}
      <section className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Detected Hereditary Risks in Household
        </h3>

        {riskAnalysis.alerts.map((alert) => (
          <div 
            key={alert.id}
            className={`glass-panel rounded-xl p-3.5 border-l-4 ${
              alert.level === 'CRITICAL' 
                ? 'border-l-rose-emergency' 
                : alert.level === 'WARNING' 
                ? 'border-l-amber-alert' 
                : 'border-l-indigo-accent'
            }`}
          >
            <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <AlertTriangle className={`w-3.5 h-3.5 ${
                alert.level === 'CRITICAL' ? 'text-rose-emergency' : 'text-amber-alert'
              }`} />
              <span>{alert.title}</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {alert.description}
            </p>
            <div className="mt-2 text-[11px] font-bold text-emerald-primary bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Guidance: {alert.action}
            </div>
          </div>
        ))}
      </section>

      {/* 4. BLOOD & GENOTYPE ROSTER */}
      <section>
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Household Genotype & Blood Roster
        </h3>

        <div className="space-y-2">
          {household.members.map((m) => (
            <div 
              key={m.id}
              className="glass-panel rounded-xl p-3 flex items-center justify-between gap-3 border border-slate-200"
            >
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: m.avatarBg }}
                >
                  {m.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                  <p className="text-[11px] text-slate-500">{m.relation}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-800 font-extrabold text-xs border border-slate-200">
                  {m.bloodGroup}
                </span>

                <span className={`px-2 py-1 rounded-md font-extrabold text-xs border ${
                  m.genotype === 'AS' 
                    ? 'bg-amber-100 text-amber-800 border-amber-300' 
                    : m.genotype === 'SS' 
                    ? 'bg-rose-100 text-rose-800 border-rose-300' 
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {m.genotype}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Subcomponent: Individual Node in Pedigree SVG Chart
function PedigreeNode({ member }) {
  if (!member) return null;

  return (
    <div className="glass-panel rounded-xl p-2.5 w-36 text-center border border-slate-300 shadow-sm bg-white/90">
      <div 
        className="w-9 h-9 rounded-full mx-auto flex items-center justify-center text-white font-extrabold text-xs shadow-xs"
        style={{ backgroundColor: member.avatarBg }}
      >
        {member.name.charAt(0)}
      </div>
      <div className="text-[11px] font-bold text-slate-900 truncate mt-1">
        {member.name.split(' ')[0]}
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] font-extrabold">
        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
          {member.bloodGroup}
        </span>
        <span className={`px-1.5 py-0.5 rounded ${
          member.genotype === 'AS' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
        }`}>
          {member.genotype}
        </span>
      </div>
      {member.chronicConditions && member.chronicConditions.length > 0 && (
        <div className="mt-1 text-[9px] text-rose-600 font-semibold truncate" title={member.chronicConditions.join(', ')}>
          {member.chronicConditions[0]}
        </div>
      )}
    </div>
  );
}
