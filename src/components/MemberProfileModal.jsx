import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  User, 
  Check, 
  Heart, 
  ShieldAlert, 
  AlertTriangle,
  Sparkles,
  Phone,
  Calendar
} from 'lucide-react';

// Preset diverse African illustrated avatar portraits
export const PRESET_AVATARS = [
  { id: 'av_baba', label: 'Elder Patriarch (G0)', bg: '#C85A32', initials: 'BA', icon: '👴🏿' },
  { id: 'av_iya', label: 'Elder Matriarch (G0)', bg: '#1E4D38', initials: 'IA', icon: '👵🏿' },
  { id: 'av_femi', label: 'Father / Adult Male (G1)', bg: '#1B2A4A', initials: 'FA', icon: '👨🏿' },
  { id: 'av_sade', label: 'Mother / Adult Female (G1)', bg: '#D9822B', initials: 'SA', icon: '👩🏿' },
  { id: 'av_tunde', label: 'Young Boy / Infant (G2)', bg: '#C85A32', initials: 'TA', icon: '👦🏿' },
  { id: 'av_kehinde', label: 'Young Girl / Toddler (G2)', bg: '#1E4D38', initials: 'KA', icon: '👧🏿' },
  { id: 'av_doc', label: 'Clinical Specialist', bg: '#2563EB', initials: 'DR', icon: '👨🏿‍⚕️' },
  { id: 'av_nurse', label: 'Field Nurse / CHEW', bg: '#059669', initials: 'NU', icon: '👩🏿‍⚕️' },
];

export default function MemberProfileModal({
  member,
  isNew = false,
  onSave,
  onClose,
  translations
}) {
  const t = translations || {};
  const fileInputRef = useRef(null);

  // Form State
  const [firstName, setFirstName] = useState(member?.firstName || member?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(member?.lastName || member?.name?.split(' ')[1] || 'Adeyemi');
  const [relation, setRelation] = useState(member?.relation || 'Son (Child)');
  const [generation, setGeneration] = useState(member?.generation || 'G2');
  const [gender, setGender] = useState(member?.gender || 'Male');
  const [dob, setDob] = useState(member?.dob || '2026-03-10');
  const [bloodGroup, setBloodGroup] = useState(member?.bloodGroup || 'O+');
  const [genotype, setGenotype] = useState(member?.genotype || 'AS');
  const [allergiesText, setAllergiesText] = useState((member?.allergies || []).join(', '));
  const [chronicText, setChronicText] = useState((member?.chronicConditions || []).join(', '));
  const [resuscitationOrder, setResuscitationOrder] = useState(member?.resuscitationOrder || 'Full Code (CPR / Intubation)');
  const [avatarUrl, setAvatarUrl] = useState(member?.avatarUrl || '');
  const [avatarBg, setAvatarBg] = useState(member?.avatarBg || '#C85A32');
  const [avatarIcon, setAvatarIcon] = useState(member?.avatarIcon || (gender === 'Female' ? '👩🏿' : '👨🏿'));
  const [primaryPhone, setPrimaryPhone] = useState(member?.primaryPhone || '');

  // Handle local image file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setAvatarUrl(uploadEvent.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedMember = {
      ...member,
      id: member?.id || 'mem_' + Math.random().toString(36).substr(2, 9),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      relation,
      generation,
      gender,
      dob,
      bloodGroup,
      genotype,
      allergies: allergiesText.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: chronicText.split(',').map(s => s.trim()).filter(Boolean),
      resuscitationOrder,
      avatarUrl,
      avatarBg,
      avatarIcon,
      primaryPhone: primaryPhone.trim(),
      statusNote: member?.statusNote || (genotype === 'AS' ? 'Carrier Watch' : 'Active'),
    };
    onSave(updatedMember);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="surface-card w-full max-w-xl p-5 sm:p-6 space-y-4 shadow-lifted relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-borderRule pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-charcoal">
                {isNew ? (t.addDependent || 'Add Dependent / Family Member') : (t.editMemberTitle || 'Family Member Profile & Portrait')}
              </h3>
              <p className="text-xs text-charcoal-muted">
                Multi-generational lineage profile with customizable portrait photo
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1 rounded-xl hover:bg-sand text-charcoal-muted"
            aria-label="Close Profile Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. PROFILE PICTURE / AVATAR SELECTION & UPLOAD */}
          <div className="p-4 rounded-2xl bg-chalk border border-borderRule space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-charcoal block">
              {t.profilePhoto || 'Profile Picture / Avatar'}
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Avatar Preview */}
              <div 
                className="w-20 h-20 rounded-3xl overflow-hidden flex items-center justify-center text-3xl font-black text-white shadow-md border-3 border-white relative flex-shrink-0"
                style={{ backgroundColor: avatarBg }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <span>{avatarIcon}</span>
                )}
              </div>

              {/* Upload & Controls */}
              <div className="space-y-2 flex-1 text-center sm:text-left">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="neu-btn-primary h-9 px-3.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 shadow-neu-sm transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t.uploadPhoto || 'Upload Photo'}</span>
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="neu-btn h-9 px-3 rounded-xl text-slate-500 text-xs font-bold shadow-neu-sm"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 font-medium">
                  Supports camera photos, PNG, JPG, or pick from African illustrated portraits below:
                </p>
              </div>
            </div>

            {/* Preset Avatars Bar */}
            <div className="pt-2 border-t border-white/80">
              <span className="text-[10px] font-black uppercase text-slate-500 block mb-1.5">
                {t.choosePreset || 'Choose Illustrated Avatar'}:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      setAvatarIcon(av.icon);
                      setAvatarBg(av.bg);
                      setAvatarUrl('');
                    }}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 transition-transform ${
                      avatarIcon === av.icon && !avatarUrl 
                        ? 'ring-2 ring-slate-900 scale-110 shadow-neu-raised' 
                        : 'neu-btn hover:opacity-100 shadow-neu-sm'
                    }`}
                    style={{ backgroundColor: av.bg }}
                    title={av.label}
                  >
                    {av.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. CORE BIOGRAPHICAL ATTRIBUTES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-charcoal block mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Tunde"
                className="w-full px-3 py-2.5 rounded-xl border border-borderRule bg-chalk text-xs font-bold focus:border-terracotta outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-charcoal block mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Adeyemi"
                className="w-full px-3 py-2.5 rounded-xl border border-borderRule bg-chalk text-xs font-bold focus:border-terracotta outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-charcoal block mb-1">
                Relationship
              </label>
              <input
                type="text"
                required
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="e.g. Son (Child)"
                className="w-full px-3 py-2.5 rounded-xl border border-borderRule bg-chalk text-xs font-medium focus:border-terracotta outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-charcoal block mb-1">
                Generation Tier
              </label>
              <select
                value={generation}
                onChange={(e) => setGeneration(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-borderRule bg-chalk text-xs font-bold focus:border-terracotta outline-none cursor-pointer"
              >
                <option value="G0">G0 - Grandparent</option>
                <option value="G1">G1 - Parent / Self / Spouse</option>
                <option value="G2">G2 - Child / Ward</option>
                <option value="G3">G3 - Collateral / Dependent</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-charcoal block mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-borderRule bg-chalk text-xs font-bold focus:border-terracotta outline-none cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-charcoal block mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-borderRule bg-chalk text-xs font-mono font-bold focus:border-terracotta outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-charcoal block mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-borderRule bg-chalk text-xs font-black text-terracotta focus:border-terracotta outline-none cursor-pointer"
              >
                <option value="O+">O+ (Universal Donor)</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-charcoal block mb-1">
                Genotype
              </label>
              <select
                value={genotype}
                onChange={(e) => setGenotype(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-borderRule bg-chalk text-xs font-black text-forest focus:border-terracotta outline-none cursor-pointer"
              >
                <option value="AA">AA (Normal Hemoglobin)</option>
                <option value="AS">AS (Sickle Cell Trait Carrier)</option>
                <option value="SS">SS (Sickle Cell Disease)</option>
                <option value="AC">AC (C-Trait Carrier)</option>
                <option value="SC">SC (SC Hemoglobinopathy)</option>
              </select>
            </div>
          </div>

          {/* 3. CLINICAL ALLERGIES & CHRONIC ATTRIBUTES */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-charcoal block mb-1">
                Severe Drug / Food Allergies (Comma-separated)
              </label>
              <input
                type="text"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                placeholder="e.g. Penicillin, Cephalosporins"
                className="w-full px-3 py-2 rounded-xl border border-borderRule bg-chalk text-xs font-medium text-emergency focus:border-terracotta outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-charcoal block mb-1">
                Documented Chronic Conditions (Comma-separated)
              </label>
              <input
                type="text"
                value={chronicText}
                onChange={(e) => setChronicText(e.target.value)}
                placeholder="e.g. Essential Hypertension (Grade 1), Asthma"
                className="w-full px-3 py-2 rounded-xl border border-borderRule bg-chalk text-xs font-medium focus:border-terracotta outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-charcoal block mb-1">
                  Resuscitation Directive
                </label>
                <select
                  value={resuscitationOrder}
                  onChange={(e) => setResuscitationOrder(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-borderRule bg-chalk text-xs font-bold focus:border-terracotta outline-none"
                >
                  <option value="Full Code (CPR / Intubation)">Full Code (CPR / Intubation)</option>
                  <option value="Full Code (Pediatric Protocol)">Full Code (Pediatric Protocol)</option>
                  <option value="DNR (Do Not Resuscitate)">DNR (Do Not Resuscitate)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-charcoal block mb-1">
                  Direct Phone / Emergency Contact
                </label>
                <input
                  type="text"
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  placeholder="+234 803 111 2233"
                  className="w-full px-3 py-2 rounded-xl border border-borderRule bg-chalk text-xs font-mono font-medium focus:border-terracotta outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons (Proportioned h-10 buttons) */}
          <div className="pt-3 border-t border-white/80 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="neu-btn btn-standard text-slate-700 font-bold text-xs"
            >
              {t.cancelBtn || 'Cancel'}
            </button>
            <button
              type="submit"
              className="neu-btn-primary btn-standard font-bold text-xs shadow-neu-primary active:scale-95 transition-all"
            >
              {isNew ? (t.addDependent || 'Add to Health Circle') : (t.saveProfile || 'Save Profile Changes')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
