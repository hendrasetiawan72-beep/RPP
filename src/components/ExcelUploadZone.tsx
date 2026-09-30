import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  FilePlus2,
  Download,
  Layers,
  Sparkles,
  BookCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ExcelRawRow, ExcelRppRawRow, ParsedExcelResult } from '../types';
import {
  parseExcelFile,
  downloadCpExcelTemplate,
  downloadRppExcelTemplate,
} from '../utils/excelParser';
import { MAJOR_SAMPLES, MajorSample } from '../utils/sampleData';

interface ExcelUploadZoneProps {
  rawRows: ExcelRawRow[];
  rppRows?: ExcelRppRawRow[];
  currentMode: 'cp' | 'rpp';
  onExcelUploaded: (result: ParsedExcelResult) => void;
  onRawRowsUpdated: (newRows: ExcelRawRow[]) => void;
  onRppRowsUpdated: (newRppRows: ExcelRppRawRow[]) => void;
  onSelectSample: (sample: MajorSample) => void;
  currentSubject: string;
}

export const ExcelUploadZone: React.FC<ExcelUploadZoneProps> = ({
  rawRows,
  rppRows,
  currentMode,
  onExcelUploaded,
  onRawRowsUpdated,
  onRppRowsUpdated,
  onSelectSample,
  currentSubject,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUploadedType, setLastUploadedType] = useState<'cp' | 'rpp' | null>(currentMode);
  const [showManualEditor, setShowManualEditor] = useState(false);
  const [editorTab, setEditorTab] = useState<'cp' | 'rpp'>(currentMode);
  const [expandedRppRow, setExpandedRppRow] = useState<number | null>(0);

  const handleFileChange = async (file: File) => {
    if (!file) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await parseExcelFile(file);
      setLastUploadedType(result.fileType);
      setEditorTab(result.fileType);
      onExcelUploaded(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Format file tidak sesuai.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // CP Row Editor Handlers
  const handleAddCpRow = () => {
    const newRow: ExcelRawRow = {
      no: rawRows.length + 1,
      elemen: 'Elemen Pembelajaran Baru',
      capaianPembelajaran: 'Pada akhir fase, peserta didik mampu memahami, menganalisis, dan mempraktikkan...',
      materi: 'Topik Bahasan Baru',
      jp: 12,
      fase: 'F',
      kelas: 'XI',
      semester: '1 (Ganjil)',
      lintasDisiplin: '',
    };
    onRawRowsUpdated([...rawRows, newRow]);
  };

  const handleUpdateCpRow = (index: number, field: keyof ExcelRawRow, val: any) => {
    const updated = [...rawRows];
    updated[index] = { ...updated[index], [field]: val };
    onRawRowsUpdated(updated);
  };

  const handleDeleteCpRow = (index: number) => {
    if (rawRows.length <= 1) {
      alert('Minimal harus terdapat 1 data Elemen/Capaian Pembelajaran.');
      return;
    }
    const updated = rawRows.filter((_, i) => i !== index);
    onRawRowsUpdated(updated);
  };

  // RPP Row Editor Handlers
  const activeRppList = rppRows && rppRows.length > 0 ? rppRows : [];

  const handleAddRppRow = () => {
    const newNo = activeRppList.length + 1;
    const newRppRow: ExcelRppRawRow = {
      no: newNo,
      elemen: `Elemen Pembelajaran Unit ${newNo}`,
      capaianPembelajaran: 'Pada akhir fase, peserta didik mampu memahami dan menerapkan kompetensi dasar secara profesional.',
      tujuanPembelajaran: `1. Menganalisis konsep dasar materi unit ${newNo}.\n2. Mempraktikkan prosedur kerja sesuai standar operasional industri.`,
      alurPembelajaran: 'Tahap 1: Pengamatan & orientasi masalah, Tahap 2: Diskusi kelompok, Tahap 3: Praktik unjuk kerja, Tahap 4: Refleksi 3-2-1.',
      materi: `Materi Pokok Unit ${newNo}`,
      jp: 12,
      fase: 'F',
      kelas: 'XI',
      semester: '1 (Ganjil)',
      lintasDisiplin: 'Kejuruan Terkait dan Teknologi Terapan',
      kesiapanPesertaDidik: 'Minat: Literasi terapan dan teknologi. 40% Visual, 40% Auditory, 20% Kinestetik. Lingkungan: Batang, Jawa Tengah.',
      karakteristikMateri: 'Materi konseptual dan aplikatif yang menuntut analisis nalar kritis serta kepatuhan SOP kerja.',
      profilLulusan: 'Bernalar Kritis, Kreativitas, Kolaborasi, Kemandirian',
      metodePembelajaran: 'Problem-Based Learning (PBL)',
      kemitraan: 'Mitra DUDI Rekanan Batang & Pendampingan Orang Tua',
      lingkunganDigital: 'Ruang Fisik standar 5S, Google Classroom, dan Platform Kolaborasi Digital',
      sintaksPendahuluan: 'Mindful Learning: Doa, cek kesiapan emosional & fisik, penayangan fenomena nyata pemantik nalar kritis.',
      sintaksInti1: 'Meaningful Learning: Diskusi kelompok analisis data kasus kontekstual dan identifikasi parameter kerja.',
      sintaksInti2: 'Joyful Learning: Praktik unjuk kerja hands-on kelompok, simulasi operasional, dan presentasi hasil temuan.',
      sintaksPenutup: 'Refleksi 3-2-1 & Kaizen: 3 hal dikuasai, 2 pertanyaan tersisa, 1 rencana perbaikan. Penguatan oleh guru.',
      asesmenAwal: 'Asesmen Diagnostik: Kuis tanya jawab lisan 5 butir soal kesiapan belajar.',
      asesmenProses: 'Asesmen Formatif: Observasi unjuk kerja proses diskusi kelompok dan ketepatan SOP praktik.',
      asesmenAkhir: 'Asesmen Sumatif: Job Sheet LKPD penilaian proyek kelompok dan tes akhir unit.',
      pengayaanRemedial: 'Pengayaan: Studi kasus industri lanjutan. Remedial: Pendampingan bertahap indikator belum tuntas.',
    };
    onRppRowsUpdated([...activeRppList, newRppRow]);
    setExpandedRppRow(activeRppList.length);
  };

  const handleUpdateRppRow = (index: number, field: keyof ExcelRppRawRow, val: any) => {
    const updated = [...activeRppList];
    updated[index] = { ...updated[index], [field]: val };
    onRppRowsUpdated(updated);
  };

  const handleDeleteRppRow = (index: number) => {
    if (activeRppList.length <= 1) {
      alert('Minimal harus terdapat 1 data Unit RPP.');
      return;
    }
    const updated = activeRppList.filter((_, i) => i !== index);
    onRppRowsUpdated(updated);
  };

  const kejuruanSamples = MAJOR_SAMPLES.filter((s) => s.kategoriMapel === 'kejuruan' && !s.id.startsWith('blank'));
  const umumSamples = MAJOR_SAMPLES.filter((s) => s.kategoriMapel === 'umum' && !s.id.startsWith('blank'));
  const blankSamples = MAJOR_SAMPLES.filter((s) => s.id.startsWith('blank'));

  return (
    <section className="bg-[#FFFDF7] p-5 sm:p-6 neo-box mb-6 no-print">
      {/* Header and Download Options */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b-2 border-black">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 border border-black inline-block"></span>
            <h2 className="font-display font-black text-xl text-neutral-900 tracking-tight">
              Langkah 1: Unggah Data Excel (Format CP atau Format RPP Terintegrasi)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Mendukung 2 format spreadsheet terpisah untuk SMK Muhammadiyah Bawang: <strong>Format CP Dasar</strong> dan <strong>Format RPP Terintegrasi Lengkap</strong>.
          </p>
        </div>

        {/* Status Mode Badge */}
        <div className="flex items-center gap-2">
          {currentMode === 'rpp' ? (
            <span className="px-3 py-1 bg-emerald-100 border-2 border-emerald-800 text-emerald-950 text-xs font-black rounded-lg flex items-center gap-1.5 shadow-[2px_2px_0px_#065f46]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Mode RPP Terintegrasi Aktif</span>
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-100 border-2 border-amber-800 text-amber-950 text-xs font-black rounded-lg flex items-center gap-1.5 shadow-[2px_2px_0px_#92400e]">
              <Layers className="w-3.5 h-3.5 text-amber-700" />
              <span>Mode CP & ATP Otomatis Aktif</span>
            </span>
          )}
        </div>
      </div>

      {/* 2 Format Excel Cards & Download Zone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Card 1: Format Excel CP */}
        <div className="p-4 bg-amber-50/70 border-2 border-black rounded-2xl flex flex-col justify-between shadow-[3px_3px_0px_#000]">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-amber-950 bg-amber-200 border border-black px-2 py-0.5 rounded-md">
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-800" />
                <span>Format 1: Excel CP (Capaian Pembelajaran)</span>
              </span>
              <span className="text-[10px] font-bold text-neutral-500">Ringkas & Otomatis</span>
            </div>
            <p className="text-xs text-neutral-700 mt-2 leading-relaxed">
              Format ringkas bagi guru untuk menginput <strong>Elemen, CP, Lingkup Materi, dan JP</strong>. Sistem otomatis menyusun matriks ATP dan modul RPP terpisah secara terstandar.
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-black/10 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black text-neutral-700 w-full sm:w-auto">Unduh Template CP:</span>
            <button
              onClick={() => downloadCpExcelTemplate('kejuruan')}
              className="neo-btn px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-black text-[11px] font-bold rounded-md flex items-center gap-1"
              title="Unduh Template CP Mapel Kejuruan (AKL/TSM)"
            >
              <Download className="w-3 h-3 text-amber-900" />
              <span>Kejuruan (.xlsx)</span>
            </button>
            <button
              onClick={() => downloadCpExcelTemplate('umum')}
              className="neo-btn px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-black text-[11px] font-bold rounded-md flex items-center gap-1"
              title="Unduh Template CP Mapel Umum / Normatif-Adaptif"
            >
              <Download className="w-3 h-3 text-blue-900" />
              <span>Mapel Umum (.xlsx)</span>
            </button>
            <button
              onClick={() => downloadCpExcelTemplate('blank')}
              className="neo-btn px-2.5 py-1 bg-white hover:bg-neutral-100 text-black text-[11px] font-bold rounded-md border border-black flex items-center gap-1"
              title="Unduh Template CP Format Kosong"
            >
              <FilePlus2 className="w-3 h-3 text-neutral-700" />
              <span>Kosong (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Card 2: Format Excel RPP Terintegrasi */}
        <div className="p-4 bg-emerald-50/70 border-2 border-black rounded-2xl flex flex-col justify-between shadow-[3px_3px_0px_#000]">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-emerald-950 bg-emerald-200 border border-black px-2 py-0.5 rounded-md">
                <BookCheck className="w-3.5 h-3.5 text-emerald-800" />
                <span>Format 2: Excel RPP Terintegrasi (Semua Kolom)</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-400">
                Paling Lengkap & Presisi
              </span>
            </div>
            <p className="text-xs text-neutral-700 mt-2 leading-relaxed">
              Format komprehensif mencakup semua kolom: <strong>CP, ATP/TP, Materi, Metode (PBL/PjBL), Kesiapan, Sintaks Pembelajaran (Awal, Inti, Penutup), dan Asesmen (Awal, Formatif, Sumatif)</strong>. Dokumen langsung berubah terintegrasi penuh!
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-black/10 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black text-neutral-700 w-full sm:w-auto">Unduh Template RPP:</span>
            <button
              onClick={() => downloadRppExcelTemplate('kejuruan')}
              className="neo-btn px-2.5 py-1 bg-emerald-300 hover:bg-emerald-400 text-black text-[11px] font-black rounded-md flex items-center gap-1"
              title="Unduh Template RPP Lengkap Kejuruan (AKL / TSM)"
            >
              <Download className="w-3 h-3 text-emerald-950" />
              <span>RPP Kejuruan (.xlsx)</span>
            </button>
            <button
              onClick={() => downloadRppExcelTemplate('umum')}
              className="neo-btn px-2.5 py-1 bg-blue-200 hover:bg-blue-300 text-black text-[11px] font-bold rounded-md flex items-center gap-1"
              title="Unduh Template RPP Lengkap Mapel Umum"
            >
              <Download className="w-3 h-3 text-blue-900" />
              <span>RPP Umum (.xlsx)</span>
            </button>
            <button
              onClick={() => downloadRppExcelTemplate('blank')}
              className="neo-btn px-2.5 py-1 bg-white hover:bg-neutral-100 text-black text-[11px] font-bold rounded-md border border-black flex items-center gap-1"
              title="Unduh Template RPP Format Kosong Semua Kolom"
            >
              <FilePlus2 className="w-3 h-3 text-neutral-700" />
              <span>RPP Kosong (.xlsx)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Picks: AKL, TSM, Bahasa Inggris */}
      <div className="my-4 space-y-4">
        <div className="p-3 bg-gradient-to-r from-amber-100 via-orange-50 to-blue-50 border-2 border-black rounded-xl">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 border border-black"></span>
            <span>⭐ Pilihan Awal Dokumen Utama (AKL, TSM, Bahasa Inggris):</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* AKL */}
            {(() => {
              const akl = kejuruanSamples.find((s) => s.id === 'akl') || kejuruanSamples[0];
              const isSelected = akl.mataPelajaran === currentSubject;
              return (
                <button
                  key={akl.id}
                  onClick={() => onSelectSample(akl)}
                  className={`neo-btn p-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-amber-300 border-2 border-black shadow-[3px_3px_0px_#000]'
                      : 'bg-white hover:bg-amber-50 border-2 border-black/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-neutral-950">
                      📊 Akuntansi (AKL)
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-neutral-700 font-semibold mt-0.5 line-clamp-1">
                    {akl.mataPelajaran}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-[9px] font-bold text-neutral-500">
                    <span className="bg-amber-200 border border-black/30 px-1 rounded">Kejuruan</span>
                    <span>Fase {akl.fase} / XI</span>
                    <span>·</span>
                    <span>{akl.rows.length} Unit RPP</span>
                  </div>
                </button>
              );
            })()}

            {/* TSM */}
            {(() => {
              const tsm = kejuruanSamples.find((s) => s.id === 'tsm') || kejuruanSamples[1];
              const isSelected = tsm.mataPelajaran === currentSubject;
              return (
                <button
                  key={tsm.id}
                  onClick={() => onSelectSample(tsm)}
                  className={`neo-btn p-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-amber-300 border-2 border-black shadow-[3px_3px_0px_#000]'
                      : 'bg-white hover:bg-amber-50 border-2 border-black/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-neutral-950">
                      🏍️ Sepeda Motor (TSM)
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-neutral-700 font-semibold mt-0.5 line-clamp-1">
                    {tsm.mataPelajaran}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-[9px] font-bold text-neutral-500">
                    <span className="bg-amber-200 border border-black/30 px-1 rounded">Kejuruan</span>
                    <span>Fase {tsm.fase} / XI</span>
                    <span>·</span>
                    <span>{tsm.rows.length} Unit RPP</span>
                  </div>
                </button>
              );
            })()}

            {/* Bahasa Inggris */}
            {(() => {
              const bing = umumSamples.find((s) => s.id === 'bahasa-inggris') || umumSamples[0];
              const isSelected = bing.mataPelajaran === currentSubject;
              return (
                <button
                  key={bing.id}
                  onClick={() => onSelectSample(bing)}
                  className={`neo-btn p-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-blue-200 border-2 border-black shadow-[3px_3px_0px_#000]'
                      : 'bg-white hover:bg-blue-50 border-2 border-black/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-neutral-950">
                      🇬🇧 Bahasa Inggris (Vocational)
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-neutral-700 font-semibold mt-0.5 line-clamp-1">
                    {bing.mataPelajaran} (Workplace English)
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-[9px] font-bold text-neutral-500">
                    <span className="bg-blue-100 border border-black/30 px-1 rounded">Normatif-Adaptif</span>
                    <span>Fase {bing.fase} / XI</span>
                    <span>·</span>
                    <span>{bing.rows.length} Unit RPP</span>
                  </div>
                </button>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Drag & Drop File Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-emerald-600 bg-emerald-50 scale-[1.01]'
            : 'border-neutral-400 bg-amber-50/30 hover:bg-amber-50/70 hover:border-black'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls, .csv"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileChange(e.target.files[0]);
            }
          }}
        />

        <div className="w-11 h-11 rounded-xl bg-amber-400 border-2 border-black flex items-center justify-center mx-auto mb-2 shadow-[2px_2px_0px_#000]">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <UploadCloud className="w-6 h-6 text-black" />
          )}
        </div>

        <h3 className="font-display font-bold text-sm text-neutral-900">
          Klik atau Seret File Excel (.xlsx / .xls) ke Sini
        </h3>
        <p className="text-[11px] text-neutral-600 mt-1 max-w-lg mx-auto">
          Sistem otomatis mendeteksi apakah file Anda berupa <strong>Format CP</strong> atau <strong>Format RPP Terintegrasi (Semua Kolom)</strong>.
        </p>
      </div>

      {/* Uploaded Feedback Badge */}
      {lastUploadedType && (
        <div className="mt-3 p-3 bg-emerald-50 border-2 border-emerald-900 rounded-xl text-xs text-emerald-950 flex items-center justify-between gap-2 shadow-[2px_2px_0px_#065f46]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              {lastUploadedType === 'rpp' ? (
                <>
                  <strong>Format Excel RPP Terintegrasi Terdeteksi!</strong> Seluruh kolom (CP, ATP, Materi, Metode, Sintaks Pembelajaran, dan Asesmen) telah disinkronkan langsung ke lembar dokumen F4.
                </>
              ) : (
                <>
                  <strong>Format Excel CP Terdeteksi!</strong> Data Elemen & Capaian Pembelajaran berhasil dimuat dan otomatis men-generate matriks ATP & RPP terpisah.
                </>
              )}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-white border border-emerald-800 px-2 py-0.5 rounded">
            {lastUploadedType === 'rpp' ? `${activeRppList.length} Unit RPP` : `${rawRows.length} Materi`}
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="mt-3 p-3 bg-rose-100 border-2 border-rose-900 rounded-xl text-xs text-rose-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Extracted Summary & Table Toggle */}
      <div className="mt-4 pt-3 border-t-2 border-black/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-800 text-emerald-900 text-xs font-black">
            {currentMode === 'rpp' ? `${activeRppList.length} Unit RPP Terintegrasi` : `${rawRows.length} Materi / Elemen Terload`}
          </span>
          <span className="text-xs text-neutral-600">
            Total Alokasi:{' '}
            <strong className="text-black">
              {currentMode === 'rpp'
                ? activeRppList.reduce((a, b) => a + (typeof b.jp === 'number' ? b.jp : parseInt(String(b.jp || 0), 10) || 0), 0)
                : rawRows.reduce((a, b) => a + (typeof b.jp === 'number' ? b.jp : parseInt(String(b.jp || 0), 10) || 0), 0)}{' '}
              JP
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowManualEditor(!showManualEditor)}
            className="neo-btn px-3 py-1 bg-white hover:bg-neutral-100 text-xs font-bold rounded-lg border-2 border-black text-neutral-800"
          >
            {showManualEditor ? 'Sembunyikan Editor Input Tabel' : 'Buka Editor Input Tabel (CP & RPP)'}
          </button>
        </div>
      </div>

      {/* Manual Data Table Editor with CP and RPP Tabs */}
      {showManualEditor && (
        <div className="mt-4 border-2 border-black rounded-xl overflow-hidden bg-white shadow-[3px_3px_0px_#000]">
          {/* Sub Tabs in Editor: CP Table vs Full RPP Table */}
          <div className="p-3 bg-neutral-100 border-b-2 border-black flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setEditorTab('cp')}
                className={`px-3 py-1 text-xs font-black rounded-md border border-black transition-all ${
                  editorTab === 'cp'
                    ? 'bg-amber-300 shadow-[1px_1px_0px_#000]'
                    : 'bg-white hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                1. Editor Kolom CP Dasar ({rawRows.length} Baris)
              </button>
              <button
                onClick={() => setEditorTab('rpp')}
                className={`px-3 py-1 text-xs font-black rounded-md border border-black transition-all ${
                  editorTab === 'rpp'
                    ? 'bg-emerald-300 shadow-[1px_1px_0px_#000]'
                    : 'bg-white hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                2. Editor Kolom RPP Terintegrasi ({activeRppList.length} Unit)
              </button>
            </div>

            <div>
              {editorTab === 'cp' ? (
                <button
                  onClick={handleAddCpRow}
                  className="neo-btn px-2.5 py-1 bg-amber-300 hover:bg-amber-400 text-black text-[11px] font-black rounded-md flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah Baris CP</span>
                </button>
              ) : (
                <button
                  onClick={handleAddRppRow}
                  className="neo-btn px-2.5 py-1 bg-emerald-400 hover:bg-emerald-500 text-black text-[11px] font-black rounded-md flex items-center gap-1 shadow-[1px_1px_0px_#000]"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah Unit RPP Lengkap</span>
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: CP ROWS TABLE */}
          {editorTab === 'cp' && (
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-amber-100 border-b border-black text-neutral-900 font-extrabold text-[11px]">
                    <th className="p-2 border-r border-black w-10 text-center">No</th>
                    <th className="p-2 border-r border-black w-44">Elemen</th>
                    <th className="p-2 border-r border-black">Capaian Pembelajaran (CP)</th>
                    <th className="p-2 border-r border-black w-44">Materi / Topik Unit</th>
                    <th className="p-2 border-r border-black w-16 text-center">JP</th>
                    <th className="p-2 w-12 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {rawRows.map((row, i) => (
                    <tr key={i} className="hover:bg-amber-50/50">
                      <td className="p-2 border-r border-neutral-300 text-center font-bold">{i + 1}</td>
                      <td className="p-2 border-r border-neutral-300">
                        <input
                          type="text"
                          value={row.elemen}
                          onChange={(e) => handleUpdateCpRow(i, 'elemen', e.target.value)}
                          placeholder="Contoh: Praktikum Akuntansi"
                          className="w-full px-2 py-1 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black"
                        />
                      </td>
                      <td className="p-2 border-r border-neutral-300">
                        <textarea
                          rows={2}
                          value={row.capaianPembelajaran}
                          onChange={(e) => handleUpdateCpRow(i, 'capaianPembelajaran', e.target.value)}
                          placeholder="Uraian Capaian Pembelajaran..."
                          className="w-full px-2 py-1 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black"
                        />
                      </td>
                      <td className="p-2 border-r border-neutral-300">
                        <input
                          type="text"
                          value={row.materi}
                          onChange={(e) => handleUpdateCpRow(i, 'materi', e.target.value)}
                          placeholder="Materi pokok unit ini"
                          className="w-full px-2 py-1 border border-neutral-300 rounded text-xs focus:ring-1 focus:ring-black"
                        />
                      </td>
                      <td className="p-2 border-r border-neutral-300 text-center">
                        <input
                          type="number"
                          value={row.jp}
                          onChange={(e) => handleUpdateCpRow(i, 'jp', parseInt(e.target.value, 10) || 0)}
                          className="w-14 px-1 py-1 border border-neutral-300 rounded text-xs text-center"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleDeleteCpRow(i)}
                          className="p-1 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                          title="Hapus baris ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: FULL RPP INTEGRATED ROWS TABLE (EXPANDABLE) */}
          {editorTab === 'rpp' && (
            <div className="divide-y divide-neutral-300 max-h-96 overflow-y-auto">
              {activeRppList.map((rpp, i) => {
                const isExpanded = expandedRppRow === i;
                return (
                  <div key={i} className="p-3 bg-white hover:bg-emerald-50/30 transition-colors">
                    {/* Collapsible Header Row */}
                    <div className="flex items-center justify-between gap-3 cursor-pointer" onClick={() => setExpandedRppRow(isExpanded ? null : i)}>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-200 border border-black flex items-center justify-center font-bold text-xs">
                          {i + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-black text-neutral-900">
                            Unit {i + 1}: {rpp.materi || 'Materi Belum Ditentukan'}
                          </h4>
                          <p className="text-[10px] text-neutral-500 line-clamp-1">
                            Elemen: {rpp.elemen} · {rpp.jp || 12} JP · Metode: {rpp.metodePembelajaran || 'PBL'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-emerald-100 border border-emerald-700 text-emerald-900 px-2 py-0.5 rounded font-bold">
                          {rpp.jp || 12} JP
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRppRow(i);
                          }}
                          className="p-1 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                          title="Hapus unit RPP ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-600" /> : <ChevronDown className="w-4 h-4 text-neutral-600" />}
                      </div>
                    </div>

                    {/* Detailed Fields when expanded */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {/* 1. Elemen & Materi */}
                        <div>
                          <label className="text-[10px] font-bold text-neutral-700 block mb-0.5">Elemen Capaian:</label>
                          <input
                            type="text"
                            value={rpp.elemen}
                            onChange={(e) => handleUpdateRppRow(i, 'elemen', e.target.value)}
                            className="w-full px-2 py-1 border border-neutral-300 rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-neutral-700 block mb-0.5">Lingkup Materi Pokok:</label>
                          <input
                            type="text"
                            value={rpp.materi}
                            onChange={(e) => handleUpdateRppRow(i, 'materi', e.target.value)}
                            className="w-full px-2 py-1 border border-neutral-300 rounded text-xs"
                          />
                        </div>

                        {/* 2. CP & TP */}
                        <div>
                          <label className="text-[10px] font-bold text-neutral-700 block mb-0.5">Capaian Pembelajaran (CP):</label>
                          <textarea
                            rows={2}
                            value={rpp.capaianPembelajaran}
                            onChange={(e) => handleUpdateRppRow(i, 'capaianPembelajaran', e.target.value)}
                            className="w-full px-2 py-1 border border-neutral-300 rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-neutral-700 block mb-0.5">Alur & Tujuan Pembelajaran (ATP / TP):</label>
                          <textarea
                            rows={2}
                            value={rpp.tujuanPembelajaran}
                            onChange={(e) => handleUpdateRppRow(i, 'tujuanPembelajaran', e.target.value)}
                            className="w-full px-2 py-1 border border-neutral-300 rounded text-xs"
                          />
                        </div>

                        {/* 3. Metode & Kesiapan */}
                        <div>
                          <label className="text-[10px] font-bold text-neutral-700 block mb-0.5">Metode / Model Pembelajaran:</label>
                          <input
                            type="text"
                            value={rpp.metodePembelajaran || ''}
                            onChange={(e) => handleUpdateRppRow(i, 'metodePembelajaran', e.target.value)}
                            placeholder="Problem-Based Learning (PBL) / PjBL"
                            className="w-full px-2 py-1 border border-neutral-300 rounded text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-neutral-700 block mb-0.5">Profil Lulusan / P5:</label>
                          <input
                            type="text"
                            value={rpp.profilLulusan || ''}
                            onChange={(e) => handleUpdateRppRow(i, 'profilLulusan', e.target.value)}
                            placeholder="Bernalar Kritis, Kreativitas, Kolaborasi"
                            className="w-full px-2 py-1 border border-neutral-300 rounded text-xs"
                          />
                        </div>

                        {/* 4. Sintaks Pembelajaran */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-2 p-2.5 bg-amber-50/60 rounded-xl border border-amber-300">
                          <div>
                            <label className="text-[10px] font-black text-amber-950 block mb-0.5">
                              Sintaks Awal (Mindful):
                            </label>
                            <textarea
                              rows={2}
                              value={rpp.sintaksPendahuluan || ''}
                              onChange={(e) => handleUpdateRppRow(i, 'sintaksPendahuluan', e.target.value)}
                              placeholder="Doa, apersepsi, pemantik nalar kritis..."
                              className="w-full px-2 py-1 border border-neutral-300 rounded text-[11px]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-amber-950 block mb-0.5">
                              Sintaks Inti (Meaningful & Joyful):
                            </label>
                            <textarea
                              rows={2}
                              value={rpp.sintaksInti1 || ''}
                              onChange={(e) => handleUpdateRppRow(i, 'sintaksInti1', e.target.value)}
                              placeholder="Eksplorasi data, unjuk kerja, praktik kolaboratif..."
                              className="w-full px-2 py-1 border border-neutral-300 rounded text-[11px]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-amber-950 block mb-0.5">
                              Sintaks Penutup (Refleksi 3-2-1):
                            </label>
                            <textarea
                              rows={2}
                              value={rpp.sintaksPenutup || ''}
                              onChange={(e) => handleUpdateRppRow(i, 'sintaksPenutup', e.target.value)}
                              placeholder="Refleksi 3-2-1, Kaizen, kesimpulan..."
                              className="w-full px-2 py-1 border border-neutral-300 rounded text-[11px]"
                            />
                          </div>
                        </div>

                        {/* 5. Asesmen */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-2 p-2.5 bg-blue-50/60 rounded-xl border border-blue-300">
                          <div>
                            <label className="text-[10px] font-black text-blue-950 block mb-0.5">
                              Asesmen Awal (Diagnostik):
                            </label>
                            <input
                              type="text"
                              value={rpp.asesmenAwal || ''}
                              onChange={(e) => handleUpdateRppRow(i, 'asesmenAwal', e.target.value)}
                              placeholder="Kuis tanya jawab kesiapan..."
                              className="w-full px-2 py-1 border border-neutral-300 rounded text-[11px]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-blue-950 block mb-0.5">
                              Asesmen Proses (Formatif):
                            </label>
                            <input
                              type="text"
                              value={rpp.asesmenProses || ''}
                              onChange={(e) => handleUpdateRppRow(i, 'asesmenProses', e.target.value)}
                              placeholder="Observasi diskusi & unjuk kerja..."
                              className="w-full px-2 py-1 border border-neutral-300 rounded text-[11px]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-blue-950 block mb-0.5">
                              Asesmen Akhir (Sumatif):
                            </label>
                            <input
                              type="text"
                              value={rpp.asesmenAkhir || ''}
                              onChange={(e) => handleUpdateRppRow(i, 'asesmenAkhir', e.target.value)}
                              placeholder="Job sheet LKPD & uji kompetensi..."
                              className="w-full px-2 py-1 border border-neutral-300 rounded text-[11px]"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
