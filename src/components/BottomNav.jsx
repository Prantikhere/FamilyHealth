import React from 'react';
import { 
  Home, 
  Camera, 
  GitFork, 
  Baby, 
  CreditCard 
} from 'lucide-react';

export default function BottomNav({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'DASHBOARD', label: 'Overview', icon: Home },
    { id: 'CAPTURE', label: 'Snap Record', icon: Camera, isAction: true },
    { id: 'MCH', label: 'Maternal/EPI', icon: Baby },
    { id: 'TREE', label: 'Family Tree', icon: GitFork },
    { id: 'EXPENSES', label: 'Expenses', icon: CreditCard },
  ];

  return (
    <nav 
      className="fixed bottom-0 inset-x-0 max-w-[768px] mx-auto z-40 bg-white/90 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom,0px)]"
      role="navigation"
      aria-label="Bottom Navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className="flex flex-col items-center justify-center -mt-5 group touch-target"
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="w-13 h-13 p-3 rounded-full bg-emerald-primary text-white shadow-lg border-4 border-white group-hover:scale-105 active:scale-95 transition-transform flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-emerald-primary' : 'text-slate-600'}`}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 touch-target transition-colors ${
                isActive ? 'text-emerald-primary font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-emerald-50 text-emerald-primary' : ''}`}>
                <IconComponent className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[68px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
