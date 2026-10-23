import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  DEFAULT_SCHOOL_IDENTITY,
  MAJOR_SAMPLES,
  MajorSample,
} from './utils/sampleData';
import {
  ExcelRawRow,
  ExcelRppRawRow,
  ParsedExcelResult,
  SchoolIdentity,
  ModulAjarData,
  GeneratedPerangkatAjar,
} from './types';
import {
  generatePerangkatAjar,
  generatePerangkatAjarFromRpp,
} from './utils/atpAndModulGenerator';
import {
  downloadCpExcelTemplate,
  downloadRppExcelTemplate,
  exportAtpToExcel,
  exportRppToExcel,
} from './utils/excelParser';
import { HeaderNav } from './components/HeaderNav';
import { ExcelUploadZone } from './components/ExcelUploadZone';
import { DocumentTabs } from './components/DocumentTabs';
import { PrintableDocument } from './components/PrintableDocument';
import { SchoolIdentityModal } from './components/SchoolIdentityModal';
import { GuidelineModal } from './components/GuidelineModal';
import { AiRefineModal } from './components/AiRefineModal';
import { RppTableEditorModal } from './components/RppTableEditorModal';
import { ExcelGuideAndAiPromptModal } from './components/ExcelGuideAndAiPromptModal';
import { Check, Layers, Table, FileText, Compass, Code2, Save, RotateCcw } from 'lucide-react';
import { loadStored, saveStored, clearAllStored, getStoredSizeKb } from './utils/persistence';

type DataMode = 'cp' | 'rpp';
type DocumentMode = 'atp_only' | 'modul_selected' | 'lampiran_selected' | 'modul_all' | 'both_separate';

const DOCUMENT_MODES: DocumentMode[] = ['atp_only', 'modul_selected', 'lampiran_selected', 'modul_all', 'both_separate'];

/** Bentuk data yang disimpan di browser (lihat utils/persistence.ts). */
interface StoredRows {
  rawRows: ExcelRawRow[];
  rppRows?: ExcelRppRawRow[];
  mode: DataMode;
}

interface StoredUi {
  documentMode: DocumentMode;
  selectedModulIndex: number;
  watermarkOpacity: number;
}

function isPerangkatValid(p: unknown): p is GeneratedPerangkatAjar {
  const x = p as GeneratedPerangkatAjar | null;
  return !!x && Array.isArray(x.atpList) && Array.isArray(x.modulAjarList) && x.modulAjarList.length > 0;
}

/** Data awal bawaan aplikasi (dipakai saat belum ada data tersimpan, atau saat reset). */
function buildDefaultState() {
  const defaultRppRows = MAJOR_SAMPLES[0].rppRows;
  return {
    identity: DEFAULT_SCHOOL_IDENTITY,
    rawRows: MAJOR_SAMPLES[0].rows,
    rppRows: defaultRppRows,
    mode: (defaultRppRows ? 'rpp' : 'cp') as DataMode,
    customPerangkat: defaultRppRows
      ? generatePerangkatAjarFromRpp(defaultRppRows, DEFAULT_SCHOOL_IDENTITY)
      : null,
    customModulAjar: null as ModulAjarData | null,
    documentMode: 'atp_only' as DocumentMode,
    selectedModulIndex: 0,
    watermarkOpacity: 0.5,
  };
}

/**
 * Membaca data editan yang tersimpan di browser. Setiap bagian divalidasi; bagian yang rusak
 * atau tidak ada diganti data awal sehingga aplikasi tidak pernah gagal dibuka karena data lama.
 */
function readInitialState() {
  const fallback = buildDefaultState();
  try {
    const storedIdentity = loadStored<SchoolIdentity>('identity');
    const identity: SchoolIdentity =
      storedIdentity && typeof storedIdentity === 'object'
        ? { ...DEFAULT_SCHOOL_IDENTITY, ...storedIdentity }
        : DEFAULT_SCHOOL_IDENTITY;

    const storedRows = loadStored<StoredRows>('rows');
    const hasRows = !!storedRows && Array.isArray(storedRows.rawRows);

    const ui = loadStored<StoredUi>('ui');
    const uiState = {
      documentMode:
        ui && DOCUMENT_MODES.includes(ui.documentMode) ? ui.documentMode : fallback.documentMode,
      selectedModulIndex:
        ui && Number.isInteger(ui.selectedModulIndex) && ui.selectedModulIndex >= 0
          ? ui.selectedModulIndex
          : fallback.selectedModulIndex,
      watermarkOpacity:
        ui && typeof ui.watermarkOpacity === 'number' && ui.watermarkOpacity >= 0 && ui.watermarkOpacity <= 1
          ? ui.watermarkOpacity
          : fallback.watermarkOpacity,
    };

    if (!hasRows) {
      // Belum ada data tabel tersimpan: pakai data awal, tetapi tetap hormati identitas & tampilan tersimpan
      return {
        ...fallback,
        identity,
        customPerangkat: fallback.rppRows
          ? generatePerangkatAjarFromRpp(fallback.rppRows, identity)
          : null,
        ...uiState,
      };
    }

    const rppRows =
      Array.isArray(storedRows.rppRows) && storedRows.rppRows.length > 0 ? storedRows.rppRows : undefined;
    const mode: DataMode = storedRows.mode === 'cp' || !rppRows ? 'cp' : 'rpp';

    let customPerangkat: GeneratedPerangkatAjar | null = null;
    const storedPerangkat = loadStored<GeneratedPerangkatAjar>('perangkat');
    if (isPerangkatValid(storedPerangkat)) {
      customPerangkat = storedPerangkat;
    } else if (mode === 'rpp' && rppRows) {
      // Hasil editan tidak tersedia: susun ulang dari tabel RPP yang tersimpan
      customPerangkat = generatePerangkatAjarFromRpp(rppRows, identity);
    }

    const storedModul = loadStored<ModulAjarData>('modul');
    const customModulAjar =
      storedModul && typeof storedModul === 'object' && customPerangkat ? storedModul : null;

    return {
      identity,
      rawRows: storedRows.rawRows,
      rppRows,
      mode,
      customPerangkat,
      customModulAjar,
      ...uiState,
    };
  } catch {
    return fallback;
  }
}

export default function App() {
  // Data awal dibaca sekali dari penyimpanan browser (localStorage), sehingga hasil editan tetap ada setelah refresh
  const [initial] = useState(readInitialState);

  const [identity, setIdentity] = useState<SchoolIdentity>(initial.identity);
  const [rawRows, setRawRows] = useState<ExcelRawRow[]>(initial.rawRows);
  const [rppRows, setRppRows] = useState<ExcelRppRawRow[] | undefined>(initial.rppRows);
  const [currentDataMode, setCurrentDataMode] = useState<DataMode>(initial.mode);
  
  // Custom generated package when RPP format or specific edits are loaded
  const [customPerangkat, setCustomPerangkat] = useState<GeneratedPerangkatAjar | null>(initial.customPerangkat);

  const [customModulAjar, setCustomModulAjar] = useState<ModulAjarData | null>(initial.customModulAjar);

  // Document separation modes:
  // - 'atp_only': Dokumen ATP saja (terpisah)
  // - 'modul_selected': Dokumen Modul Ajar terpilih (dipilah per materi)
  // - 'lampiran_selected': Dokumen Lampiran & LKPD terpilih
  // - 'modul_all': Semua Modul Ajar terpisah berurutan
  // - 'both_separate': Keduanya dengan pemisah halaman
  const [documentMode, setDocumentMode] = useState<DocumentMode>(initial.documentMode);
  const [selectedModulIndex, setSelectedModulIndex] = useState<number>(initial.selectedModulIndex);
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(initial.watermarkOpacity);

  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  const [isGuidelineModalOpen, setIsGuidelineModalOpen] = useState(false);
  const [isAiRefineModalOpen, setIsAiRefineModalOpen] = useState(false);
  const [isRppEditorOpen, setIsRppEditorOpen] = useState(false);
  const [isExcelGuideModalOpen, setIsExcelGuideModalOpen] = useState(false);
  const [rppEditorInitialTab, setRppEditorInitialTab] = useState<'desain' | 'sintaks' | 'eksplorasi' | 'asesmen' | 'lampiran'>('sintaks');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // ---------------------------------------------------------------------------
  // Penyimpanan otomatis ke browser (localStorage)
  // ---------------------------------------------------------------------------
  const [storageStatus, setStorageStatus] = useState<'ok' | 'quota' | 'unavailable' | 'error'>('ok');
  const [savedKb, setSavedKb] = useState<number>(() => getStoredSizeKb());
  const storageWarnedRef = useRef(false);

  // Selalu menunjuk ke kondisi data terbaru, agar penyimpanan saat menutup/refresh halaman tidak memakai data lama
  const snapshotRef = useRef({
    identity,
    rawRows,
    rppRows,
    currentDataMode,
    customPerangkat,
    customModulAjar,
    documentMode,
    selectedModulIndex,
    watermarkOpacity,
  });
  snapshotRef.current = {
    identity,
    rawRows,
    rppRows,
    currentDataMode,
    customPerangkat,
    customModulAjar,
    documentMode,
    selectedModulIndex,
    watermarkOpacity,
  };

  const persistNow = useCallback(() => {
    const snap = snapshotRef.current;
    const results = [
      saveStored('identity', snap.identity),
      saveStored<StoredRows>('rows', {
        rawRows: snap.rawRows,
        rppRows: snap.rppRows,
        mode: snap.currentDataMode,
      }),
      saveStored('perangkat', snap.customPerangkat),
      saveStored('modul', snap.customModulAjar),
      saveStored<StoredUi>('ui', {
        documentMode: snap.documentMode,
        selectedModulIndex: snap.selectedModulIndex,
        watermarkOpacity: snap.watermarkOpacity,
      }),
    ];

    const failure = results.find((r) => !r.ok);
    if (failure && !failure.ok) {
      setStorageStatus(failure.reason);
      if (!storageWarnedRef.current) {
        storageWarnedRef.current = true;
        showNotification(
          failure.reason === 'quota'
            ? '⚠️ Data terlalu besar untuk disimpan otomatis di browser. Gunakan Ekspor Excel agar hasil editan tidak hilang.'
            : failure.reason === 'unavailable'
              ? '⚠️ Penyimpanan browser tidak tersedia (mode privat atau diblokir). Hasil editan akan hilang saat refresh, gunakan Ekspor Excel.'
              : '⚠️ Gagal menyimpan otomatis di browser. Gunakan Ekspor Excel agar hasil editan tidak hilang.'
        );
      }
    } else {
      storageWarnedRef.current = false;
      setStorageStatus('ok');
      setSavedKb(getStoredSizeKb());
    }
  }, []);

  // Simpan setiap ada perubahan data (ditunda sebentar agar tidak menulis berulang saat mengetik/menggeser slider)
  useEffect(() => {
    const timer = window.setTimeout(persistNow, 500);
    return () => window.clearTimeout(timer);
  }, [
    identity,
    rawRows,
    rppRows,
    currentDataMode,
    customPerangkat,
    customModulAjar,
    documentMode,
    selectedModulIndex,
    watermarkOpacity,
    persistNow,
  ]);

  // Simpan seketika saat halaman di-refresh, ditutup, atau tab disembunyikan, supaya perubahan terakhir tidak hilang
  useEffect(() => {
    const flush = () => persistNow();
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') persistNow();
    };
    window.addEventListener('pagehide', flush);
    window.addEventListener('beforeunload', flush);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', flush);
      window.removeEventListener('beforeunload', flush);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [persistNow]);

  // Hapus data tersimpan dan kembali ke data awal aplikasi
  const handleResetStoredData = () => {
    const confirmed = window.confirm(
      'Hapus semua hasil editan yang tersimpan di browser dan kembali ke data awal?\n\nTindakan ini tidak dapat dibatalkan. Ekspor ke Excel terlebih dahulu jika data masih diperlukan.'
    );
    if (!confirmed) return;
    clearAllStored();
    const fresh = buildDefaultState();
    setIdentity(fresh.identity);
    setRawRows(fresh.rawRows);
    setRppRows(fresh.rppRows);
    setCurrentDataMode(fresh.mode);
    setCustomPerangkat(fresh.customPerangkat);
    setCustomModulAjar(fresh.customModulAjar);
    setDocumentMode(fresh.documentMode);
    setSelectedModulIndex(fresh.selectedModulIndex);
    setWatermarkOpacity(fresh.watermarkOpacity);
    showNotification('Data tersimpan dihapus. Aplikasi kembali ke data awal.');
  };

  // Base generation from rows & identity
  const activePerangkat = useMemo(() => {
    if (customPerangkat) {
      return customPerangkat;
    }
    return generatePerangkatAjar(rawRows, identity);
  }, [customPerangkat, rawRows, identity]);

  const currentAtpList = activePerangkat.atpList;
  const currentModulAjarList = activePerangkat.modulAjarList;

  // Active Modul Ajar for the selected index
  const safeModulIndex = Math.min(selectedModulIndex, Math.max(0, currentModulAjarList.length - 1));
  const activeModulAjar = customModulAjar || currentModulAjarList[safeModulIndex] || currentModulAjarList[0];

  // Handle uploaded result from Excel file (either CP or RPP format)
  const handleExcelUploaded = (result: ParsedExcelResult) => {
    const updatedIdentity: SchoolIdentity = {
      ...identity,
      mataPelajaran: result.detectedSubject || identity.mataPelajaran,
      kelas: result.detectedClass || identity.kelas,
      fase: result.detectedPhase || identity.fase,
      kategoriMapel: result.detectedCategory || identity.kategoriMapel,
    };
    setIdentity(updatedIdentity);
    setRawRows(result.cpRows);
    setCustomModulAjar(null);
    setSelectedModulIndex(0);

    if (result.fileType === 'rpp' && result.rppRows && result.rppRows.length > 0) {
      setRppRows(result.rppRows);
      setCurrentDataMode('rpp');
      const gen = generatePerangkatAjarFromRpp(result.rppRows, updatedIdentity);
      setCustomPerangkat(gen);
      showNotification(
        `✨ Berhasil memproses Format Excel RPP Terintegrasi (${result.rppRows.length} Unit). Semua kolom CP, ATP, Metode, Sintaks Pembelajaran, dan Asesmen terhubung langsung!`
      );
    } else {
      setRppRows(undefined);
      setCurrentDataMode('cp');
      setCustomPerangkat(null);
      showNotification(
        `✨ Berhasil memproses Format Excel CP (${result.cpRows.length} Baris). Matriks ATP dan draf RPP Deep Learning telah dibuat otomatis.`
      );
    }
  };

  // Handle manual edits to CP rows
  const handleRawRowsUpdated = (newRows: ExcelRawRow[]) => {
    setRawRows(newRows);
    setCustomPerangkat(null);
    setCurrentDataMode('cp');
    setCustomModulAjar(null);
    showNotification(`Tabel CP diperbarui (${newRows.length} baris). Matriks ATP dan RPP disinkronkan ulang.`);
  };

  // Handle manual edits to integrated RPP rows
  const handleRppRowsUpdated = (newRppRows: ExcelRppRawRow[]) => {
    setRppRows(newRppRows);
    const gen = generatePerangkatAjarFromRpp(newRppRows, identity);
    setCustomPerangkat(gen);
    setCurrentDataMode('rpp');
    setCustomModulAjar(null);
    showNotification(`Tabel RPP Terintegrasi diperbarui (${newRppRows.length} unit). Seluruh dokumen langsung berubah.`);
  };

  // Handle selecting a sample major
  const handleSelectSample = (sample: MajorSample) => {
    const updatedIdentity: SchoolIdentity = {
      ...identity,
      kategoriMapel: sample.kategoriMapel,
      programKeahlian: sample.programKeahlian,
      konsentrasiKeahlian: sample.konsentrasiKeahlian,
      mataPelajaran: sample.mataPelajaran,
      fase: sample.fase,
      kelas: sample.kelas,
      semester: sample.semester,
    };

    setIdentity(updatedIdentity);
    setRawRows(sample.rows);
    setCustomModulAjar(null);
    setSelectedModulIndex(0);

    if (sample.rppRows && sample.rppRows.length > 0) {
      setRppRows(sample.rppRows);
      setCurrentDataMode('rpp');
      const gen = generatePerangkatAjarFromRpp(sample.rppRows, updatedIdentity);
      setCustomPerangkat(gen);
      showNotification(`Memuat data ${sample.name} dalam Format RPP Terintegrasi.`);
    } else {
      setRppRows(undefined);
      setCurrentDataMode('cp');
      setCustomPerangkat(null);
      showNotification(`Memuat data ${sample.name} dalam Format ATP (Alur Tujuan Pembelajaran).`);
    }
  };

  // Handle identity update
  const handleSaveIdentity = (updated: SchoolIdentity) => {
    setIdentity(updated);
    if (customPerangkat && rppRows) {
      const regenerated = generatePerangkatAjarFromRpp(rppRows, updated);
      setCustomPerangkat(regenerated);
    }
    if (customModulAjar) {
      setCustomModulAjar({
        ...customModulAjar,
        identity: updated,
      });
    }
    showNotification('Identitas satuan pendidikan dan guru pengampu berhasil disimpan.');
  };

  // Handle AI enrichment applied
  const handleApplyEnrichment = (enriched: ModulAjarData) => {
    setCustomModulAjar(enriched);
    showNotification(`Pengayaan Deep Learning berhasil diterapkan pada Modul: ${enriched.judulMateri}.`);
  };

  // Downloads
  const handleDownloadCpTemplate = (type?: 'kejuruan' | 'umum' | 'blank') => {
    downloadCpExcelTemplate(type || (identity.kategoriMapel === 'umum' ? 'umum' : 'kejuruan'));
    showNotification('Template Excel CP resmi SMK Muhammadiyah Bawang berhasil diunduh.');
  };

  const handleDownloadRppTemplate = (type?: 'kejuruan' | 'umum' | 'blank') => {
    downloadRppExcelTemplate(type || (identity.kategoriMapel === 'umum' ? 'umum' : 'kejuruan'));
    showNotification('Template Excel RPP Terintegrasi (Semua Kolom) berhasil diunduh.');
  };

  // Exports
  const handleExportAtp = () => {
    exportAtpToExcel(currentAtpList, identity);
    showNotification('Matriks spreadsheet ATP berhasil diekspor (.xlsx).');
  };

  const handleExportRpp = () => {
    exportRppToExcel(currentModulAjarList, identity);
    showNotification('Seluruh unit RPP Deep Learning berhasil diekspor ke spreadsheet Excel terintegrasi (.xlsx).');
  };

  // Table & Syntax Editor Handlers
  const handleOpenRppEditor = (initialTab: 'desain' | 'sintaks' | 'eksplorasi' | 'asesmen' | 'lampiran' = 'sintaks') => {
    setRppEditorInitialTab(initialTab);
    setIsRppEditorOpen(true);
  };

  const handleSaveModulFromEditor = (updatedModul: ModulAjarData, index: number) => {
    const newModulList = [...currentModulAjarList];
    newModulList[index] = updatedModul;
    setCustomPerangkat({
      identity,
      atpList: currentAtpList,
      modulAjarList: newModulList,
      createdAt: new Date().toISOString(),
    });
    setCustomModulAjar(null);
    showNotification(`💾 Perubahan RPP & Lampiran Unit ${index + 1} berhasil disimpan dan diterapkan.`);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-neutral-900 flex flex-col font-sans">
      {/* Top Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white border-2 border-black px-4 py-2.5 rounded-xl shadow-[4px_4px_0px_#000] text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom duration-200 no-print">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation Header */}
      <HeaderNav
        identity={identity}
        onOpenIdentityModal={() => setIsIdentityModalOpen(true)}
        onOpenAiRefineModal={() => setIsAiRefineModalOpen(true)}
        onOpenGuidelineModal={() => setIsGuidelineModalOpen(true)}
        onDownloadCpTemplate={handleDownloadCpTemplate}
        onDownloadRppTemplate={handleDownloadRppTemplate}
        onExportAtp={handleExportAtp}
        onExportRpp={handleExportRpp}
        documentMode={documentMode}
        setDocumentMode={setDocumentMode}
        onOpenRppEditor={() => handleOpenRppEditor('sintaks')}
        onOpenExcelGuideModal={() => setIsExcelGuideModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Banner Quick Info & Fast Mode Switcher */}
        <div className="bg-amber-300 border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
              <Layers className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="font-display font-black text-base sm:text-lg text-black leading-tight">
                Generator Dokumen Terpisah: ATP & RPP Per Materi (Deep Learning)
              </h2>
              <p className="text-xs text-neutral-900 font-medium mt-0.5">
                Dokumen ATP dan RPP dibuat <strong>terpisah</strong> per unit materi. Format ramah cetak <strong>Landscape F4 (330 × 215 mm)</strong> dengan layout titik dua sejajar rapi dan tanda tangan pengesahan di bawah dokumen.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
            <span
              className={`px-2.5 py-1.5 border-2 border-black rounded-lg text-[11px] font-bold flex items-center gap-1.5 ${
                storageStatus === 'ok' ? 'bg-emerald-200 text-black' : 'bg-red-200 text-black'
              }`}
              title={
                storageStatus === 'ok'
                  ? 'Hasil editan disimpan otomatis di browser ini dan tetap ada setelah refresh.'
                  : 'Penyimpanan otomatis di browser bermasalah. Gunakan Ekspor Excel untuk mengamankan data.'
              }
            >
              <Save className="w-3.5 h-3.5" />
              <span>
                {storageStatus === 'ok'
                  ? `Tersimpan otomatis di browser · ${savedKb} KB`
                  : 'Penyimpanan browser bermasalah'}
              </span>
            </span>

            <button
              onClick={handleResetStoredData}
              className="neo-btn px-3 py-1.5 bg-white hover:bg-red-50 text-black text-xs font-bold rounded-lg flex items-center gap-1.5"
              title="Hapus data tersimpan dan kembali ke data awal"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-700" />
              <span>Reset Data</span>
            </button>

            <button
              onClick={() => {
                setDocumentMode('atp_only');
                setTimeout(() => window.print(), 250);
              }}
              className="neo-btn px-3 py-1.5 bg-white hover:bg-neutral-50 text-black text-xs font-bold rounded-lg flex items-center gap-1.5"
            >
              <Table className="w-3.5 h-3.5 text-emerald-700" />
              <span>Cetak ATP Saja (F4)</span>
            </button>

            <button
              onClick={() => {
                setDocumentMode('modul_selected');
                setTimeout(() => window.print(), 250);
              }}
              className="neo-btn px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-300 text-xs font-black rounded-lg flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Cetak RPP Unit {safeModulIndex + 1} (F4)</span>
            </button>
          </div>
        </div>

        {/* Step 1: Upload / Input Zone (Supports both CP and RPP Excel formats) */}
        <ExcelUploadZone
          rawRows={rawRows}
          rppRows={rppRows}
          currentMode={currentDataMode}
          onExcelUploaded={handleExcelUploaded}
          onRawRowsUpdated={handleRawRowsUpdated}
          onRppRowsUpdated={handleRppRowsUpdated}
          onSelectSample={handleSelectSample}
          currentSubject={identity.mataPelajaran}
          onOpenExcelGuideModal={() => setIsExcelGuideModalOpen(true)}
        />

        {/* Step 2: Document View Tabs & Material Selector */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3 no-print">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 border border-black inline-block"></span>
              <h3 className="font-display font-black text-lg text-neutral-900">
                Langkah 2: Tinjau & Cetak Dokumen Terpisah (Format Landscape F4)
              </h3>
            </div>
            <div className="text-xs text-neutral-600 font-medium hidden sm:flex items-center gap-2">
              <span className="bg-amber-100 border border-black px-2 py-0.5 rounded font-mono font-bold">
                {identity.mataPelajaran}
              </span>
              <span>·</span>
              <span>{currentModulAjarList.length} Unit RPP Tersedia</span>
            </div>
          </div>

          <DocumentTabs
            documentMode={documentMode}
            setDocumentMode={setDocumentMode}
            modulAjarList={currentModulAjarList}
            selectedModulIndex={safeModulIndex}
            setSelectedModulIndex={setSelectedModulIndex}
            watermarkOpacity={watermarkOpacity}
            setWatermarkOpacity={setWatermarkOpacity}
            onOpenRppEditor={handleOpenRppEditor}
          />

          {/* Printable Separated Document Display */}
          <PrintableDocument
            identity={identity}
            atpList={currentAtpList}
            modulAjarList={currentModulAjarList}
            selectedModulIndex={safeModulIndex}
            documentMode={documentMode}
            watermarkOpacity={watermarkOpacity}
            onOpenRppEditor={handleOpenRppEditor}
          />
        </div>
      </main>

      {/* Screen Footer (Only displayed on web screen, NOT in print) */}
      <footer className="bg-[#FFFDF7] border-t-2 border-black py-6 px-4 text-center mt-12 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-600">
          <div className="flex items-center gap-2 font-bold text-neutral-800">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>SMK Muhammadiyah Bawang, Batang · Kurikulum Merdeka</span>
          </div>

          <div className="text-xs font-black text-neutral-900 bg-amber-200 border-2 border-black px-3.5 py-1 rounded-lg shadow-[2px_2px_0px_#000]">
            developed by @hndx07
          </div>

          <div className="text-[11px] text-neutral-500 font-medium">
            Deep Learning (Mindful · Meaningful · Joyful) · Mapel Kejuruan & Normatif-Adaptif
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SchoolIdentityModal
        isOpen={isIdentityModalOpen}
        onClose={() => setIsIdentityModalOpen(false)}
        identity={identity}
        onSave={handleSaveIdentity}
      />

      <GuidelineModal
        isOpen={isGuidelineModalOpen}
        onClose={() => setIsGuidelineModalOpen(false)}
      />

      <AiRefineModal
        isOpen={isAiRefineModalOpen}
        onClose={() => setIsAiRefineModalOpen(false)}
        modulAjar={activeModulAjar}
        identity={identity}
        onApplyEnrichment={handleApplyEnrichment}
      />

      <RppTableEditorModal
        isOpen={isRppEditorOpen}
        onClose={() => setIsRppEditorOpen(false)}
        modulList={currentModulAjarList}
        selectedModulIndex={safeModulIndex}
        onSaveModul={handleSaveModulFromEditor}
        identity={identity}
        initialTab={rppEditorInitialTab}
      />

      <ExcelGuideAndAiPromptModal
        isOpen={isExcelGuideModalOpen}
        onClose={() => setIsExcelGuideModalOpen(false)}
        identity={identity}
      />
    </div>
  );
}
