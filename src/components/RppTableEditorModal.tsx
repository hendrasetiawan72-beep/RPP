import React, { useState } from 'react';
import {
  X,
  Save,
  Check,
  Code2,
  Table,
  Layers,
  Info,
} from 'lucide-react';
import { ModulAjarData, SchoolIdentity } from '../types';
import {
  DEEP_LEARNING_SYNTAX_OPTIONS,
  SyntaxOption,
} from '../utils/deepLearningSyntax';

interface RppTableEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  modulList: ModulAjarData[];
  selectedModulIndex: number;
  onSaveModul: (updatedModul: ModulAjarData, index: number) => void;
  identity: SchoolIdentity;
  initialTab?: 'desain' | 'sintaks' | 'asesmen' | 'lampiran';
}

export const RppTableEditorModal: React.FC<RppTableEditorModalProps> = ({
  isOpen,
  onClose,
  modulList,
  selectedModulIndex,
  onSaveModul,
  identity,
  initialTab = 'sintaks',
}) => {
  const [activeUnitIdx, setActiveUnitIdx] = useState<number>(selectedModulIndex);
  const [activeTab, setActiveTab] = useState<'desain' | 'sintaks' | 'asesmen' | 'lampiran'>(initialTab);

  // Deep clone current module for safe in-memory editing
  const currentModul = modulList[activeUnitIdx] || modulList[0];
  const [editedModul, setEditedModul] = useState<ModulAjarData>(() =>
    JSON.parse(JSON.stringify(currentModul))
  );

  // Sync when activeUnitIdx changes
  React.useEffect(() => {
    if (modulList[activeUnitIdx]) {
      setEditedModul(JSON.parse(JSON.stringify(modulList[activeUnitIdx])));
    }
  }, [activeUnitIdx, modulList]);

  // Sync initialTab when modal opens
  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
      setActiveUnitIdx(selectedModulIndex);
    }
  }, [isOpen, initialTab, selectedModulIndex]);

  if (!isOpen || !editedModul) return null;

  const rpp = editedModul.rppFormat;
  const pMendalam = rpp.perencanaanMendalam;
  const ident = pMendalam.identifikasi;
  const desain = pMendalam.desainPembelajaran;
  const kerangka = desain.kerangkaPembelajaran;
  const langkah = rpp.pengalamanBelajar;
  const asesmen = rpp.asesmen;
  const lampiran = rpp.lampiran;

  // Apply selected Deep Learning syntax preset
  const handleApplySyntaxPreset = (preset: SyntaxOption) => {
    const isPjbl = preset.model === 'PjBL';
    const updated = JSON.parse(JSON.stringify(editedModul)) as ModulAjarData;

    // 1. Update framework and pedagogical practice
    if (isPjbl) {
      updated.rppFormat.perencanaanMendalam.desainPembelajaran.kerangkaPembelajaran.praktikPedagogik.pjbl =
        `PjBL Deep Learning (${preset.namaOpsi}): ${preset.ringkasan}. Prinsip berkesadaran, bermakna, dan menggembirakan. Catatan Pedagogis: ${preset.catatanPenerapan.pedagogis}`;
    } else {
      updated.rppFormat.perencanaanMendalam.desainPembelajaran.kerangkaPembelajaran.praktikPedagogik.pbl =
        `PBL Deep Learning (${preset.namaOpsi}): ${preset.ringkasan}. Prinsip berkesadaran, bermakna, dan menggembirakan. Catatan Pedagogis: ${preset.catatanPenerapan.pedagogis}`;
    }

    // 2. Update partnership & digital environment
    updated.rppFormat.perencanaanMendalam.desainPembelajaran.kerangkaPembelajaran.kemitraanPembelajaran.mitraIndustri.terkaitPbl =
      preset.catatanPenerapan.kemitraan;
    updated.rppFormat.perencanaanMendalam.desainPembelajaran.kerangkaPembelajaran.lingkunganBelajar.penerapanNyataBudaya.budayaBelajar =
      preset.catatanPenerapan.pedagogis;

    // 3. Map syntax steps into kegiatanInti (Memahami, Mengaplikasi, Merefleksi)
    const langkahMemahami = preset.langkah.filter((l) => l.alurMendalam === 'memahami');
    const langkahMengaplikasi = preset.langkah.filter((l) => l.alurMendalam === 'mengaplikasi');
    const langkahMerefleksi = preset.langkah.filter((l) => l.alurMendalam === 'merefleksi');

    // Memahami & Mengaplikasi section
    const instruksiGabungan = [
      ...langkahMemahami.map((l) => `[Memahami - Langkah ${l.no}: ${l.namaLangkah}]\n${l.deskripsi}`),
      ...langkahMengaplikasi.map((l) => `[Mengaplikasi - Langkah ${l.no}: ${l.namaLangkah}]\n${l.deskripsi}`),
    ].join('\n\n');

    updated.rppFormat.pengalamanBelajar.kegiatanInti.memahamiBermaknaMenggembirakan.instruksiGuru =
      instruksiGabungan;

    updated.rppFormat.pengalamanBelajar.kegiatanInti.memahamiBermaknaMenggembirakan.rangkumanTemuan =
      preset.langkah.map(
        (l) => `${l.namaLangkah} (${l.alurMendalam}): Peserta didik menguasai konsep dan aplikasi terpadu sesuai standar kerja.`
      );

    // Merefleksi section
    updated.rppFormat.pengalamanBelajar.kegiatanInti.merefleksiBerkesadaranBermakna.instruksiAplikasi =
      langkahMerefleksi.map((l) => `[Merefleksi - Langkah ${l.no}: ${l.namaLangkah}] ${l.deskripsi}`).join('\n\n') ||
      `Refleksi mendalam pengalaman belajar, evaluasi proses kerja mandiri/kelompok, dan tindak lanjut perbaikan kompetensi.`;

    updated.rppFormat.pengalamanBelajar.kegiatanInti.merefleksiBerkesadaranBermakna.penguatanKonsep =
      `Guru memberikan umpan balik formatif terstruktur, penguatan konsep esensial industri, serta apresiasi atas ketuntasan belajar murid. ${preset.catatanPenerapan.asesmen}`;

    setEditedModul(updated);
  };

  // Quick field updates helper
  const updateField = (path: string, value: any) => {
    const updated = JSON.parse(JSON.stringify(editedModul));
    const parts = path.split('.');
    let curr = updated;
    for (let i = 0; i < parts.length - 1; i++) {
      curr = curr[parts[i]];
    }
    curr[parts[parts.length - 1]] = value;
    setEditedModul(updated);
  };

  const handleSave = () => {
    onSaveModul(editedModul, activeUnitIdx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs no-print overflow-hidden">
      <div className="bg-[#FFFDF7] neo-box-lg max-w-6xl w-full h-[94vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-150 border-[3px] border-black shadow-[8px_8px_0px_#000]">
        
        {/* Top Header */}
        <div className="p-4 border-b-2 border-black bg-amber-200/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <Table className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg sm:text-xl text-neutral-900 leading-tight">
                Editor Input Tabel RPP & Lampiran (Embed Interaktif)
              </h3>
              <p className="text-xs text-neutral-700">
                Ubah manual seluruh kolom RPP, sesuaikan sintaks PjBL/PBL Deep Learning, dan sertakan kode embed LKPD, Materi, serta Rubrik.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="neo-btn px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs rounded-xl border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-100 hover:bg-rose-100 border-2 border-black"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-Header: Unit Selector & Main Tabs */}
        <div className="bg-neutral-100/90 border-b border-black/30 p-2 sm:px-4 flex flex-wrap items-center justify-between gap-2 shrink-0">
          {/* Unit Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-neutral-600">Pilih Unit RPP:</span>
            <div className="flex gap-1 overflow-x-auto max-w-md py-0.5">
              {modulList.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => setActiveUnitIdx(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all border ${
                    activeUnitIdx === idx
                      ? 'bg-amber-400 text-black border-black shadow-[2px_2px_0px_#000]'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  Unit {m.nomorModul}: {m.judulMateri.slice(0, 18)}...
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('desain')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeTab === 'desain'
                  ? 'bg-blue-300 text-black border-2 border-black font-black shadow-[2px_2px_0px_#000]'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              1. Kolom Desain RPP
            </button>
            <button
              onClick={() => setActiveTab('sintaks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeTab === 'sintaks'
                  ? 'bg-amber-400 text-black border-2 border-black font-black shadow-[2px_2px_0px_#000]'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              2. Sintaks PjBL / PBL Deep Learning
            </button>
            <button
              onClick={() => setActiveTab('asesmen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeTab === 'asesmen'
                  ? 'bg-purple-300 text-black border-2 border-black font-black shadow-[2px_2px_0px_#000]'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              3. Tabel Asesmen & Nilai
            </button>
            <button
              onClick={() => setActiveTab('lampiran')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeTab === 'lampiran'
                  ? 'bg-emerald-300 text-black border-2 border-black font-black shadow-[2px_2px_0px_#000]'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              4. Lampiran & Kode Embed
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: DESAIN PEMBELAJARAN & KOLOM RPP */}
          {activeTab === 'desain' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-3.5 flex items-start gap-2.5">
                <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-950">
                  <strong className="block font-bold">Editor Kolom Desain RPP:</strong>
                  Semua kolom tabel perencanaan mendalam terhubung langsung dengan dokumen siap cetak. Perubahan di sini akan langsung memperbarui tata letak landscape F4.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-800">Judul Materi / Topik Unit</label>
                  <input
                    type="text"
                    value={editedModul.judulMateri}
                    onChange={(e) => updateField('judulMateri', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs bg-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-800">Alokasi Waktu Materi</label>
                  <input
                    type="text"
                    value={editedModul.alokasiWaktuMateri || '18 JP'}
                    onChange={(e) => updateField('alokasiWaktuMateri', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs bg-white font-mono"
                  />
                </div>
              </div>

              {/* Tabel Desain Pembelajaran */}
              <div className="border-2 border-black rounded-xl overflow-hidden bg-white shadow-[3px_3px_0px_#000]">
                <div className="bg-neutral-100 p-2.5 border-b border-black font-black text-xs uppercase flex items-center justify-between">
                  <span>Tabel Kolom Komponen Perencanaan Mendalam</span>
                  <span className="text-[10px] font-mono text-neutral-500">Edit Langsung Kolom</span>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      1. Capaian Pembelajaran (CP)
                    </label>
                    <textarea
                      rows={2}
                      value={desain.capaianPembelajaran}
                      onChange={(e) =>
                        updateField('rppFormat.perencanaanMendalam.desainPembelajaran.capaianPembelajaran', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">
                      2. Tujuan Pembelajaran (Setiap baris satu TP)
                    </label>
                    <textarea
                      rows={3}
                      value={desain.tujuanPembelajaran.join('\n')}
                      onChange={(e) =>
                        updateField(
                          'rppFormat.perencanaanMendalam.desainPembelajaran.tujuanPembelajaran',
                          e.target.value.split('\n').filter((t) => t.trim().length > 0)
                        )
                      }
                      className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white leading-relaxed font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        3. Praktik Pedagogik: Problem Based Learning (PBL)
                      </label>
                      <textarea
                        rows={3}
                        value={kerangka.praktikPedagogik.pbl}
                        onChange={(e) =>
                          updateField('rppFormat.perencanaanMendalam.desainPembelajaran.kerangkaPembelajaran.praktikPedagogik.pbl', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        4. Praktik Pedagogik: Project Based Learning (PjBL)
                      </label>
                      <textarea
                        rows={3}
                        value={kerangka.praktikPedagogik.pjbl}
                        onChange={(e) =>
                          updateField('rppFormat.perencanaanMendalam.desainPembelajaran.kerangkaPembelajaran.praktikPedagogik.pjbl', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        5. Kemitraan Pembelajaran: DUDI / Industri Rekanan
                      </label>
                      <input
                        type="text"
                        value={kerangka.kemitraanPembelajaran.mitraIndustri.nama}
                        onChange={(e) =>
                          updateField('rppFormat.perencanaanMendalam.desainPembelajaran.kerangkaPembelajaran.kemitraanPembelajaran.mitraIndustri.nama', e.target.value)
                        }
                        className="w-full px-3 py-1.5 border border-black rounded-lg text-xs bg-white mb-2 font-bold"
                        placeholder="Nama Mitra Industri"
                      />
                      <textarea
                        rows={2}
                        value={kerangka.kemitraanPembelajaran.mitraIndustri.terkaitPbl}
                        onChange={(e) =>
                          updateField('rppFormat.perencanaanMendalam.desainPembelajaran.kerangkaPembelajaran.kemitraanPembelajaran.mitraIndustri.terkaitPbl', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white leading-relaxed"
                        placeholder="Peran & keterkaitan dengan pembelajaran"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        6. Budaya Belajar & Pemanfaatan Digital
                      </label>
                      <textarea
                        rows={3}
                        value={kerangka.lingkunganBelajar.penerapanNyataBudaya.budayaBelajar}
                        onChange={(e) =>
                          updateField('rppFormat.perencanaanMendalam.desainPembelajaran.kerangkaPembelajaran.lingkunganBelajar.penerapanNyataBudaya.budayaBelajar', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white leading-relaxed mb-2"
                        placeholder="Penerapan budaya belajar (5S, SOP industri)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SINTAKS DEEP LEARNING (PjBL & PBL) */}
          {activeTab === 'sintaks' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Opsi Sintaks PjBL dan PBL Preset Cards */}
              <div className="border-2 border-black rounded-xl p-4 bg-amber-50/70 shadow-[3px_3px_0px_#000]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-700" />
                    <h4 className="font-display font-black text-sm uppercase text-neutral-900">
                      ⚡ Pilih Opsi Sintaks Pembelajaran Deep Learning (1-Klik Terapkan)
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                    Alur: Memahami → Mengaplikasi → Merefleksi
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mb-3">
                  Klik salah satu opsi di bawah untuk secara otomatis menerapkan sintaks PjBL atau PBL ke seluruh kolom tahapan belajar, instruksi guru, serta aktivitas murid:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {DEEP_LEARNING_SYNTAX_OPTIONS.map((opt) => (
                    <div
                      key={opt.id}
                      className="p-3 bg-white border-2 border-black rounded-xl hover:bg-amber-100/50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded border border-black uppercase ${
                              opt.model === 'PjBL' ? 'bg-indigo-100 text-indigo-900' : 'bg-rose-100 text-rose-900'
                            }`}
                          >
                            {opt.model}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">
                            {opt.langkah.length} Langkah
                          </span>
                        </div>
                        <h5 className="font-bold text-xs text-neutral-900 mb-1">{opt.namaOpsi}</h5>
                        <p className="text-[11px] text-neutral-600 leading-snug mb-2">{opt.ringkasan}</p>
                      </div>

                      <button
                        onClick={() => handleApplySyntaxPreset(opt)}
                        className="mt-2 w-full py-1.5 px-2 bg-amber-300 hover:bg-amber-400 border border-black rounded-lg text-xs font-black flex items-center justify-center gap-1 shadow-[1px_1px_0px_#000]"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Terapkan Opsi Ini ke RPP</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editor Manual Tabel Langkah Pembelajaran */}
              <div className="space-y-4">
                {/* 1. Kegiatan Inti: Memahami & Mengaplikasi */}
                <div className="border-2 border-black rounded-xl overflow-hidden bg-white shadow-[2px_2px_0px_#000]">
                  <div className="bg-blue-100 p-2.5 border-b border-black font-black text-xs flex items-center justify-between">
                    <span className="uppercase text-blue-950">A. Kegiatan Inti: Tahap Memahami & Mengaplikasi</span>
                    <span className="text-[10px] font-mono">Bermakna & Menggembirakan</span>
                  </div>
                  <div className="p-3 space-y-3">
                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        Instruksi Guru (Sintaks Pembelajaran Mendalam)
                      </label>
                      <textarea
                        rows={5}
                        value={langkah.kegiatanInti.memahamiBermaknaMenggembirakan.instruksiGuru}
                        onChange={(e) =>
                          updateField('rppFormat.pengalamanBelajar.kegiatanInti.memahamiBermaknaMenggembirakan.instruksiGuru', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white leading-relaxed font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        Rangkuman Hasil Temuan & Aktivitas Murid
                      </label>
                      <textarea
                        rows={3}
                        value={langkah.kegiatanInti.memahamiBermaknaMenggembirakan.rangkumanTemuan.join('\n')}
                        onChange={(e) =>
                          updateField(
                            'rppFormat.pengalamanBelajar.kegiatanInti.memahamiBermaknaMenggembirakan.rangkumanTemuan',
                            e.target.value.split('\n').filter((t) => t.trim().length > 0)
                          )
                        }
                        className="w-full px-3 py-1.5 border border-black rounded-lg text-xs bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Kegiatan Inti: Merefleksi */}
                <div className="border-2 border-black rounded-xl overflow-hidden bg-white shadow-[2px_2px_0px_#000]">
                  <div className="bg-purple-100 p-2.5 border-b border-black font-black text-xs flex items-center justify-between">
                    <span className="uppercase text-purple-950">B. Kegiatan Inti: Tahap Merefleksi (Berkesadaran & Bermakna)</span>
                    <span className="text-[10px] font-mono">Evaluasi Proses & Kemitraan DUDI</span>
                  </div>
                  <div className="p-3 space-y-3">
                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        Instruksi Refleksi & Umpan Balik Mitra/DUDI
                      </label>
                      <textarea
                        rows={3}
                        value={langkah.kegiatanInti.merefleksiBerkesadaranBermakna.instruksiAplikasi}
                        onChange={(e) =>
                          updateField('rppFormat.pengalamanBelajar.kegiatanInti.merefleksiBerkesadaranBermakna.instruksiAplikasi', e.target.value)
                        }
                        className="w-full px-3 py-1.5 border border-black rounded-lg text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        Penguatan Konsep Guru
                      </label>
                      <textarea
                        rows={2}
                        value={langkah.kegiatanInti.merefleksiBerkesadaranBermakna.penguatanKonsep}
                        onChange={(e) =>
                          updateField('rppFormat.pengalamanBelajar.kegiatanInti.merefleksiBerkesadaranBermakna.penguatanKonsep', e.target.value)
                        }
                        className="w-full px-3 py-1.5 border border-black rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Kegiatan Penutup: Refleksi 3-2-1 */}
                <div className="border-2 border-black rounded-xl overflow-hidden bg-white shadow-[2px_2px_0px_#000]">
                  <div className="bg-rose-100 p-2.5 border-b border-black font-black text-xs flex items-center justify-between">
                    <span className="uppercase text-rose-950">C. Kegiatan Penutup: Refleksi 3-2-1 & Tindak Lanjut</span>
                    <span className="text-[10px] font-mono">15 Menit</span>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-800 block mb-0.5">
                          3 Hal Penting Dipelajari
                        </label>
                        <input
                          type="text"
                          value={langkah.kegiatanPenutup.refleksiIndividu321.tigaHalPenting}
                          onChange={(e) =>
                            updateField('rppFormat.pengalamanBelajar.kegiatanPenutup.refleksiIndividu321.tigaHalPenting', e.target.value)
                          }
                          className="w-full px-2 py-1.5 border border-black rounded text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-neutral-800 block mb-0.5">
                          2 Pertanyaan Masih Muncul
                        </label>
                        <input
                          type="text"
                          value={langkah.kegiatanPenutup.refleksiIndividu321.duaPertanyaan}
                          onChange={(e) =>
                            updateField('rppFormat.pengalamanBelajar.kegiatanPenutup.refleksiIndividu321.duaPertanyaan', e.target.value)
                          }
                          className="w-full px-2 py-1.5 border border-black rounded text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-neutral-800 block mb-0.5">
                          1 Hal Menarik Berkesan
                        </label>
                        <input
                          type="text"
                          value={langkah.kegiatanPenutup.refleksiIndividu321.satuHalMenarik}
                          onChange={(e) =>
                            updateField('rppFormat.pengalamanBelajar.kegiatanPenutup.refleksiIndividu321.satuHalMenarik', e.target.value)
                          }
                          className="w-full px-2 py-1.5 border border-black rounded text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-neutral-800 block mb-1">
                          Kesimpulan & Penguatan Akhir
                        </label>
                        <textarea
                          rows={2}
                          value={langkah.kegiatanPenutup.kesimpulanDanPenguatan}
                          onChange={(e) =>
                            updateField('rppFormat.pengalamanBelajar.kegiatanPenutup.kesimpulanDanPenguatan', e.target.value)
                          }
                          className="w-full px-3 py-1.5 border border-black rounded-lg text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-neutral-800 block mb-1">
                          Rencana Tindak Lanjut
                        </label>
                        <textarea
                          rows={2}
                          value={langkah.kegiatanPenutup.tindakLanjut}
                          onChange={(e) =>
                            updateField('rppFormat.pengalamanBelajar.kegiatanPenutup.tindakLanjut', e.target.value)
                          }
                          className="w-full px-3 py-1.5 border border-black rounded-lg text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ASESMEN & EVALUASI */}
          {activeTab === 'asesmen' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="border-2 border-black rounded-xl overflow-hidden bg-white shadow-[3px_3px_0px_#000]">
                <div className="bg-purple-100 p-2.5 border-b border-black font-black text-xs uppercase">
                  Tabel Ringkasan Asesmen
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        Asesmen Awal (Diagnostik)
                      </label>
                      <textarea
                        rows={3}
                        value={asesmen.ringkasan.asesmenAwal}
                        onChange={(e) =>
                          updateField('rppFormat.asesmen.ringkasan.asesmenAwal', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        Asesmen Proses (Formatif)
                      </label>
                      <textarea
                        rows={3}
                        value={asesmen.ringkasan.asesmenProses}
                        onChange={(e) =>
                          updateField('rppFormat.asesmen.ringkasan.asesmenProses', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        Asesmen Akhir (Sumatif)
                      </label>
                      <textarea
                        rows={3}
                        value={asesmen.ringkasan.asesmenAkhir}
                        onChange={(e) =>
                          updateField('rppFormat.asesmen.ringkasan.asesmenAkhir', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-black/20">
                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        Program Pengayaan
                      </label>
                      <textarea
                        rows={2}
                        value={rpp.pengayaanDanRemedial.pengayaan}
                        onChange={(e) =>
                          updateField('rppFormat.pengayaanDanRemedial.pengayaan', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">
                        Program Remedial
                      </label>
                      <textarea
                        rows={2}
                        value={rpp.pengayaanDanRemedial.remedial}
                        onChange={(e) =>
                          updateField('rppFormat.pengayaanDanRemedial.remedial', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LAMPIRAN & INPUT KODE EMBED INTERAKTIF */}
          {activeTab === 'lampiran' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-3.5 flex items-start gap-2.5">
                <Code2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950">
                  <strong className="block font-bold">Dukungan Input Kode Embed Interaktif:</strong>
                  Sertakan kode embed HTML (seperti tag <code>&lt;iframe src="..."&gt;&lt;/iframe&gt;</code>) atau link langsung URL dari Google Docs, Google Forms, YouTube, Canva, Quizizz, atau spreadsheet. Kode embed ini akan tampil interaktif di tampilan web dan rapi saat dicetak ke PDF Landscape F4.
                </div>
              </div>

              {/* Lampiran 1: Materi Pembelajaran (Diatas LKPD) */}
              <div className="border-2 border-black rounded-xl overflow-hidden bg-white shadow-[3px_3px_0px_#000]">
                <div className="bg-neutral-100 p-2.5 border-b border-black font-black text-xs uppercase flex items-center justify-between">
                  <span>Lampiran 1: Materi Pembelajaran</span>
                  <span className="text-[10px] font-mono text-blue-800 font-bold bg-blue-100 px-2 py-0.5 rounded">
                    Tautan Hiperlink & Script HTML
                  </span>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">Judul Materi Pembelajaran</label>
                    <input
                      type="text"
                      value={lampiran.bahanBacaan.judul}
                      onChange={(e) => updateField('rppFormat.lampiran.bahanBacaan.judul', e.target.value)}
                      className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white font-bold"
                    />
                  </div>

                  {/* Kolom Tautan Materi (Bisa Jadi Hiperlink di PDF Siap Cetak) */}
                  <div className="p-3 bg-blue-50/80 border border-blue-300 rounded-xl space-y-1">
                    <label className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                      <span>🔗 Kolom Tautan Materi Pembelajaran (Hiperlink Aktif):</span>
                    </label>
                    <input
                      type="url"
                      placeholder="Contoh: https://guru.kemdikbud.go.id/ atau https://drive.google.com/..."
                      value={lampiran.bahanBacaan.tautan || ''}
                      onChange={(e) => updateField('rppFormat.lampiran.bahanBacaan.tautan', e.target.value)}
                      className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white font-mono"
                    />
                    <p className="text-[10px] text-neutral-600">
                      Tautan ini dapat langsung diklik (hyperlink aktif) pada dokumen web pratinjau maupun hasil cetak dokumen PDF.
                    </p>
                  </div>

                  {/* Kolom Input Kode Script HTML / Embed Materi */}
                  <div className="p-3 bg-amber-50/80 border-2 border-dashed border-amber-400 rounded-xl space-y-1.5">
                    <label className="text-xs font-black text-neutral-900 flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-blue-800" />
                      <span>Kolom Input Kode Script HTML / Embed Materi (YouTube, Google Slides, Flipbook)</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder='Contoh: <iframe width="100%" height="380" src="https://www.youtube.com/embed/..." allowfullscreen></iframe>'
                      value={lampiran.bahanBacaan.embedCode || ''}
                      onChange={(e) => updateField('rppFormat.lampiran.bahanBacaan.embedCode', e.target.value)}
                      className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white font-mono leading-relaxed"
                    />
                    <p className="text-[10px] text-neutral-600">
                      Mendukung tag iframe, embed code, atau script HTML multimedia yang disematkan langsung di lembar materi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lampiran 2: LKPD (Semua teks isi dihapus kecuali judul headernya, kolom tautan & kode embed) */}
              <div className="border-2 border-black rounded-xl overflow-hidden bg-white shadow-[3px_3px_0px_#000]">
                <div className="bg-neutral-100 p-2.5 border-b border-black font-black text-xs uppercase flex items-center justify-between">
                  <span>Lampiran 2: LKPD (Lembar Kerja Peserta Didik)</span>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    Judul Header & Tautan + Embed
                  </span>
                </div>
                <div className="p-4 space-y-4">
                  {/* Judul Header LKPD (Satu-satunya teks LKPD yang dipertahankan sesuai instruksi) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">Judul Header LKPD</label>
                      <input
                        type="text"
                        value={lampiran.lkpd.judul}
                        onChange={(e) => updateField('rppFormat.lampiran.lkpd.judul', e.target.value)}
                        className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-800 block mb-1">Nomor / Kode Lampiran</label>
                      <input
                        type="text"
                        value={lampiran.lkpd.nomor || 'Lampiran 2'}
                        onChange={(e) => updateField('rppFormat.lampiran.lkpd.nomor', e.target.value)}
                        className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Kolom Tautan LKPD (Hiperlink di PDF Siap Cetak) */}
                  <div className="p-3 bg-emerald-50/80 border border-emerald-300 rounded-xl space-y-1">
                    <label className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                      <span>🔗 Kolom Tautan LKPD (Dapat Dibuka Melalui Hiperlink di PDF Siap Cetak):</span>
                    </label>
                    <input
                      type="url"
                      placeholder="Contoh: https://docs.google.com/document/d/... atau https://liveworksheets.com/..."
                      value={lampiran.lkpd.tautan || ''}
                      onChange={(e) => updateField('rppFormat.lampiran.lkpd.tautan', e.target.value)}
                      className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white font-mono"
                    />
                    <p className="text-[10px] text-neutral-600">
                      Tautan LKPD yang aktif dan dapat dibuka langsung melalui klik link di PDF siap cetak.
                    </p>
                  </div>

                  {/* Dibawahnya: Kolom Kode Embed LKPD */}
                  <div className="p-3 bg-amber-50/80 border-2 border-dashed border-amber-400 rounded-xl space-y-1.5">
                    <label className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-amber-800" />
                      <span>Kolom Kode Embed LKPD (HTML &lt;iframe&gt; / Liveworksheets / Google Docs)</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder='Contoh: <iframe src="https://docs.google.com/document/d/.../preview" width="100%" height="480"></iframe>'
                      value={lampiran.lkpd.embedCode || ''}
                      onChange={(e) => updateField('rppFormat.lampiran.lkpd.embedCode', e.target.value)}
                      className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white font-mono leading-relaxed"
                    />
                    <p className="text-[10px] text-neutral-600">
                      Pratinjau interaktif LKPD akan disematkan tepat di bawah kolom tautan pada dokumen lampiran.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lampiran 3: Rubrik Observasi & Kode Embed */}
              <div className="border-2 border-black rounded-xl overflow-hidden bg-white shadow-[3px_3px_0px_#000]">
                <div className="bg-neutral-100 p-2.5 border-b border-black font-black text-xs uppercase flex items-center justify-between">
                  <span>Lampiran 3: Rubrik Observasi Aktivitas Kelompok & Kuis</span>
                  <span className="text-[10px] font-mono text-purple-800 font-bold bg-purple-100 px-2 py-0.5 rounded">
                    Mendukung Kode Embed
                  </span>
                </div>
                <div className="p-4 space-y-4">
                  {/* Input Kode Embed Rubrik */}
                  <div className="p-3 bg-purple-50/80 border-2 border-dashed border-purple-400 rounded-xl space-y-1.5">
                    <label className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-purple-800" />
                      <span>Kode Embed Rubrik & Kuis (Google Forms / Spreadsheet Penilaian)</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder='Contoh: <iframe src="https://docs.google.com/forms/d/e/.../viewform?embedded=true" width="100%" height="480"></iframe>'
                      value={lampiran.embedCodeRubrik || ''}
                      onChange={(e) => updateField('rppFormat.lampiran.embedCodeRubrik', e.target.value)}
                      className="w-full px-3 py-2 border border-black rounded-lg text-xs bg-white font-mono leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Lampiran 4: Editor Tabel Rekapitulasi Nilai Siswa (27 Siswa) */}
              <div className="border-2 border-black rounded-xl overflow-hidden bg-white shadow-[3px_3px_0px_#000]">
                <div className="bg-neutral-100 p-2.5 border-b border-black font-black text-xs uppercase flex items-center justify-between">
                  <span>Lampiran 4: Editor Input Tabel Rekapitulasi Observasi Nilai Siswa (27 Siswa)</span>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold">Otomatis Hitung Nilai Akhir</span>
                </div>
                <div className="p-3 overflow-x-auto max-h-96">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-200 border-b border-black font-bold">
                        <th className="p-1 border-r border-black w-8 text-center">No</th>
                        <th className="p-1 border-r border-black text-left w-56">Nama Siswa</th>
                        <th className="p-1 border-r border-black w-16 text-center">Aktif (1-4)</th>
                        <th className="p-1 border-r border-black w-16 text-center">Sama (1-4)</th>
                        <th className="p-1 border-r border-black w-16 text-center">Jawab (1-4)</th>
                        <th className="p-1 border-r border-black w-16 text-center">Disiplin (1-4)</th>
                        <th className="p-1 border-r border-black w-16 text-center">Tuntas (1-4)</th>
                        <th className="p-1 border-r border-black w-16 text-center">Total</th>
                        <th className="p-1 w-16 text-center">Nilai</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {lampiran.rekapNilaiSiswaContoh.map((mhs, idx) => (
                        <tr key={mhs.no} className={idx % 2 === 0 ? 'bg-neutral-50/50' : 'bg-white'}>
                          <td className="p-1 border-r border-neutral-300 font-bold text-center">{mhs.no}</td>
                          <td className="p-1 border-r border-neutral-300">
                            <input
                              type="text"
                              value={mhs.nama}
                              onChange={(e) => {
                                const newRekap = [...lampiran.rekapNilaiSiswaContoh];
                                newRekap[idx] = { ...newRekap[idx], nama: e.target.value };
                                updateField('rppFormat.lampiran.rekapNilaiSiswaContoh', newRekap);
                              }}
                              className="w-full px-1.5 py-0.5 border border-neutral-300 rounded text-xs bg-white"
                            />
                          </td>
                          {(['keaktifan', 'kerjasama', 'tanggungJawab', 'disiplin', 'ketuntasan'] as const).map(
                            (col) => (
                              <td key={col} className="p-1 border-r border-neutral-300 text-center">
                                <input
                                  type="number"
                                  min={1}
                                  max={4}
                                  value={mhs[col]}
                                  onChange={(e) => {
                                    const val = Math.min(4, Math.max(1, parseInt(e.target.value) || 1));
                                    const newRekap = [...lampiran.rekapNilaiSiswaContoh];
                                    const updatedItem = { ...newRekap[idx], [col]: val };
                                    const total =
                                      updatedItem.keaktifan +
                                      updatedItem.kerjasama +
                                      updatedItem.tanggungJawab +
                                      updatedItem.disiplin +
                                      updatedItem.ketuntasan;
                                    const nilai = Math.round((total / 20) * 100);
                                    updatedItem.totalSkor = total;
                                    updatedItem.nilaiAkhir = nilai;
                                    newRekap[idx] = updatedItem;
                                    updateField('rppFormat.lampiran.rekapNilaiSiswaContoh', newRekap);
                                  }}
                                  className="w-12 text-center font-mono py-0.5 border border-neutral-300 rounded text-xs bg-white"
                                />
                              </td>
                            )
                          )}
                          <td className="p-1 border-r border-neutral-300 text-center font-mono font-bold text-amber-900">
                            {mhs.totalSkor}
                          </td>
                          <td className="p-1 text-center font-mono font-bold text-emerald-900">
                            {mhs.nilaiAkhir}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar Actions */}
        <div className="p-3 border-t-2 border-black bg-neutral-100 flex items-center justify-between shrink-0">
          <div className="text-xs text-neutral-600 font-medium">
            💡 Seluruh perubahan tersimpan langsung dan tercetak selaras pada format kertas F4 Landscape.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-neutral-200 border-2 border-black rounded-xl text-xs font-bold"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="neo-btn px-5 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs rounded-xl border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
            >
              <Save className="w-4 h-4" />
              <span>Simpan & Terapkan ke Dokumen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
