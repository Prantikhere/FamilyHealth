import React from 'react';
import { X, Sparkles, Camera } from 'lucide-react';
import DocumentCaptureView from './DocumentCaptureView';

export default function OcrScannerModal({
  members,
  onSaveRecord,
  onClose,
  translations
}) {
  const t = translations || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="surface-card rounded-3xl w-full max-w-2xl max-h-[94vh] overflow-y-auto shadow-lifted relative p-5 sm:p-6 space-y-4 border border-white/90">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-neu-raised border border-white/30">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                <span>{t.ocrScannerHeading || 'Scan Health Document (OCR)'}</span>
                <span className="neu-pill text-[10px] font-bold shadow-xs">
                  WASM OCR
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t.ocrScannerSubtitle || 'Extract clinic prescriptions, immunization cards, and receipts offline'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="neu-icon-btn w-9 h-9 rounded-xl text-slate-500 hover:text-slate-800 touch-target"
            aria-label="Close OCR Scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* OCR Engine & Capture Body */}
        <DocumentCaptureView
          members={members}
          onSave={(record) => {
            onSaveRecord(record);
            onClose();
          }}
          onCancel={onClose}
        />

      </div>
    </div>
  );
}
