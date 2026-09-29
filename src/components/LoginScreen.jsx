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
  EyeOff
} from 'lucide-react';

export const DUMMY_ACCOUNTS = [
  {
    role: 'Caretaker & Mother',
    name: 'Amina Bello',
    email: 'amina@seihealth.org',
    password: 'Pass@1234',
    badge: 'Household Admin',
    clinic: 'Iru Comprehensive Primary Health Post',
    avatarBg: '#047857',
    icon: UserCheck,
    description: 'Primary caretaker managing 4 multi-generational members and infant immunization.'
  },
  {
    role: 'Community Health Worker (CHEW)',
    name: 'Nurse Modupe Alabi',
    email: 'nurse.modupe@phc.lagos.gov.ng',
    password: 'Clinic#2026',
    badge: 'Intermediary Provider',
    clinic: 'Lagos State Primary Health Care Board',
    avatarBg: '#2563EB',
    icon: Stethoscope,
    description: 'Field nurse administering WHO EPI vaccines and conducting malnutrition checks.'
  },
  {
    role: 'Emergency Triage First Responder',
    name: 'Dr. Kelechi Okafor',
    email: 'dr.okafor@emergency.ice',
    password: 'Triage#99',
    badge: 'Emergency ICE Access',
    clinic: 'St. Nicholas Hospital & Trauma Outpost',
    avatarBg: '#BE123C',
    icon: AlertOctagon,
    description: 'First responder / ER clinician requiring instant offline patient blood & allergy pass.'
  }
];

export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('amina@seihealth.org');
  const [password, setPassword] = useState('Pass@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick fill dummy account
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
      // Validate credentials against dummy accounts or allow any password >= 4 chars for test
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
        // Fallback custom login
        onLoginSuccess({
          name: email.split('@')[0].replace(/[._]/g, ' '),
          email: email.trim(),
          role: 'Household Caretaker',
          badge: 'Verified User',
          clinic: 'Community Health Post',
          avatarBg: '#047857',
          isOfflineDemo: false,
        });
      } else {
        setErrorMsg('Please enter valid credentials or tap one of the dummy accounts below.');
      }
    }, 600);
  };

  // 1-Click Offline Bypass
  const handleOfflineBypass = () => {
    onLoginSuccess({
      name: 'Amina Bello (Offline Mode)',
      email: 'offline.vault@local',
      role: 'Family Caretaker',
      badge: 'Local-First Vault',
      clinic: 'Iru Comprehensive Primary Health Post',
      avatarBg: '#047857',
      isOfflineDemo: true,
    });
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center px-4 py-8 max-w-md mx-auto relative">
      {/* Decorative Brand Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-primary text-white flex items-center justify-center mx-auto shadow-lg mb-3">
          <HeartPulse className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          SeiHealth Sovereign
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          360° Household Health Companion & Emergency ICE Vault
        </p>
      </div>

      {/* Main Login Glass Card */}
      <div className="glass-modal rounded-3xl p-6 border border-slate-200 shadow-xl bg-white/95">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Sign In to Health Vault</h2>
            <p className="text-[11px] text-slate-500">Access your family's 360° health dashboard</p>
          </div>
          <span className="text-[10px] font-bold uppercase bg-emerald-light text-emerald-primary px-2 py-0.5 rounded-full border border-emerald-200">
            NDPR Safe
          </span>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-emergency text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Email / Health ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. amina@seihealth.org"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-primary/40 focus:border-emerald-primary bg-white text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Access Password / PIN
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-primary/40 focus:border-emerald-primary bg-white text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <label className="flex items-center gap-1.5 text-slate-600 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-primary focus:ring-emerald-primary"
              />
              <span>Remember on this device</span>
            </label>
            <span className="text-emerald-primary font-bold hover:underline cursor-pointer">
              Forgot PIN?
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-emerald-primary hover:bg-emerald-dark text-white font-extrabold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <span>Enter 360° Health Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Offline Bypass */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleOfflineBypass}
            className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <WifiOff className="w-4 h-4 text-slate-500" />
            <span>Direct 100% Offline Access (No Auth Needed)</span>
          </button>
        </div>
      </div>

      {/* DUMMY TEST CREDENTIALS BOX */}
      <div className="mt-5 glass-panel rounded-2xl p-4 border border-slate-200/90 text-xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Demo Accounts (1-Click Fill)
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">Tap to auto-fill</span>
        </div>

        <div className="space-y-2">
          {DUMMY_ACCOUNTS.map((acc, idx) => {
            const Icon = acc.icon;
            const isCurrentlySelected = email === acc.email;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(acc)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                  isCurrentlySelected
                    ? 'border-emerald-primary bg-emerald-50/80 shadow-xs ring-1 ring-emerald-primary/40'
                    : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div 
                  className="w-7 h-7 rounded-lg text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs"
                  style={{ backgroundColor: acc.avatarBg }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 text-xs truncate">{acc.name}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {acc.badge.split(' ')[0]}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                    {acc.email} • Pass: <span className="font-bold text-slate-700">{acc.password}</span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1 line-clamp-1">
                    {acc.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Trust Notice */}
      <div className="mt-4 text-center text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-primary" />
        <span>Local-first architecture • Compliant with NDPR & Zero Cloud Lock-in</span>
      </div>
    </div>
  );
}
