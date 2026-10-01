import React from 'react';
import {
  SchoolIdentity,
  AlurTujuanPembelajaranItem,
  ModulAjarData,
} from '../types';
import { CheckCircle2, CheckSquare, Square, Printer, Info, Edit3, Code2, ExternalLink, Table, Layers } from 'lucide-react';
import { ReadableColumnPoints } from './ReadableColumnPoints';

interface PrintableDocumentProps {
  identity: SchoolIdentity;
  atpList: AlurTujuanPembelajaranItem[];
  modulAjarList: ModulAjarData[];
  documentMode?: 'atp_only' | 'modul_selected' | 'lampiran_selected' | 'modul_all' | 'both_separate';
  selectedModulIndex?: number;
  activeFilter?: 'all' | 'atp' | 'modul' | 'all_modul' | 'lkpd';
  activeModulIndex?: number;
  watermarkOpacity?: number;
  onOpenRppEditor?: (initialTab?: 'desain' | 'sintaks' | 'eksplorasi' | 'asesmen' | 'lampiran') => void;
}

export const PrintableDocument: React.FC<PrintableDocumentProps> = ({
  identity,
  atpList,
  modulAjarList,
  documentMode = 'atp_only',
  selectedModulIndex = 0,
  activeFilter,
  activeModulIndex,
  watermarkOpacity = 0.5,
  onOpenRppEditor,
}) => {
  const schoolLogoUrl =
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgzWdtCjCcX2chJuhLX_26N5MmkVK-1SkyO7kgXznQQJPQa6_TB_EJzD1WWpztg7yX9RBRE7rGn0t2Z3FdG06mwwT6pQix8t6vnlcOBm_EgGl9z0jeJemJkppP0KIIjkXGksQvaCLh2dz-gOF6a2H213VQBL6Am8Elhmd76OOnphogk-EoTTbkYbg0TQJhv/s512/34690.png';
  const watermarkUrl =
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh14eQT9MWn4-D1hdb8FisPsg0qK1iIvxXbMg0RGCvXFzUVWUt_KTiOWcEBzrJYxqALWV7_RPeowvTNfbyw-tbCeDb40lvY5jm_lWN5_jjeZko2SF82_wLRcW2-rBs6fWcauvugbRXBRODAeDb0FBkV81rSrgh6stKQG9ZWf5MU3qxTwiqdSEO9AaJ1EbUX/s480/44857.png';

  const effectiveMode = documentMode || (activeFilter === 'atp' ? 'atp_only' : activeFilter === 'modul' ? 'modul_selected' : activeFilter === 'all_modul' ? 'modul_all' : 'both_separate');
  const safeIndex = Math.min(
    selectedModulIndex !== undefined ? selectedModulIndex : (activeModulIndex || 0),
    Math.max(0, modulAjarList.length - 1)
  );

  const showAtp = effectiveMode === 'atp_only' || effectiveMode === 'both_separate';
  const showSingleRpp = effectiveMode === 'modul_selected';
  const showLampiranOnly = effectiveMode === 'lampiran_selected';
  const showAllRpp = effectiveMode === 'modul_all' || effectiveMode === 'both_separate';

  const selectedModul = modulAjarList[safeIndex] || modulAjarList[0];

  // Official School Kop Surat (matching official letterhead in landscape ratio)
  const renderKopSurat = () => (
    <div className="border-b-[3px] border-black pb-2 text-center mb-5 page-break-inside-avoid">
      <div className="flex items-center justify-between gap-4">
        <div className="w-24 h-24 shrink-0 flex items-center justify-center">
          <img
            src={schoolLogoUrl}
            alt="Logo SMK Muhammadiyah Bawang"
            className="w-20 h-20 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex-1 text-center font-sans">
          <h4 className="text-xs sm:text-sm font-black tracking-widest text-neutral-900 uppercase leading-tight">
            {identity.majelisLine1 || 'MAJLIS PENDIDIKAN DASAR DAN MENENGAH'}
          </h4>
          <h5 className="text-xs sm:text-sm font-black tracking-wider text-neutral-900 uppercase leading-tight mt-0.5">
            {identity.majelisLine2 || 'DAERAH MUHAMMADIYAH BATANG'}
          </h5>
          <h1 className="font-black text-xl sm:text-2xl md:text-3xl text-neutral-950 uppercase tracking-tight mt-0.5 leading-none">
            {identity.schoolName || 'SMK MUHAMMADIYAH BAWANG'}
          </h1>
          <div className="text-xs sm:text-sm font-black tracking-[0.25em] text-neutral-900 uppercase my-1">
            {identity.statusAkreditasi || 'T E R A K R E D I T A S I  “ A ”'}
          </div>
          <p className="text-[11px] sm:text-xs text-neutral-800 font-semibold leading-tight">
            {identity.alamatLengkap || 'Jl. Bawang-Sukorejo Km 01 Ds. Jlamprang Kec. Bawang Kab. Batang.'}
          </p>
          <p className="text-[10px] sm:text-[11px] text-neutral-800 font-medium leading-tight mt-0.5">
            Email : <span className="underline">{identity.email || 'smkmuhbawang@gmail.com'}</span>  Website : <span className="underline">{identity.website || 'www.smkmuhiba.sch.id'}</span>
          </p>
          <p className="text-[10px] sm:text-[11px] text-neutral-800 font-medium leading-tight">
            Kode Pos. {identity.kodePos || '51274'} Telp. {identity.telepon || '(0285) 4486909'} Fax. {identity.fax || '(0285) 4486899'}
          </p>
        </div>

        {/* Spacer to balance left logo and keep center school letterhead typography perfectly centered (right header icon removed) */}
        <div className="w-24 hidden md:block shrink-0" aria-hidden="true" />
      </div>
      {/* Official double rule below kop */}
      <div className="mt-2 border-b-[2.5px] border-black"></div>
      <div className="mt-[2px] border-b-[1px] border-black"></div>
    </div>
  );

  // Lembar Pengesahan Resmi Dokumen (Sesuai Kurikulum Merdeka)
  const renderTandaTanganPengesahan = (contextTitle: string) => (
    <div className="mt-8 pt-4 border-t-2 border-black page-break-inside-avoid">
      <div className="text-center font-bold text-xs uppercase tracking-wider text-neutral-800 mb-1">
        LEMBAR PENGESAHAN {contextTitle.toUpperCase()}
      </div>
      <p className="text-[11px] text-neutral-700 leading-relaxed text-center max-w-2xl mx-auto mb-5">
        Disahkan dan dinyatakan berlaku sebagai panduan resmi pelaksanaan pembelajaran di <strong>SMK Muhammadiyah Bawang</strong> untuk Tahun Pelajaran {identity.tahunPelajaran}.
      </p>

      <div className="grid grid-cols-2 gap-8 text-xs text-neutral-900 pt-2 max-w-4xl mx-auto">
        <div className="text-center">
          <p className="font-medium text-neutral-600">Mengetahui,</p>
          <p className="font-extrabold text-neutral-900 mt-0.5">Kepala SMK Muhammadiyah Bawang</p>
          <div className="h-24"></div>
          <p className="font-black underline text-sm">{identity.namaKepalaSekolah}</p>
          <p className="text-[11px] font-mono text-neutral-600">NBM/NIP. {identity.nipKepalaSekolah}</p>
        </div>

        <div className="text-center">
          <p className="font-medium text-neutral-600">Bawang, {identity.tanggalPenyusunan}</p>
          <p className="font-extrabold text-neutral-900 mt-0.5">Guru Pengampu</p>
          <div className="h-24"></div>
          <p className="font-black underline text-sm">{identity.namaGuru}</p>
          <p className="text-[11px] font-mono text-neutral-600">NBM/NIP. {identity.nipGuru}</p>
        </div>
      </div>
    </div>
  );

  // Helper to render embed iframe or URL preview in lampiran
  const renderEmbedBox = (embedCode?: string, label?: string) => {
    if (!embedCode || !embedCode.trim()) return null;
    const isIframe = embedCode.includes('<iframe');
    const isUrl = embedCode.trim().startsWith('http');

    return (
      <div className="mt-3 border-2 border-dashed border-emerald-600 rounded-lg p-3 bg-emerald-50/50 page-break-inside-avoid">
        <div className="flex items-center justify-between text-[11px] font-black text-emerald-950 mb-2">
          <span className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Digital Interaktif (Embed): {label || 'Lampiran'}</span>
          </span>
          <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
            Pratinjau Media
          </span>
        </div>

        <div className="w-full bg-white border border-black/40 rounded overflow-hidden">
          {isIframe ? (
            <div
              className="w-full min-h-[360px] flex items-center justify-center [&>iframe]:w-full [&>iframe]:min-h-[360px] [&>iframe]:border-0"
              dangerouslySetInnerHTML={{ __html: embedCode }}
            />
          ) : isUrl ? (
            <iframe
              src={embedCode.trim()}
              title={label}
              className="w-full h-[380px] border-0"
              allowFullScreen
            />
          ) : (
            <div className="p-3 font-mono text-xs text-neutral-800 bg-neutral-100 whitespace-pre-wrap">
              {embedCode}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render Full Lampiran Section (Used under Lembar Pengesahan and for standalone Lampiran tab)
  const renderLampiranContent = (modul: ModulAjarData, index: number) => {
    const lampiran = modul.rppFormat.lampiran;

    return (
      <div className="space-y-6">
        <div className="text-center pb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block">
            DOKUMEN PENDUKUNG PEMBELAJARAN
          </span>
          <h4 className="font-display font-black text-base uppercase text-neutral-950">
            LAMPIRAN RPP PENDEKATAN DEEP LEARNING
          </h4>
          <p className="text-xs text-neutral-600">
            Unit {index + 1}: {modul.judulMateri} · SMK Muhammadiyah Bawang, Batang
          </p>

          {/* Screen quick edit trigger for Lampiran */}
          {onOpenRppEditor && (
            <div className="mt-2 flex justify-center no-print">
              <button
                onClick={() => onOpenRppEditor('lampiran')}
                className="neo-btn px-3 py-1 bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-black rounded-lg border border-black flex items-center gap-1 shadow-[2px_2px_0px_#000]"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>✏️ Input Kode Embed LKPD / Materi / Rubrik</span>
              </button>
            </div>
          )}
        </div>

        {/* Lampiran 1: Materi Pembelajaran (Diletakkan di atas LKPD sesuai instruksi) */}
        <div className="border border-black p-4 bg-white space-y-3 text-xs page-break-inside-avoid">
          <div className="border-b border-black pb-1.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-500 font-bold">Lampiran 1</span>
              <h5 className="font-bold text-xs uppercase text-neutral-900">
                Materi Pembelajaran: {lampiran.bahanBacaan.judul}
              </h5>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-300">
              Bahan Ajar & Media
            </span>
          </div>

          {/* Kolom Tautan Materi (Hiperlink yang aktif di PDF Siap Cetak) */}
          <div className="p-3 bg-blue-50/70 border border-blue-300 rounded-lg space-y-1">
            <span className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
              <span>🔗 Tautan Materi Pembelajaran (Klik untuk Membuka):</span>
            </span>
            {lampiran.bahanBacaan.tautan ? (
              <a
                href={lampiran.bahanBacaan.tautan}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 underline font-mono text-xs break-all font-semibold inline-flex items-center gap-1"
              >
                <span>{lampiran.bahanBacaan.tautan}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            ) : (
              <span className="text-neutral-500 italic text-[11px] block">
                (Tautan materi pembelajaran belum diisi. Tambahkan tautan melalui Editor RPP)
              </span>
            )}
          </div>

          {/* Kolom Input Kode Script HTML / Embed Materi */}
          {renderEmbedBox(lampiran.bahanBacaan.embedCode, 'Media & Materi Pembelajaran (Kode Script / Embed HTML)')}
        </div>

        {/* Lampiran 2: LKPD (Semua teks isi dihapus kecuali judul header, kolom tautan & embed) */}
        <div className="border border-black p-4 bg-white space-y-3 text-xs page-break-inside-avoid">
          <div className="border-b border-black pb-1.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-500 font-bold">Lampiran 2</span>
              <h5 className="font-bold text-xs uppercase text-neutral-900">
                LKPD (Lembar Kerja Peserta Didik): {lampiran.lkpd.judul}
              </h5>
            </div>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
              Job Sheet / LKPD
            </span>
          </div>

          {/* Kolom Tautan LKPD (Hiperlink yang aktif di PDF Siap Cetak) */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-lg space-y-1">
            <span className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
              <span>🔗 Tautan LKPD Digital (Klik untuk Membuka):</span>
            </span>
            {lampiran.lkpd.tautan ? (
              <a
                href={lampiran.lkpd.tautan}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-900 underline font-mono text-xs break-all font-semibold inline-flex items-center gap-1"
              >
                <span>{lampiran.lkpd.tautan}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            ) : (
              <span className="text-neutral-500 italic text-[11px] block">
                (Tautan LKPD belum diisi. Tambahkan tautan melalui Editor RPP)
              </span>
            )}
          </div>

          {/* Dibawahnya Kolom Kode Embed LKPD */}
          {renderEmbedBox(lampiran.lkpd.embedCode, 'LKPD Digital Interaktif (Embed HTML)')}
        </div>

        {/* Lampiran 3: Rubrik Observasi Formatif */}
        <div className="border border-black p-4 bg-white space-y-3 text-xs page-break-inside-avoid">
          <div className="border-b border-black pb-1">
            <span className="text-[10px] font-mono text-neutral-500 font-bold">Lampiran 3</span>
            <h5 className="font-bold text-xs uppercase text-neutral-900">
              Rubrik Penilaian Formatif Observasi Aktivitas Siswa di Kelompok
            </h5>
          </div>
          <div className="border border-black overflow-hidden">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-black font-bold">
                  <th className="p-1.5 border-r border-black w-10 text-center">No</th>
                  <th className="p-1.5 border-r border-black w-48 text-left">Aspek Yang Diamati</th>
                  <th className="p-1.5 border-r border-black text-left">Kriteria</th>
                  <th className="p-1.5 w-16 text-center">Skor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {lampiran.rubrikObservasiKelompok.map((item) => (
                  <React.Fragment key={item.no}>
                    {item.kriteria.map((krit, kIdx) => (
                      <tr key={kIdx}>
                        {kIdx === 0 && (
                          <>
                            <td rowSpan={item.kriteria.length} className="p-1.5 border-r border-neutral-300 text-center font-bold align-top">
                              {item.no}.
                            </td>
                            <td rowSpan={item.kriteria.length} className="p-1.5 border-r border-neutral-300 font-bold align-top">
                              {item.aspek}
                            </td>
                          </>
                        )}
                        <td className="p-1.5 border-r border-neutral-300">{krit.split('(Skor')[0]}</td>
                        <td className="p-1.5 text-center font-mono font-bold">{kIdx + 1}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Embed code rendering for Rubrik */}
          {renderEmbedBox(lampiran.embedCodeRubrik || lampiran.rubrikObservasiKelompok?.[0]?.embedCode, 'Rubrik & Kuis Penilaian')}
        </div>

        {/* Lampiran 4: Instrumen Rekapitulasi Observasi Nilai Siswa (27 Siswa) - Perfect in Landscape F4 */}
        <div className="border border-black p-4 bg-white space-y-3 text-xs page-break-inside-avoid">
          <div className="border-b border-black pb-1 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-500 font-bold">Lampiran 4</span>
              <h5 className="font-bold text-xs uppercase text-neutral-900">
                Instrumen Penilaian Formatif Observasi Aktivitas Siswa di Kelompok (Rekapitulasi 27 Siswa)
              </h5>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
              Format F4 Landscape (330mm)
            </span>
          </div>
          <div className="border border-black overflow-hidden">
            <table className="w-full text-[10px] border-collapse text-center">
              <thead>
                <tr className="bg-neutral-100 border-b border-black font-bold">
                  <th className="p-1 border-r border-black w-8">No</th>
                  <th className="p-1 border-r border-black text-left w-64">Nama Siswa</th>
                  <th className="p-1 border-r border-black w-14">Keaktifan (1-4)</th>
                  <th className="p-1 border-r border-black w-14">Kerjasama (1-4)</th>
                  <th className="p-1 border-r border-black w-14">Tanggung Jawab (1-4)</th>
                  <th className="p-1 border-r border-black w-14">Disiplin (1-4)</th>
                  <th className="p-1 border-r border-black w-14">Ketuntasan (1-4)</th>
                  <th className="p-1 border-r border-black w-14">Total Skor</th>
                  <th className="p-1 w-14">Nilai Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {lampiran.rekapNilaiSiswaContoh.map((mhs) => (
                  <tr key={mhs.no} className={mhs.no % 2 === 0 ? 'bg-neutral-50/50' : 'bg-white'}>
                    <td className="p-1 border-r border-neutral-300 font-bold">{mhs.no}</td>
                    <td className="p-1 border-r border-neutral-300 text-left font-medium">{mhs.nama}</td>
                    <td className="p-1 border-r border-neutral-300 font-mono">{mhs.keaktifan}</td>
                    <td className="p-1 border-r border-neutral-300 font-mono">{mhs.kerjasama}</td>
                    <td className="p-1 border-r border-neutral-300 font-mono">{mhs.tanggungJawab}</td>
                    <td className="p-1 border-r border-neutral-300 font-mono">{mhs.disiplin}</td>
                    <td className="p-1 border-r border-neutral-300 font-mono">{mhs.ketuntasan}</td>
                    <td className="p-1 border-r border-neutral-300 font-mono font-bold text-amber-900">{mhs.totalSkor}</td>
                    <td className="p-1 font-mono font-bold text-emerald-900">{mhs.nilaiAkhir}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] font-mono text-neutral-700">
            Rumus Penilaian: Nilai Akhir = (Total Skor / Skor Maksimal 20) x 100
          </div>
        </div>
      </div>
    );
  };

  // Render RPP Pendekatan Deep Learning strictly adhering to official format in Landscape F4
  const renderRppDeepLearning = (modul: ModulAjarData, index: number, isMultiPrint = false) => {
    const rpp = modul.rppFormat;
    const pMendalam = rpp.perencanaanMendalam;
    const ident = pMendalam.identifikasi;
    const desain = pMendalam.desainPembelajaran;
    const langkah = rpp.pengalamanBelajar;
    const asesmen = rpp.asesmen;
    const lampiran = rpp.lampiran;

    return (
      <div key={modul.id} className={`relative space-y-6 ${isMultiPrint && index > 0 ? 'page-break-before pt-6' : ''}`}>
        {renderKopSurat()}

        {/* Quick Table Editor Action (Screen only) */}
        {onOpenRppEditor && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-amber-100/80 border-2 border-black rounded-xl no-print shadow-[2px_2px_0px_#000]">
            <div className="flex items-center gap-2 text-xs font-black text-neutral-900">
              <Table className="w-4 h-4 text-black" />
              <span>Editor Tabel & Sintaks Deep Learning (Unit {index + 1})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenRppEditor('sintaks')}
                className="neo-btn px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black rounded-lg border border-black flex items-center gap-1 shadow-[1px_1px_0px_#000]"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Opsi Sintaks PjBL/PBL</span>
              </button>
              <button
                onClick={() => onOpenRppEditor('lampiran')}
                className="neo-btn px-2.5 py-1 bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-black rounded-lg border border-black flex items-center gap-1 shadow-[1px_1px_0px_#000]"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Input Embed & Lampiran</span>
              </button>
              <button
                onClick={() => onOpenRppEditor('desain')}
                className="neo-btn px-2.5 py-1 bg-white hover:bg-neutral-100 text-black text-xs font-bold rounded-lg border border-black flex items-center gap-1 shadow-[1px_1px_0px_#000]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Kolom RPP</span>
              </button>
            </div>
          </div>
        )}

        {/* Title Header RPP */}
        <div className="text-center pb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block mb-0.5">
            PERANGKAT AJAR KURIKULUM MERDEKA · SMK MUHAMMADIYAH BAWANG
          </span>
          <h2 className="font-display font-black text-base sm:text-lg text-neutral-950 uppercase tracking-tight">
            RENCANA PELAKSANAAN PEMBELAJARAN (RPP)
          </h2>
          <h3 className="font-black text-sm text-neutral-900 uppercase tracking-wider">
            PENDEKATAN DEEP LEARNING (MINDFUL, MEANINGFUL, JOYFUL LEARNING)
          </h3>
          <p className="text-xs font-bold text-amber-900 mt-0.5">
            Unit {index + 1}: {modul.judulMateri} ({modul.alokasiWaktuMateri || '18 JP'})
          </p>
        </div>

        {/* A. IDENTITAS - 2-Kolom Landscape dengan Titik Dua yang Selaras Sempurna */}
        <div className="space-y-1.5">
          <h4 className="font-black text-xs uppercase text-neutral-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-black inline-block"></span>
            <span>A. Identitas</span>
          </h4>
          <div className="border border-black overflow-hidden bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black text-xs">
              {/* Kolom Kiri */}
              <div className="divide-y divide-neutral-200">
                <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                  <span className="font-bold text-neutral-800">Satuan Pendidikan</span>
                  <span className="font-bold text-center text-neutral-900">:</span>
                  <span className="font-semibold text-neutral-900 pl-1">SMK Muhammadiyah Bawang, Batang</span>
                </div>
                <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                  <span className="font-bold text-neutral-800">Program Keahlian</span>
                  <span className="font-bold text-center text-neutral-900">:</span>
                  <span className="font-semibold text-neutral-900 pl-1">{identity.programKeahlian}</span>
                </div>
                <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                  <span className="font-bold text-neutral-800">Konsentrasi Keahlian</span>
                  <span className="font-bold text-center text-neutral-900">:</span>
                  <span className="font-semibold text-neutral-900 pl-1">{identity.konsentrasiKeahlian}</span>
                </div>
                <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                  <span className="font-bold text-neutral-800">Mata Pelajaran</span>
                  <span className="font-bold text-center text-neutral-900">:</span>
                  <span className="font-semibold text-neutral-900 pl-1">{identity.mataPelajaran}</span>
                </div>
                <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                  <span className="font-bold text-neutral-800">Lingkup Materi</span>
                  <span className="font-bold text-center text-neutral-900">:</span>
                  <span className="font-black text-neutral-950 pl-1">{modul.judulMateri}</span>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="divide-y divide-neutral-200">
                <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                  <span className="font-bold text-neutral-800">Fase / Kelas</span>
                  <span className="font-bold text-center text-neutral-900">:</span>
                  <span className="font-semibold text-neutral-900 pl-1">Fase {identity.fase} / Kelas {identity.kelas}</span>
                </div>
                <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                  <span className="font-bold text-neutral-800">Semester</span>
                  <span className="font-bold text-center text-neutral-900">:</span>
                  <span className="font-semibold text-neutral-900 pl-1">{identity.semester}</span>
                </div>
                <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                  <span className="font-bold text-neutral-800">Tahun Pelajaran</span>
                  <span className="font-bold text-center text-neutral-900">:</span>
                  <span className="font-semibold text-neutral-900 pl-1">{identity.tahunPelajaran}</span>
                </div>
                <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                  <span className="font-bold text-neutral-800">Alokasi Waktu (JP)</span>
                  <span className="font-bold text-center text-neutral-900">:</span>
                  <span className="font-mono font-bold text-neutral-900 pl-1">{modul.alokasiWaktuMateri || rpp.identitasTabel.waktuJp || '18 JP'}</span>
                </div>
                <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                  <span className="font-bold text-neutral-800">Guru Pengampu</span>
                  <span className="font-bold text-center text-neutral-900">:</span>
                  <span className="font-semibold text-neutral-900 pl-1">{identity.namaGuru}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* B. PERENCANAAN PEMBELAJARAN MENDALAM */}
        <div className="space-y-4">
          <h4 className="font-black text-xs uppercase text-neutral-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-black inline-block"></span>
            <span>B. Perencanaan Pembelajaran Mendalam (Deep Learning)</span>
          </h4>

          {/* 1. Identifikasi */}
          <div className="space-y-2">
            <h5 className="font-bold text-xs text-neutral-900">1. Identifikasi Kesiapan dan Karakteristik</h5>
            <div className="border border-black overflow-hidden bg-white text-xs">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="w-56 p-2.5 font-bold align-top bg-neutral-50/70 border-r border-black">
                      a. Identifikasi Kesiapan Peserta Didik
                    </td>
                    <td className="p-2.5 text-neutral-800 space-y-1.5">
                      <div className="grid grid-cols-[170px_16px_1fr] items-start">
                        <span className="font-bold text-neutral-800">Minat</span>
                        <span className="font-bold text-center text-neutral-900">:</span>
                        <span className="text-neutral-900 pl-1">{ident.kesiapanPesertaDidik.minat}</span>
                      </div>
                      <div className="grid grid-cols-[170px_16px_1fr] items-start">
                        <span className="font-bold text-neutral-800">Cara Belajar</span>
                        <span className="font-bold text-center text-neutral-900">:</span>
                        <span className="text-neutral-900 pl-1">{ident.kesiapanPesertaDidik.caraBelajar}</span>
                      </div>
                      <div className="grid grid-cols-[170px_16px_1fr] items-start">
                        <span className="font-bold text-neutral-800">Lingkungan Tempat Tinggal</span>
                        <span className="font-bold text-center text-neutral-900">:</span>
                        <span className="text-neutral-900 pl-1">{ident.kesiapanPesertaDidik.lingkunganTempatTinggal}</span>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b border-black">
                    <td className="w-56 p-2.5 font-bold align-top bg-neutral-50/70 border-r border-black">
                      b. Karakteristik Materi Pelajaran
                    </td>
                    <td className="p-2.5 text-neutral-800 space-y-2">
                      <p>{ident.karakteristikMateri.deskripsiMateri}</p>
                      <p className="font-semibold text-neutral-900">Karakteristik materi adalah sebagai berikut:</p>
                      <ReadableColumnPoints
                        content={ident.karakteristikMateri.poinKarakteristik}
                        badgeColor="neutral"
                        badgeStyle="number"
                        className="space-y-1"
                      />
                      <div className="pt-1.5 border-t border-neutral-200 space-y-1">
                        <div className="grid grid-cols-[230px_16px_1fr] items-start">
                          <span className="font-bold text-neutral-800">Bersifat Konseptual & Aplikatif</span>
                          <span className="font-bold text-center text-neutral-900">:</span>
                          <span className="text-neutral-900 pl-1">{ident.karakteristikMateri.sifatMateri.konseptualDanAplikatif}</span>
                        </div>
                        <div className="grid grid-cols-[230px_16px_1fr] items-start">
                          <span className="font-bold text-neutral-800">Menumbuhkan Berpikir Ilmiah</span>
                          <span className="font-bold text-center text-neutral-900">:</span>
                          <span className="text-neutral-900 pl-1">{ident.karakteristikMateri.sifatMateri.kemampuanBerpikirIlmiah}</span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="w-56 p-2.5 font-bold align-top bg-neutral-50/70 border-r border-black">
                      c. Dimensi Profil Lulusan (Pancasila)
                    </td>
                    <td className="p-2.5">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          {ident.dimensiProfilLulusan.keimananKetakwaan ? <CheckSquare className="w-4 h-4 text-emerald-700" /> : <Square className="w-4 h-4 text-neutral-400" />}
                          <span>Keimanan & ketakwaan</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {ident.dimensiProfilLulusan.kesehatan ? <CheckSquare className="w-4 h-4 text-emerald-700" /> : <Square className="w-4 h-4 text-neutral-400" />}
                          <span>Kesehatan</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {ident.dimensiProfilLulusan.kemandirian ? <CheckSquare className="w-4 h-4 text-emerald-700" /> : <Square className="w-4 h-4 text-neutral-400" />}
                          <span>Kemandirian</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {ident.dimensiProfilLulusan.bernalarKritis ? <CheckSquare className="w-4 h-4 text-emerald-700" /> : <Square className="w-4 h-4 text-neutral-400" />}
                          <span>Bernalar kritis</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {ident.dimensiProfilLulusan.kolaborasi ? <CheckSquare className="w-4 h-4 text-emerald-700" /> : <Square className="w-4 h-4 text-neutral-400" />}
                          <span>Kolaborasi</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {ident.dimensiProfilLulusan.komunikasi ? <CheckSquare className="w-4 h-4 text-emerald-700" /> : <Square className="w-4 h-4 text-neutral-400" />}
                          <span>Komunikasi</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {ident.dimensiProfilLulusan.kreativitas ? <CheckSquare className="w-4 h-4 text-emerald-700" /> : <Square className="w-4 h-4 text-neutral-400" />}
                          <span>Kreativitas</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {ident.dimensiProfilLulusan.kewargaan ? <CheckSquare className="w-4 h-4 text-emerald-700" /> : <Square className="w-4 h-4 text-neutral-400" />}
                          <span>Kewargaan</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Desain Pembelajaran */}
          <div className="space-y-2">
            <h5 className="font-bold text-xs text-neutral-900">2. Desain Pembelajaran Terpadu</h5>
            <div className="border border-black overflow-hidden bg-white text-xs">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="w-56 p-2.5 font-bold align-top bg-neutral-50/70 border-r border-black">
                      a. Capaian Pembelajaran (CP)
                    </td>
                    <td className="p-2.5 text-neutral-800 leading-relaxed">
                      {desain.capaianPembelajaran}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-56 p-2.5 font-bold align-top bg-neutral-50/70 border-r border-black">
                      b. Lintas Disiplin Ilmu
                    </td>
                    <td className="p-2.5 text-neutral-800">
                      {desain.lintasDisiplinIlmu}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-56 p-2.5 font-bold align-top bg-neutral-50/70 border-r border-black">
                      c. Tujuan Pembelajaran
                    </td>
                    <td className="p-2.5 text-neutral-800">
                      <p className="font-semibold mb-1.5 text-neutral-900">Peserta didik mampu:</p>
                      <ReadableColumnPoints
                        content={desain.tujuanPembelajaran}
                        badgeColor="amber"
                        badgeStyle="number"
                        className="space-y-1.5"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-56 p-2.5 font-bold align-top bg-neutral-50/70 border-r border-black">
                      d. Topik Pembelajaran Kontekstual
                    </td>
                    <td className="p-2.5 text-neutral-800">
                      <ReadableColumnPoints
                        content={desain.topikKontekstual}
                        badgeColor="blue"
                        badgeStyle="number"
                        className="space-y-1"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-56 p-2.5 font-bold align-top bg-neutral-50/70 border-r border-black">
                      e. Kerangka Pembelajaran
                      <br />
                      <span className="font-normal text-[11px] text-neutral-600">1) Praktik Pedagogik</span>
                    </td>
                    <td className="p-2.5 text-neutral-800 space-y-1">
                      <p>{desain.kerangkaPembelajaran.praktikPedagogik.pbl}</p>
                      <p>{desain.kerangkaPembelajaran.praktikPedagogik.pjbl}</p>
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-56 p-2.5 font-bold align-top bg-neutral-50/70 border-r border-black">
                      2) Kemitraan Pembelajaran
                    </td>
                    <td className="p-2.5 text-neutral-800 space-y-2.5">
                      <div className="bg-neutral-50/60 p-2 rounded-lg border border-neutral-200">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="inline-flex items-center justify-center font-mono font-bold text-[10px] min-w-[18px] h-[18px] rounded bg-purple-100 text-purple-950 border border-purple-300 print:border-black print:bg-neutral-100 print:text-black">
                            1
                          </span>
                          <strong className="text-neutral-900">
                            Mitra Dunia Kerja / Industri ({desain.kerangkaPembelajaran.kemitraanPembelajaran.mitraIndustri.nama})
                          </strong>
                        </div>
                        <ul className="list-disc pl-6 space-y-0.5 text-xs text-neutral-800">
                          {desain.kerangkaPembelajaran.kemitraanPembelajaran.mitraIndustri.peran.map((pr, i) => (
                            <li key={i}>{pr}</li>
                          ))}
                          <li><strong>Terkait PBL:</strong> {desain.kerangkaPembelajaran.kemitraanPembelajaran.mitraIndustri.terkaitPbl}</li>
                        </ul>
                      </div>
                      <div className="bg-neutral-50/60 p-2 rounded-lg border border-neutral-200">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="inline-flex items-center justify-center font-mono font-bold text-[10px] min-w-[18px] h-[18px] rounded bg-purple-100 text-purple-950 border border-purple-300 print:border-black print:bg-neutral-100 print:text-black">
                            2
                          </span>
                          <strong className="text-neutral-900">Orang Tua / Wali Murid</strong>
                        </div>
                        <ul className="list-disc pl-6 space-y-0.5 text-xs text-neutral-800">
                          {desain.kerangkaPembelajaran.kemitraanPembelajaran.orangTuaWali.peran.map((pr, i) => (
                            <li key={i}>{pr}</li>
                          ))}
                          <li><strong>Terkait Metode Belajar:</strong> {desain.kerangkaPembelajaran.kemitraanPembelajaran.orangTuaWali.terkaitMetode}</li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="w-56 p-2.5 font-bold align-top bg-neutral-50/70 border-r border-black">
                      3) Lingkungan Belajar
                    </td>
                    <td className="p-2.5 text-neutral-800 space-y-1.5">
                      <div className="grid grid-cols-[130px_16px_1fr] items-start">
                        <span className="font-bold text-neutral-800">Ruang Fisik</span>
                        <span className="font-bold text-center text-neutral-900">:</span>
                        <span className="text-neutral-900 pl-1">{desain.kerangkaPembelajaran.lingkunganBelajar.ruangFisik.join('; ')}</span>
                      </div>
                      <div className="grid grid-cols-[130px_16px_1fr] items-start">
                        <span className="font-bold text-neutral-800">Ruang Virtual</span>
                        <span className="font-bold text-center text-neutral-900">:</span>
                        <span className="text-neutral-900 pl-1">{desain.kerangkaPembelajaran.lingkunganBelajar.ruangVirtual.join('; ')}</span>
                      </div>
                      <div className="grid grid-cols-[130px_16px_1fr] items-start">
                        <span className="font-bold text-neutral-800">Budaya Belajar</span>
                        <span className="font-bold text-center text-neutral-900">:</span>
                        <span className="text-neutral-900 pl-1">{desain.kerangkaPembelajaran.lingkunganBelajar.budayaBelajar.join('; ')}</span>
                      </div>
                      <div className="mt-2 pt-1 border-t border-neutral-200 space-y-1">
                        <p className="font-semibold text-neutral-900 mb-0.5">Penerapan nyata budaya belajar berupa:</p>
                        <div className="grid grid-cols-[130px_16px_1fr] items-start">
                          <span className="font-semibold text-neutral-700">Ruang Fisik</span>
                          <span className="text-center font-bold">:</span>
                          <span className="text-neutral-800 pl-1">{desain.kerangkaPembelajaran.lingkunganBelajar.penerapanNyataBudaya.ruangFisik}</span>
                        </div>
                        <div className="grid grid-cols-[130px_16px_1fr] items-start">
                          <span className="font-semibold text-neutral-700">Ruang Virtual</span>
                          <span className="text-center font-bold">:</span>
                          <span className="text-neutral-800 pl-1">{desain.kerangkaPembelajaran.lingkunganBelajar.penerapanNyataBudaya.ruangVirtual}</span>
                        </div>
                        <div className="grid grid-cols-[130px_16px_1fr] items-start">
                          <span className="font-semibold text-neutral-700">Budaya Belajar</span>
                          <span className="text-center font-bold">:</span>
                          <span className="text-neutral-800 pl-1">{desain.kerangkaPembelajaran.lingkunganBelajar.penerapanNyataBudaya.budayaBelajar}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="w-56 p-2.5 font-bold align-top bg-neutral-50/70 border-r border-black">
                      4) Pemanfaatan Digital
                    </td>
                    <td className="p-2.5 text-neutral-800">
                      <ReadableColumnPoints
                        content={desain.kerangkaPembelajaran.pemanfaatanDigital}
                        badgeColor="blue"
                        badgeStyle="bullet"
                        className="space-y-1"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. PENGALAMAN BELAJAR (LANGKAH-LANGKAH DEEP LEARNING) */}
        <div className="space-y-3">
          <h4 className="font-black text-xs uppercase text-neutral-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-black inline-block"></span>
            <span>3. Pengalaman Belajar (Sintaks Pendekatan Deep Learning)</span>
          </h4>
          <h5 className="font-bold text-xs text-neutral-900">a. Langkah-langkah Pembelajaran</h5>

          <div className="border border-black overflow-hidden bg-white text-xs">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-black">
                  <td className="w-48 p-2.5 font-bold align-top bg-neutral-50/70 border-r border-black">
                    Kegiatan Inti
                    <br />
                    <span className="font-normal text-[11px] text-neutral-600">(bermakna, menggembirakan)</span>
                  </td>
                  <td className="p-2.5 text-neutral-800 space-y-3">
                    <div>
                      <p className="font-bold text-neutral-900 mb-1">a. Memahami (bermakna-menggembirakan)</p>
                      <p className="leading-relaxed mb-2">
                        {langkah.kegiatanInti.memahamiBermaknaMenggembirakan.instruksiGuru}
                      </p>

                      {langkah.kegiatanInti.memahamiBermaknaMenggembirakan.tabelEksplorasi && (
                        <div className="my-2 border border-black max-w-lg">
                          <div className="bg-amber-100 font-bold p-1.5 border-b border-black text-[11px] flex items-center justify-between gap-2">
                            <span>{langkah.kegiatanInti.memahamiBermaknaMenggembirakan.tabelEksplorasi.judul}</span>
                            {onOpenRppEditor && (
                              <button
                                onClick={() => onOpenRppEditor('eksplorasi')}
                                className="neo-btn px-2 py-0.5 bg-amber-300 hover:bg-amber-200 text-black text-[10px] font-black rounded border border-black flex items-center gap-1 shadow-[1px_1px_0px_#000] no-print shrink-0"
                                title="Ubah tabel ini secara manual atau upload Excel"
                              >
                                <Edit3 className="w-2.5 h-2.5" />
                                <span>✏️ Ubah Manual / Upload Excel</span>
                              </button>
                            )}
                          </div>
                          <table className="w-full text-center text-[11px]">
                            <thead>
                              <tr className="bg-neutral-100 border-b border-black font-bold">
                                <th className="p-1 border-r border-black w-1/2">
                                  {langkah.kegiatanInti.memahamiBermaknaMenggembirakan.tabelEksplorasi.kolom[0]}
                                </th>
                                <th className="p-1 w-1/2">
                                  {langkah.kegiatanInti.memahamiBermaknaMenggembirakan.tabelEksplorasi.kolom[1]}
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                              {langkah.kegiatanInti.memahamiBermaknaMenggembirakan.tabelEksplorasi.data.map(([c1, c2], rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 border-r border-neutral-300 font-mono text-left">
                                    <ReadableColumnPoints content={c1} badgeColor="amber" />
                                  </td>
                                  <td className="p-1.5 font-mono text-left">
                                    <ReadableColumnPoints content={c2} badgeColor="emerald" />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <p className="font-semibold text-neutral-900 mt-2">
                        Setelah diskusi kelompok dan kelas, guru menyimpulkan hasil temuan:
                      </p>
                      <div className="mt-1">
                        <ReadableColumnPoints
                          content={langkah.kegiatanInti.memahamiBermaknaMenggembirakan.rangkumanTemuan}
                          badgeColor="amber"
                          badgeStyle="number"
                          className="space-y-1"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-200">
                      <p className="font-bold text-neutral-900 mb-1">b. Merefleksi (berkesadaran - bermakna)</p>
                      <p>{langkah.kegiatanInti.merefleksiBerkesadaranBermakna.instruksiAplikasi}</p>
                      <p className="text-neutral-600 mt-0.5">{langkah.kegiatanInti.merefleksiBerkesadaranBermakna.penguatanKonsep}</p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="w-48 p-2.5 font-bold align-top bg-neutral-50/70 border-r border-black">
                    Kegiatan Penutup
                  </td>
                  <td className="p-2.5 text-neutral-800 space-y-2">
                    <div>
                      <p className="font-semibold text-neutral-900 mb-1">
                        • Refleksi individu (Teknik Kaizen 3-2-1):
                      </p>
                      <div className="space-y-1.5 pl-2 text-xs">
                        <div className="flex items-start gap-2">
                          <span className="inline-flex items-center justify-center font-mono font-bold text-[10px] min-w-[20px] h-[18px] px-1 rounded bg-purple-100 text-purple-950 border border-purple-300 shrink-0 mt-[1px] select-none print:border-black print:bg-neutral-100 print:text-black">
                            3
                          </span>
                          <span className="flex-1">{langkah.kegiatanPenutup.refleksiIndividu321.tigaHalPenting}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="inline-flex items-center justify-center font-mono font-bold text-[10px] min-w-[20px] h-[18px] px-1 rounded bg-purple-100 text-purple-950 border border-purple-300 shrink-0 mt-[1px] select-none print:border-black print:bg-neutral-100 print:text-black">
                            2
                          </span>
                          <span className="flex-1">{langkah.kegiatanPenutup.refleksiIndividu321.duaPertanyaan}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="inline-flex items-center justify-center font-mono font-bold text-[10px] min-w-[20px] h-[18px] px-1 rounded bg-purple-100 text-purple-950 border border-purple-300 shrink-0 mt-[1px] select-none print:border-black print:bg-neutral-100 print:text-black">
                            1
                          </span>
                          <span className="flex-1">{langkah.kegiatanPenutup.refleksiIndividu321.satuHalMenarik}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-[190px_16px_1fr] items-start pt-1">
                      <span className="font-semibold text-neutral-800">• Kesimpulan dan Penguatan</span>
                      <span className="font-bold text-center text-neutral-900">:</span>
                      <span className="text-neutral-800 pl-1">{langkah.kegiatanPenutup.kesimpulanDanPenguatan}</span>
                    </div>
                    <div className="grid grid-cols-[190px_16px_1fr] items-start">
                      <span className="font-semibold text-neutral-800">• Rencana Tindak Lanjut</span>
                      <span className="font-bold text-center text-neutral-900">:</span>
                      <span className="text-neutral-800 pl-1">{langkah.kegiatanPenutup.tindakLanjut}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. ASESMEN PEMBELAJARAN */}
        <div className="space-y-4">
          <h4 className="font-black text-xs uppercase text-neutral-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-black inline-block"></span>
            <span>4. Asesmen Pembelajaran</span>
          </h4>

          {/* Ringkasan Asesmen dengan Titik Dua Selaras */}
          <div className="border border-black overflow-hidden bg-white text-xs">
            <div className="divide-y divide-neutral-200">
              <div className="grid grid-cols-[190px_16px_1fr] items-start p-2">
                <span className="font-bold text-neutral-800">Asesmen Awal (Diagnostik)</span>
                <span className="font-bold text-center text-neutral-900">:</span>
                <span className="text-neutral-900 pl-1">{asesmen.ringkasan.asesmenAwal}</span>
              </div>
              <div className="grid grid-cols-[190px_16px_1fr] items-start p-2">
                <span className="font-bold text-neutral-800">Asesmen Proses (Formatif)</span>
                <span className="font-bold text-center text-neutral-900">:</span>
                <span className="text-neutral-900 pl-1">{asesmen.ringkasan.asesmenProses}</span>
              </div>
              <div className="grid grid-cols-[190px_16px_1fr] items-start p-2">
                <span className="font-bold text-neutral-800">Asesmen Akhir (Sumatif)</span>
                <span className="font-bold text-center text-neutral-900">:</span>
                <span className="text-neutral-900 pl-1">{asesmen.ringkasan.asesmenAkhir}</span>
              </div>
            </div>
          </div>

          {/* a. Asesmen Awal Detail */}
          <div className="space-y-1.5">
            <h5 className="font-bold text-xs text-neutral-900">a. Asesmen Awal: Instrumen Penilaian Awal Pembelajaran</h5>
            <div className="grid grid-cols-[80px_16px_1fr] text-[11px] items-start text-neutral-700">
              <span className="font-semibold">Tujuan</span>
              <span className="font-bold text-center">:</span>
              <span className="pl-1 italic">{asesmen.asesmenAwalInstrumen.tujuan}</span>
            </div>
            <div className="border border-black overflow-hidden bg-white max-w-2xl">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-b border-black font-bold">
                    <th className="p-1.5 border-r border-black w-10 text-center">No</th>
                    <th className="p-1.5 border-r border-black">Daftar Pertanyaan Pemantik</th>
                    <th className="p-1.5 border-r border-black w-16 text-center">Ya</th>
                    <th className="p-1.5 w-16 text-center">Tidak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {asesmen.asesmenAwalInstrumen.daftarPertanyaan.map((q) => (
                    <tr key={q.no}>
                      <td className="p-1.5 border-r border-neutral-300 text-center font-bold">{q.no}</td>
                      <td className="p-1.5 border-r border-neutral-300">{q.pertanyaan}</td>
                      <td className="p-1.5 border-r border-neutral-300 text-center"></td>
                      <td className="p-1.5 text-center"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-[80px_16px_1fr] text-[11px] items-start text-neutral-600">
              <span className="font-semibold">Evaluasi</span>
              <span className="font-bold text-center">:</span>
              <span className="pl-1">{asesmen.asesmenAwalInstrumen.tujuanEvaluasi}</span>
            </div>
          </div>

          {/* b. Asesmen Proses */}
          <div className="space-y-1.5 text-xs">
            <h5 className="font-bold text-xs text-neutral-900">b. Asesmen Proses (Formatif)</h5>
            <div className="border border-black overflow-hidden bg-white p-2.5 divide-y divide-neutral-200">
              <div className="flex items-start gap-2 py-1.5">
                <span className="inline-flex items-center justify-center font-mono font-bold text-[10px] min-w-[18px] h-[18px] rounded bg-emerald-100 text-emerald-950 border border-emerald-400 shrink-0 mt-[1px] select-none print:border-black print:bg-neutral-100 print:text-black">
                  1
                </span>
                <div className="grid grid-cols-[110px_16px_1fr] items-start flex-1 min-w-0">
                  <span className="font-bold text-neutral-800">Diskusi</span>
                  <span className="font-bold text-center text-neutral-900">:</span>
                  <span className="text-neutral-900 pl-1">{asesmen.asesmenProsesDetail.diskusi}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 py-1.5">
                <span className="inline-flex items-center justify-center font-mono font-bold text-[10px] min-w-[18px] h-[18px] rounded bg-emerald-100 text-emerald-950 border border-emerald-400 shrink-0 mt-[1px] select-none print:border-black print:bg-neutral-100 print:text-black">
                  2
                </span>
                <div className="grid grid-cols-[110px_16px_1fr] items-start flex-1 min-w-0">
                  <span className="font-bold text-neutral-800">Presentasi</span>
                  <span className="font-bold text-center text-neutral-900">:</span>
                  <span className="text-neutral-900 pl-1">{asesmen.asesmenProsesDetail.presentasi}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 py-1.5">
                <span className="inline-flex items-center justify-center font-mono font-bold text-[10px] min-w-[18px] h-[18px] rounded bg-emerald-100 text-emerald-950 border border-emerald-400 shrink-0 mt-[1px] select-none print:border-black print:bg-neutral-100 print:text-black">
                  3
                </span>
                <div className="grid grid-cols-[110px_16px_1fr] items-start flex-1 min-w-0">
                  <span className="font-bold text-neutral-800">Unjuk Kerja</span>
                  <span className="font-bold text-center text-neutral-900">:</span>
                  <span className="text-neutral-900 pl-1">{asesmen.asesmenProsesDetail.unjukKerja}</span>
                </div>
              </div>
            </div>
          </div>

          {/* c. ASESMEN SUMATIF */}
          <div className="space-y-3 pt-2">
            <h5 className="font-black text-xs text-neutral-900 uppercase">c. Asesmen Sumatif (Akhir Pembelajaran)</h5>
            <p className="text-xs text-neutral-700 leading-relaxed">
              {asesmen.asesmenSumatifDetail.pengantar}
            </p>

            {/* Sikap Spiritual & Sosial in 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="border border-black p-3 bg-white">
                <h6 className="font-bold text-neutral-900 mb-1">1) Penilaian Sikap Spiritual</h6>
                <div className="space-y-1 mb-2 text-[11px]">
                  <div className="grid grid-cols-[130px_16px_1fr] items-start">
                    <span className="font-semibold text-neutral-700">Teknik Penilaian</span>
                    <span className="font-bold text-center">:</span>
                    <span className="text-neutral-900 pl-1">{asesmen.asesmenSumatifDetail.sikapSpiritual.teknik}</span>
                  </div>
                  <div className="grid grid-cols-[130px_16px_1fr] items-start">
                    <span className="font-semibold text-neutral-700">Instrumen</span>
                    <span className="font-bold text-center">:</span>
                    <span className="text-neutral-900 pl-1">{asesmen.asesmenSumatifDetail.sikapSpiritual.instrumen}</span>
                  </div>
                  <div className="grid grid-cols-[130px_16px_1fr] items-start">
                    <span className="font-semibold text-neutral-700">Nama Siswa</span>
                    <span className="font-bold text-center">:</span>
                    <span className="text-neutral-400 pl-1">........................................</span>
                  </div>
                </div>

                <table className="w-full text-[10px] border border-black border-collapse text-center">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-black font-bold">
                      <th className="p-1 border-r border-black w-8">No.</th>
                      <th className="p-1 border-r border-black text-left">Indikator</th>
                      <th className="p-1 border-r border-black w-8">SL</th>
                      <th className="p-1 border-r border-black w-8">SR</th>
                      <th className="p-1 border-r border-black w-8">KD</th>
                      <th className="p-1 w-8">TP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {asesmen.asesmenSumatifDetail.sikapSpiritual.indikator.map((ind, i) => (
                      <tr key={i}>
                        <td className="p-1 border-r border-neutral-300 font-bold">{i + 1}</td>
                        <td className="p-1 border-r border-neutral-300 text-left">{ind}</td>
                        <td className="p-1 border-r border-neutral-300"></td>
                        <td className="p-1 border-r border-neutral-300"></td>
                        <td className="p-1 border-r border-neutral-300"></td>
                        <td className="p-1"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border border-black p-3 bg-white">
                <h6 className="font-bold text-neutral-900 mb-1">2) Penilaian Sikap Sosial</h6>
                <div className="space-y-1 mb-2 text-[11px]">
                  <div className="grid grid-cols-[130px_16px_1fr] items-start">
                    <span className="font-semibold text-neutral-700">Teknik Penilaian</span>
                    <span className="font-bold text-center">:</span>
                    <span className="text-neutral-900 pl-1">{asesmen.asesmenSumatifDetail.sikapSosial.teknik}</span>
                  </div>
                  <div className="grid grid-cols-[130px_16px_1fr] items-start">
                    <span className="font-semibold text-neutral-700">Instrumen</span>
                    <span className="font-bold text-center">:</span>
                    <span className="text-neutral-900 pl-1">{asesmen.asesmenSumatifDetail.sikapSosial.instrumen}</span>
                  </div>
                  <div className="grid grid-cols-[130px_16px_1fr] items-start">
                    <span className="font-semibold text-neutral-700">Nama Siswa</span>
                    <span className="font-bold text-center">:</span>
                    <span className="text-neutral-400 pl-1">........................................</span>
                  </div>
                </div>

                <table className="w-full text-[10px] border border-black border-collapse text-center">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-black font-bold">
                      <th className="p-1 border-r border-black w-8">No.</th>
                      <th className="p-1 border-r border-black text-left">Indikator</th>
                      <th className="p-1 border-r border-black w-8">SL</th>
                      <th className="p-1 border-r border-black w-8">SR</th>
                      <th className="p-1 border-r border-black w-8">KD</th>
                      <th className="p-1 w-8">TP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {asesmen.asesmenSumatifDetail.sikapSosial.indikator.map((ind, i) => (
                      <tr key={i}>
                        <td className="p-1 border-r border-neutral-300 font-bold">{i + 1}</td>
                        <td className="p-1 border-r border-neutral-300 text-left">{ind}</td>
                        <td className="p-1 border-r border-neutral-300"></td>
                        <td className="p-1 border-r border-neutral-300"></td>
                        <td className="p-1 border-r border-neutral-300"></td>
                        <td className="p-1"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rubrik Penilaian Sikap Observasi */}
            <div className="border border-black p-3 bg-white text-xs mt-3">
              <h6 className="font-bold text-neutral-900 mb-2">
                3) Rubrik Penilaian Sikap Observasi Kelompok
              </h6>
              <div className="border border-black overflow-hidden">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-black font-bold">
                      <th className="p-1.5 border-r border-black text-left w-36">Kriteria</th>
                      <th className="p-1.5 border-r border-black text-left">Sangat Baik (4)</th>
                      <th className="p-1.5 border-r border-black text-left">Baik (3)</th>
                      <th className="p-1.5 border-r border-black text-left">Cukup (2)</th>
                      <th className="p-1.5 text-left">Perlu Bimbingan (1)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {asesmen.asesmenSumatifDetail.rubrikPenilaianSikapObservasi.map((rub, rIdx) => (
                      <tr key={rIdx}>
                        <td className="p-1.5 border-r border-neutral-300 font-bold bg-neutral-50/50">{rub.kriteria}</td>
                        <td className="p-1.5 border-r border-neutral-300">{rub.sangatBaik}</td>
                        <td className="p-1.5 border-r border-neutral-300">{rub.baik}</td>
                        <td className="p-1.5 border-r border-neutral-300">{rub.cukup}</td>
                        <td className="p-1.5">{rub.perluDikembangkan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* F. PENGAYAAN DAN REMEDIAL */}
        <div className="space-y-2">
          <h4 className="font-black text-xs uppercase text-neutral-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-black inline-block"></span>
            <span>F. Pengayaan dan Remedial</span>
          </h4>
          <div className="border border-black p-3 bg-white text-xs divide-y divide-neutral-200">
            <div className="grid grid-cols-[160px_16px_1fr] items-start py-1.5">
              <span className="font-bold text-neutral-800">Program Pengayaan</span>
              <span className="font-bold text-center text-neutral-900">:</span>
              <span className="text-neutral-900 pl-1 leading-relaxed">{rpp.pengayaanDanRemedial.pengayaan}</span>
            </div>
            <div className="grid grid-cols-[160px_16px_1fr] items-start py-1.5">
              <span className="font-bold text-neutral-800">Program Remedial</span>
              <span className="font-bold text-center text-neutral-900">:</span>
              <span className="text-neutral-900 pl-1 leading-relaxed">{rpp.pengayaanDanRemedial.remedial}</span>
            </div>
          </div>
        </div>

        {/* G. REFLEKSI GURU DAN PESERTA DIDIK */}
        <div className="space-y-3">
          <h4 className="font-black text-xs uppercase text-neutral-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-black inline-block"></span>
            <span>G. Refleksi Guru dan Peserta Didik</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="border border-black p-3 bg-white space-y-2">
              <h5 className="font-bold text-neutral-900">1. Refleksi Pendidik (Jurnal Refleksi Diri)</h5>
              <div className="border border-black overflow-hidden">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-black font-bold">
                      <th className="p-1 border-r border-black w-8">No</th>
                      <th className="p-1 border-r border-black text-left">Aspek Yang Direfleksikan</th>
                      <th className="p-1 text-left">Deskripsi Refleksi Guru</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {rpp.refleksiGuruDanPesertaDidik.refleksiGuru.map((rg) => (
                      <tr key={rg.no}>
                        <td className="p-1 border-r border-neutral-300 text-center font-bold">{rg.no}</td>
                        <td className="p-1 border-r border-neutral-300 font-medium">{rg.aspek}</td>
                        <td className="p-1">{rg.refleksi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border border-black p-3 bg-white space-y-2">
              <h5 className="font-bold text-neutral-900">2. Refleksi Peserta Didik (Angket Pemahaman)</h5>
              <div className="border border-black overflow-hidden">
                <table className="w-full text-xs border-collapse text-center">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-black font-bold">
                      <th className="p-1 border-r border-black w-8">No</th>
                      <th className="p-1 border-r border-black text-left">Kompetensi Yang Dipelajari</th>
                      <th className="p-1 border-r border-black w-10">😃</th>
                      <th className="p-1 border-r border-black w-10">😐</th>
                      <th className="p-1 w-10">🙁</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {rpp.refleksiGuruDanPesertaDidik.refleksiPesertaDidik.angketEmoticon.map((ae) => (
                      <tr key={ae.no}>
                        <td className="p-1 border-r border-neutral-300 font-bold">{ae.no}</td>
                        <td className="p-1 border-r border-neutral-300 text-left">{ae.kompetensi}</td>
                        <td className="p-1 border-r border-neutral-300"></td>
                        <td className="p-1 border-r border-neutral-300"></td>
                        <td className="p-1"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Lembar Pengesahan Resmi di Atas Lampiran (Sesuai Regulasi dan Permintaan) */}
        {renderTandaTanganPengesahan(`RPP DEEP LEARNING: ${modul.judulMateri}`)}

        {/* LAMPIRAN-LAMPIRAN RESMI: Masuk ke Halaman Baru di Bawah Lembar Pengesahan */}
        <div className="space-y-6 pt-6 border-t-2 border-black page-break-before break-before-page">
          {renderLampiranContent(modul, index)}
        </div>
      </div>
    );
  };

  return (
    <div className="relative bg-white neo-box-lg p-4 sm:p-8 md:p-10 mx-auto max-w-7xl shadow-[6px_6px_0px_#000] border-[3px] border-black print-container overflow-hidden">
      {/* Background Watermark (with configurable opacity) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
        style={{ opacity: watermarkOpacity }}
        aria-hidden="true"
      >
        <img
          src={watermarkUrl}
          alt="Watermark SMK Muhammadiyah Bawang"
          className="w-[550px] h-[550px] object-contain select-none max-w-none transform -rotate-12"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-10 space-y-10">
        {/* DOKUMEN 1: ALUR TUJUAN PEMBELAJARAN (ATP) */}
        {showAtp && (
          <section className="space-y-4">
            {renderKopSurat()}

            <div className="text-center py-2 bg-amber-100/70 border-2 border-black rounded-xl shadow-[3px_3px_0px_#000]">
              <span className="text-[10px] font-black tracking-widest uppercase text-amber-900 block">
                DOKUMEN PERANGKAT AJAR KURIKULUM MERDEKA
              </span>
              <h2 className="font-display font-black text-lg sm:text-xl text-neutral-900 uppercase">
                ALUR TUJUAN PEMBELAJARAN (ATP)
              </h2>
              <p className="text-xs font-bold text-neutral-700 mt-0.5">
                MATA PELAJARAN: {identity.mataPelajaran.toUpperCase()} · FASE {identity.fase} / KELAS {identity.kelas}
              </p>
              <p className="text-[11px] font-semibold text-neutral-600">
                Tahun Pelajaran {identity.tahunPelajaran} · SMK Muhammadiyah Bawang, Batang
              </p>
            </div>

            {/* Identitas ATP Tabel - 2-Kolom Landscape dengan Titik Dua yang Selaras */}
            <div className="border border-black overflow-hidden bg-white text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black">
                <div className="divide-y divide-neutral-200">
                  <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                    <span className="font-bold text-neutral-800">Satuan Pendidikan</span>
                    <span className="font-bold text-center text-neutral-900">:</span>
                    <span className="font-semibold text-neutral-900 pl-1">SMK Muhammadiyah Bawang, Batang</span>
                  </div>
                  <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                    <span className="font-bold text-neutral-800">Program Keahlian</span>
                    <span className="font-bold text-center text-neutral-900">:</span>
                    <span className="font-semibold text-neutral-900 pl-1">{identity.programKeahlian}</span>
                  </div>
                  <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                    <span className="font-bold text-neutral-800">Konsentrasi Keahlian</span>
                    <span className="font-bold text-center text-neutral-900">:</span>
                    <span className="font-semibold text-neutral-900 pl-1">{identity.konsentrasiKeahlian}</span>
                  </div>
                  <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                    <span className="font-bold text-neutral-800">Mata Pelajaran</span>
                    <span className="font-bold text-center text-neutral-900">:</span>
                    <span className="font-semibold text-neutral-900 pl-1">{identity.mataPelajaran}</span>
                  </div>
                </div>

                <div className="divide-y divide-neutral-200">
                  <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                    <span className="font-bold text-neutral-800">Fase / Kelas</span>
                    <span className="font-bold text-center text-neutral-900">:</span>
                    <span className="font-semibold text-neutral-900 pl-1">Fase {identity.fase} / Kelas {identity.kelas}</span>
                  </div>
                  <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                    <span className="font-bold text-neutral-800">Semester</span>
                    <span className="font-bold text-center text-neutral-900">:</span>
                    <span className="font-semibold text-neutral-900 pl-1">{identity.semester}</span>
                  </div>
                  <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                    <span className="font-bold text-neutral-800">Tahun Pelajaran</span>
                    <span className="font-bold text-center text-neutral-900">:</span>
                    <span className="font-semibold text-neutral-900 pl-1">{identity.tahunPelajaran}</span>
                  </div>
                  <div className="grid grid-cols-[150px_16px_1fr] items-start p-2">
                    <span className="font-bold text-neutral-800">Guru Pengampu</span>
                    <span className="font-bold text-center text-neutral-900">:</span>
                    <span className="font-semibold text-neutral-900 pl-1">{identity.namaGuru}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Matriks Tabel ATP - Proposional untuk Kertas Landscape F4 */}
            <div className="overflow-x-auto border-2 border-black rounded-xl bg-white shadow-[3px_3px_0px_#000]">
              <table className="w-full text-left text-[11px] border-collapse table-fixed min-w-[950px]">
                <thead>
                  <tr className="bg-amber-200 border-b-2 border-black text-neutral-900 font-black">
                    <th className="p-2 border-r border-black text-center w-[5%]">Kode</th>
                    <th className="p-2 border-r border-black w-[11%]">Elemen</th>
                    <th className="p-2 border-r border-black w-[19%]">Capaian Pembelajaran (CP)</th>
                    <th className="p-2 border-r border-black w-[11%]">Lingkup Materi</th>
                    <th className="p-2 border-r border-black w-[19%]">Tujuan Pembelajaran (TP)</th>
                    <th className="p-2 border-r border-black w-[14%]">Alur Pembelajaran (ATP)</th>
                    <th className="p-2 border-r border-black w-[8%]">Profil Pancasila</th>
                    <th className="p-2 border-r border-black w-[5%] text-center">JP</th>
                    <th className="p-2 w-[8%]">Rencana Asesmen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/30">
                  {atpList.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'}>
                      <td className="p-2 border-r border-black font-mono font-bold text-center text-amber-900 align-top">
                        {item.kodeTp}
                      </td>
                      <td className="p-2 border-r border-black font-bold text-neutral-900 align-top">
                        {item.elemen}
                      </td>
                      <td className="p-2 border-r border-black text-neutral-700 leading-snug align-top">
                        <ReadableColumnPoints content={item.capaianPembelajaran} badgeColor="neutral" />
                      </td>
                      <td className="p-2 border-r border-black font-semibold text-neutral-800 align-top">
                        <ReadableColumnPoints content={item.lingkupMateri} badgeColor="neutral" />
                      </td>
                      <td className="p-2 border-r border-black text-neutral-900 leading-snug align-top">
                        <ReadableColumnPoints content={item.tujuanPembelajaran} badgeColor="amber" />
                      </td>
                      <td className="p-2 border-r border-black text-neutral-700 leading-snug align-top">
                        <ReadableColumnPoints content={item.alurTujuanPembelajaran} badgeColor="emerald" />
                      </td>
                      <td className="p-2 border-r border-black text-neutral-800 align-top">
                        <ul className="list-disc pl-3 space-y-0.5">
                          {item.profilPelajarPancasila.map((ppp, pIdx) => (
                            <li key={pIdx}>{ppp}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-2 border-r border-black font-mono font-bold text-center align-top text-neutral-900">
                        {item.alokasiWaktuJp} JP
                      </td>
                      <td className="p-2 text-neutral-700 align-top text-[10px] space-y-1.5">
                        <div className="flex items-start gap-1">
                          <span className="font-mono font-bold text-[9px] px-1 py-0.2 rounded bg-neutral-100 text-neutral-900 border border-neutral-400 shrink-0 select-none print:border-black print:bg-neutral-100">
                            Diag
                          </span>
                          <span className="flex-1 leading-tight">{item.asesmenRencana.diagnostik}</span>
                        </div>
                        <div className="flex items-start gap-1">
                          <span className="font-mono font-bold text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-950 border border-amber-400 shrink-0 select-none print:border-black print:bg-neutral-100">
                            Form
                          </span>
                          <span className="flex-1 leading-tight">{item.asesmenRencana.formatif}</span>
                        </div>
                        <div className="flex items-start gap-1">
                          <span className="font-mono font-bold text-[9px] px-1 py-0.2 rounded bg-blue-100 text-blue-950 border border-blue-400 shrink-0 select-none print:border-black print:bg-neutral-100">
                            Sum
                          </span>
                          <span className="flex-1 leading-tight">{item.asesmenRencana.sumatif}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Rangkaian Alur Linear */}
            <div className="p-3 bg-emerald-50/70 border-2 border-black rounded-xl">
              <h5 className="font-extrabold text-xs uppercase tracking-wider text-emerald-950 mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Rangkaian Alur Linear Pembelajaran (Fase {identity.fase})</span>
              </h5>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {atpList.map((item, i) => (
                  <React.Fragment key={item.id}>
                    <div className="bg-white border-2 border-black rounded-lg px-2 py-1 shadow-[2px_2px_0px_#000]">
                      <span className="font-mono font-bold text-amber-800 mr-1">{item.kodeTp}</span>
                      <span className="font-medium text-neutral-800">{item.lingkupMateri}</span>
                    </div>
                    {i < atpList.length - 1 && (
                      <span className="font-black text-neutral-400">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Tanda Tangan Pengesahan di bawah Dokumen ATP */}
            {renderTandaTanganPengesahan('ALUR TUJUAN PEMBELAJARAN (ATP)')}
          </section>
        )}

        {/* DOKUMEN 2: RPP PENDEKATAN DEEP LEARNING (Unit Materi Terpilih) */}
        {showSingleRpp && selectedModul && (
          <section className="space-y-6">
            {renderRppDeepLearning(selectedModul, safeIndex, false)}
          </section>
        )}

        {/* DOKUMEN 3: LAMPIRAN & RUBRIK SAJA (Unit Materi Terpilih) */}
        {showLampiranOnly && selectedModul && (
          <section className="space-y-6">
            {renderKopSurat()}
            {renderLampiranContent(selectedModul, safeIndex)}
          </section>
        )}

        {/* DOKUMEN 3: SEMUA RPP TERPISAH BERURUTAN */}
        {showAllRpp && (
          <section className={`space-y-8 ${showAtp ? 'page-break-before pt-8 border-t-[3px] border-black' : ''}`}>
            {modulAjarList.map((modul, idx) => renderRppDeepLearning(modul, idx, true))}
          </section>
        )}
      </div>
    </div>
  );
};
