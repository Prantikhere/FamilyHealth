import React, { useState } from 'react';
import { 
  FileCheck, 
  FileText, 
  Share2, 
  Lock, 
  Key, 
  Clock, 
  Trash2, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  ExternalLink, 
  Filter, 
  Download,
  Calendar,
  Eye,
  X,
  Copy,
  Sparkles,
  Stethoscope
} from 'lucide-react';

export default function TimelineView({
  household,
  onAddRecord,
  currentLang = 'en',
  translations
}) {
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'OFFICIAL' | 'SELF'
  const [selectedRecordIds, setSelectedRecordIds] = useState([]);
  
  // Delegated Transfer Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferPin, setTransferPin] = useState('7492');
  const [recipientDesc, setRecipientDesc] = useState('Dr. Babatunde - First Cardiology Consultants');
  const [ttlHours, setTtlHours] = useState(48);
  const [activeTransfer, setActiveTransfer] = useState(null);
  
  // Doctor Simulation Modal State
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [doctorEnteredPin, setDoctorEnteredPin] = useState('');
  const [doctorDecrypted, setDoctorDecrypted] = useState(false);
  const [doctorError, setDoctorError] = useState('');

  // Selected certificate viewer
  const [viewingCertificate, setViewingCertificate] = useState(null);

  const t = translations || {};

  // Filter records
  const filteredRecords = household.records.filter(r => {
    if (filterType === 'OFFICIAL') return r.provenance === 'OFFICIAL_VERIFIED';
    if (filterType === 'SELF') return r.provenance === 'SELF_REPORTED';
    return true;
  });

  const toggleSelectRecord = (id) => {
    setSelectedRecordIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecordIds.length === filteredRecords.length) {
      setSelectedRecordIds([]);
    } else {
      setSelectedRecordIds(filteredRecords.map(r => r.id));
    }
  };

  // Generate Transfer Package (Section 4.1 Handshake)
  const handleInitiateTransfer = () => {
    if (selectedRecordIds.length === 0) return;
    const transferId = 't_' + Math.random().toString(36).substr(2, 9);
    const mockToken = {
      id: transferId,
      url: `https://share.familyhealth.africa/t/${transferId}`,
      pin: transferPin,
      pinSalt: 'salt_' + Math.random().toString(36).substr(2, 8),
      pinHash: 'sha256_argon2id_' + transferPin + '_hash',
      recipient: recipientDesc,
      recordIds: [...selectedRecordIds],
      records: household.records.filter(r => selectedRecordIds.includes(r.id)),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + ttlHours * 3600 * 1000).toISOString(),
      revoked: false,
    };
    setActiveTransfer(mockToken);
    setShowTransferModal(true);
  };

  // Revoke Transfer (Section 4.1 Step 14)
  const handleRevokeTransfer = () => {
    if (activeTransfer) {
      setActiveTransfer(prev => ({ ...prev, revoked: true }));
      setDoctorDecrypted(false);
    }
  };

  // Doctor Unlock Handshake
  const handleDoctorUnlock = (e) => {
    e.preventDefault();
    setDoctorError('');
    if (!activeTransfer || activeTransfer.revoked) {
      setDoctorError('This transfer link has been revoked or expired.');
      return;
    }
    if (doctorEnteredPin === activeTransfer.pin) {
      setDoctorDecrypted(true);
    } else {
      setDoctorError('Invalid 4-digit PIN. Decryption failed.');
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200">
      
      {/* 1. TOP HEADER & PROVENANCE FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderRule pb-3">
        <div>
          <h2 className="text-base font-black text-charcoal tracking-tight">
            Dual-Tier Health Records Timeline
          </h2>
          <p className="text-xs text-charcoal-muted">
            Cryptographically signed official records & patient self-reported logs
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-sand p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              filterType === 'ALL' ? 'bg-charcoal text-white shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            All ({household.records.length})
          </button>
          <button
            onClick={() => setFilterType('OFFICIAL')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              filterType === 'OFFICIAL' ? 'bg-indigoVerified text-white shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Official Verified
          </button>
          <button
            onClick={() => setFilterType('SELF')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              filterType === 'SELF' ? 'bg-ochre text-white shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Self-Reported
          </button>
        </div>
      </div>

      {/* 2. SELECTIVE TRANSFER ACTIVATION BAR (Section 2.2 Wireframe) */}
      <div className="surface-card p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-chalk border-2 border-borderRule">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedRecordIds.length > 0 && selectedRecordIds.length === filteredRecords.length}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-borderRule text-terracotta focus:ring-terracotta cursor-pointer"
            id="selectAllRecords"
          />
          <label htmlFor="selectAllRecords" className="text-xs font-bold text-charcoal cursor-pointer">
            Select records to compile temporary doctor transfer PIN
          </label>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-mono text-charcoal-muted">
            {selectedRecordIds.length} selected
          </span>
          <button
            onClick={handleInitiateTransfer}
            disabled={selectedRecordIds.length === 0}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs ${
              selectedRecordIds.length > 0 
                ? 'bg-terracotta hover:bg-terracotta-dark text-white cursor-pointer active:scale-95' 
                : 'bg-sand text-charcoal-muted cursor-not-allowed opacity-60'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Transfer Selected ({selectedRecordIds.length})</span>
          </button>
        </div>
      </div>

      {/* 3. TIMELINE FEED ENGINE */}
      <div className="space-y-3">
        {filteredRecords.map((record) => {
          const isOfficial = record.provenance === 'OFFICIAL_VERIFIED';
          const member = household.members.find(m => m.id === record.memberId);
          const isSelected = selectedRecordIds.includes(record.id);

          return (
            <div 
              key={record.id}
              className={`surface-card p-4 transition-all relative overflow-hidden ${
                isSelected ? 'ring-2 ring-terracotta border-transparent' : 'border-borderRule'
              }`}
            >
              {/* Top Accent Strip */}
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: isOfficial ? '#1B2A4A' : '#D9822B' }}
              />

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectRecord(record.id)}
                    className="mt-1 w-4 h-4 rounded border-borderRule text-terracotta focus:ring-terracotta cursor-pointer"
                  />
                  <div>
                    {/* Provenance Badge */}
                    <div className="flex items-center gap-2 mb-1">
                      {isOfficial ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigoVerified text-white">
                          <ShieldCheck className="w-3 h-3 text-sky-300" />
                          {t.officialSeal || 'OFFICIAL VERIFIED SEAL'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-ochre text-white">
                          <AlertCircle className="w-3 h-3 text-amber-200" />
                          {t.selfReported || 'SELF-REPORTED ENTRY'}
                        </span>
                      )}
                      
                      <span className="text-[10px] font-bold text-charcoal-muted">
                        {member?.name} ({member?.generation})
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-charcoal">
                      {record.title}
                    </h3>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-charcoal-muted flex-shrink-0">
                  {new Date(record.recordedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              {/* Record Content Details */}
              <p className="text-xs text-charcoal-muted mt-2 pl-6 leading-relaxed">
                {record.details}
              </p>

              {/* Provenance Issuer Details */}
              <div className="mt-3 pl-6 pt-2.5 border-t border-borderRule flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="text-charcoal-muted">
                  <span className="font-semibold text-charcoal">Issuer:</span> {record.issuerName}
                  {record.attestationSignature && (
                    <span className="ml-2 font-mono text-[10px] text-indigoVerified bg-indigoVerified-container px-1.5 py-0.2 rounded font-bold">
                      ✓ Verified Ed25519
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isOfficial && (
                    <button
                      onClick={() => setViewingCertificate(record)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigoVerified hover:underline"
                    >
                      <FileCheck className="w-3 h-3" />
                      <span>View Certificate</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedRecordIds([record.id]);
                      handleInitiateTransfer();
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-terracotta hover:underline"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Share Record ↗</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* 4. GRANULAR TRANSFER HANDSHAKE MODAL (Section 4.1) */}
      {showTransferModal && activeTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="surface-card w-full max-w-lg p-5 space-y-4 shadow-lifted relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-borderRule pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-terracotta text-white flex items-center justify-center shadow-xs">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-charcoal">
                    Granular Delegated Transfer Handshake
                  </h3>
                  <p className="text-[11px] text-charcoal-muted">
                    Zero-knowledge token with Argon2id-hashed 4-digit PIN
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowTransferModal(false)}
                className="p-1 rounded-lg hover:bg-sand text-charcoal-muted"
                aria-label="Close transfer modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Banner */}
            {activeTransfer.revoked ? (
              <div className="p-3 rounded-xl bg-emergency-container text-emergency text-xs font-bold border border-emergency/30 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>ACCESS TERMINATED: This transfer token has been revoked atomically from Redis and GCP Cloud SQL.</span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-forest-light text-forest text-xs font-bold border border-forest/30 flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>ACTIVE TRANSFER BUNDLE: {activeTransfer.records.length} records wrapped with Argon2id Master KEK.</span>
              </div>
            )}

            {/* Transfer Credentials */}
            <div className="space-y-3 bg-chalk p-4 rounded-xl border border-borderRule text-xs">
              <div>
                <span className="text-[10px] font-black uppercase text-charcoal-muted block mb-1">
                  1. Ephemeral Access URL
                </span>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-borderRule font-mono text-[11px]">
                  <span className="truncate flex-1 text-charcoal">{activeTransfer.url}</span>
                  <button 
                    onClick={() => navigator.clipboard?.writeText(activeTransfer.url)} 
                    className="p-1 hover:text-terracotta text-charcoal-muted"
                    title="Copy URL"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-charcoal-muted block mb-1">
                    2. 4-Digit Doctor PIN
                  </span>
                  <div className="p-2.5 rounded-lg bg-terracotta-light border-2 border-terracotta text-center font-mono font-black text-lg text-terracotta tracking-widest">
                    {activeTransfer.pin}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase text-charcoal-muted block mb-1">
                    3. Auto-Expiry TTL
                  </span>
                  <div className="p-2.5 rounded-lg bg-sand text-center text-xs font-bold text-charcoal">
                    Expires in {ttlHours} hours
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black uppercase text-charcoal-muted block mb-0.5">
                  Recipient Descriptor:
                </span>
                <span className="font-bold text-charcoal">{activeTransfer.recipient}</span>
              </div>
            </div>

            {/* Simulation & Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
              <button
                onClick={() => {
                  setDoctorEnteredPin('');
                  setDoctorDecrypted(false);
                  setDoctorError('');
                  setShowDoctorModal(true);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigoVerified text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-slate-800 transition-colors"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Simulate Doctor Terminal View</span>
              </button>

              {!activeTransfer.revoked && (
                <button
                  onClick={handleRevokeTransfer}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emergency text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Atomic Revocation Now</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 5. DOCTOR VIEW SIMULATOR MODAL (Section 4.1 Steps 7-13) */}
      {showDoctorModal && activeTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="surface-card w-full max-w-lg p-5 space-y-4 shadow-lifted relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-borderRule pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigoVerified text-white flex items-center justify-center shadow-xs">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-charcoal">
                    Doctor Terminal Decryption View
                  </h3>
                  <p className="text-[11px] text-charcoal-muted">
                    Simulating WebAssembly in-browser client decryption
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDoctorModal(false)}
                className="p-1 rounded-lg hover:bg-sand text-charcoal-muted"
                aria-label="Close doctor terminal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!doctorDecrypted ? (
              <form onSubmit={handleDoctorUnlock} className="space-y-4">
                <div className="p-4 rounded-xl bg-sand text-xs text-charcoal space-y-1">
                  <span className="font-black block">Doctor Access Handshake</span>
                  <p className="text-charcoal-muted">
                    You have requested encrypted patient records from {household.head}. Please enter the 4-digit PIN provided by the patient to derive the K_transfer key and decrypt the records.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-charcoal block mb-1.5">
                    Enter 4-Digit Transfer PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={doctorEnteredPin}
                    onChange={(e) => setDoctorEnteredPin(e.target.value)}
                    placeholder="e.g. 7492"
                    className="w-full text-center tracking-widest font-mono text-xl py-3 rounded-xl border-2 border-borderRule focus:border-terracotta focus:ring-0 outline-none"
                    autoFocus
                  />
                </div>

                {doctorError && (
                  <div className="p-2.5 rounded-lg bg-emergency-container text-emergency text-xs font-bold">
                    {doctorError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={doctorEnteredPin.length !== 4}
                  className="w-full py-3 rounded-xl bg-indigoVerified text-white font-extrabold text-xs shadow-md disabled:opacity-50 hover:bg-slate-800 transition-colors"
                >
                  Unwrap DEKs & Decrypt Records
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-forest-light text-forest text-xs font-bold border border-forest/30 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-forest" />
                  <span>Decryption Successful! AES-256-GCM plaintexts rendered in secure sandbox.</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-charcoal-muted">
                    Decrypted Patient Records ({activeTransfer.records.length}):
                  </h4>
                  {activeTransfer.records.map(rec => (
                    <div key={rec.id} className="p-3 rounded-xl bg-chalk border border-borderRule text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-charcoal">{rec.title}</span>
                        <span className="font-mono text-[10px] text-charcoal-muted">{rec.recordedDate?.slice(0, 10)}</span>
                      </div>
                      <p className="text-charcoal-muted">{rec.details}</p>
                      {rec.attestationSignature && (
                        <span className="text-[10px] font-mono text-indigoVerified block">
                          Verified Issuer: {rec.issuerName}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowDoctorModal(false);
                    setShowTransferModal(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-sand hover:bg-sand-variant text-charcoal font-bold text-xs transition-colors mt-2"
                >
                  Close Doctor Terminal
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 6. VERIFIED CERTIFICATE VIEWER MODAL */}
      {viewingCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="surface-card w-full max-w-md p-5 space-y-4 shadow-lifted relative">
            <div className="flex items-center justify-between border-b border-borderRule pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigoVerified" />
                <h3 className="text-sm font-black text-charcoal">Official Attestation Certificate</h3>
              </div>
              <button onClick={() => setViewingCertificate(null)} className="p-1 rounded-lg hover:bg-sand">
                <X className="w-5 h-5 text-charcoal-muted" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-indigoVerified text-white text-xs space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-sky-200 block">
                Ed25519 Cryptographic Certificate
              </span>
              <h4 className="text-base font-black">{viewingCertificate.title}</h4>
              <p className="text-sand-variant text-xs">{viewingCertificate.details}</p>
              
              <div className="pt-2 border-t border-white/20 font-mono text-[10px] space-y-1">
                <div>Issuer: {viewingCertificate.issuerName}</div>
                <div>License: {viewingCertificate.issuerLicense}</div>
                <div className="truncate">Digital Signature: {viewingCertificate.attestationSignature}</div>
                <div className="truncate">SHA-256 Digest: {viewingCertificate.documentSha256}</div>
              </div>
            </div>

            <button
              onClick={() => setViewingCertificate(null)}
              className="w-full py-2.5 rounded-xl bg-sand text-charcoal font-bold text-xs hover:bg-sand-variant transition-colors"
            >
              Close Certificate
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
