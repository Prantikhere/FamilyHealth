import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Baby, 
  Heart, 
  Users, 
  Check, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function OnboardingModal({ household, onComplete }) {
  const [selectedRole, setSelectedRole] = useState(household.headRole || 'Family Caretaker');
  const [headName, setHeadName] = useState(household.head || 'Amina Bello');
  const [currency, setCurrency] = useState(household.currency || '₦');

  const roles = [
    {
      id: 'Family Caretaker',
      title: 'Family Caretaker',
      subtitle: 'Manage health records, medications, and cash expenses for whole multi-generational house.',
      icon: Users,
      badge: 'Multi-Generational',
      color: 'bg-emerald-500',
    },
    {
      id: 'New Mother',
      title: 'New Mother / Infant Care',
      subtitle: 'Track WHO EPI child immunizations, monthly weight curves, and malnutrition MUAC checks.',
      icon: Baby,
      badge: 'EPI Protocols',
      color: 'bg-pink-500',
    },
    {
      id: 'Pregnant Woman',
      title: 'Pregnant Woman / Antenatal',
      subtitle: 'Track antenatal clinic visits, fetal milestones, iron/folic acid, and maternal vitals.',
      icon: Heart,
      badge: 'Antenatal Care',
      color: 'bg-purple-500',
    }
  ];

  const handleFinish = (e) => {
    e.preventDefault();
    onComplete({
      head: headName.trim() || 'Amina Bello',
      headRole: selectedRole,
      currency: currency,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Banner */}
        <div className="p-6 bg-gradient-to-br from-emerald-primary to-emerald-dark text-white text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner">
            <HeartHandshake className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight">Welcome to AfriHealth</h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-xs mx-auto">
            Data-sovereign household health companion with offline paper capture and emergency passes.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFinish} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Primary Caretaker / Head of Household Name
            </label>
            <input
              type="text"
              required
              value={headName}
              onChange={(e) => setHeadName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-primary/40"
              placeholder="e.g. Amina Bello"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-2">
              Select Primary Caretaker Anchor Setup
            </label>
            <div className="space-y-2">
              {roles.map((r) => {
                const isSelected = selectedRole === r.id;
                const IconComponent = r.icon;

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-emerald-primary bg-emerald-50/80 shadow-sm ring-2 ring-emerald-primary/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${r.color} text-white flex-shrink-0 mt-0.5 shadow-xs`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-extrabold text-slate-900 text-xs">{r.title}</h4>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{r.badge}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{r.subtitle}</p>
                    </div>

                    <div className="flex-shrink-0 mt-1">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-primary text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regional Currency */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">Local Health Payment Currency</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { symbol: '₦', name: 'Naira (NGN)' },
                { symbol: 'GH₵', name: 'Cedi (GHS)' },
                { symbol: 'KSh', name: 'Shilling (KES)' },
                { symbol: '$', name: 'USD ($)' },
              ].map((c) => (
                <button
                  key={c.symbol}
                  type="button"
                  onClick={() => setCurrency(c.symbol)}
                  className={`py-2 rounded-xl border text-xs font-black transition-all ${
                    currency === c.symbol
                      ? 'bg-emerald-primary text-white border-emerald-primary shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="text-sm block">{c.symbol}</span>
                  <span className="text-[9px] font-normal block">{c.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-primary hover:bg-emerald-dark text-white font-extrabold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Initialize Local Health Vault</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-semibold text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-primary" />
            <span>Strict NDPR Compliance • All health data stays on this device</span>
          </div>
        </form>
      </div>
    </div>
  );
}
