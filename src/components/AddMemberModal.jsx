import React, { useState } from 'react';
import { X, UserPlus, Heart, AlertTriangle } from 'lucide-react';
import { GENOTYPES, BLOOD_GROUPS } from '../services/genetics';

export default function AddMemberModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Child');
  const [gender, setGender] = useState('Female');
  const [dob, setDob] = useState('2020-01-01');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [genotype, setGenotype] = useState('AA');
  const [allergiesText, setAllergiesText] = useState('');
  const [chronicText, setChronicText] = useState('');
  const [isPregnant, setIsPregnant] = useState(false);
  const [avatarBg, setAvatarBg] = useState('#047857');

  const avatarColors = [
    '#047857', // Emerald
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#D97706', // Amber
    '#0D9488', // Teal
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const allergies = allergiesText.split(',').map(s => s.trim()).filter(Boolean);
    const chronicConditions = chronicText.split(',').map(s => s.trim()).filter(Boolean);

    const newMember = {
      id: `mem_${Date.now()}`,
      name: name.trim(),
      relation,
      gender,
      dob,
      bloodGroup,
      genotype,
      allergies: allergies.length > 0 ? allergies : ['None'],
      chronicConditions,
      avatarBg,
      isPregnant,
      vaccinesDue: relation.includes('Child') || relation.includes('Infant') ? [
        { id: `vac_${Date.now()}_1`, name: 'Routine EPI Booster', dueDate: '2026-11-15', completed: false }
      ] : []
    };

    onSave(newMember);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            <h2 className="text-base font-bold">Add Family Member</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs text-charcoal">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Full Legal / Given Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Babatunde Bello"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-borderRule focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Relationship</label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-primary/40 text-xs"
              >
                <option value="Self (Mother)">Self (Mother)</option>
                <option value="Spouse">Spouse</option>
                <option value="Daughter">Daughter</option>
                <option value="Son">Son</option>
                <option value="Daughter (Infant)">Daughter (Infant)</option>
                <option value="Son (Infant)">Son (Infant)</option>
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Mother-in-law">Mother-in-law</option>
                <option value="Father-in-law">Father-in-law</option>
                <option value="Sibling">Sibling</option>
                <option value="Dependent">Dependent</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-primary/40 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold text-xs"
              >
                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Genotype (Sickle Trait)</label>
              <select
                value={genotype}
                onChange={(e) => setGenotype(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold text-xs"
              >
                {GENOTYPES.map(gt => (
                  <option key={gt} value={gt}>{gt} {gt === 'AS' ? '(Trait Carrier)' : gt === 'SS' ? '(Sickle Cell)' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Known Drug / Food Allergies <span className="text-slate-400 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Penicillin, Sulfa, Ibuprofen"
              value={allergiesText}
              onChange={(e) => setAllergiesText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Chronic Conditions / Regimens <span className="text-slate-400 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Hypertension, Type 2 Diabetes, Asthma"
              value={chronicText}
              onChange={(e) => setChronicText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
            />
          </div>

          {/* Maternal Pregnancy Toggle if female */}
          <div className="flex items-center gap-2 p-2.5 bg-zinc-100 rounded-lg border border-zinc-200">
            <input
              type="checkbox"
              id="isPregnant"
              checked={isPregnant}
              onChange={(e) => setIsPregnant(e.target.checked)}
              className="w-4 h-4 rounded text-zinc-950 focus:ring-zinc-950"
            />
            <label htmlFor="isPregnant" className="font-semibold text-charcoal cursor-pointer">
              Currently Pregnant (Track Antenatal Care & Immunization)
            </label>
          </div>

          {/* Avatar Color */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">Avatar Color Tag</label>
            <div className="flex items-center gap-2">
              {avatarColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAvatarBg(color)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    avatarBg === color ? 'scale-125 border-zinc-950 shadow-sm' : 'border-white'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-borderRule flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-borderRule text-charcoal font-semibold hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-zinc-950 text-white font-bold hover:bg-black transition-colors shadow-sm"
            >
              Save Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
