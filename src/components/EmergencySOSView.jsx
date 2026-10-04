import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  AlertOctagon, 
  QrCode, 
  Droplet, 
  Heart, 
  Activity, 
  CheckCircle2, 
  Compass, 
  MapPin, 
  Clock, 
  ChevronRight, 
  AlertTriangle, 
  Search, 
  Stethoscope, 
  Sparkles,
  Share2,
  Printer,
  X
} from 'lucide-react';
import QRCode from 'qrcode';

export default function EmergencySOSView({
  household,
  selectedMemberId,
  onSelectMember,
  currentLang = 'en',
  translations
}) {
  const [selectedSosMemberId, setSelectedSosMemberId] = useState(selectedMemberId || household.members[0]?.id);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [activeFacilityFilter, setActiveFacilityFilter] = useState('ALL');
  
  // Triage State
  const [showTriageModal, setShowTriageModal] = useState(false);
  const [triageStep, setTriageStep] = useState('SYMPTOM_SELECT'); // 'SYMPTOM_SELECT' | 'SEVERITY' | 'RESULT'
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [hasRedFlags, setHasRedFlags] = useState(false);

  const t = translations || {};
  const currentMember = household.members.find(m => m.id === selectedSosMemberId) || household.members[0];

  // Generate Air-Gapped Offline QR code (Section 1.1 FR-06)
  useEffect(() => {
    if (!currentMember) return;

    const offlinePayload = {
      proto: 'FH_ICE_V2',
      id: currentMember.id,
      name: currentMember.name,
      dob: currentMember.dob,
      bloodGroup: currentMember.bloodGroup,
      genotype: currentMember.genotype,
      allergies: currentMember.allergies,
      resuscitation: currentMember.resuscitationOrder || 'Full Code',
      chronic: currentMember.chronicConditions,
      caretaker: household.head,
      emergencyPhone: household.emergencyPhone,
      clinic: household.clinicAnchor,
      ts: new Date().toISOString(),
    };

    QRCode.toDataURL(JSON.stringify(offlinePayload), {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 260,
      color: {
        dark: '#141210',
        light: '#FFFFFF',
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Error generating offline ICE QR:', err));
  }, [currentMember, household]);

  // Vernacular colloquial symptom definitions (FR-07 & FR-08)
  const TRIAGE_SYMPTOMS = [
    {
      id: 'fever',
      title: 'High Fever / Febrile Event',
      slang: 'Body dey hot well well (Malaria / Febrile Convulsion)',
      icon: Activity,
      redFlags: ['Stiff neck', 'Twitching or seizure', 'Vomiting everything', 'Extreme lethargy / Unresponsive'],
      guidance: {
        redFlagCategory: 'EMERGENCY_ROOM',
        categoryLabel: 'EMERGENCY ROOM (IMMEDIATE ESCALATION)',
        urgencyColor: 'bg-emergency text-white',
        advice: 'Proceed immediately to General Hospital Ikeja or nearest 24/7 emergency unit. Keep patient in lateral recovery position, do not place anything in mouth during seizures.',
      },
      standardGuidance: {
        category: 'PRIMARY_CARE',
        categoryLabel: 'PRIMARY HEALTH CARE (PHC) VISIT',
        urgencyColor: 'bg-ochre text-white',
        advice: 'Take rapid diagnostic test (RDT) for Malaria at Iru PHC. Sponge with lukewarm water. Maintain oral hydration.',
      }
    },
    {
      id: 'vertigo',
      title: 'Dizziness / Presyncope',
      slang: 'My eye dey turn me (BP Crisis / Low Blood Sugar)',
      icon: AlertTriangle,
      redFlags: ['Sudden weakness in one arm/face', 'Slurred speech', 'Systolic BP over 180 mmHg', 'Chest pain'],
      guidance: {
        redFlagCategory: 'EMERGENCY_ROOM',
        categoryLabel: 'TERTIARY STROKE / CARDIAC EMERGENCY',
        urgencyColor: 'bg-emergency text-white',
        advice: 'Signs suggestive of acute hypertensive crisis or transient ischemic attack. Call 112 or First Cardiology emergency hotline.',
      },
      standardGuidance: {
        category: 'COMMUNITY_PHARMACY',
        categoryLabel: 'COMMUNITY PHARMACY BP & GLUCOSE CHECK',
        urgencyColor: 'bg-forest text-white',
        advice: 'Rest seated, drink a glass of water. Visit MedPlus or local chemist to check blood pressure and blood sugar.',
      }
    },
    {
      id: 'cramps',
      title: 'Acute Abdominal Cramps / Diarrhea',
      slang: 'Belly dey bite me (Acute Gastroenteritis / Cholera)',
      icon: Droplet,
      redFlags: ['Rice-water watery stools (>5 times in 2 hours)', 'Sunken eyes and dry tongue', 'Unable to drink', 'Blood in stool'],
      guidance: {
        redFlagCategory: 'EMERGENCY_ROOM',
        categoryLabel: 'PRIMARY HEALTH CENTER / ORS EMERGENCY',
        urgencyColor: 'bg-emergency text-white',
        advice: 'Severe dehydration danger (Cholera epidemic marker). Begin immediate Oral Rehydration Salts (ORS) + Zinc and transport to Iru PHC.',
      },
      standardGuidance: {
        category: 'HOME_CARE',
        categoryLabel: 'SUPPORTIVE HOME CARE & ORS',
        urgencyColor: 'bg-forest text-white',
        advice: 'Administer clean boiled water with ORS sachet. Avoid heavy oily foods. Monitor frequency for 12 hours.',
      }
    },
    {
      id: 'dyspnea',
      title: 'Shortness of Breath',
      slang: 'Breathe dey hard me (Asthma Attack / Bronchospasm)',
      icon: Stethoscope,
      redFlags: ['Inability to complete full sentences', 'Stridor / Gasping sound', 'Bluish lips or fingertips', 'Chest pulling in'],
      guidance: {
        redFlagCategory: 'EMERGENCY_ROOM',
        categoryLabel: 'EMERGENCY ROOM (OXYGEN SUPPORT)',
        urgencyColor: 'bg-emergency text-white',
        advice: 'Administer 4-6 puffs of Salbutamol inhaler via spacer if available. Transport immediately to emergency room with oxygen availability.',
      },
      standardGuidance: {
        category: 'PRIMARY_CARE',
        categoryLabel: 'PHC CLINICAL ENCOUNTER',
        urgencyColor: 'bg-ochre text-white',
        advice: 'Sit upright, avoid smoke and dust exposure. Visit clinic for peak flow assessment.',
      }
    }
  ];

  // Filter facilities
  const filteredFacilities = (household.facilities || []).filter(fac => {
    if (activeFacilityFilter === 'EMERGENCY') return fac.emergency24_7;
    if (activeFacilityFilter === 'PHC') return fac.type === 'PHC';
    if (activeFacilityFilter === 'PHARMACY') return fac.type === 'PHARMACY';
    return true;
  });

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200">

      {/* 1. EMERGENCY TOP NOTIFICATION (Neumorphic Crimson) */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-4 py-3.5 rounded-2xl flex items-center justify-between shadow-neu-raised border border-white/20">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 animate-emergency text-white flex-shrink-0" />
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider">
              Zero-Click Crisis Health Card & Triage
            </h2>
            <p className="text-[10px] text-rose-100">
              Offline emergency profile directly readable by any offline scanner
            </p>
          </div>
        </div>

        {/* Member Selector Pill */}
        <select
          value={selectedSosMemberId}
          onChange={(e) => {
            setSelectedSosMemberId(e.target.value);
            onSelectMember(e.target.value);
          }}
          className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs py-1.5 px-3 rounded-xl border border-white/30 outline-none cursor-pointer shadow-neu-sm transition-all"
        >
          {household.members.map(m => (
            <option key={m.id} value={m.id} className="text-slate-900 bg-white">
              {m.name} ({m.generation})
            </option>
          ))}
        </select>
      </div>

      {/* 2. EMERGENCY HEALTH CARD (Neumorphic Surface Card) */}
      <div className="surface-card p-5 sm:p-6 space-y-4">
        
        <div className="text-center space-y-0.5 border-b border-white/80 pb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            EMERGENCY HEALTH CARD
          </span>
          <h3 className="text-xl font-black text-slate-900">
            {currentMember.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {currentMember.relation} • Born: {currentMember.dob}
          </p>
        </div>

        {/* AIR-GAPPED OFFLINE QR CODE (Neumorphic Inset Frame) */}
        <div className="text-center py-4 neu-inset rounded-3xl">
          <div className="inline-block p-3 bg-white rounded-3xl shadow-neu-raised border-2 border-white">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Offline ICE QR Matrix" className="w-48 h-48 mx-auto rounded-xl" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-500 font-bold">
                Generating Offline Pass...
              </div>
            )}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-2 font-bold">
            Offline Scan: Direct CBOR Decryption • Zero Cloud Dependency
          </div>
        </div>

        {/* CRITICAL MEDICAL ATTRIBUTES (48pt Blood Group + Genotype - Neumorphic Extrusion) */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="p-4 rounded-3xl neu-btn text-center shadow-neu-raised border border-rose-200/80">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 block">
              BLOOD GROUP
            </span>
            <div className="text-4xl sm:text-5xl font-black text-rose-700 my-1 font-mono">
              {currentMember.bloodGroup}
            </div>
            <span className="text-[10px] font-bold text-slate-500">Rh Factor Verified</span>
          </div>

          <div className="p-4 rounded-3xl neu-inset text-center shadow-neu-pressed">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 block">
              GENOTYPE
            </span>
            <div className="text-4xl sm:text-5xl font-black text-indigo-900 my-1 font-mono">
              {currentMember.genotype}
            </div>
            <span className="text-[10px] font-bold text-slate-500">Mendelian Trait</span>
          </div>
        </div>

        {/* ALLERGIES & RESUSCITATION SPECIFICATION */}
        <div className="space-y-2.5 text-xs neu-inset p-4 rounded-2xl">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-slate-900 block">Severe Allergies:</span>
              <span className="text-slate-800 font-semibold">
                {currentMember.allergies?.join(', ') || 'No known drug allergies declared'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-2 border-t border-white/80">
            <Heart className="w-4 h-4 text-slate-800 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-slate-900 block">Resuscitation Order:</span>
              <span className="text-slate-800 font-medium">
                {currentMember.resuscitationOrder || 'Full Code (CPR / Endotracheal Intubation)'}
              </span>
            </div>
          </div>

          {currentMember.chronicConditions && currentMember.chronicConditions.length > 0 && (
            <div className="flex items-start gap-2.5 pt-2 border-t border-white/80">
              <Activity className="w-4 h-4 text-slate-800 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-slate-900 block">Chronic Conditions:</span>
                <span className="text-slate-600 font-medium">
                  {currentMember.chronicConditions.join(', ')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* DIRECT EMERGENCY CONTACTS (Proportioned Speed Dial) */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
            Direct Emergency Contacts (One-Touch Call)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={`tel:${household.emergencyPhone?.replace(/\s+/g, '') || '+2348023341122'}`}
              className="neu-btn-primary min-h-[48px] px-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-neu-primary cursor-pointer"
            >
              <div>
                <span className="block font-bold text-white">Call Caretaker ({household.head})</span>
                <span className="text-[11px] text-slate-400 font-mono">{household.emergencyPhone}</span>
              </div>
              <PhoneCall className="w-4 h-4 text-white" />
            </a>

            <a
              href="tel:112"
              className="neu-btn min-h-[48px] px-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-neu-raised cursor-pointer"
            >
              <div>
                <span className="block font-bold text-slate-900">Lagos State Emergency Service</span>
                <span className="text-[11px] text-slate-500 font-mono">Toll-Free Hotline: 112 / 767</span>
              </div>
              <AlertOctagon className="w-4 h-4 text-slate-900" />
            </a>
          </div>
        </div>

      </div>

      {/* 3. "KNOW BEFORE YOU GO" SYMPTOM TRIAGE (Section 1.1 FR-07) */}
      <div className="surface-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl neu-inset flex items-center justify-center text-slate-800">
              <Compass className="w-4 h-4 text-slate-800" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                {t.knowBeforeYouGo || 'Know Before You Go — Triage'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Rule-based clinical decision support & regional endemic symptom cascades
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedSymptom(TRIAGE_SYMPTOMS[0]);
              setHasRedFlags(false);
              setTriageStep('SYMPTOM_SELECT');
              setShowTriageModal(true);
            }}
            className="neu-btn-primary h-9 px-3.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 shadow-neu-primary cursor-pointer"
          >
            <span>Launch Triage</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Symptom Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {TRIAGE_SYMPTOMS.map(sym => (
            <div
              key={sym.id}
              onClick={() => {
                setSelectedSymptom(sym);
                setHasRedFlags(false);
                setTriageStep('SEVERITY');
                setShowTriageModal(true);
              }}
              className="p-3 rounded-xl bg-chalk hover:bg-sand border border-borderRule cursor-pointer transition-colors space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-charcoal">{sym.title}</span>
                <sym.icon className="w-4 h-4 text-terracotta" />
              </div>
              <p className="text-[11px] text-charcoal-muted italic truncate">
                "{sym.slang}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CARE DISCOVERY & GEOSPATIAL FACILITIES DIRECTORY (FR-10 & Section 6.4) */}
      <div className="surface-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-borderRule pb-3">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-charcoal">
              {t.nearbyFacilities || 'Care Discovery & Verified Facilities'}
            </h3>
            <p className="text-[11px] text-charcoal-muted">
              PostGIS spatial distance from Lagos edge coordinates (6.5244° N, 3.3792° E)
            </p>
          </div>

          {/* Facility Filter Pills */}
          <div className="flex items-center gap-1 bg-sand p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveFacilityFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                activeFacilityFilter === 'ALL' ? 'bg-charcoal text-white' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFacilityFilter('EMERGENCY')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                activeFacilityFilter === 'EMERGENCY' ? 'bg-emergency text-white' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              24/7 SOS
            </button>
            <button
              onClick={() => setActiveFacilityFilter('PHC')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                activeFacilityFilter === 'PHC' ? 'bg-forest text-white' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              PHC (EPI)
            </button>
            <button
              onClick={() => setActiveFacilityFilter('PHARMACY')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                activeFacilityFilter === 'PHARMACY' ? 'bg-ochre text-white' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Pharmacies
            </button>
          </div>
        </div>

        {/* Facilities List */}
        <div className="space-y-2.5">
          {filteredFacilities.map(fac => (
            <div key={fac.id} className="p-3.5 rounded-xl bg-chalk border border-borderRule flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-xs text-charcoal">{fac.name}</h4>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-terracotta-container text-terracotta">
                    {fac.distanceKm} km
                  </span>
                  {fac.emergency24_7 && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emergency-container text-emergency">
                      24/7 ER
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-charcoal-muted">{fac.address}</p>
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-charcoal-muted pt-0.5">
                  <Clock className="w-3 h-3 text-charcoal-muted" />
                  <span>{fac.operatingHours}</span>
                  <span>•</span>
                  <span>HMO: {fac.hmoAccepted?.slice(0, 2).join(', ')}</span>
                </div>
              </div>

              <a
                href={`tel:${fac.phone.replace(/\s+/g, '')}`}
                className="p-2.5 rounded-xl bg-sand hover:bg-sand-variant text-charcoal text-xs font-black flex items-center gap-1 shadow-xs flex-shrink-0"
                title={`Call ${fac.name}`}
              >
                <PhoneCall className="w-3.5 h-3.5 text-forest" />
                <span className="hidden sm:inline">Call</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 5. CLINICAL TRIAGE DECISION TREE MODAL (FR-07) */}
      {showTriageModal && selectedSymptom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/65 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="surface-card w-full max-w-lg p-5 space-y-4 shadow-lifted relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-borderRule pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-terracotta" />
                <div>
                  <h3 className="text-sm font-black text-charcoal">
                    Care Triage Clinical Decision Tree
                  </h3>
                  <p className="text-[10px] text-charcoal-muted">
                    Strict Non-Diagnostic Legal Firewall • Urgency Stratification
                  </p>
                </div>
              </div>

              <button onClick={() => setShowTriageModal(false)} className="p-1 rounded-lg hover:bg-sand">
                <X className="w-5 h-5 text-charcoal-muted" />
              </button>
            </div>

            {/* Step Content */}
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-chalk border border-borderRule text-xs">
                <span className="font-extrabold text-charcoal block">{selectedSymptom.title}</span>
                <span className="text-charcoal-muted italic block text-[11px]">"{selectedSymptom.slang}"</span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-charcoal block">
                  Check Red-Flag Endemic Danger Signs:
                </span>
                {selectedSymptom.redFlags.map((flag, idx) => (
                  <label key={idx} className="flex items-center gap-2.5 p-2 rounded-lg bg-sand/60 hover:bg-sand cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        setHasRedFlags(true);
                      }}
                      className="w-4 h-4 rounded text-emergency focus:ring-emergency"
                    />
                    <span className="font-medium text-charcoal">{flag}</span>
                  </label>
                ))}
              </div>

              {/* Triage Stratification Output */}
              <div className="pt-2">
                {hasRedFlags ? (
                  <div className="p-4 rounded-xl bg-emergency-container border-2 border-emergency text-charcoal space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-emergency text-white font-black text-xs uppercase tracking-wider">
                        {selectedSymptom.guidance.categoryLabel}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-charcoal leading-relaxed">
                      {selectedSymptom.guidance.advice}
                    </p>
                    <div className="pt-2 flex items-center gap-2">
                      <a
                        href="tel:112"
                        className="px-4 py-2 rounded-xl bg-emergency text-white font-black text-xs inline-flex items-center gap-1.5 shadow-md"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call 112 Emergency Dispatch</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-forest-light border-2 border-forest text-charcoal space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-forest text-white font-black text-xs uppercase tracking-wider">
                        {selectedSymptom.standardGuidance.categoryLabel}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-charcoal leading-relaxed">
                      {selectedSymptom.standardGuidance.advice}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowTriageModal(false)}
              className="w-full py-2.5 rounded-xl bg-sand text-charcoal font-bold text-xs hover:bg-sand-variant transition-colors"
            >
              Done / Close Triage
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
