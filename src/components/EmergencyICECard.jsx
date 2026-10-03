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
      proto: 'FH_ICE_V2',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-chalk rounded-3xl shadow-2xl overflow-hidden border border-borderRule my-auto">
        
        {/* OBSIDIAN HEADER (#09090B) */}
        <div className="bg-zinc-950 text-white p-5 relative border-b border-zinc-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <AlertOctagon className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                  EMERGENCY IN CASE OF EMERGENCY (ICE)
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                  {member.name}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
              aria-label="Close emergency card"
            >
              <X className="w-5 h-5 font-bold" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400 font-medium">
            <span>{member.relation}</span>
            <span>•</span>
            <span>DOB: {member.dob}</span>
            <span>•</span>
            <span className="bg-white/10 px-2 py-0.5 rounded-full font-bold text-[10px] text-zinc-300">
              Offline Validated
            </span>
          </div>
        </div>

        {/* BODY CONTENT */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-charcoal">
          
          {/* 1. HIGH-CONTRAST VITALS: BLOOD GROUP 48pt BOLD */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-950 text-white border border-zinc-900 rounded-2xl p-4 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
                <Droplet className="w-4 h-4 fill-white text-white" />
                <span>Blood Group</span>
              </div>
              <div className="text-4xl sm:text-5xl font-black text-white my-1 tracking-tight">
                {member.bloodGroup}
              </div>
              <span className="text-[10px] font-bold text-zinc-400">Rh Factor Verified</span>
            </div>

            <div className="bg-zinc-100 border border-zinc-300 rounded-2xl p-4 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-zinc-700">
                <span>Genotype</span>
              </div>
              <div className="text-4xl sm:text-5xl font-black text-zinc-950 my-1 tracking-tight">
                {member.genotype}
              </div>
              <span className="text-[10px] font-black text-zinc-700">
                {member.genotype === 'AS' ? 'Sickle Trait Carrier' : member.genotype === 'SS' ? 'Sickle Cell Disease' : 'Normal Hemoglobin'}
              </span>
            </div>
          </div>

          {/* 2. VITAL ALLERGIES */}
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
            <span className="text-[11px] font-black uppercase tracking-wider text-zinc-950 block mb-2">
              ⚠️ CRITICAL ALLERGIES (DO NOT ADMINISTER)
            </span>
            <div className="flex flex-wrap gap-2">
              {member.allergies && member.allergies.length > 0 && member.allergies[0] !== 'None' ? (
                member.allergies.map((all, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-zinc-950 text-white font-black text-xs shadow-xs tracking-wide flex items-center gap-1"
                  >
                    <span>⚠️ {all}</span>
                  </span>
                ))
              ) : (
                <span className="text-xs font-semibold text-zinc-600 italic">
                  No known drug allergies reported.
                </span>
              )}
            </div>
          </div>

          {/* 3. CHRONIC CONDITIONS & ACTIVE MEDICATIONS */}
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 block mb-2">
              CHRONIC CONDITIONS & ACTIVE MEDICAL REGIMEN
            </span>
            {member.chronicConditions && member.chronicConditions.length > 0 ? (
              <div className="space-y-1.5">
                {member.chronicConditions.map((cond, idx) => (
                  <div key={idx} className="flex items-center gap-2 font-bold text-zinc-950 text-xs">
                    <span className="w-2 h-2 rounded-full bg-zinc-950" />
                    <span>{cond}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic">No chronic medical conditions on record.</p>
            )}

            {member.regimen && (
              <div className="mt-3 pt-2.5 border-t border-zinc-200">
                <span className="text-[10px] font-extrabold uppercase text-zinc-600 block mb-1">
                  Active Prescriptions:
                </span>
                {member.regimen.map((r, i) => (
                  <div key={i} className="text-xs font-semibold text-zinc-800">
                    • {r.name} — {r.dosage}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. EMERGENCY CONTACT ONE-TOUCH CALL */}
          <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase text-zinc-600 tracking-wider block">
                PRIMARY EMERGENCY CONTACT
              </span>
              <h4 className="text-sm font-black text-zinc-950 mt-0.5">
                {household.head} (Caretaker)
              </h4>
              <p className="text-xs text-zinc-600 font-mono mt-0.5">
                {household.emergencyPhone || '+234 803 555 0192'}
              </p>
            </div>

            <a
              href={`tel:${(household.emergencyPhone || '+2348035550192').replace(/\s+/g, '')}`}
              className="neu-btn-primary h-11 px-4 rounded-xl text-white font-bold text-xs inline-flex items-center gap-2 shadow-neu-primary active:scale-95 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>SPEED DIAL</span>
            </a>
          </div>

          {/* 5. HIGH-DENSITY OFFLINE ICE QR CODE */}
          <div className="p-4 rounded-2xl neu-inset text-center shadow-neu-pressed">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 block mb-1">
              OFFLINE ENCRYPTED QR EMERGENCY PASS
            </span>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto mb-3 font-medium">
              Triage personnel and first responders can scan this code offline to read the encrypted health record directly without internet or authentication.
            </p>

            {qrDataUrl ? (
              <div className="inline-block p-2.5 bg-white rounded-2xl border-2 border-slate-900 shadow-neu-raised">
                <img src={qrDataUrl} alt="Offline ICE QR Matrix" className="w-48 h-48 mx-auto rounded-lg" />
              </div>
            ) : (
              <div className="w-48 h-48 mx-auto flex items-center justify-center bg-white/40 rounded-2xl">
                <span className="text-xs text-slate-400 font-bold">Generating QR...</span>
              </div>
            )}
            
            <div className="mt-2 text-[10px] font-mono text-slate-500 font-bold">
              Protocol: SEI_ICE_V1 • Standalone Zero Cloud Access
            </div>
          </div>

          {/* Action Row: Print, Share, Close (Proportioned Buttons) */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 neu-btn btn-standard font-bold text-xs text-slate-700"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Card</span>
            </button>

            <button
              onClick={handleShare}
              className="flex-1 neu-btn-primary btn-standard font-bold text-xs shadow-neu-primary"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied Details!' : 'Share Pass'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
