import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  Layers,
  Table,
  CheckCircle2,
  ExternalLink,
  Code2,
  HelpCircle,
  Download,
  Info,
} from 'lucide-react';
import { SchoolIdentity } from '../types';
import { downloadAtpExcelTemplate, downloadRppExcelTemplate } from '../utils/excelParser';

interface ExcelGuideAndAiPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  identity: SchoolIdentity;
}

export const ExcelGuideAndAiPromptModal: React.FC<ExcelGuideAndAiPromptModalProps> = ({
  isOpen,
  onClose,
  identity,
}) => {
  const [activeTab, setActiveTab] = useState<'alur' | 'prompt' | 'skema'>('alur');
  const [activePromptType, setActivePromptType] = useState<'atp' | 'rpp'>('atp');
  const [selectedJurusan, setSelectedJurusan] = useState<string>(identity.konsentrasiKeahlian || 'Akuntansi dan Keuangan Lembaga (AKL)');
  const [selectedMapel, setSelectedMapel] = useState<string>(identity.mataPelajaran || 'Praktikum Akuntansi Perusahaan Jasa dan Dagang');
  const [selectedFase, setSelectedFase] = useState<string>(identity.fase || 'F');
  const [selectedKelas, setSelectedKelas] = useState<string>(identity.kelas || 'XI');
  const [selectedSemester, setSelectedSemester] = useState<string>(identity.semester || '1 (Ganjil)');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
  };

  // Preset Options for quick selection
  const JURUSAN_PRESETS = [
    {
      jurusan: 'Akuntansi dan Keuangan Lembaga (AKL)',
      program: 'Akuntansi dan Keuangan',
      mapel: 'Praktikum Akuntansi Perusahaan Jasa dan Dagang',
      mitra: 'Kantor Akuntan Publik / Bank Mini SMK / BPKAD Batang',
      fase: 'F',
      kelas: 'XI',
      semester: '1 (Ganjil)',
    },
    {
      jurusan: 'Teknik Sepeda Motor (TSM)',
      program: 'Teknik Otomotif',
      mapel: 'Pemeliharaan Mesin dan Kelistrikan Sepeda Motor',
      mitra: 'Bengkel Resmi AHASS / Yamaha rekanan Batang',
      fase: 'F',
      kelas: 'XI',
      semester: '1 (Ganjil)',
    },
    {
      jurusan: 'Rekayasa Perangkat Lunak (RPL / PPLG)',
      program: 'Pengembangan Perangkat Lunak dan Gim',
      mapel: 'Pemrograman Web dan Perangkat Bergerak',
      mitra: 'Software House / Startup Digital Rekanan Batang & Semarang',
      fase: 'F',
      kelas: 'XI',
      semester: '1 (Ganjil)',
    },
    {
      jurusan: 'Desain Komunikasi Visual (DKV)',
      program: 'Seni dan Ekonomi Kreatif',
      mapel: 'Desain Grafis Percetakan dan Media Interaktif',
      mitra: 'Percetakan & Studio Kreatif Batang & Pekalongan',
      fase: 'F',
      kelas: 'XI',
      semester: '1 (Ganjil)',
    },
    {
      jurusan: 'Teknik Kendaraan Ringan (TKRO)',
      program: 'Teknik Otomotif',
      mapel: 'Pemeliharaan Sasis dan Pemindah Tenaga Kendaraan Ringan',
      mitra: 'Bengkel Mobil Nasmoco / Auto2000 rekanan Batang',
      fase: 'F',
      kelas: 'XI',
      semester: '1 (Ganjil)',
    },
    {
      jurusan: 'Manajemen Perkantoran dan Layanan Bisnis (MPLB)',
      program: 'Manajemen Perkantoran',
      mapel: 'Otomatisasi Tata Kelola Kehumasan dan Keprotokolan',
      mitra: 'Instansi Pemerintah Kabupaten Batang & BUMN',
      fase: 'F',
      kelas: 'XI',
      semester: '1 (Ganjil)',
    },
    {
      jurusan: 'Mapel Umum: Bahasa Inggris',
      program: 'Mata Pelajaran Umum (Normatif-Adaptif)',
      mapel: 'Bahasa Inggris Komunikasi Kerja',
      mitra: 'Dunia Usaha dan Industri Rekanan Batang',
      fase: 'F',
      kelas: 'XI',
      semester: '1 (Ganjil)',
    },
    {
      jurusan: 'Mapel Umum: Matematika',
      program: 'Mata Pelajaran Umum (Normatif-Adaptif)',
      mapel: 'Matematika Terapan Kejuruan',
      mitra: 'Unit Produksi dan Bengkel SMK Muhammadiyah Bawang',
      fase: 'E',
      kelas: 'X',
      semester: '1 (Ganjil)',
    },
  ];

  const handleSelectPreset = (preset: typeof JURUSAN_PRESETS[0]) => {
    setSelectedJurusan(preset.jurusan);
    setSelectedMapel(preset.mapel);
    setSelectedFase(preset.fase);
    setSelectedKelas(preset.kelas);
    setSelectedSemester(preset.semester);
  };

  // Generate Prompt for ATP
  const generatedAtpPrompt = `Anda adalah ahli kurikulum kejuruan SMK Kurikulum Merdeka (berdasarkan Keputusan Kepala BSKAP No 032/H/KR/2024 dan Panduan Pembelajaran dan Asesmen PPA 2024).

TUGAS ANDA:
Berdasarkan Capaian Pembelajaran (CP) untuk:
- Satuan Pendidikan: SMK Muhammadiyah Bawang, Batang
- Jurusan / Konsentrasi: ${selectedJurusan}
- Mata Pelajaran: ${selectedMapel}
- Fase / Kelas / Semester: Fase ${selectedFase} / Kelas ${selectedKelas} / Semester ${selectedSemester}

Buatlah matriks ALUR TUJUAN PEMBELAJARAN (ATP) yang siap di-upload ke sistem aplikasi dalam bentuk tabel Markdown dengan HEADER KOLOM PERSIS SEPERTI DI BAWAH INI:

| No | Elemen | Capaian Pembelajaran (CP) | Alur & Tujuan Pembelajaran (ATP / TP) | Tahapan Alur Pembelajaran | Lingkup Materi Pokok | Alokasi Waktu (JP) | Fase | Kelas | Semester | Lintas Disiplin Ilmu |

KETENTUAN PENGISIAN SETIAP KOLOM:
1. No: Angka urut 1, 2, 3, dst.
2. Elemen: Nama Elemen resmi dari CP BSKAP 032/H/KR/2024.
3. Capaian Pembelajaran (CP): Teks resmi CP per elemen secara utuh.
4. Alur & Tujuan Pembelajaran (ATP / TP): Rumuskan 2-3 Tujuan Pembelajaran per elemen dengan kaidah resmi [Kompetensi + Konten + Keterampilan Berpikir Ilmiah]. Gunakan numbering (1., 2., dst).
5. Tahapan Alur Pembelajaran: Rangkaian alur tahapan bertahap secara linear (contoh: "Tahap 1: Pengamatan & Identifikasi, Tahap 2: Pengukuran/Praktik, Tahap 3: Analisis Data, Tahap 4: Refleksi 3-2-1").
6. Lingkup Materi Pokok: Topik/sub-materi konkret yang dipelajari dan dipraktikkan.
7. Alokasi Waktu (JP): Angka jam pelajaran realistis (contoh: 18, 24, 12).
8. Fase: ${selectedFase}
9. Kelas: ${selectedKelas}
10. Semester: ${selectedSemester}
11. Lintas Disiplin Ilmu: Mata pelajaran lain yang relevan dan saling mendukung.

OUTPUT YANG DIINGINKAN:
Hasilkan HANYA tabel Markdown di atas (tanpa kata pengantar atau penutup panjang) sehingga pengguna dapat langsung memblok seluruh tabel, menyalinnya (Ctrl+C), menempelkannya (Ctrl+V) ke Microsoft Excel atau Google Sheets, dan menyimpannya sebagai file .xlsx siap upload ke aplikasi SMK Muhammadiyah Bawang.`;

  // Generate Prompt for RPP Deep Learning
  const generatedRppPrompt = `Anda adalah konsultan pedagogis senior SMK Muhammadiyah Bawang dan pengembang RPP Kurikulum Merdeka dengan Pendekatan Pembelajaran Mendalam (Deep Learning: Mindful Learning, Meaningful Learning, dan Joyful Learning) serta sintaks PjBL / PBL.

TUGAS ANDA:
Berdasarkan dokumen ATP untuk:
- Satuan Pendidikan: SMK Muhammadiyah Bawang, Kabupaten Batang, Jawa Tengah
- Jurusan / Konsentrasi: ${selectedJurusan}
- Mata Pelajaran: ${selectedMapel}
- Fase / Kelas / Semester: Fase ${selectedFase} / Kelas ${selectedKelas} / Semester ${selectedSemester}

Buatlah tabel SPREADSHEET RPP DEEP LEARNING TERINTEGRASI LENGKAP dengan HEADER KOLOM PERSIS DI BAWAH INI:

| No / Unit | Elemen | Capaian Pembelajaran (CP) | Alur & Tujuan Pembelajaran (ATP / TP) | Tahapan Alur Pembelajaran | Lingkup Materi Pokok | Alokasi Waktu (JP) | Fase | Kelas | Semester | Lintas Disiplin Ilmu | Kesiapan Peserta Didik (Minat & Gaya Belajar) | Karakteristik & Sifat Materi | Dimensi Profil Lulusan / P5 | Metode & Model Pembelajaran | Kemitraan Industri & Orang Tua | Lingkungan Belajar (Fisik & Virtual) | Pemanfaatan Digital | Sintaks Pendahuluan (Mindful Learning) | Sintaks Inti 1 - Memahami & Eksplorasi (Meaningful Learning) | Tabel Hasil Eksplorasi | Sintaks Inti 2 - Mengaplikasi & Merefleksi (Joyful Learning) | Sintaks Penutup (Refleksi 3-2-1 & Kaizen) | Asesmen Awal (Diagnostik) | Asesmen Proses (Formatif) | Asesmen Akhir (Sumatif) | Pengayaan dan Remedial | Tautan Materi | Kode Embed Materi | Tautan LKPD | Kode Embed LKPD |

KETENTUAN KHUSUS TIAP KOLOM SESUAI SKEMA APLIKASI:
1. Sintaks Pendahuluan (Mindful Learning): Aktivitas membangun fokus, kesadaran emosional, doa, dan pertanyaan pemantik kontekstual.
2. Sintaks Inti 1 (Meaningful Learning): Penyelidikan masalah nyata industri Batang atau studi kasus bermakna dengan sintaks PBL / PjBL.
3. Tabel Hasil Eksplorasi: Format string tabel pengamatan dua kolom. Tuliskan dengan format: "Judul Tabel :: Nama Kolom 1 | Nama Kolom 2 :: baris1_kol1 | baris1_kol2 ; baris2_kol1 | baris2_kol2 ; baris3_kol1 | baris3_kol2"
   (Contoh: "Tabel Parameter Pengujian Mesin :: Parameter Indikator | Nilai Standar SOP :: Tekanan Kompresi | 1100 kPa ; Putaran Stasioner | 1400 RPM ; Tegangan Pengisian | 14.2 Volt")
4. Sintaks Inti 2 (Joyful Learning): Pengalaman belajar menggembirakan, hands-on praktik, roleplay, uji coba produk, atau mini pameran unjuk kerja.
5. Sintaks Penutup (Refleksi 3-2-1 & Kaizen): Evaluasi 3 hal yang dipahami, 2 pertanyaan yang masih ada, 1 tindak lanjut perbaikan mandiri.
6. Asesmen: Rincikan asesmen awal (diagnostik kesiapan), asesmen proses (observasi kinerja kelompok), dan asesmen akhir (sumatif job sheet / tes).
7. Tautan Materi: URL bahan ajar digital (contoh: https://guru.kemdikbud.go.id/ atau link dokumen).
8. Kode Embed Materi: Tag iframe HTML embed video YouTube atau presentasi Google Slides (contoh: <iframe width="100%" height="380" src="https://www.youtube.com/embed/..." allowfullscreen></iframe>).
9. Tautan LKPD: URL lembar kerja digital yang aktif diklik via hyperlink (contoh: https://docs.google.com/document/d/.../edit).
10. Kode Embed LKPD: Tag iframe HTML embed LKPD Google Forms atau Liveworksheets.

OUTPUT:
Berikan dalam bentuk tabel Markdown terstruktur persis 1 tabel lengkap (3-4 baris materi unit pembelajaran) yang bisa di-copy paste ke Excel dalam 1 kali klik.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs no-print">
      <div className="bg-[#FFFDF7] neo-box-lg max-w-5xl w-full h-[92vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-150 border-[3px] border-black shadow-[8px_8px_0px_#000]">
        
        {/* Top Header */}
        <div className="p-4 border-b-2 border-black bg-emerald-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <FileSpreadsheet className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg sm:text-xl text-neutral-900 leading-tight">
                Panduan Skema Excel & Generator Prompt AI (Siap Upload)
              </h3>
              <p className="text-xs text-neutral-700">
                Alur Resmi Penyiapan Dokumen: <strong>Lampiran CP ➔ Matriks ATP ➔ Modul RPP Deep Learning (.xlsx)</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-100 hover:bg-rose-100 border-2 border-black transition-all"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-neutral-100 border-b border-black/40 p-2 sm:px-4 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('alur')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all border ${
                activeTab === 'alur'
                  ? 'bg-amber-300 text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              1. Rekomendasi Alur 2-Tahap (CP ➔ ATP ➔ RPP)
            </button>
            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all border ${
                activeTab === 'prompt'
                  ? 'bg-emerald-300 text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              2. Generator Prompt AI (Salin ke Gemini/ChatGPT)
            </button>
            <button
              onClick={() => setActiveTab('skema')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all border ${
                activeTab === 'skema'
                  ? 'bg-blue-300 text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              3. Kamus Skema Kolom Excel Persis
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadAtpExcelTemplate('kejuruan')}
              className="neo-btn px-2.5 py-1 bg-amber-200 text-black text-xs font-bold rounded-lg border border-black flex items-center gap-1"
              title="Unduh Template Excel ATP (.xlsx)"
            >
              <Download className="w-3.5 h-3.5 text-amber-900" />
              <span>Template ATP (.xlsx)</span>
            </button>
            <button
              onClick={() => downloadRppExcelTemplate('kejuruan')}
              className="neo-btn px-2.5 py-1 bg-emerald-300 text-black text-xs font-bold rounded-lg border border-black flex items-center gap-1"
              title="Unduh Template Excel RPP (.xlsx)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-950" />
              <span>Template RPP (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF8F5]">

          {/* TAB 1: ALUR DUA TAHAP BERBASIS REGULASI */}
          {activeTab === 'alur' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              {/* Highlight Banner */}
              <div className="p-4 bg-gradient-to-r from-amber-100 via-orange-50 to-emerald-100 border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
                <h4 className="font-display font-black text-base text-neutral-900 mb-1 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-800" />
                  <span>Alur Resmi Kurikulum Merdeka SMK Muhammadiyah Bawang</span>
                </h4>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  Agar hasil file Excel dapat <strong>100% sama persis dan langsung dikenali oleh sistem aplikasi ini</strong> tanpa error, siapkan dokumen melalui 2 tahap berurutan berikut:
                </p>
              </div>

              {/* 2-Tahap Visual Stepper */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* TAHAP 1: CP ➔ ATP */}
                <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-300 text-black border border-black text-xs font-black uppercase">
                        Tahap 1
                      </span>
                      <span className="text-[11px] font-mono text-neutral-500 font-bold">Dasar Regulasi BSKAP 032</span>
                    </div>

                    <h5 className="font-display font-black text-base text-neutral-900">
                      Lampiran CP ➔ File Excel ATP (.xlsx)
                    </h5>

                    <p className="text-xs text-neutral-700 leading-relaxed">
                      Siapkan dokumen <strong>Lampiran Capaian Pembelajaran (CP)</strong> resmi Kemendikdasmen (BSKAP 032/H/KR/2024) sesuai bidang keahlian/jurusan Anda.
                    </p>

                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs space-y-1.5 text-neutral-800">
                      <div className="font-bold text-amber-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-700" />
                        <span>Langkah Eksekusi dengan AI:</span>
                      </div>
                      <ol className="list-decimal pl-4 space-y-1 text-[11px] text-neutral-700">
                        <li>Buka tab <strong>"2. Generator Prompt AI"</strong> di atas.</li>
                        <li>Pilih jurusan/mapel Anda, lalu klik <strong>"Salin Prompt AI untuk ATP"</strong>.</li>
                        <li>Buka Gemini (gemini.google.com) atau ChatGPT, tempel prompt tersebut.</li>
                        <li>AI menghasilkan tabel matriks ATP dengan 11 kolom resmi.</li>
                        <li>Salin tabel AI, paste di Excel sel A1, simpan sebagai <strong>.xlsx</strong>.</li>
                        <li>Upload ke aplikasi ini ➔ Dokumen ATP langsung tersusun!</li>
                      </ol>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900">Hasil: Dokumen ATP</span>
                    <button
                      onClick={() => {
                        setActiveTab('prompt');
                        setActivePromptType('atp');
                      }}
                      className="neo-btn px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black rounded-lg border border-black flex items-center gap-1 shadow-[2px_2px_0px_#000]"
                    >
                      <span>Buka Prompt ATP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* TAHAP 2: ATP ➔ RPP DEEP LEARNING */}
                <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-black border border-black text-xs font-black uppercase">
                        Tahap 2
                      </span>
                      <span className="text-[11px] font-mono text-neutral-500 font-bold">Deep Learning & PjBL/PBL</span>
                    </div>

                    <h5 className="font-display font-black text-base text-neutral-900">
                      Dokumen ATP ➔ File Excel RPP Terintegrasi (.xlsx)
                    </h5>

                    <p className="text-xs text-neutral-700 leading-relaxed">
                      Gunakan baris-baris <strong>ATP yang telah dihasilkan pada Tahap 1</strong> untuk menghasilkan dokumen RPP Deep Learning terintegrasi lengkap.
                    </p>

                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs space-y-1.5 text-neutral-800">
                      <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>Langkah Eksekusi dengan AI:</span>
                      </div>
                      <ol className="list-decimal pl-4 space-y-1 text-[11px] text-neutral-700">
                        <li>Buka tab <strong>"2. Generator Prompt AI"</strong>, pilih sub-tab <strong>"Prompt RPP Deep Learning"</strong>.</li>
                        <li>Salin prompt dan berikan baris ATP materi Anda ke Gemini / ChatGPT.</li>
                        <li>AI menghasilkan tabel komprehensif 26 kolom (Mindful, Meaningful, Joyful, Tabel Hasil Eksplorasi, Link/Embed LKPD).</li>
                        <li>Salin tabel jawaban AI ke Excel, simpan sebagai <strong>.xlsx</strong>.</li>
                        <li>Upload ke aplikasi ini ➔ Seluruh unit RPP langsung terdistribusi terpisah dengan Lembar Pengesahan dan Lampiran siap cetak!</li>
                      </ol>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-900">Hasil: RPP Siap Cetak F4</span>
                    <button
                      onClick={() => {
                        setActiveTab('prompt');
                        setActivePromptType('rpp');
                      }}
                      className="neo-btn px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-black rounded-lg border border-black flex items-center gap-1 shadow-[2px_2px_0px_#000]"
                    >
                      <span>Buka Prompt RPP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Fitur Khusus: Tabel Eksplorasi & Lampiran Embed */}
              <div className="p-4 bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000] space-y-3">
                <h5 className="font-display font-black text-sm text-neutral-900 flex items-center gap-2">
                  <Table className="w-4 h-4 text-purple-700" />
                  <span>Dukungan Penuh: Tabel Hasil Eksplorasi & Lampiran Embed Digital</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                    <strong className="text-purple-950 block font-bold">1. Tabel Hasil Eksplorasi dalam RPP:</strong>
                    <p className="text-neutral-700 text-[11px] leading-relaxed">
                      Dapat diisi melalui Excel dengan kolom <em>Tabel Hasil Eksplorasi</em>, atau diubah kapan saja secara manual melalui <strong>Editor RPP</strong> langsung di aplikasi.
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                    <strong className="text-blue-950 block font-bold">2. Tautan & Kode Embed Lampiran:</strong>
                    <p className="text-neutral-700 text-[11px] leading-relaxed">
                      Materi dan LKPD mendukung kolom tautan URL (yang dapat dibuka via klik hyperlink di PDF siap cetak) serta kolom kode embed HTML (&lt;iframe&gt;) untuk tampilan interaktif.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: GENERATOR PROMPT AI */}
          {activeTab === 'prompt' && (
            <div className="space-y-5 max-w-4xl mx-auto">
              
              {/* Preset Selector */}
              <div className="p-4 bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-200">
                  <div>
                    <h4 className="font-display font-black text-sm text-neutral-900">
                      Pilih Jurusan / Konsentrasi Keahlian & Mata Pelajaran:
                    </h4>
                    <p className="text-[11px] text-neutral-600">
                      Prompt AI akan otomatis disesuaikan dengan kurikulum kejuruan spesifik Anda.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md self-start sm:self-auto">
                    Konteks SMK Muhammadiyah Bawang
                  </span>
                </div>

                {/* Quick Presets Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {JURUSAN_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                        selectedJurusan === p.jurusan
                          ? 'bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0px_#000] font-black'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-300'
                      }`}
                    >
                      {p.jurusan.split('(')[0]}
                    </button>
                  ))}
                </div>

                {/* Customized Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-xs">
                  <div>
                    <label className="font-bold text-neutral-700 block mb-0.5 text-[11px]">Jurusan / Konsentrasi</label>
                    <input
                      type="text"
                      value={selectedJurusan}
                      onChange={(e) => setSelectedJurusan(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-black rounded-lg text-xs bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-neutral-700 block mb-0.5 text-[11px]">Mata Pelajaran</label>
                    <input
                      type="text"
                      value={selectedMapel}
                      onChange={(e) => setSelectedMapel(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-black rounded-lg text-xs bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-neutral-700 block mb-0.5 text-[11px]">Fase & Kelas</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        placeholder="Fase"
                        value={selectedFase}
                        onChange={(e) => setSelectedFase(e.target.value)}
                        className="w-1/2 px-2 py-1.5 border border-black rounded-lg text-xs bg-white text-center font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Kelas"
                        value={selectedKelas}
                        onChange={(e) => setSelectedKelas(e.target.value)}
                        className="w-1/2 px-2 py-1.5 border border-black rounded-lg text-xs bg-white text-center font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-neutral-700 block mb-0.5 text-[11px]">Semester</label>
                    <input
                      type="text"
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-black rounded-lg text-xs bg-white font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Sub-Tabs: Prompt ATP vs Prompt RPP */}
              <div className="flex items-center gap-2 border-b-2 border-black pb-1">
                <button
                  onClick={() => setActivePromptType('atp')}
                  className={`px-4 py-2 rounded-t-xl text-xs font-black transition-all flex items-center gap-1.5 border-t-2 border-x-2 ${
                    activePromptType === 'atp'
                      ? 'bg-amber-300 text-black border-black shadow-[2px_-2px_0px_#000]'
                      : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:bg-neutral-200'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-900" />
                  <span>A. Prompt AI untuk Generate Matriks ATP (.xlsx)</span>
                </button>
                <button
                  onClick={() => setActivePromptType('rpp')}
                  className={`px-4 py-2 rounded-t-xl text-xs font-black transition-all flex items-center gap-1.5 border-t-2 border-x-2 ${
                    activePromptType === 'rpp'
                      ? 'bg-emerald-300 text-black border-black shadow-[2px_-2px_0px_#000]'
                      : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:bg-neutral-200'
                  }`}
                >
                  <Layers className="w-4 h-4 text-emerald-950" />
                  <span>B. Prompt AI untuk Generate RPP Deep Learning (.xlsx)</span>
                </button>
              </div>

              {/* Prompt Card Box */}
              <div className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_#000]">
                <div className="p-3 bg-neutral-100 border-b border-black flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="font-mono text-xs font-bold text-neutral-800">
                      {activePromptType === 'atp'
                        ? 'Prompt AI: Alur Tujuan Pembelajaran (ATP)'
                        : 'Prompt AI: RPP Deep Learning Terintegrasi'}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      handleCopy(
                        activePromptType === 'atp' ? generatedAtpPrompt : generatedRppPrompt,
                        activePromptType
                      )
                    }
                    className="neo-btn px-4 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-black rounded-lg flex items-center gap-1.5 shadow-[2px_2px_0px_#404040]"
                  >
                    {copiedType === activePromptType ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Prompt Berhasil Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-amber-400" />
                        <span>Salin Prompt AI Ini</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 bg-neutral-50/80 font-mono text-xs text-neutral-800 max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed border-b border-black/10">
                  {activePromptType === 'atp' ? generatedAtpPrompt : generatedRppPrompt}
                </div>

                {/* Practical Copy-Paste Guide to Excel */}
                <div className="p-3.5 bg-amber-50 border-t border-amber-300 flex items-start gap-2.5 text-xs text-amber-950">
                  <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block font-bold">Cara Memasukkan Hasil Jawaban AI ke Microsoft Excel / Google Sheets:</strong>
                    <ol className="list-decimal pl-4 space-y-0.5 text-[11px] text-neutral-700">
                      <li>Buka <strong>Gemini</strong> (atau ChatGPT / Claude) dan paste prompt di atas. Jika Anda punya teks CP / ATP sendiri, lampirkan juga di chat.</li>
                      <li>AI akan memberikan respons berupa <strong>Tabel Markdown</strong>.</li>
                      <li>Blok seluruh tabel hasil jawaban AI dari baris header paling atas sampai baris terakhir, lalu tekan <strong>Ctrl + C (Copy)</strong>.</li>
                      <li>Buka aplikasi Microsoft Excel atau Google Sheets, klik pada sel <strong>A1</strong>, lalu tekan <strong>Ctrl + V (Paste)</strong>.</li>
                      <li>Simpan file dengan format <strong>Excel Workbook (.xlsx)</strong>.</li>
                      <li>Upload file tersebut ke aplikasi ini di Langkah 1 ➔ Dokumen resmi langsung tersaji sempurna!</li>
                    </ol>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SPESIFIKASI SKEMA KOLOM EXCEL */}
          {activeTab === 'skema' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              {/* Skema 1: Format Kolom ATP */}
              <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[3px_3px_0px_#000] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400 border border-black inline-block"></span>
                    <h5 className="font-display font-black text-sm uppercase text-neutral-900">
                      Format 1: Skema Kolom File Excel ATP (Alur Tujuan Pembelajaran)
                    </h5>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300">
                    11 Kolom Standar
                  </span>
                </div>

                <div className="border border-black overflow-x-auto rounded-lg">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-amber-100 border-b border-black font-bold text-neutral-900">
                        <th className="p-2 border-r border-black w-12 text-center">No</th>
                        <th className="p-2 border-r border-black w-40 text-left">Nama Kolom Excel</th>
                        <th className="p-2 border-r border-black w-24 text-center">Sifat</th>
                        <th className="p-2 text-left">Deskripsi & Contoh Isian</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 text-[11px]">
                      <tr>
                        <td className="p-2 border-r border-neutral-300 text-center font-bold">1</td>
                        <td className="p-2 border-r border-neutral-300 font-mono font-bold text-amber-900">No / Nomor</td>
                        <td className="p-2 border-r border-neutral-300 text-center text-emerald-700 font-bold">Wajib</td>
                        <td className="p-2">Nomor urut elemen (1, 2, 3...)</td>
                      </tr>
                      <tr className="bg-neutral-50/50">
                        <td className="p-2 border-r border-neutral-300 text-center font-bold">2</td>
                        <td className="p-2 border-r border-neutral-300 font-mono font-bold text-amber-900">Elemen</td>
                        <td className="p-2 border-r border-neutral-300 text-center text-emerald-700 font-bold">Wajib</td>
                        <td className="p-2">Nama elemen resmi CP (contoh: Praktikum Akuntansi Perusahaan Jasa dan Dagang)</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-neutral-300 text-center font-bold">3</td>
                        <td className="p-2 border-r border-neutral-300 font-mono font-bold text-amber-900">Capaian Pembelajaran (CP)</td>
                        <td className="p-2 border-r border-neutral-300 text-center text-emerald-700 font-bold">Wajib</td>
                        <td className="p-2">Paragraf CP resmi BSKAP No 032/H/KR/2024</td>
                      </tr>
                      <tr className="bg-neutral-50/50">
                        <td className="p-2 border-r border-neutral-300 text-center font-bold">4</td>
                        <td className="p-2 border-r border-neutral-300 font-mono font-bold text-amber-900">Tujuan Pembelajaran (TP)</td>
                        <td className="p-2 border-r border-neutral-300 text-center text-neutral-600">Opsional</td>
                        <td className="p-2">Daftar TP terstruktur (1. Peserta didik mampu... 2. Peserta didik mampu...)</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-neutral-300 text-center font-bold">5</td>
                        <td className="p-2 border-r border-neutral-300 font-mono font-bold text-amber-900">Alur Pembelajaran</td>
                        <td className="p-2 border-r border-neutral-300 text-center text-neutral-600">Opsional</td>
                        <td className="p-2">Tahapan alur linear (Tahap 1: Pengamatan, Tahap 2: Simulasi...)</td>
                      </tr>
                      <tr className="bg-neutral-50/50">
                        <td className="p-2 border-r border-neutral-300 text-center font-bold">6</td>
                        <td className="p-2 border-r border-neutral-300 font-mono font-bold text-amber-900">Lingkup Materi / Topik</td>
                        <td className="p-2 border-r border-neutral-300 text-center text-emerald-700 font-bold">Wajib</td>
                        <td className="p-2">Judul lingkup materi pokok yang akan menjadi unit RPP terpisah</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-neutral-300 text-center font-bold">7</td>
                        <td className="p-2 border-r border-neutral-300 font-mono font-bold text-amber-900">Alokasi Waktu (JP)</td>
                        <td className="p-2 border-r border-neutral-300 text-center text-emerald-700 font-bold">Wajib</td>
                        <td className="p-2">Jumlah jam pelajaran angka (contoh: 24 atau 18)</td>
                      </tr>
                      <tr className="bg-neutral-50/50">
                        <td className="p-2 border-r border-neutral-300 text-center font-bold">8-10</td>
                        <td className="p-2 border-r border-neutral-300 font-mono font-bold text-amber-900">Fase, Kelas, Semester</td>
                        <td className="p-2 border-r border-neutral-300 text-center text-neutral-600">Opsional</td>
                        <td className="p-2">Contoh: F, XI, 1 (Ganjil)</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-neutral-300 text-center font-bold">11</td>
                        <td className="p-2 border-r border-neutral-300 font-mono font-bold text-amber-900">Lintas Disiplin Ilmu</td>
                        <td className="p-2 border-r border-neutral-300 text-center text-neutral-600">Opsional</td>
                        <td className="p-2">Keterkaitan dengan disiplin ilmu lainnya</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Skema 2: Format Kolom RPP Terintegrasi */}
              <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[3px_3px_0px_#000] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border border-black inline-block"></span>
                    <h5 className="font-display font-black text-sm uppercase text-neutral-900">
                      Format 2: Skema Kolom File Excel RPP Terintegrasi Lengkap
                    </h5>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    Semua Kolom Deep Learning
                  </span>
                </div>

                <div className="border border-black overflow-x-auto rounded-lg">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-emerald-100 border-b border-black font-bold text-neutral-900">
                        <th className="p-2 border-r border-black w-12 text-center">No</th>
                        <th className="p-2 border-r border-black w-48 text-left">Nama Kolom Excel</th>
                        <th className="p-2 text-left">Keterangan Khusus & Format Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 text-[11px]">
                      <tr>
                        <td className="p-2 border-r border-neutral-300 text-center font-bold">1-11</td>
                        <td className="p-2 border-r border-neutral-300 font-mono font-bold">No s.d. Lintas Disiplin Ilmu</td>
                        <td className="p-2">Sama dengan skema ATP di atas (identitas dasar unit pembelajaran)</td>
                      </tr>
                      <tr className="bg-neutral-50/50">
                        <td className="p-2 border-r border-neutral-300 text-center font-bold">12-14</td>
                        <td className="p-2 border-r border-neutral-300 font-mono font-bold">Kesiapan, Karakteristik Materi, Profil Lulusan</td>
                        <td className="p-2">Profil kesiapan belajar murid (visual/auditory/kinestetik), sifat materi konseptual/aplikatif, dan dimensi P5</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-neutral-300 text-center font-bold">15-18</td>
                        <td className="p-2 border-r border-neutral-300 font-mono font-bold">Metode, Kemitraan, Lingkungan, Digital</td>
                        <td className="p-2">Model (PBL / PjBL), Mitra industri rekanan di Kabupaten Batang, dan ruang belajar fisik/virtual</td>
                      </tr>
                      <tr className="bg-amber-50">
                        <td className="p-2 border-r border-neutral-300 text-center font-bold">19-22</td>
                        <td className="p-2 border-r border-neutral-300 font-mono font-bold text-amber-900">Sintaks Pembelajaran Deep Learning</td>
                        <td className="p-2">
                          <strong>Sintaks Pendahuluan</strong> (Mindful), <strong>Sintaks Inti 1</strong> (Memahami & Eksplorasi Meaningful), <strong>Sintaks Inti 2</strong> (Mengaplikasi & Merefleksi Joyful), <strong>Sintaks Penutup</strong> (Refleksi 3-2-1 & Kaizen)
                        </td>
                      </tr>
                      <tr className="bg-purple-50">
                        <td className="p-2 border-r border-neutral-300 text-center font-bold">23</td>
                        <td className="p-2 border-r border-neutral-300 font-mono font-bold text-purple-900">Tabel Hasil Eksplorasi</td>
                        <td className="p-2">
                          Format: <code>Judul Tabel :: Kolom1 | Kolom2 :: baris1_k1 | baris1_k2 ; baris2_k1 | baris2_k2</code><br />
                          Dapat diubah secara dinamis melalui upload Excel maupun diedit manual di aplikasi.
                        </td>
                      </tr>
                      <tr className="bg-neutral-50/50">
                        <td className="p-2 border-r border-neutral-300 text-center font-bold">24-26</td>
                        <td className="p-2 border-r border-neutral-300 font-mono font-bold">Asesmen Awal, Proses, dan Akhir</td>
                        <td className="p-2">Diagnostik kesiapan, formatif unjuk kerja kelompok, dan sumatif job sheet/proyek</td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="p-2 border-r border-neutral-300 text-center font-bold">27-30</td>
                        <td className="p-2 border-r border-neutral-300 font-mono font-bold text-blue-900">Tautan & Kode Embed (Materi & LKPD)</td>
                        <td className="p-2">
                          <strong>Tautan Materi & Tautan LKPD</strong>: URL yang aktif dibuka via hyperlink di PDF.<br />
                          <strong>Kode Embed Materi & LKPD</strong>: Tag HTML &lt;iframe&gt; untuk pratinjau digital interaktif.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-neutral-100 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="text-[11px] font-mono text-neutral-600 flex items-center gap-1.5">
            <span className="font-bold text-neutral-800">SMK Muhammadiyah Bawang, Batang</span>
            <span>·</span>
            <span>Copyright developed by @hndx07</span>
          </div>

          <button
            onClick={onClose}
            className="neo-btn px-5 py-1.5 bg-neutral-900 text-white font-bold text-xs rounded-xl"
          >
            Selesai Membaca & Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
