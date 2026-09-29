import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Volume2, 
  CheckCircle, 
  Plus, 
  FileText, 
  Calendar, 
  Activity, 
  Pill, 
  ShieldAlert, 
  Search, 
  Camera, 
  Filter,
  CreditCard,
  ChevronRight,
  TrendingUp,
  Heart,
  Baby,
  Dna,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { ttsService } from '../services/tts';

export default function DashboardView({ 
  household, 
  records, 
  selectedMemberId, 
  currentUser,
  onOpenICE, 
  onNavigateCapture,
  onNavigateMCH,
  onNavigateTree,
  onNavigateExpenses,
  onMarkAlertDone 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [speakingId, setSpeakingId] = useState(null);

  // 1. Calculate 360° Household Health Metrics
  const health360Metrics = useMemo(() => {
    // Vaccine completion %
    let totalVaccines = 0;
    let completedVaccines = 0;
    household.members.forEach(m => {
      if (m.vaccinesDue) {
        totalVaccines += m.vaccinesDue.length;
        completedVaccines += m.vaccinesDue.filter(v => v.completed).length;
      }
    });
    const vaccineScore = totalVaccines > 0 ? Math.round((completedVaccines / totalVaccines) * 100) : 100;

    // Medication refill compliance
    let lowSupplyCount = 0;
    household.members.forEach(m => {
      if (m.regimen) {
        lowSupplyCount += m.regimen.filter(r => r.supplyRemainingDays <= 4).length;
      }
    });
    const medicationScore = lowSupplyCount === 0 ? 98 : lowSupplyCount === 1 ? 82 : 65;

    // Genetic & chronic risk monitoring
    const sickleCarriers = household.members.filter(m => m.genotype === 'AS' || m.genotype === 'SS').length;
    const htnCount = household.members.filter(m => m.chronicConditions?.some(c => c.toLowerCase().includes('hypertension'))).length;
    const geneticScore = sickleCarriers > 1 ? 85 : 95;

    // Financial health / budget usage
    const totalSpend = records.reduce((acc, curr) => acc + (curr.cost || 0), 0);
    const budgetCap = household.monthlyBudgetCap || 25000;
    const budgetUsagePct = Math.min(Math.round((totalSpend / budgetCap) * 100), 100);
    const budgetScore = budgetUsagePct <= 75 ? 95 : budgetUsagePct <= 90 ? 80 : 60;

    // Overall Composite 360° Health Index
    const overallScore = Math.round(
      (vaccineScore * 0.3) + (medicationScore * 0.3) + (geneticScore * 0.2) + (budgetScore * 0.2)
    );

    return {
      overallScore,
      vaccineScore,
      totalVaccines,
      completedVaccines,
      medicationScore,
      lowSupplyCount,
      sickleCarriers,
      htnCount,
      budgetScore,
      totalSpend,
      budgetCap,
      budgetUsagePct,
    };
  }, [household, records]);

  // 2. Generate Actionable Household Clinical Alerts
  const actionList = useMemo(() => {
    const alerts = [];

    household.members.forEach((m) => {
      // Vaccine alerts
      if (m.vaccinesDue) {
        m.vaccinesDue.forEach((v) => {
          if (!v.completed) {
            alerts.push({
              id: `vac_${m.id}_${v.name}`,
              memberId: m.id,
              memberName: m.name,
              title: `${m.name} is due for ${v.name}`,
              subtitle: `WHO Schedule milestone • Target: ${v.dueDate}`,
              targetDate: v.dueDate,
              category: 'VACCINE',
              urgency: 'HIGH',
              audioText: `Urgent health notice for ${m.name}. Vaccination dose ${v.name} is due on ${v.dueDate}. Please take child to the nearest primary health center.`,
            });
          }
        });
      }

      // Medication refill alerts
      if (m.regimen) {
        m.regimen.forEach((r) => {
          if (r.supplyRemainingDays <= 5) {
            alerts.push({
              id: `reg_${m.id}_${r.name}`,
              memberId: m.id,
              memberName: m.name,
              title: `${m.name}: ${r.name} runs low (${r.supplyRemainingDays} days left)`,
              subtitle: `Dosage: ${r.dosage} • Chemist refill required`,
              targetDate: 'Within 3 days',
              category: 'REFILL',
              urgency: 'HIGH',
              audioText: `Medication refill notice. ${m.name}'s supply of ${r.name} has only ${r.supplyRemainingDays} days remaining. Please refill at local chemist.`,
            });
          }
        });
      }

      // Chronic hypertension clinic reminder
      if (m.chronicConditions && m.chronicConditions.includes('Hypertension')) {
        alerts.push({
          id: `htn_${m.id}`,
          memberId: m.id,
          memberName: m.name,
          title: `Monthly BP Clinic Check recommended for ${m.name}`,
          subtitle: `Cardiovascular hypertension protocol • St. Nicholas or Health Post`,
          targetDate: 'This week',
          category: 'CLINICAL',
          urgency: 'MODERATE',
          audioText: `Clinical reminder for ${m.name}. Monthly blood pressure check is recommended this week.`,
        });
      }
    });

    return alerts;
  }, [household.members]);

  // Audio speech trigger for alert card
  const handlePlayTTS = (item) => {
    setSpeakingId(item.id);
    ttsService.speak(item.audioText, household.language || 'en');
    setTimeout(() => {
      setSpeakingId(null);
    }, 4500);
  };

  const activeMember = household.members.find((m) => m.id === selectedMemberId);

  // Filter records by search query and category
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesSearch = 
        rec.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'ALL' || 
        rec.type === selectedCategory || 
        rec.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [records, searchQuery, selectedCategory]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 pb-24">
      
      {/* 360° DASHBOARD HERO: HOUSEHOLD VITAL INDEX & PILLARS */}
      <section className="glass-panel rounded-3xl p-5 border border-emerald-200/90 bg-gradient-to-br from-white/95 via-emerald-50/20 to-white/90 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Household 360° Health Command Center
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Multi-generational clinical vitals, preventive care & emergency readiness
            </p>
          </div>

          <span className="text-[10px] font-extrabold uppercase bg-emerald-light text-emerald-primary px-2.5 py-1 rounded-full border border-emerald-200 shadow-xs">
            Live 360° Radar
          </span>
        </div>

        {/* 360° CIRCULAR INDEX + 4 PILLARS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4 items-center">
          
          {/* Main 360 Composite Score Gauge */}
          <div className="flex flex-col items-center justify-center p-3 bg-white/80 rounded-2xl border border-emerald-100 shadow-xs text-center">
            <div className="relative w-24 h-24 flex items-center justify-center my-1">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-primary transition-all duration-1000 ease-out"
                  strokeDasharray={`${health360Metrics.overallScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {health360Metrics.overallScore}%
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">360° Index</span>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-primary mt-1">
              Optimal Health Shield
            </span>
            <span className="text-[10px] text-slate-400">
              4 members monitored
            </span>
          </div>

          {/* 4 Pillars of 360° Health */}
          <div className="sm:col-span-2 grid grid-cols-2 gap-2.5">
            
            {/* Pillar 1: Maternal & Child (EPI) */}
            <button
              onClick={onNavigateMCH}
              className="p-3 rounded-2xl bg-white/80 hover:bg-pink-50/60 border border-slate-200/80 hover:border-pink-300 transition-all text-left group shadow-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="p-1.5 rounded-lg bg-pink-100 text-pink-700">
                  <Baby className="w-4 h-4" />
                </span>
                <span className="text-xs font-extrabold text-pink-700">{health360Metrics.vaccineScore}%</span>
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 group-hover:text-pink-700">MCH & Vaccines</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {health360Metrics.completedVaccines}/{health360Metrics.totalVaccines} doses completed
              </p>
            </button>

            {/* Pillar 2: Active Regimens & Refills */}
            <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 text-left shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                  <Pill className="w-4 h-4" />
                </span>
                <span className={`text-xs font-extrabold ${health360Metrics.lowSupplyCount > 0 ? 'text-amber-alert' : 'text-emerald-primary'}`}>
                  {health360Metrics.lowSupplyCount > 0 ? 'Refill Due' : 'Stocked'}
                </span>
              </div>
              <h3 className="text-xs font-extrabold text-slate-900">Chronic Regimens</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {health360Metrics.lowSupplyCount > 0 ? `${health360Metrics.lowSupplyCount} medicine runs low` : 'All regimens active'}
              </p>
            </div>

            {/* Pillar 3: Genetics & Pedigree Risk */}
            <button
              onClick={onNavigateTree}
              className="p-3 rounded-2xl bg-white/80 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-300 transition-all text-left group shadow-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-accent">
                  <Dna className="w-4 h-4" />
                </span>
                <span className="text-xs font-extrabold text-indigo-accent">2 AS Carriers</span>
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-accent">Genetic Pedigree</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Sickle trait map & BP lineage</p>
            </button>

            {/* Pillar 4: Financial Safety / Cash Ledger */}
            <button
              onClick={onNavigateExpenses}
              className="p-3 rounded-2xl bg-white/80 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 transition-all text-left group shadow-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-primary">
                  <CreditCard className="w-4 h-4" />
                </span>
                <span className="text-xs font-extrabold text-emerald-primary">{health360Metrics.budgetUsagePct}%</span>
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-primary">Health Budget</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {household.currency}{health360Metrics.totalSpend.toLocaleString()} / {household.currency}{health360Metrics.budgetCap.toLocaleString()}
              </p>
            </button>
          </div>
        </div>

        {/* Primary Health Clinic Liaison Info Bar */}
        <div className="pt-2.5 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="w-4 h-4 text-emerald-primary flex-shrink-0" />
            <span className="truncate font-medium">{household.clinicAnchor || 'Iru Comprehensive Primary Health Post, Lagos'}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-semibold flex-shrink-0">
            <span className="text-slate-500">Clinic: <strong className="text-slate-800">Mon & Thu</strong></span>
            <span className="text-slate-500">•</span>
            <a 
              href={`tel:${household.emergencyPhone?.replace(/\s+/g, '') || '+2348035550192'}`}
              className="text-emerald-primary hover:underline flex items-center gap-1 font-bold"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{household.emergencyPhone || '+234 803 555 0192'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 360° HOUSEHOLD ROSTER MATRIX (ALL 4 FAMILY MEMBERS IN 1 VIEW) */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-emerald-primary" />
            360° Household Roster & Next Clinical Milestones
          </h2>
          <span className="text-[10px] text-slate-400 font-semibold">{household.members.length} Members Monitored</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {household.members.map((member) => {
            const hasVaccinesPending = member.vaccinesDue?.some(v => !v.completed);
            const nextVaccine = member.vaccinesDue?.find(v => !v.completed);
            const isElderly = member.relation.includes('law') || member.relation.includes('Mother') && member.dob.startsWith('195');

            return (
              <div 
                key={member.id}
                className="glass-panel rounded-2xl p-3.5 border border-slate-200/90 hover:shadow-md transition-all bg-white/90"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-xs"
                      style={{ backgroundColor: member.avatarBg }}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-900 leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {member.relation} • Born: {member.dob}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenICE(member)}
                    className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-emergency border border-rose-200 text-[10px] font-extrabold flex items-center gap-1 shadow-xs transition-colors"
                    title={`Open emergency ICE pass for ${member.name}`}
                  >
                    <ShieldAlert className="w-3 h-3" />
                    <span>ICE PASS</span>
                  </button>
                </div>

                {/* Vitals & Genetics Badges */}
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Blood: {member.bloodGroup}
                  </span>
                  <span className={`px-2 py-0.5 rounded ${
                    member.genotype === 'AS' ? 'bg-amber-100 text-amber-800' : member.genotype === 'SS' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Genotype: {member.genotype}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 truncate max-w-[120px]" title={member.allergies?.join(', ')}>
                    {member.allergies?.[0] !== 'None' ? `⚠️ ${member.allergies?.[0]}` : 'No Allergies'}
                  </span>
                </div>

                {/* Next Clinical Milestone Timer */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-slate-600 truncate">
                    <Clock className="w-3.5 h-3.5 text-emerald-primary flex-shrink-0" />
                    <span className="truncate">
                      {nextVaccine 
                        ? `Due: ${nextVaccine.name} (${nextVaccine.dueDate})`
                        : member.regimen 
                        ? `Refill: ${member.regimen[1]?.name || member.regimen[0]?.name} in 3 days`
                        : member.chronicConditions?.includes('Hypertension')
                        ? 'BP Clinic check due this week'
                        : 'Routine preventative checkup'}
                    </span>
                  </div>

                  <span className="text-[10px] font-extrabold text-emerald-primary flex-shrink-0 ml-2">
                    Active
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 360° QUICK LAUNCH ACTION HUB */}
      <section className="bg-slate-100/80 p-3.5 rounded-2xl border border-slate-200/90">
        <h2 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-primary" />
          360° Quick Actions
        </h2>

        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <button
            onClick={onNavigateCapture}
            className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200/80 text-slate-800 flex flex-col items-center shadow-xs transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-light text-emerald-primary flex items-center justify-center mb-1">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold leading-tight">Snap Paper Record</span>
          </button>

          <button
            onClick={onNavigateMCH}
            className="p-2.5 rounded-xl bg-white hover:bg-pink-50 border border-slate-200/80 text-slate-800 flex flex-col items-center shadow-xs transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center mb-1">
              <Baby className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold leading-tight">EPI Vaccine Ladder</span>
          </button>

          <button
            onClick={onNavigateTree}
            className="p-2.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200/80 text-slate-800 flex flex-col items-center shadow-xs transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-accent flex items-center justify-center mb-1">
              <Dna className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold leading-tight">Sickle Trait Matrix</span>
          </button>

          <button
            onClick={onNavigateExpenses}
            className="p-2.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-200/80 text-slate-800 flex flex-col items-center shadow-xs transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-1">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold leading-tight">Health Cash Ledger</span>
          </button>
        </div>
      </section>

      {/* URGENT HOUSEHOLD ACTIONS / CALLOUT BOX WITH REGIONAL AUDIO TTS */}
      {actionList.length > 0 && selectedMemberId === 'ALL' && (
        <section aria-labelledby="urgent-actions-title">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <h2 id="urgent-actions-title" className="text-sm font-bold text-slate-900 tracking-tight">
                Urgent Priority Actions ({actionList.length})
              </h2>
            </div>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
              Tap audio for regional speech
            </span>
          </div>

          <div className="space-y-2.5">
            {actionList.map((item) => (
              <div 
                key={item.id}
                className="glass-panel rounded-xl p-3.5 flex items-start gap-3 border-l-4 border-l-amber-500 hover:shadow-md transition-shadow"
              >
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800 flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {item.subtitle}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Target: {item.targetDate}
                    </span>
                    {item.category === 'VACCINE' && (
                      <button
                        onClick={onNavigateMCH}
                        className="text-[10px] font-bold text-emerald-primary hover:underline flex items-center"
                      >
                        Open EPI Ladder <ChevronRight className="w-3 h-3 ml-0.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Audio TTS Button & Done Trigger */}
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handlePlayTTS(item)}
                    className={`p-2 rounded-lg border transition-colors touch-target flex items-center justify-center ${
                      speakingId === item.id 
                        ? 'bg-emerald-primary text-white border-emerald-primary animate-pulse' 
                        : 'bg-white/80 hover:bg-emerald-50 text-slate-700 border-slate-200'
                    }`}
                    title="Read alert aloud in regional speech"
                    aria-label="Play audio guidance"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onMarkAlertDone(item)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-light hover:bg-emerald-100 text-emerald-primary font-bold text-[11px] border border-emerald-200 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTINUOUS FAMILY HEALTH STREAM */}
      <section aria-labelledby="stream-title" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 id="stream-title" className="text-sm font-extrabold text-slate-900 tracking-tight">
              {selectedMemberId === 'ALL' ? 'Continuous Family Health Stream' : `${activeMember?.name}'s Medical History`}
            </h2>
            <p className="text-xs text-slate-500">
              {filteredRecords.length} records verified on-device
            </p>
          </div>

          <button
            onClick={onNavigateCapture}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-primary hover:bg-emerald-dark text-white font-bold text-xs shadow-sm transition-all self-start sm:self-auto"
          >
            <Camera className="w-4 h-4" />
            <span>Snap New Record</span>
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search meds, doctor, symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-primary/30 text-xs text-slate-800"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-2 rounded-xl border border-slate-200 bg-white/80 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="Prescription">Prescriptions</option>
            <option value="Immunization">Immunization</option>
            <option value="Lab Test">Lab Tests</option>
            <option value="Receipt">Receipts</option>
          </select>
        </div>

        {/* List of Continuous Records */}
        {filteredRecords.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center border-dashed border-2 border-slate-300">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No medical records match query</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You can snap physical prescription sheets, clinic notes, lab investigations, or receipt cards.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((rec) => {
              const memberObj = household.members.find((m) => m.id === rec.memberId);

              return (
                <article
                  key={rec.id}
                  className="glass-panel rounded-2xl p-4 hover:shadow-md transition-all duration-200 group border border-slate-200/90"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        rec.type === 'Prescription' 
                          ? 'bg-emerald-50 text-emerald-primary border-emerald-200' 
                          : rec.type === 'Immunization'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : rec.type === 'Lab Test'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {rec.type}
                      </span>
                      {rec.verified && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-primary" title="Digitally verified on-device">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">
                      {rec.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-primary transition-colors">
                    {rec.provider}
                  </h3>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-slate-50/60 p-2.5 rounded-lg border border-slate-100 font-mono text-[11.5px]">
                    {rec.details}
                  </p>

                  {rec.voiceNote && (
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-600 bg-amber-50/70 px-2.5 py-1.5 rounded-md border border-amber-200/60">
                      <Volume2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                      <span className="italic truncate">Voice Note: "{rec.voiceNote}"</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-200/70 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: memberObj?.avatarBg || '#047857' }}
                      />
                      <span className="font-semibold text-slate-700">
                        {memberObj?.name || 'Household Member'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-bold text-slate-900">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span>{household.currency}{Number(rec.cost || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
