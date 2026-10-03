import React, { useState } from 'react';
import { 
  HeartPulse, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Layers, 
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
  Lock, 
  FileCheck, 
  QrCode, 
  Compass, 
  PhoneCall 
} from 'lucide-react';

export default function LandingPage({ onEnterApp, onSelectDemoUser }) {
  const [activeFeatureTab, setActiveFeatureTab] = useState('circle');

  const featureTabs = [
    {
      id: 'circle',
      title: 'Circle & Lineage (DAG)',
      icon: Users,
      tag: 'Multi-Generational Health',
      heading: 'Pedigree Tree Canvas & Hereditary Sickle Cell Analysis',
      desc: 'Orchestrates up to 32 dependents across 4 generational tiers (G0 Grandparents, G1 Parents, G2 Children). Features real-time autosomal recessive Mendelian risk calculation (HbAA, HbAS, HbSS trait tracking).',
      metric: '88% Index',
      metricLabel: 'Family Health Completeness',
      color: 'bg-zinc-950 text-white',
      badgeColor: 'bg-zinc-100 text-zinc-900 border border-zinc-200'
    },
    {
      id: 'timeline',
      title: 'Dual-Tier Timeline',
      icon: Layers,
      tag: 'Cryptographic Provenance',
      heading: 'Official Verified Seals vs. Self-Reported Patient Logs',
      desc: 'Distinguishes between accredited hospital lab results signed with Ed25519 digital keys and patient-logged blood pressure readings. Includes granular delegated transfer with 4-digit Argon2id PINs.',
      metric: 'Zero-Knowledge',
      metricLabel: 'AES-256-GCM Envelope Encryption',
      color: 'bg-zinc-900 text-white',
      badgeColor: 'bg-zinc-100 text-zinc-900 border border-zinc-200'
    },
    {
      id: 'sos',
      title: 'SOS Emergency & Triage',
      icon: AlertOctagon,
      tag: 'Zero-Click Crisis Pass',
      heading: 'Air-Gapped Offline QR Card & Vernacular Care Triage',
      desc: 'Renders 48pt bold blood group, genotype, and allergies readable by any standard offline camera scanner. Powered by a rule-based triage tree supporting Nigerian Pidgin, Yoruba, Hausa, and Igbo symptom mapping.',
      metric: '100% Offline',
      metricLabel: 'Operates Without Cellular Data',
      color: 'bg-zinc-950 text-white',
      badgeColor: 'bg-zinc-100 text-zinc-900 border border-zinc-200'
    }
  ];

  const activeTabConfig = featureTabs.find(t => t.id === activeFeatureTab) || featureTabs[0];

  return (
    <div className="min-h-screen bg-canvas text-charcoal flex flex-col justify-between selection:bg-zinc-900 selection:text-white">
      
      {/* 1. TOP GLOBAL NAVBAR */}
      <header className="sticky top-0 z-50 bg-chalk/90 backdrop-blur-md border-b border-borderRule px-4 sm:px-8 py-3.5 shadow-subtle">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-white shadow-xs">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-charcoal block leading-none">
                FamilyHealth
              </span>
              <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">
                African Family Health Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onEnterApp(true)}
              className="text-xs font-black text-charcoal hover:text-zinc-600 px-3 py-2 rounded-xl transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onEnterApp(false)}
              className="text-xs font-black bg-zinc-950 hover:bg-black text-white px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Enter Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="px-4 sm:px-8 pt-10 sm:pt-16 pb-12 max-w-5xl mx-auto text-center space-y-6">
        
        {/* Architecture Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-black text-zinc-900 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-zinc-950 animate-pulse" />
          <span>Low-Level Design v2.4.0 • Google Cloud Edge PoP (Lagos & JNB)</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-charcoal tracking-tight max-w-4xl mx-auto leading-[1.12]">
          Healthcare Sovereignty for African Families
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-charcoal-muted max-w-2xl mx-auto leading-relaxed">
          The offline-first sovereign companion connecting multi-generational family circles, dual-tier official hospital records, zero-click crisis QR cards, and vernacular care triage.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onEnterApp(false)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zinc-950 hover:bg-black text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Launch Live POV Experience</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onEnterApp(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-zinc-50 text-zinc-950 font-black text-sm border border-zinc-200 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-zinc-500" />
            <span>Enter via Demo Credentials</span>
          </button>
        </div>

        {/* Trust Badges Bar */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-zinc-600">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-zinc-900" />
            <span>Zero-Knowledge AES-256-GCM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-4 h-4 text-zinc-900" />
            <span>Air-Gapped Offline Operation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-zinc-900" />
            <span>Ed25519 Hospital Signatures</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe2 className="w-4 h-4 text-zinc-900" />
            <span>5 African Languages & Pidgin</span>
          </div>
        </div>

      </section>

      {/* 3. INTERACTIVE 3-HUB ARCHITECTURE SHOWCASE */}
      <section className="px-4 sm:px-8 py-10 max-w-5xl mx-auto w-full">
        
        <div className="text-center mb-6">
          <span className="text-xs font-black uppercase tracking-wider text-zinc-500 block">
            Core Structural Topologies (Section 2.2)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal mt-1">
            Three Integrated Functional Hubs
          </h2>
        </div>

        {/* Hub Selector Tabs */}
        <div className="flex items-center justify-center gap-2 p-1.5 bg-zinc-100 rounded-2xl border border-zinc-200 max-w-md mx-auto mb-6">
          {featureTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFeatureTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeFeatureTab === tab.id 
                  ? 'bg-zinc-950 text-white shadow-xs' 
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.title}</span>
            </button>
          ))}
        </div>

        {/* Active Hub Card Display */}
        <div className="surface-card p-6 sm:p-8 rounded-3xl shadow-card border border-borderRule space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${activeTabConfig.badgeColor}`}>
                {activeTabConfig.tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-charcoal mt-1.5">
                {activeTabConfig.heading}
              </h3>
            </div>
            
            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-center min-w-[130px]">
              <span className="text-base font-black text-zinc-950 block">
                {activeTabConfig.metric}
              </span>
              <span className="text-[10px] text-zinc-500 font-bold block">
                {activeTabConfig.metricLabel}
              </span>
            </div>
          </div>

          <p className="text-sm text-charcoal-muted leading-relaxed">
            {activeTabConfig.desc}
          </p>

          {/* Interactive Feature Highlights */}
          <div className="pt-3 border-t border-borderRule grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeFeatureTab === 'circle' && (
              <>
                <div className="p-3.5 rounded-xl bg-chalk border border-borderRule text-xs shadow-xs">
                  <span className="font-black text-charcoal block mb-0.5">Lineage DAG Tree</span>
                  <p className="text-charcoal-muted text-[11px]">Cyclic prevention checks across G0 grandparents, G1 parents, G2 children.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-chalk border border-borderRule text-xs shadow-xs">
                  <span className="font-black text-charcoal block mb-0.5">Sickle Cell Traits</span>
                  <p className="text-charcoal-muted text-[11px]">Identifies carrier compatibility (AS × AS) with Mendelian Punnett overlays.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-chalk border border-borderRule text-xs shadow-xs">
                  <span className="font-black text-charcoal block mb-0.5">88% Completeness</span>
                  <p className="text-charcoal-muted text-[11px]">Automated detection of overdue vaccines and pending BP logs.</p>
                </div>
              </>
            )}

            {activeFeatureTab === 'timeline' && (
              <>
                <div className="p-3.5 rounded-xl bg-chalk border border-borderRule text-xs shadow-xs">
                  <span className="font-black text-zinc-950 block mb-0.5">Official Verified Seal</span>
                  <p className="text-charcoal-muted text-[11px]">Ed25519 digitally signed hospital encounters and accredited lab panels.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-chalk border border-borderRule text-xs shadow-xs">
                  <span className="font-black text-zinc-700 block mb-0.5">Self-Reported Entry</span>
                  <p className="text-charcoal-muted text-[11px]">Clear provenance watermark for patient-logged vitals and Omron readings.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-chalk border border-borderRule text-xs shadow-xs">
                  <span className="font-black text-zinc-950 block mb-0.5">Doctor PIN Transfer</span>
                  <p className="text-charcoal-muted text-[11px]">Argon2id salt-hashed 4-digit PIN with atomic instantaneous revocation.</p>
                </div>
              </>
            )}

            {activeFeatureTab === 'sos' && (
              <>
                <div className="p-3.5 rounded-xl bg-chalk border border-borderRule text-xs shadow-xs">
                  <span className="font-black text-zinc-950 block mb-0.5">48pt Bold Vitals</span>
                  <p className="text-charcoal-muted text-[11px]">High-contrast emergency blood group, Rh factor, and penicillin allergy.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-chalk border border-borderRule text-xs shadow-xs">
                  <span className="font-black text-zinc-950 block mb-0.5">Air-Gapped Offline QR</span>
                  <p className="text-charcoal-muted text-[11px]">Decodable by paramedic cameras without internet or server access.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-chalk border border-borderRule text-xs shadow-xs">
                  <span className="font-black text-zinc-950 block mb-0.5">Know Before You Go</span>
                  <p className="text-charcoal-muted text-[11px]">Colloquial Pidgin symptom triage mapping red-flags to emergency units.</p>
                </div>
              </>
            )}
          </div>
        </div>

      </section>

      {/* 4. FOOTER */}
      <footer className="border-t border-borderRule bg-chalk px-4 sm:px-8 py-8 text-center text-xs text-charcoal-muted space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-black text-[10px]">
            FH
          </div>
          <span className="font-black text-charcoal">FamilyHealth Africa</span>
          <span>•</span>
          <span>Designed for NDPA 2023, HIPAA & ISO-27001 Compliance</span>
        </div>
        <p className="text-[11px] text-charcoal-muted">
          Operational at Google Cloud Edge PoP (Lagos & Johannesburg) with SQLCipher Offline Resilience.
        </p>
      </footer>

    </div>
  );
}
