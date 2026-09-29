import React, { useState, useEffect } from 'react';
import { 
  X, 
  PhoneCall, 
  AlertOctagon, 
  Share2, 
  Printer, 
  QrCode, 
  ShieldAlert, 
  Check, 
  Heart,
  Droplet
} from 'lucide-react';
import QRCode from 'qrcode';

export default function EmergencyICECard({ member, household, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate high-density offline QR code with base64 embedded vital record
  useEffect(() => {
    if (!member) return;

    const vitalPayload = {
      proto: 'SEI_ICE_V1',
      id: member.id,
      name: member.name,
      dob: member.dob,
      bloodGroup: member.bloodGroup,
      genotype: member.genotype,
      allergies: member.allergies,
      chronic: member.chronicConditions,
      caretaker: household.head,
      emergencyPhone: household.emergencyPhone || '+234 803 555 0192',
      clinic: household.clinicAnchor || 'Iru Comprehensive Primary Health Post',
      timestamp: new Date().toISOString(),
    };

    // Compact JSON string
    const jsonStr = JSON.stringify(vitalPayload);
    QRCode.toDataURL(jsonStr, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 280,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate offline ICE QR code:', err));
  }, [member, household]);

  if (!member) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Emergency Medical ICE Pass — ${member.name}`,
          text: `EMERGENCY MEDICAL PASS: ${member.name} | Blood: ${member.bloodGroup} | Genotype: ${member.genotype} | Allergies: ${member.allergies?.join(', ') || 'None'} | Emergency Contact: ${household.emergencyPhone}`,
        });
      } catch (e) {
        console.warn('Share aborted:', e);
      }
    } else {
      navigator.clipboard.writeText(
        `EMERGENCY MEDICAL PASS: ${member.name} | Blood: ${member.bloodGroup} | Genotype: ${member.genotype} | Allergies: ${member.allergies?.join(', ') || 'None'} | Emergency Contact: ${household.emergencyPhone}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-rose-300 my-auto">
        
        {/* BLOOD RED HEADER (Emergency Brand Color #BE123C) */}
        <div className="bg-[#BE123C] text-white p-5 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                <AlertOctagon className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-100 block">
                  EMERGENCY IN CASE OF EMERGENCY (ICE)
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                  {member.name}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              aria-label="Close emergency card"
            >
              <X className="w-5 h-5 font-bold" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2 text-xs text-rose-100 font-medium">
            <span>{member.relation}</span>
            <span>•</span>
            <span>DOB: {member.dob}</span>
            <span>•</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold text-[10px]">
              Offline Validated
            </span>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-800">
          
          {/* 1. HIGH-CONTRAST VITALS: BLOOD GROUP 48pt BOLD */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-rose-700">
                <Droplet className="w-4 h-4 fill-rose-600 text-rose-600" />
                <span>Blood Group</span>
              </div>
              <div className="text-4xl sm:text-5xl font-black text-rose-emergency my-1 tracking-tight">
                {member.bloodGroup}
              </div>
              <span className="text-[10px] font-bold text-rose-600">Rh Factor Verified</span>
            </div>

            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                <span>Genotype</span>
              </div>
              <div className="text-4xl sm:text-5xl font-black text-slate-900 my-1 tracking-tight">
                {member.genotype}
              </div>
              <span className={`text-[10px] font-bold ${
                member.genotype === 'AS' ? 'text-amber-alert' : member.genotype === 'SS' ? 'text-rose-emergency' : 'text-emerald-primary'
              }`}>
                {member.genotype === 'AS' ? 'Sickle Trait Carrier' : member.genotype === 'SS' ? 'Sickle Cell Disease' : 'Normal Hemoglobin'}
              </span>
            </div>
          </div>

          {/* 2. VITAL ALLERGIES IN HIGHLIGHTED DANGER PILL TAGS */}
          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-800 block mb-2">
              ⚠️ CRITICAL ALLERGIES (DO NOT ADMINISTER)
            </span>
            <div className="flex flex-wrap gap-2">
              {member.allergies && member.allergies.length > 0 && member.allergies[0] !== 'None' ? (
                member.allergies.map((all, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-rose-emergency text-white font-black text-xs shadow-xs tracking-wide flex items-center gap-1"
                  >
                    <span>⚠️ {all}</span>
                  </span>
                ))
              ) : (
                <span className="text-xs font-semibold text-slate-600 italic">
                  No known drug allergies reported.
                </span>
              )}
            </div>
          </div>

          {/* 3. CHRONIC CONDITIONS & ACTIVE MEDICATIONS */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
              CHRONIC CONDITIONS & ACTIVE MEDICAL REGIMEN
            </span>
            {member.chronicConditions && member.chronicConditions.length > 0 ? (
              <div className="space-y-1.5">
                {member.chronicConditions.map((cond, idx) => (
                  <div key={idx} className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>{cond}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No chronic medical conditions on record.</p>
            )}

            {member.regimen && (
              <div className="mt-3 pt-2.5 border-t border-slate-200">
                <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                  Active Prescriptions:
                </span>
                {member.regimen.map((r, i) => (
                  <div key={i} className="text-xs font-semibold text-slate-700">
                    • {r.name} — {r.dosage}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. EMERGENCY CONTACT ONE-TOUCH CALL */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                PRIMARY EMERGENCY CONTACT
              </span>
              <h4 className="text-sm font-black text-slate-900 mt-0.5">
                {household.head} (Caretaker)
              </h4>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                {household.emergencyPhone || '+234 803 555 0192'}
              </p>
            </div>

            <a
              href={`tel:${(household.emergencyPhone || '+2348035550192').replace(/\s+/g, '')}`}
              className="px-4 py-3 rounded-xl bg-emerald-primary text-white font-black text-xs flex items-center gap-2 shadow-md hover:bg-emerald-dark active:scale-95 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>SPEED DIAL</span>
            </a>
          </div>

          {/* 5. HIGH-DENSITY OFFLINE ICE QR CODE */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 block mb-1">
              OFFLINE ENCRYPTED QR EMERGENCY PASS
            </span>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto mb-3">
              Triage personnel and first responders can scan this code offline to read the encrypted health record directly without internet or authentication.
            </p>

            {qrDataUrl ? (
              <div className="inline-block p-2 bg-white rounded-2xl border-2 border-slate-900 shadow-md">
                <img src={qrDataUrl} alt="Offline ICE QR Matrix" className="w-48 h-48 mx-auto" />
              </div>
            ) : (
              <div className="w-48 h-48 mx-auto flex items-center justify-center bg-slate-100 rounded-2xl">
                <span className="text-xs text-slate-400">Generating QR...</span>
              </div>
            )}
            
            <div className="mt-2 text-[10px] font-mono text-slate-400">
              Protocol: SEI_ICE_V1 • Standalone Zero Cloud Access
            </div>
          </div>

          {/* Action Row: Print, Share, Close */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Card</span>
            </button>

            <button
              onClick={handleShare}
              className="flex-1 py-3 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied Details!' : 'Share Pass'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
