import React from 'react';
import { Plus, Users, AlertCircle, Baby } from 'lucide-react';

export default function FamilyRibbon({ 
  members, 
  selectedMemberId, 
  onSelectMember, 
  onOpenAddMember 
}) {
  // Determine member health status color:
  // Green: up to date
  // Amber: action needed (e.g. vaccine due or clinic check due)
  // Red: critical condition (multiple chronic, or urgent pending dose)
  const getMemberStatus = (member) => {
    if (member.vaccinesDue && member.vaccinesDue.some(v => !v.completed)) {
      return { level: 'amber', label: 'Vaccine Due' };
    }
    if (member.chronicConditions && member.chronicConditions.length >= 2) {
      return { level: 'red', label: 'Chronic Regimen' };
    }
    if (member.chronicConditions && member.chronicConditions.length === 1) {
      return { level: 'amber', label: 'Monitoring' };
    }
    return { level: 'green', label: 'Up to Date' };
  };

  return (
    <section 
      className="bg-white/70 backdrop-blur-md border-b border-slate-200/80 py-2.5 px-4"
      aria-label="Family Members Selector"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
        {/* Whole House Option */}
        <button
          onClick={() => onSelectMember('ALL')}
          className={`flex flex-col items-center flex-shrink-0 w-16 group transition-all duration-200 ${
            selectedMemberId === 'ALL' ? 'scale-105 opacity-100' : 'opacity-70 hover:opacity-90'
          }`}
          aria-pressed={selectedMemberId === 'ALL'}
        >
          <div 
            className={`w-12 h-12 rounded-full flex items-center justify-center bg-slate-800 text-white shadow-sm transition-all duration-200 ${
              selectedMemberId === 'ALL' 
                ? 'ring-4 ring-emerald-primary/30 ring-offset-2 ring-offset-canvas shadow-md' 
                : 'border border-slate-700'
            }`}
          >
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-800 mt-1.5 truncate max-w-[64px] text-center">
            All Family
          </span>
        </button>

        {/* Member Avatars */}
        {members.map((member) => {
          const isSelected = selectedMemberId === member.id;
          const status = getMemberStatus(member);

          return (
            <button
              key={member.id}
              onClick={() => onSelectMember(member.id)}
              className={`flex flex-col items-center flex-shrink-0 w-16 group transition-all duration-200 ${
                isSelected ? 'scale-105 opacity-100' : 'opacity-70 hover:opacity-90'
              }`}
              aria-pressed={isSelected}
              title={`${member.name} (${member.relation}) - ${status.label}`}
            >
              <div className="relative">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm transition-all duration-200 ${
                    isSelected 
                      ? 'ring-4 ring-emerald-primary/40 ring-offset-2 ring-offset-canvas shadow-md' 
                      : 'border-2 border-white'
                  }`}
                  style={{ backgroundColor: member.avatarBg || '#047857' }}
                >
                  {member.relation.includes('Infant') ? (
                    <Baby className="w-5 h-5" />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>

                {/* Status Dot Beacon */}
                <span 
                  className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                    status.level === 'red' 
                      ? 'bg-rose-emergency animate-pulse' 
                      : status.level === 'amber' 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                  }`} 
                  title={status.label}
                />
              </div>

              <span className="text-[11px] font-medium text-slate-800 mt-1.5 truncate max-w-[64px] text-center">
                {member.name.split(' ')[0]}
              </span>
            </button>
          );
        })}

        {/* (+) Add Member Button */}
        <button
          onClick={onOpenAddMember}
          className="flex flex-col items-center flex-shrink-0 w-16 group opacity-75 hover:opacity-100 transition-all duration-200"
          aria-label="Add New Family Member"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-dashed border-emerald-primary/60 bg-emerald-50/50 text-emerald-primary group-hover:bg-emerald-100/60 transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-emerald-primary mt-1.5 truncate max-w-[64px] text-center">
            + Add
          </span>
        </button>
      </div>
    </section>
  );
}
