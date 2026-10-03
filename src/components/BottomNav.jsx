import React from 'react';
import { 
  Users, 
  Layers, 
  ShieldAlert, 
  Clock, 
  Activity
} from 'lucide-react';

export default function BottomNav({ activeTab, onSelectTab, translations }) {
  const t = translations || {};

  const hubs = [
    { 
      id: 'CIRCLE', 
      label: t.circleTab || 'Circle', 
      sublabel: 'Lineage & Graph',
      icon: Users 
    },
    { 
      id: 'TIMELINE', 
      label: t.timelineTab || 'Timeline', 
      sublabel: 'Dual-Tier Ledger',
      icon: Layers 
    },
    { 
      id: 'SOS', 
      label: t.sosTab || 'SOS', 
      sublabel: 'Crisis & Triage',
      icon: ShieldAlert,
      isEmergency: true
    },
  ];

  return (
    <nav 
      className="fixed bottom-0 inset-x-0 max-w-[768px] mx-auto z-40 bg-[#E8EDF5]/95 backdrop-blur-md border-t border-white/80 shadow-[0_-4px_18px_rgba(202,211,222,0.55)] pb-[env(safe-area-inset-bottom,0px)]"
      role="navigation"
      aria-label="Bottom Navigation Hubs"
    >
      <div className="flex items-center justify-around h-[70px] px-3">
        {hubs.map((hub) => {
          const isActive = activeTab === hub.id;
          const IconComponent = hub.icon;

          if (hub.isEmergency) {
            return (
              <button
                key={hub.id}
                onClick={() => onSelectTab(hub.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1.5 touch-target transition-all rounded-2xl ${
                  isActive 
                    ? 'text-rose-600 font-black' 
                    : 'text-slate-400 hover:text-rose-600'
                }`}
                aria-label={hub.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={`p-2 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-gradient-to-br from-rose-600 to-rose-700 text-white shadow-neu-raised scale-105 border border-white/30' 
                    : 'bg-white/40 text-rose-600 shadow-neu-sm'
                }`}>
                  <IconComponent className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                </div>
                <span className="text-[10px] font-black mt-1 tracking-wider uppercase">
                  {hub.label}
                </span>
                <span className="text-[9px] text-slate-400 hidden sm:inline">
                  {hub.sublabel}
                </span>
              </button>
            );
          }

          return (
            <button
              key={hub.id}
              onClick={() => onSelectTab(hub.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 touch-target transition-all rounded-2xl ${
                isActive 
                  ? 'text-slate-900 font-black' 
                  : 'text-slate-400 hover:text-slate-800'
              }`}
              aria-label={hub.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={`p-2 rounded-2xl transition-all ${
                isActive 
                  ? 'bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-neu-raised scale-105 border border-white/20' 
                  : 'bg-white/40 text-slate-500 shadow-neu-sm'
              }`}>
                <IconComponent className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] font-bold mt-1 tracking-tight">
                {hub.label}
              </span>
              <span className="text-[9px] text-slate-400 hidden sm:inline">
                {hub.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
