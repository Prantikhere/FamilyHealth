import React, { useState } from 'react';
import { 
  HeartPulse, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Camera, 
  Dna, 
  Baby, 
  CreditCard, 
  AlertOctagon, 
  CheckCircle2, 
  WifiOff, 
  Zap, 
  Users, 
  TrendingUp, 
  Smartphone, 
  Download, 
  Play, 
  ChevronRight,
  Stethoscope,
  Globe2,
  Lock
} from 'lucide-react';

export default function LandingPage({ onEnterApp, onSelectDemoUser }) {
  const [activeFeatureTab, setActiveFeatureTab] = useState('ocr');

  const featureTabs = [
    {
      id: 'ocr',
      title: 'Paper-to-Data OCR',
      icon: Camera,
      tag: 'Computer Vision',
      heading: 'Instant On-Device Prescription & Bill Ingestion',
      desc: 'Transforms crumpled paper prescriptions, clinical notes, and handwritten receipts into structured databases in under 1.2 seconds—entirely offline using edge binarization and heuristic regex algorithms.',
      metric: '100% Offline',
      metricLabel: 'Zero server dependency',
      color: 'from-emerald-500/20 to-teal-500/10',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'genetics',
      title: 'Sickle Cell & Pedigree',
      icon: Dna,
      tag: 'Preventive Genetics',
      heading: 'Pre-Marital Mendelian Risk & Family Tree Map',
      desc: 'Analyzes hereditary risks across three generations. Features an interactive Punnett square trait analyzer that alerts carriers to potential Sickle Cell Anemia (SS) inheritance before conception.',
      metric: '25% Risk',
      metricLabel: 'Detected for AS × AS couples',
      color: 'from-indigo-500/20 to-purple-500/10',
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'mch',
      title: 'WHO EPI Vaccines',
      icon: Baby,
      tag: 'Maternal & Child',
      heading: 'Interactive Immunization Ladder & MUAC Strip',
      desc: 'Guides mothers through the full WHO Expanded Programme on Immunization (BCG to Measles). Includes visual weight percentile growth curves and Mid-Upper Arm Circumference malnutrition color bands.',
      metric: '83% EPI',
      metricLabel: 'Vaccination milestone compliance',
      color: 'from-pink-500/20 to-rose-500/10',
      badgeColor: 'bg-pink-100 text-pink-800'
    },
    {
      id: 'ice',
      title: 'Emergency ICE Pass',
      icon: AlertOctagon,
      tag: 'Triage Paramedic',
      heading: 'Offline QR Medical Pass with One-Touch Dial',
      desc: 'Blood red high-contrast emergency card accessible without phone unlocking. Encrypts blood group, critical allergies, and emergency contact into a standalone QR scannable by paramedics without internet.',
      metric: '< 2 Seconds',
      metricLabel: 'Paramedic triage assessment',
      color: 'from-rose-500/20 to-amber-500/10',
      badgeColor: 'bg-rose-100 text-rose-800'
    }
  ];

  const currentFeature = featureTabs.find(t => t.id === activeFeatureTab);

  return (
    <div className="min-h-screen bg-canvas text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-primary flex items-center justify-center text-white shadow-md">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base font-black text-slate-900 tracking-tight block leading-tight">
                SeiHealth
              </span>
              <span className="text-[10px] font-bold text-emerald-primary uppercase tracking-wider block">
                Sovereign Health PWA
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEnterApp(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span>Demo Credentials</span>
            </button>

            <button
              onClick={() => onEnterApp(false)}
              className="px-4 py-2 rounded-xl bg-emerald-primary hover:bg-emerald-dark text-white font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="px-4 sm:px-6 pt-10 pb-12 sm:pt-16 sm:pb-20 max-w-4xl mx-auto text-center">
        {/* Investor Highlights Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-light border border-emerald-300/80 text-emerald-primary text-xs font-black shadow-xs mb-6 animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 fill-emerald-500 text-emerald-500" />
          <span>Local-First Health Architecture • Emerging Market POV</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-5">
          Healthcare Sovereignty for Every Household
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          A mobile-ready, local-first platform designed for emerging economies. Digitize paper prescriptions on-device, track WHO infant vaccinations, map multi-generational sickle cell traits, and generate encrypted emergency passes—<strong className="text-slate-900">with 100% offline autonomy and zero cloud fees</strong>.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto mb-10">
          <button
            onClick={() => onEnterApp(false)}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-primary hover:bg-emerald-dark text-white font-extrabold text-sm shadow-xl hover:shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Experience 360° Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onEnterApp(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm border-2 border-slate-200/90 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Select Demo Persona</span>
          </button>
        </div>

        {/* Mobile Device Mockup / Live Preview Frame */}
        <div className="relative max-w-sm sm:max-w-md mx-auto rounded-[38px] p-3 bg-slate-900 shadow-2xl border-4 border-slate-700/80">
          <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-2" />
          <div className="rounded-[28px] overflow-hidden bg-white text-left p-4 space-y-3 border border-slate-800">
            {/* Mock Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-primary text-white flex items-center justify-center font-bold text-xs">
                  S
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-900">Household 360° Radar</div>
                  <div className="text-[9px] text-slate-500">Caretaker: Amina Bello</div>
                </div>
              </div>
              <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                94% Health Index
              </span>
            </div>

            {/* Mock Vitals Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200">
                <div className="text-[9px] font-bold text-pink-700 uppercase">Zainab (Infant)</div>
                <div className="font-extrabold text-slate-900 text-xs mt-0.5">Penta 3 Vaccine Due</div>
                <div className="text-[9px] text-slate-500">Target: Oct 4 • Free Clinic</div>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200">
                <div className="text-[9px] font-bold text-purple-700 uppercase">Mama Fatima</div>
                <div className="font-extrabold text-slate-900 text-xs mt-0.5">Amlodipine 5mg Refill</div>
                <div className="text-[9px] text-amber-700 font-bold">3 days supply left</div>
              </div>
            </div>

            {/* Mock Quick ICE Action */}
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-emergency" />
                <span className="text-[10px] font-bold text-rose-900">Paramedic ICE Pass Ready (O+ | AS)</span>
              </div>
              <span className="text-[9px] font-bold bg-rose-emergency text-white px-2 py-0.5 rounded">
                QR ACTIVE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KEY METRICS TICKER FOR INVESTORS */}
      <section className="bg-slate-900 text-white py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
            <div className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">
              Offline Autonomous
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Zero cloud downtime risk</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">&lt; 2s</div>
            <div className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">
              Instant PWA Mount
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Cached on 2G/3G networks</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">0 NGN</div>
            <div className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">
              Server Hostage Cost
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">NDPR sovereign encryption</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">360°</div>
            <div className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">
              Household Health Index
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Whole family multi-gen radar</div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE FEATURE DEEP DIVE (INVESTOR POV) */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-primary bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Interactive Technical Pillars
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Engineered for Ground Realities
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-2">
            Click through the core functional modules below to preview how SeiHealth bridges physical community health and digital clinical rigor.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {featureTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeFeatureTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md scale-105'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Preview Card */}
        {currentFeature && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-xl bg-gradient-to-br from-white to-slate-50 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${currentFeature.badgeColor}`}>
                  {currentFeature.tag}
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-3 leading-snug">
                  {currentFeature.heading}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                  {currentFeature.desc}
                </p>

                <div className="mt-5 p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-emerald-primary">{currentFeature.metric}</span>
                    <span className="text-xs text-slate-500 block">{currentFeature.metricLabel}</span>
                  </div>
                  <button
                    onClick={() => onEnterApp(false)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-light hover:bg-emerald-100 text-emerald-primary font-extrabold text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>Try in App</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dynamic Feature Visual Graphic */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white font-mono text-xs shadow-inner space-y-2.5">
                <div className="flex items-center justify-between text-slate-400 text-[10px] pb-2 border-b border-slate-800">
                  <span>SEI_ENGINE_STATUS: ACTIVE</span>
                  <span className="text-emerald-400 font-bold">ONLINE/OFFLINE READY</span>
                </div>

                {activeFeatureTab === 'ocr' && (
                  <div className="space-y-2 text-[11px]">
                    <div className="text-slate-400">// Ingesting image: Rx_Adeyemi_Chemist.jpg</div>
                    <div className="text-emerald-400">✓ Contrast & edge binarization applied</div>
                    <div className="text-emerald-400">✓ Regex matched: "Artemether Lumefantrine 80/480mg"</div>
                    <div className="text-amber-300">✓ Frequency: "1 tab bd x 3 days"</div>
                    <div className="text-emerald-400">✓ Extracted Fee: ₦3,850 Cash Paid</div>
                    <div className="text-white font-bold bg-slate-800 p-2 rounded mt-2">
                      Accuracy Confidence: 96% (Verified)
                    </div>
                  </div>
                )}

                {activeFeatureTab === 'genetics' && (
                  <div className="space-y-2 text-[11px]">
                    <div className="text-slate-400">// Mendelian Punnett Square calculation</div>
                    <div className="text-indigo-400">Partner 1: Genotype AS (Sickle Trait)</div>
                    <div className="text-indigo-400">Partner 2: Genotype AS (Sickle Trait)</div>
                    <div className="text-rose-400 font-bold">⚠️ High Alert: 25% Sickle Cell Anemia (SS) risk</div>
                    <div className="text-amber-300">50% Carrier Trait (AS) | 25% Normal (AA)</div>
                    <div className="text-slate-300 text-[10px]">
                      Guidance: Pre-conception clinical genetic counseling advised.
                    </div>
                  </div>
                )}

                {activeFeatureTab === 'mch' && (
                  <div className="space-y-2 text-[11px]">
                    <div className="text-slate-400">// WHO EPI Expanded Programme</div>
                    <div className="text-emerald-400">✓ BCG & OPV 0 (At Birth) - Completed</div>
                    <div className="text-emerald-400">✓ Penta 1, PCV 1, Rota 1 (6 Weeks) - Completed</div>
                    <div className="text-emerald-400">✓ Penta 2, PCV 2, Rota 2 (10 Weeks) - Completed</div>
                    <div className="text-pink-400 font-bold">⏳ Penta 3, Polio 3, PCV 3 (14 Weeks) - DUE OCT 4</div>
                    <div className="text-slate-300 text-[10px]">
                      MUAC Arm Circumference: 140mm (Green Strip - Healthy)
                    </div>
                  </div>
                )}

                {activeFeatureTab === 'ice' && (
                  <div className="space-y-2 text-[11px]">
                    <div className="text-slate-400">// Encrypted Offline ICE Matrix</div>
                    <div className="text-rose-400 font-bold">BLOOD GROUP: O+ (Rh Positive)</div>
                    <div className="text-amber-300 font-bold">GENOTYPE: AS</div>
                    <div className="text-rose-400 font-bold">CRITICAL ALLERGIES: PENICILLIN (⚠️ ANAPHYLAXIS)</div>
                    <div className="text-slate-300">Caretaker: Amina Bello (+234 803 555 0192)</div>
                    <div className="text-emerald-400 text-[10px]">
                      Direct speed dial: tel:+2348035550192 (No unlock needed)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. INVESTOR ACCEPTANCE / FIELD PERSONAS */}
      <section className="py-12 px-4 sm:px-6 bg-slate-100/70 border-t border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Designed for Key Stakeholders
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select any role below to launch the live app immediately with tailored privileges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Persona 1: Caretaker */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-200 bg-white flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm mb-3 shadow-xs">
                  👩🏽‍🍼
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Amina Bello</h3>
                <span className="text-[10px] font-bold uppercase text-emerald-primary tracking-wider">
                  Household Caretaker & Mother
                </span>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Tracks 4 multi-generational dependents, monitors infant vaccines, and logs out-of-pocket health payments.
                </p>
              </div>
              <button
                onClick={() => onSelectDemoUser(0)}
                className="mt-4 w-full py-2.5 rounded-xl bg-emerald-light hover:bg-emerald-100 text-emerald-primary font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Login as Caretaker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Persona 2: Field Health Worker */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-200 bg-white flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-sm mb-3 shadow-xs">
                  🩺
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Nurse Modupe</h3>
                <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                  Community Extension Worker (CHEW)
                </span>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Administers primary clinic immunizations, verifies batches, and assesses child growth malnutrition strips.
                </p>
              </div>
              <button
                onClick={() => onSelectDemoUser(1)}
                className="mt-4 w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Login as Field Nurse</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Persona 3: Emergency Clinician */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-200 bg-white flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-sm mb-3 shadow-xs">
                  🚨
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Dr. Kelechi Okafor</h3>
                <span className="text-[10px] font-bold uppercase text-rose-600 tracking-wider">
                  Trauma Triage First Responder
                </span>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Scans encrypted offline ICE QR cards during acute emergencies to prevent fatal medication and transfusion errors.
                </p>
              </div>
              <button
                onClick={() => onSelectDemoUser(2)}
                className="mt-4 w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Login as Triage MD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION & FOOTER */}
      <footer className="py-10 px-4 sm:px-6 bg-white border-t border-slate-200 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-primary text-white flex items-center justify-center mx-auto shadow-md">
            <HeartPulse className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-black text-slate-900">
            Start Exploring SeiHealth
          </h3>
          <p className="text-xs text-slate-500">
            Ready to test live paper document capture, WHO vaccine schedules, and offline ICE passes?
          </p>

          <button
            onClick={() => onEnterApp(false)}
            className="w-full py-3.5 rounded-2xl bg-emerald-primary hover:bg-emerald-dark text-white font-black text-xs shadow-lg transition-all active:scale-95"
          >
            Launch Interactive Experience Now
          </button>

          <div className="pt-4 text-[11px] text-slate-400 font-medium flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-primary" />
            <span>Strict NDPR Compliance • Zero Cloud Lock-in • Progressive Web App</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
