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
  ChevronRight
} from 'lucide-react';
import { ttsService } from '../services/tts';

export default function DashboardView({ 
  household, 
  records, 
  selectedMemberId, 
  onOpenICE, 
  onNavigateCapture,
  onNavigateMCH,
  onMarkAlertDone 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [speakingId, setSpeakingId] = useState(null);

  // Generate dynamic actionable alerts across household
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

      // Chronic condition & medication refill warnings
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

      if (m.chronicConditions && m.chronicConditions.includes('Hypertension')) {
        alerts.push({
          id: `htn_${m.id}`,
          memberId: m.id,
          memberName: m.name,
          title: `Monthly BP Clinic Check recommended for ${m.name}`,
          subtitle: `Cardiovascular hypertension protocol • St. Nicholas or Chemist`,
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
      {/* 1. URGENT HOUSEHOLD ACTIONS / HERO CALLOUT */}
      {actionList.length > 0 && selectedMemberId === 'ALL' && (
        <section aria-labelledby="urgent-actions-title">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <h2 id="urgent-actions-title" className="text-sm font-bold text-slate-900 tracking-tight">
                Urgent Household Actions ({actionList.length})
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
              Tap audio for speech
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
                        View EPI Tracker <ChevronRight className="w-3 h-3 ml-0.5" />
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
                    title="Read alert aloud in regional cadence"
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

      {/* 2. ACTIVE INDIVIDUAL PROFILE BANNER & ICE QUICK LAUNCH */}
      {activeMember && (
        <section className="glass-panel rounded-2xl p-4 border border-emerald-200/80 bg-gradient-to-br from-white/90 via-emerald-50/30 to-white/80 shadow-sm">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm"
                style={{ backgroundColor: activeMember.avatarBg }}
              >
                {activeMember.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                  {activeMember.name}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {activeMember.relation} • Born: {activeMember.dob}
                </p>
              </div>
            </div>

            {/* Standalone Emergency ICE Trigger */}
            <button
              onClick={() => onOpenICE(activeMember)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-emergency text-white font-bold text-xs shadow-sm hover:bg-rose-700 active:scale-95 transition-all animate-emergency flex-shrink-0"
              aria-label={`Open Emergency ICE Card for ${activeMember.name}`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>EMERGENCY ICE</span>
            </button>
          </div>

          {/* Critical Clinical Vitals Row */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/70">
            <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Group</span>
              <span className="text-sm font-extrabold text-emerald-primary mt-0.5 block">{activeMember.bloodGroup}</span>
            </div>

            <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Genotype</span>
              <span className={`text-sm font-extrabold mt-0.5 block ${activeMember.genotype === 'AS' ? 'text-amber-alert' : activeMember.genotype === 'SS' ? 'text-rose-emergency' : 'text-slate-900'}`}>
                {activeMember.genotype}
              </span>
            </div>

            <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60 truncate">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Allergies</span>
              <span className="text-xs font-bold text-rose-emergency mt-0.5 block truncate" title={activeMember.allergies?.join(', ')}>
                {activeMember.allergies && activeMember.allergies.length > 0 ? activeMember.allergies.join(', ') : 'None'}
              </span>
            </div>
          </div>

          {/* Chronic Conditions Tags */}
          {activeMember.chronicConditions && activeMember.chronicConditions.length > 0 && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Chronic:</span>
              {activeMember.chronicConditions.map((cond, idx) => (
                <span key={idx} className="text-[11px] font-semibold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                  {cond}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 3. CONTINUOUS FAMILY HEALTH STREAM & PAPER RECORDS */}
      <section aria-labelledby="stream-title" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 id="stream-title" className="text-base font-extrabold text-slate-900 tracking-tight">
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
            <button
              onClick={onNavigateCapture}
              className="mt-4 px-4 py-2 bg-emerald-primary text-white rounded-xl text-xs font-bold hover:bg-emerald-dark inline-flex items-center gap-1.5 shadow-sm"
            >
              <Camera className="w-4 h-4" />
              Scan Paper Document
            </button>
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
                  {/* Top Bar: Category Pill & Date */}
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

                  {/* Provider & Details */}
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-primary transition-colors">
                    {rec.provider}
                  </h3>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-slate-50/60 p-2.5 rounded-lg border border-slate-100 font-mono text-[11.5px]">
                    {rec.details}
                  </p>

                  {/* Voice note snippet if attached */}
                  {rec.voiceNote && (
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-600 bg-amber-50/70 px-2.5 py-1.5 rounded-md border border-amber-200/60">
                      <Volume2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                      <span className="italic truncate">Voice Note: "{rec.voiceNote}"</span>
                    </div>
                  )}

                  {/* Footer: Household Affiliation & Cash Cost */}
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
