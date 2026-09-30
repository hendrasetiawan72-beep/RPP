import React, { useState } from 'react';
import { Table, FileText, Layers, Eye, BookOpen, ChevronRight, HelpCircle, X, Code2, Edit3 } from 'lucide-react';
import { ModulAjarData } from '../types';

interface DocumentTabsProps {
  documentMode: 'atp_only' | 'modul_selected' | 'lampiran_selected' | 'modul_all' | 'both_separate';
  setDocumentMode: (mode: 'atp_only' | 'modul_selected' | 'lampiran_selected' | 'modul_all' | 'both_separate') => void;
  modulAjarList: ModulAjarData[];
  selectedModulIndex: number;
  setSelectedModulIndex: (index: number) => void;
  watermarkOpacity: number;
  setWatermarkOpacity: (val: number) => void;
  onOpenRppEditor?: (initialTab?: 'desain' | 'sintaks' | 'asesmen' | 'lampiran') => void;
}

export const DocumentTabs: React.FC<DocumentTabsProps> = ({
  documentMode,
  setDocumentMode,
  modulAjarList,
  selectedModulIndex,
  setSelectedModulIndex,
  watermarkOpacity,
  setWatermarkOpacity,
  onOpenRppEditor,
}) => {
  const [showF4Guide, setShowF4Guide] = useState(false);

  return (
    <div className="bg-[#FFFDF7] p-3.5 neo-box mb-6 space-y-3 no-print">
      {/* Primary Document Separation Tabs */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          <button
            onClick={() => setDocumentMode('atp_only')}
            className={`neo-btn px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              documentMode === 'atp_only'
                ? 'bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'bg-white hover:bg-neutral-100 text-neutral-800 border border-black'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-emerald-800" />
            <span>Dokumen 1: ATP Saja</span>
          </button>

          <button
            onClick={() => setDocumentMode('modul_selected')}
            className={`neo-btn px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              documentMode === 'modul_selected'
                ? 'bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'bg-white hover:bg-neutral-100 text-neutral-800 border border-black'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-800" />
            <span>Dokumen 2: RPP Deep Learning (Per Unit)</span>
          </button>

          <button
            onClick={() => setDocumentMode('lampiran_selected')}
            className={`neo-btn px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              documentMode === 'lampiran_selected'
                ? 'bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'bg-white hover:bg-neutral-100 text-neutral-800 border border-black'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-800" />
            <span>Dokumen 3: Lampiran & LKPD (Per Unit)</span>
          </button>

          <button
            onClick={() => setDocumentMode('modul_all')}
            className={`neo-btn px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              documentMode === 'modul_all'
                ? 'bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'bg-white hover:bg-neutral-100 text-neutral-800 border border-black'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-800" />
            <span>Semua RPP ({modulAjarList.length} Unit)</span>
          </button>

          <button
            onClick={() => setDocumentMode('both_separate')}
            className={`neo-btn px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              documentMode === 'both_separate'
                ? 'bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'bg-white hover:bg-neutral-100 text-neutral-800 border border-black'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-800" />
            <span>Semua Dokumen (Lengkap)</span>
          </button>
        </div>

        {/* Paper Info & Watermark Controls */}
        <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto justify-end">
          {/* Quick Table & Syntax Editor Button */}
          {onOpenRppEditor && (
            <button
              onClick={() => onOpenRppEditor('sintaks')}
              className="neo-btn px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black text-xs font-black rounded-lg border-2 border-black flex items-center gap-1 shadow-[2px_2px_0px_#000]"
            >
              <Layers className="w-3.5 h-3.5 text-black" />
              <span>✏️ Editor Tabel & Sintaks</span>
            </button>
          )}

          {/* F4 Landscape Indicator Badge */}
          <div className="flex items-center gap-1.5 bg-emerald-100/90 border border-black/60 px-2.5 py-1 rounded-lg text-[11px] font-black text-emerald-950">
            <span>📄 F4 Landscape (330 × 215 mm)</span>
            <button
              onClick={() => setShowF4Guide(true)}
              className="text-emerald-800 hover:text-black hover:underline inline-flex items-center"
              title="Petunjuk setting cetak F4 Landscape"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Watermark opacity control */}
          <div className="flex items-center gap-2 bg-amber-50/80 px-2.5 py-1 border border-black/40 rounded-lg text-xs">
            <Eye className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
            <span className="text-[11px] font-bold text-neutral-700 whitespace-nowrap">
              Watermark: {Math.round(watermarkOpacity * 100)}%
            </span>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={watermarkOpacity}
              onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
              className="w-16 accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Sub-selector: Choose Material for RPP */}
      {(documentMode === 'modul_selected' || documentMode === 'lampiran_selected' || documentMode === 'both_separate') && (
        <div className="pt-2 border-t border-black/10 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-600 flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
            <span>Pilih Unit Materi:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {modulAjarList.map((modul, idx) => {
              const isSelected = selectedModulIndex === idx;
              return (
                <button
                  key={modul.id}
                  onClick={() => {
                    setSelectedModulIndex(idx);
                  }}
                  className={`neo-btn px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    isSelected
                      ? 'bg-blue-300 text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                      : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-black/60'
                  }`}
                >
                  <span>Unit {modul.nomorModul}: </span>
                  <span className="font-medium">{modul.judulMateri}</span>
                  <span className="ml-1 text-[10px] text-neutral-500 font-mono">({modul.alokasiWaktuMateri || '18 JP'})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* F4 Print Guide Modal */}
      {showF4Guide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
          <div className="bg-[#FFFDF7] neo-box-lg max-w-lg w-full p-5 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowF4Guide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-100 hover:bg-rose-100 border-2 border-black"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-black text-lg text-neutral-900 mb-2 flex items-center gap-2">
              <span>🖨️ Panduan Cetak F4 Landscape (Folio)</span>
            </h3>

            <p className="text-xs text-neutral-700 leading-relaxed mb-3">
              Dokumen ini dirancang khusus untuk ukuran standar <strong>Kertas F4 / Folio (330 × 215 mm)</strong> dalam orientasi <strong>Landscape (Mendatar)</strong> agar seluruh 9 kolom tabel ATP dan komponen RPP muat dengan sangat rapi dan proporsional.
            </p>

            <div className="bg-amber-100/70 border-2 border-black rounded-xl p-3 text-xs space-y-2 mb-4">
              <div className="font-bold text-neutral-900">Langkah Pengaturan Saat Mencetak:</div>
              <ol className="list-decimal pl-5 space-y-1.5 text-neutral-800">
                <li>Klik tombol <strong>Cetak Dokumen</strong> / tekan <code>Ctrl + P</code>.</li>
                <li>Pilih <strong>Tujuan / Destination</strong>: Simpan sebagai PDF (atau printer yang terhubung).</li>
                <li>Atur <strong>Tata Letak / Layout</strong>: <strong>Lanskap (Landscape)</strong>.</li>
                <li>Atur <strong>Ukuran Kertas / Paper Size</strong>: <strong>Folio / F4 / German Std Fanfold (8.5 × 13 inci)</strong>. Jika printer tidak memiliki pilihan F4, pilih <strong>Legal</strong>.</li>
                <li>Centang opsi <strong>Grafik Latar Belakang / Background Graphics</strong> agar kop surat dan garis cetak muncul sempurna.</li>
              </ol>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowF4Guide(false)}
                className="neo-btn px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black rounded-lg"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
