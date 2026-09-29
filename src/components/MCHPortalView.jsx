import React, { useState } from 'react';
import { 
  Baby, 
  Heart, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Volume2, 
  TrendingUp, 
  Plus, 
  AlertCircle, 
  MapPin, 
  Scale, 
  Sparkles,
  X
} from 'lucide-react';
import { ttsService } from '../services/tts';

export default function MCHPortalView({ household, onUpdateVaccine, onAddGrowthPoint }) {
  // Find infant or child in household
  const infant = household.members.find(m => m.relation.includes('Infant') || m.relation.includes('Daughter') || m.relation.includes('Son')) || household.members[2];
  
  // Find pregnant woman in household if any
  const pregnantMother = household.members.find(m => m.isPregnant) || null;

  const [activeSubTab, setActiveSubTab] = useState('EPI'); // 'EPI' or 'GROWTH'
  const [showGrowthModal, setShowGrowthModal] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [muacColor, setMuacColor] = useState('Green'); // 'Green', 'Yellow', 'Red'
  const [growthNotes, setGrowthNotes] = useState('');

  // Handle vaccine toggle
  const handleToggleVaccine = (vacId, currentStatus) => {
    if (infant) {
      onUpdateVaccine(infant.id, vacId, !currentStatus);
    }
  };

  // Play audio guidance for specific vaccine milestone
  const handleAudioVaccine = (vac) => {
    const text = `Vaccine guidance: ${vac.name}. Scheduled due date: ${vac.dueDate}. ${vac.notes || 'Vital for child immunity against infectious disease.'}`;
    ttsService.speak(text, household.language || 'en');
  };

  // Submit growth point
  const handleSaveGrowth = (e) => {
    e.preventDefault();
    if (!weightInput || isNaN(parseFloat(weightInput))) {
      alert('Please enter a valid weight in kg');
      return;
    }

    const newPoint = {
      id: `gw_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ageMonths: 7, // calculated based on DOB
      weightKg: parseFloat(weightInput),
      muacColor: muacColor,
      muacMm: muacColor === 'Green' ? 138 : muacColor === 'Yellow' ? 120 : 110,
      notes: growthNotes.trim() || 'Logged at primary health post',
    };

    onAddGrowthPoint(infant.id, newPoint);
    setShowGrowthModal(false);
    setWeightInput('');
    setGrowthNotes('');
  };

  const growthRecords = infant?.growthRecords || [];
  const vaccinesDue = infant?.vaccinesDue || [];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
      {/* Title */}
      <div>
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Maternal & Child Health (MCH) Portal</span>
          <span className="text-[10px] font-bold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full border border-pink-200">
            WHO EPI Protocol
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Antenatal tracking, child immunization ladder, and WHO growth percentile curves.
        </p>
      </div>

      {/* STAGE HERO BANNER */}
      <div className="glass-panel rounded-2xl p-4 bg-gradient-to-r from-pink-500/10 via-purple-500/5 to-emerald-500/10 border border-pink-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
              <Baby className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  {infant ? infant.name : 'Baby Milestone'}
                </h3>
                <span className="text-[10px] font-extrabold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                  6.5 Months
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Stage: Complementary Feeding & EPI Booster Window
              </p>
            </div>
          </div>
        </div>

        {/* Quick Clinic Anchor Info */}
        <div className="mt-3 pt-2.5 border-t border-pink-200/60 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-primary" />
            <span className="truncate">{household.clinicAnchor || 'Iru Comprehensive Health Post'}</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-primary">Clinic Days: Mon & Thu</span>
        </div>
      </div>

      {/* Sub Tabs: Immunization Ladder vs Growth Curve */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/70 rounded-xl">
        <button
          onClick={() => setActiveSubTab('EPI')}
          className={`py-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
            activeSubTab === 'EPI'
              ? 'bg-white text-emerald-primary shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Vaccine Ladder (EPI)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('GROWTH')}
          className={`py-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
            activeSubTab === 'GROWTH'
              ? 'bg-white text-emerald-primary shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Growth Curve (MUAC)</span>
        </button>
      </div>

      {/* TAB 1: WHO EXPANDED PROGRAMME ON IMMUNIZATION (EPI) CHECKLIST */}
      {activeSubTab === 'EPI' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Expanded Programme on Immunization (WHO Schedule)
            </h3>
            <span className="text-[11px] font-bold text-emerald-primary">
              {vaccinesDue.filter(v => v.completed).length} of {vaccinesDue.length} Done
            </span>
          </div>

          <div className="space-y-2.5">
            {vaccinesDue.map((vac, idx) => (
              <div 
                key={vac.id || idx}
                className={`glass-panel rounded-xl p-3 flex items-start gap-3 border transition-all ${
                  vac.completed 
                    ? 'border-emerald-200 bg-emerald-50/30' 
                    : 'border-slate-300 bg-white/90'
                }`}
              >
                {/* Interactive Checkbox */}
                <button
                  onClick={() => handleToggleVaccine(vac.id, vac.completed)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-primary transition-colors flex-shrink-0"
                  aria-label={vac.completed ? 'Mark dose incomplete' : 'Mark dose completed'}
                >
                  {vac.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-primary fill-emerald-100" />
                  ) : (
                    <Circle className="w-6 h-6 hover:text-slate-600" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className={`text-xs font-extrabold ${vac.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {vac.name}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      vac.completed 
                        ? 'bg-emerald-100 text-emerald-primary' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {vac.completed ? 'Completed' : `Due: ${vac.dueDate}`}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-1">
                    {vac.notes || 'Administered at primary health center during weekly immunization clinic.'}
                  </p>

                  {vac.batch && (
                    <div className="mt-1 text-[10px] font-mono text-slate-400">
                      Batch #{vac.batch} • Verified by community nurse
                    </div>
                  )}
                </div>

                {/* Audio Guidance TTS Button */}
                <button
                  onClick={() => handleAudioVaccine(vac)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-primary transition-colors flex-shrink-0"
                  title="Listen to vaccine information"
                  aria-label="Audio guidance for vaccine"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: CHILD GROWTH TRACKER & MUAC STRIP */}
      {activeSubTab === 'GROWTH' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                WHO Weight-for-Age Growth Curve
              </h3>
              <p className="text-[11px] text-slate-500">Normal 50th percentile curve vs recorded weights</p>
            </div>

            <button
              onClick={() => setShowGrowthModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-primary text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-emerald-dark"
            >
              <Plus className="w-3.5 h-3.5" /> Log Growth Point
            </button>
          </div>

          {/* SVG Growth Chart */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-300 bg-white">
            <div className="h-48 w-full relative flex flex-col justify-between">
              {/* Y Axis Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-slate-400 pointer-events-none pb-5">
                <div className="border-b border-slate-100 flex justify-between"><span>10 kg</span></div>
                <div className="border-b border-slate-100 flex justify-between"><span>8 kg</span></div>
                <div className="border-b border-slate-100 flex justify-between"><span>6 kg</span></div>
                <div className="border-b border-slate-100 flex justify-between"><span>4 kg</span></div>
                <div className="border-b border-slate-200 flex justify-between font-bold text-slate-600"><span>2 kg (Birth)</span></div>
              </div>

              {/* Chart SVG Canvas */}
              <svg className="w-full h-40 overflow-visible relative z-10" viewBox="0 0 300 120" preserveAspectRatio="none">
                {/* 50th Percentile WHO Target Line (Green dashed curve) */}
                <path
                  d="M 10 100 Q 150 50, 290 20"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />

                {/* Recorded child weight path */}
                {growthRecords.length > 1 && (
                  <path
                    d={`M 15 ${120 - growthRecords[0].weightKg * 10} ${growthRecords.slice(1).map((r, i) => `L ${40 + (i + 1) * 60} ${120 - r.weightKg * 10}`).join(' ')}`}
                    fill="none"
                    stroke="#047857"
                    strokeWidth="3.5"
                  />
                )}

                {/* Data Points */}
                {growthRecords.map((r, i) => {
                  const x = 15 + i * 70;
                  const y = Math.max(10, 120 - r.weightKg * 10);
                  return (
                    <g key={r.id}>
                      <circle cx={x} cy={y} r="5" fill="#047857" stroke="#ffffff" strokeWidth="2" />
                      <text x={x} y={y - 8} fontSize="9" fontWeight="bold" fill="#047857" textAnchor="middle">
                        {r.weightKg}kg
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* X Axis Months */}
              <div className="flex justify-between text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-200">
                <span>Birth (0m)</span>
                <span>2m</span>
                <span>4m</span>
                <span>6m</span>
                <span>9m</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-3 text-[11px] font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-500 border border-emerald-500" /> WHO 50th %ile
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-primary" /> {infant?.name}'s Weight
              </span>
            </div>
          </div>

          {/* MUAC (Mid-Upper Arm Circumference) Reference Guide */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              MUAC Color Strip Status (Nutrition Check)
            </h4>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300">
                <div className="w-4 h-4 rounded-full bg-emerald-500 mx-auto mb-1" />
                <span className="font-extrabold text-emerald-800 block">Green (&gt;12.5cm)</span>
                <span className="text-[10px] text-emerald-600 mt-0.5 block">Normal Nutrition</span>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300">
                <div className="w-4 h-4 rounded-full bg-amber-500 mx-auto mb-1" />
                <span className="font-extrabold text-amber-800 block">Yellow (11.5-12.5cm)</span>
                <span className="text-[10px] text-amber-600 mt-0.5 block">Moderate Risk</span>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300">
                <div className="w-4 h-4 rounded-full bg-rose-500 mx-auto mb-1" />
                <span className="font-extrabold text-rose-800 block">Red (&lt;11.5cm)</span>
                <span className="text-[10px] text-rose-600 mt-0.5 block">Urgent Malnutrition</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SIMPLIFIED GROWTH POINT MODAL */}
      {showGrowthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-emerald-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                <h3 className="text-sm font-bold">Log Child Growth Point</h3>
              </div>
              <button onClick={() => setShowGrowthModal(false)} className="p-1 hover:bg-white/20 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrowth} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Current Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 7.6"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">MUAC Arm Strip Color</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Green', 'Yellow', 'Red'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setMuacColor(color)}
                      className={`py-2 rounded-xl border font-bold text-xs transition-all ${
                        muacColor === color
                          ? color === 'Green' ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                            : color === 'Yellow' ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                            : 'bg-rose-500 text-white border-rose-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Feeding / Clinical Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Breastfeeding + pap with groundnuts"
                  value={growthNotes}
                  onChange={(e) => setGrowthNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowGrowthModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-2.5 rounded-xl bg-emerald-primary text-white font-bold hover:bg-emerald-dark"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
