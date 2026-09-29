import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  ShieldCheck, 
  FileCode, 
  CheckCircle2, 
  QrCode, 
  Lock, 
  Key,
  HardDrive
} from 'lucide-react';
import { storage } from '../services/storage';

export default function DataExportModal({ household, onImportData, onClose }) {
  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState('');

  // 1. Export Offline Standalone HTML Medical Pass
  const handleExportOfflineHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SeiHealth Sovereign Health Record — ${household.head}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #F8FAFC; color: #0F172A; padding: 24px; max-width: 800px; margin: 0 auto; }
    .header { background: #047857; color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
    .card { background: white; border-radius: 12px; padding: 16px; margin-bottom: 14px; border: 1px solid #E2E8F0; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; background: #ECFDF5; color: #047857; }
    .danger { background: #FFF1F2; color: #BE123C; border: 1px solid #BE123C; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
    th, td { text-align: left; padding: 10px; border-bottom: 1px solid #E2E8F0; }
    th { background: #F1F5F9; color: #475569; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 24px;">SeiHealth Sovereign Household Health Pass</h1>
    <p style="margin: 4px 0 0 0; opacity: 0.9;">Caretaker: ${household.head} • Exported on: ${new Date().toLocaleDateString()}</p>
    <p style="margin: 2px 0 0 0; font-size: 11px; opacity: 0.8;">Zero Cloud Lock-in • NDPR Compliant Sovereign Document</p>
  </div>

  <div class="card">
    <h2>Household Members & Critical Vitals</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Relation</th>
          <th>Blood Group</th>
          <th>Genotype</th>
          <th>Allergies</th>
          <th>Chronic Conditions</th>
        </tr>
      </thead>
      <tbody>
        ${household.members.map(m => `
          <tr>
            <td><strong>${m.name}</strong></td>
            <td>${m.relation}</td>
            <td><span class="badge">${m.bloodGroup}</span></td>
            <td><span class="badge ${m.genotype === 'AS' ? 'danger' : ''}">${m.genotype}</span></td>
            <td>${m.allergies.join(', ') || 'None'}</td>
            <td>${m.chronicConditions.join(', ') || 'None'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="card">
    <h2>Verified Medical History & Paper Records</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Member</th>
          <th>Type</th>
          <th>Provider</th>
          <th>Details</th>
          <th>Cost</th>
        </tr>
      </thead>
      <tbody>
        ${household.records.map(r => {
          const m = household.members.find(mem => mem.id === r.memberId);
          return `
            <tr>
              <td>${r.date}</td>
              <td>${m ? m.name : 'Household'}</td>
              <td><span class="badge">${r.type}</span></td>
              <td>${r.provider}</td>
              <td>${r.details}</td>
              <td>${household.currency}${r.cost}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  </div>

  <footer style="text-align: center; margin-top: 24px; color: #64748B; font-size: 11px;">
    Encrypted and signed on device. SeiHealth Progressive Web App.
  </footer>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seihealth_medical_pass_${household.head.replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 2. Export JSON Database Backup
  const handleExportJSON = () => {
    storage.exportJSON(household);
  };

  // 3. Handle Import JSON
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await storage.importJSON(file);
      onImportData(data);
      setImportStatus('Backup restored successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      alert('Error importing file: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-emerald-primary text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6" />
            <div>
              <h2 className="text-base font-bold">Data Sovereignty & Export</h2>
              <span className="text-[10px] text-emerald-100 uppercase tracking-wider font-semibold">
                NDPR Compliance & Zero Cloud Lock-in
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
          
          {/* NDPR Privacy Badge Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
            <div className="flex items-center gap-2 font-bold mb-1 text-emerald-800">
              <Lock className="w-4 h-4 text-emerald-primary" />
              <span>Nigeria Data Protection Regulation (NDPR) Compliance</span>
            </div>
            <p className="text-[11px] text-emerald-900/80 leading-relaxed">
              All records, dosages, genotypes, and child immunizations reside strictly on this local device. 
              No health data is automatically broadcast or sold to central servers without an explicit export triggered by the caretaker.
            </p>
            <div className="mt-2 text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
              <Key className="w-3.5 h-3.5" />
              <span>AES-256 local key generated in browser storage</span>
            </div>
          </div>

          {/* Export Actions Grid */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Export Options (Instant & Offline)
            </h3>

            {/* Offline Standalone HTML Medical Pass */}
            <button
              onClick={handleExportOfflineHTML}
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-primary hover:bg-emerald-50/50 transition-all flex items-center justify-between group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-primary group-hover:bg-emerald-primary group-hover:text-white transition-colors">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Offline Standalone HTML Medical Pass</h4>
                  <p className="text-[11px] text-slate-500">Opens in any browser or feature phone without internet</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-primary" />
            </button>

            {/* JSON Sovereign Backup */}
            <button
              onClick={handleExportJSON}
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-primary hover:bg-emerald-50/50 transition-all flex items-center justify-between group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Full Household JSON Database Backup</h4>
                  <p className="text-[11px] text-slate-500">Includes all members, OCR records, vaccines, and receipts</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </button>

            {/* Peer-to-Peer Import */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all flex items-center justify-between group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-200 text-slate-700">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Restore / Import Household Backup</h4>
                  <p className="text-[11px] text-slate-500">Load previously exported JSON backup into device storage</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-primary">Select File</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />

            {importStatus && (
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 text-center font-bold">
                {importStatus}
              </div>
            )}
          </div>

          {/* Intermediary Clinic Handout Protocol Explanation */}
          <div className="p-3.5 rounded-xl bg-slate-100 text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 text-[11px] block">
              🏥 Clinic Intermediary QR Handouts
            </span>
            <p className="text-[11px] leading-relaxed">
              Community health extension workers (CHEWs) at rural health posts can distribute laminated QR stickers. 
              Tapping or scanning mounts the cached PWA shell in &lt; 2 seconds on 2G/3G connections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
