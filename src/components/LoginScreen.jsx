import React, { useState } from 'react';
import { 
  HeartPulse, 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  Stethoscope, 
  AlertOctagon, 
  Zap,
  WifiOff,
  Eye,
  EyeOff,
  ChevronLeft,
  Sparkles,
  Users
} from 'lucide-react';

export const DUMMY_ACCOUNTS = [
  {
    role: 'Primary Caretaker (G1)',
    name: 'Femi Adeyemi',
    email: 'femi.adeyemi@familyhealth.africa',
    password: 'Pass@1234',
    badge: 'Household Admin',
    clinic: 'General Hospital Ikeja & Iru PHC',
    avatarBg: '#C85A32',
    icon: UserCheck,
    description: 'Primary household caretaker managing 6 multi-generational members (G0 to G2), chronic regimens, and child vaccines.'
  },
  {
    role: 'Community Health Worker (CHEW)',
    name: 'Nurse Modupe Alabi',
    email: 'nurse.modupe@phc.lagos.gov.ng',
    password: 'Clinic#2026',
    badge: 'Intermediary Provider',
    clinic: 'Lagos State Primary Health Care Board',
    avatarBg: '#1E4D38',
    icon: Stethoscope,
    description: 'Field nurse administering WHO EPI vaccines, MUAC tape malnutrition checks, and rural maternal clinic care.'
  },
  {
    role: 'Emergency Clinician / Cardiologist',
    name: 'Dr. Babajide Okafor',
    email: 'dr.babajide@firstcardiology.ng',
    password: 'Triage#99',
    badge: 'Emergency ICE Access',
    clinic: 'First Cardiology Consultants & Trauma Unit',
    avatarBg: '#1B2A4A',
    icon: AlertOctagon,
    description: 'Cardiovascular & ER specialist requiring zero-click offline patient blood group, genotype, and allergy profile.'
  },
  {
    role: 'Elder Dependent (G0)',
    name: 'Baba Adeyemi',
    email: 'baba.adeyemi@familyhealth.africa',
    password: 'Elder#2026',
    badge: 'Senior Patient View',
    clinic: 'Lagos Island General Hospital (Geriatrics)',
    avatarBg: '#D9822B',
    icon: HeartPulse,
    description: 'Elder patriarch monitoring chronic hypertension, daily Amlodipine regimen, and personal emergency ICE card.'
  }
];

export default function LoginScreen({ onLoginSuccess, onBackToLanding }) {
  const [email, setEmail] = useState('femi.adeyemi@familyhealth.africa');
  const [password, setPassword] = useState('Pass@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick fill preset account
  const handleSelectPreset = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      const matched = DUMMY_ACCOUNTS.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
      if (matched) {
        onLoginSuccess({
          name: matched.name,
          email: matched.email,
          role: matched.role,
          badge: matched.badge,
          clinic: matched.clinic,
          avatarBg: matched.avatarBg,
          isOfflineDemo: false,
        });
      } else if (email.trim() && password.length >= 4) {
        onLoginSuccess({
          name: email.split('@')[0].replace(/[._]/g, ' '),
          email: email.trim(),
          role: 'Household Caretaker',
          badge: 'Verified User',
          clinic: 'Community Health Post',
          avatarBg: '#C85A32',
          isOfflineDemo: false,
        });
      } else {
        setErrorMsg('Please enter valid credentials or tap one of the demo accounts below.');
      }
    }, 400);
  };

  // 1-Click Evaluator Bypass
  const handleEvaluatorBypass = () => {
    onLoginSuccess({
      name: 'Femi Adeyemi (Evaluator POV)',
      email: 'evaluator.pov@familyhealth.africa',
      role: 'Primary Caretaker (G1)',
      badge: 'Full Access Evaluator',
      clinic: 'General Hospital Ikeja & Iru PHC',
      avatarBg: '#C85A32',
      isOfflineDemo: true,
    });
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center px-4 py-8 max-w-md mx-auto relative animate-in fade-in duration-200">
      
      {/* Back to Product Overview Button */}
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="self-start mb-4 neu-btn btn-compact text-xs font-bold text-slate-600 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Product Overview</span>
        </button>
      )}

      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 text-white flex items-center justify-center mx-auto shadow-neu-raised mb-3 border border-white/20">
          <HeartPulse className="w-9 h-9 text-rose-400" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          FamilyHealth
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          African Family Health Platform • Sovereign Identity & Records
        </p>
      </div>

      {/* 1-Tap Quick Evaluator Access Banner (Neumorphic Inset) */}
      <div className="mb-4 p-3.5 rounded-2xl neu-inset flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center shadow-neu-sm flex-shrink-0">
            <Sparkles className="w-4 h-4 text-slate-800" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-900 block">
              1-Tap Evaluator Access
            </span>
            <span className="text-[11px] text-slate-500 block">
              Instant access into the 3-Hub Health Circle
            </span>
          </div>
        </div>

        <button
          onClick={handleEvaluatorBypass}
          className="neu-btn-primary h-9 px-3.5 rounded-xl font-bold text-xs shadow-neu-primary active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
        >
          <span>Launch POV</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Form Container (Neumorphic Surface Card) */}
      <div className="surface-card p-6 shadow-lifted">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
              Registered Phone / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="femi.adeyemi@familyhealth.africa"
                className="neu-input w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
              Argon2id Master PIN / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="neu-input w-full pl-9 pr-10 py-2.5 rounded-xl text-xs font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl neu-inset text-rose-600 text-xs font-bold border border-rose-200">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-500 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              <span>Remember credential</span>
            </label>
            <span className="text-slate-900 font-bold hover:underline cursor-pointer">
              Forgot PIN?
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="neu-btn-primary btn-standard w-full text-xs font-bold rounded-xl shadow-neu-primary active:scale-[0.98] disabled:opacity-60 cursor-pointer"
          >
            <span>{isLoading ? 'Decrypting Session...' : 'Sign In to Health Circle'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Personas Quick Select */}
        <div className="mt-6 pt-5 border-t border-white/80 space-y-2.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block text-center">
            Tap a Demo Role to Pre-fill Credentials:
          </span>

          <div className="space-y-2.5">
            {DUMMY_ACCOUNTS.map((acc, index) => {
              const IconComp = acc.icon;
              const isSelected = email.toLowerCase() === acc.email.toLowerCase();

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectPreset(acc)}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected 
                      ? 'neu-inset border border-slate-400/80 shadow-neu-pressed' 
                      : 'neu-btn hover:shadow-neu-raised'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-neu-sm"
                    style={{ backgroundColor: acc.avatarBg }}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-extrabold text-xs text-slate-900 truncate">
                        {acc.name}
                      </span>
                      <span className="neu-pill text-[9px] font-bold shadow-xs">
                        {acc.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {acc.role}
                    </span>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                      {acc.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Security Footnote */}
      <div className="mt-5 text-center text-[11px] text-charcoal-muted flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-zinc-900" />
        <span>Client-side AES-256-GCM Envelope Encryption (Zero-Knowledge)</span>
      </div>

    </div>
  );
}
