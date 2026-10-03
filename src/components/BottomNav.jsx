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
      className="fixed bottom-0 inset-x-0 max-w-[768px] mx-auto z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 shadow-xs pb-[env(safe-area-inset-bottom,0px)]"
      role="navigation"
      aria-label="Bottom Navigation Hubs"
    >
      <div className="flex items-center justify-around h-[68px] px-3">
        {hubs.map((hub) => {
          const isActive = activeTab === hub.id;
          const IconComponent = hub.icon;

          if (hub.isEmergency) {
            return (
              <button
                key={hub.id}
                onClick={() => onSelectTab(hub.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1 touch-target transition-all rounded-xl ${
                  isActive 
                    ? 'text-zinc-950 font-black' 
                    : 'text-zinc-400 hover:text-zinc-950'
                }`}
                aria-label={hub.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={`p-1.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-zinc-950 text-white scale-105 shadow-xs' 
                    : 'bg-zinc-100 text-zinc-800'
                }`}>
                  <IconComponent className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                </div>
                <span className="text-[10px] font-black mt-0.5 tracking-wider uppercase">
                  {hub.label}
                </span>
                <span className="text-[9px] text-zinc-400 hidden sm:inline">
                  {hub.sublabel}
                </span>
              </button>
            );
          }

          return (
            <button
              key={hub.id}
              onClick={() => onSelectTab(hub.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 touch-target transition-all rounded-xl ${
                isActive 
                  ? 'text-zinc-950 font-black' 
                  : 'text-zinc-400 hover:text-zinc-950'
              }`}
              aria-label={hub.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                isActive 
                  ? 'bg-zinc-950 text-white scale-105 shadow-xs' 
                  : 'text-zinc-500'
              }`}>
                <IconComponent className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] font-bold mt-0.5 tracking-tight">
                {hub.label}
              </span>
              <span className="text-[9px] text-zinc-400 hidden sm:inline">
                {hub.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
