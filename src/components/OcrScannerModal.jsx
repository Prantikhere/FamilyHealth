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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-charcoal/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-canvas border-2 border-borderRule rounded-3xl w-full max-w-2xl max-h-[94vh] overflow-y-auto shadow-lifted relative p-4 sm:p-6 space-y-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-borderRule pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-terracotta text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-charcoal flex items-center gap-2">
                <span>{t.ocrScannerHeading || 'Scan Health Document (OCR)'}</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-terracotta-container text-terracotta px-2 py-0.5 rounded-full border border-terracotta/20">
                  WASM OCR
                </span>
              </h2>
              <p className="text-xs text-charcoal-muted">
                {t.ocrScannerSubtitle || 'Extract clinic prescriptions, immunization cards, and receipts offline'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-sand hover:bg-sand-variant text-charcoal flex items-center justify-center font-bold text-sm transition-colors touch-target"
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
