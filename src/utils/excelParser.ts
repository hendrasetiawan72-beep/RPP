import * as XLSX from 'xlsx';
import {
  ExcelRawRow,
  ExcelRppRawRow,
  ParsedExcelResult,
  AlurTujuanPembelajaranItem,
  SchoolIdentity,
  ModulAjarData,
} from '../types';

/**
 * Normalizes header string to recognize variations in teacher spreadsheets
 */
function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Parse an uploaded Excel/CSV file into structured objects.
 * Automatically identifies whether the file is:
 * 1. 'cp'  : Format Capaian Pembelajaran (CP, Elemen, Materi, JP, Fase, Kelas)
 * 2. 'rpp' : Format RPP Terintegrasi (Lengkap dengan CP, ATP, Materi, Metode, Sintaks Pembelajaran, dan Asesmen)
 */
export async function parseExcelFile(file: File): Promise<ParsedExcelResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Grab first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to array of arrays to find real header row
        const rawAoA: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!rawAoA || rawAoA.length === 0) {
          throw new Error('File Excel kosong atau tidak terbaca.');
        }

        let headerRowIndex = -1;
        let colMap: { [key: string]: number } = {};
        let isRppFormat = false;

        // Scan the first 15 rows to find the main header
        for (let r = 0; r < Math.min(rawAoA.length, 15); r++) {
          const row = rawAoA[r];
          if (!Array.isArray(row)) continue;

          const rowKeys = row.map((c) => (c ? normalizeKey(String(c)) : ''));

          // Check for RPP specific keys
          const rppKeyMatches = rowKeys.filter((k) =>
            k.includes('sintaks') ||
            k.includes('metode') ||
            k.includes('mindful') ||
            k.includes('meaningful') ||
            k.includes('joyful') ||
            k.includes('pedagogik') ||
            k.includes('kesiapan') ||
            k.includes('asesmenawal') ||
            k.includes('asesmenproses') ||
            k.includes('asesmenakhir') ||
            k.includes('diagnostik') ||
            k.includes('sumatif') ||
            k.includes('profillulusan')
          );

          const hasElemen = rowKeys.some((k) => k.includes('elemen') || k.includes('aspek') || k.includes('bidang'));
          const hasCP = rowKeys.some((k) => k.includes('capaian') || k === 'cp' || k.includes('pembelajaran'));
          const hasMateri = rowKeys.some((k) => k.includes('materi') || k.includes('konten') || k.includes('topik'));

          if (rppKeyMatches.length >= 2 || (hasElemen && hasCP && rppKeyMatches.length >= 1)) {
            headerRowIndex = r;
            isRppFormat = true;
          } else if ((hasElemen && (hasCP || hasMateri)) || (hasCP && hasMateri)) {
            headerRowIndex = r;
            isRppFormat = false;
          }

          if (headerRowIndex !== -1) {
            rowKeys.forEach((key, idx) => {
              if (key.includes('no') || key === 'nomor' || key === 'unit') colMap['no'] = idx;
              else if (key.includes('elemen') || key.includes('aspek')) colMap['elemen'] = idx;
              else if (key.includes('capaian') || key === 'cp') colMap['cp'] = idx;
              else if (key.includes('tujuan') || key === 'tp' || key.includes('atp')) colMap['tp'] = idx;
              else if (key.includes('alur') || key.includes('tahapan')) colMap['alur'] = idx;
              else if (key.includes('materi') || key.includes('konten') || key.includes('topik')) colMap['materi'] = idx;
              else if (key.includes('waktu') || key.includes('jp') || key.includes('jam') || key.includes('alokasi')) colMap['jp'] = idx;
              else if (key.includes('fase')) colMap['fase'] = idx;
              else if (key.includes('kelas') || key.includes('tingkat')) colMap['kelas'] = idx;
              else if (key.includes('semester')) colMap['semester'] = idx;
              else if (key.includes('disiplin') || key.includes('lintas')) colMap['lintasDisiplin'] = idx;
              else if (key.includes('kesiapan') || key.includes('minat') || key.includes('gaya')) colMap['kesiapan'] = idx;
              else if (key.includes('karakteristik') || key.includes('sifat')) colMap['karakteristik'] = idx;
              else if (key.includes('profil') || key.includes('lulusan') || key.includes('p5')) colMap['profil'] = idx;
              else if (key.includes('metode') || key.includes('model') || key.includes('pbl') || key.includes('pjbl')) colMap['metode'] = idx;
              else if (key.includes('mitra') || key.includes('kemitraan') || key.includes('dudi')) colMap['kemitraan'] = idx;
              else if (key.includes('digital') || key.includes('lingkungan')) colMap['digital'] = idx;
              else if (key.includes('pendahuluan') || key.includes('awal') || key.includes('mindful')) colMap['sintaksAwal'] = idx;
              else if (key.includes('inti1') || key.includes('memahami') || key.includes('meaningful')) colMap['sintaksInti1'] = idx;
              else if (key.includes('inti2') || key.includes('aplikasi') || key.includes('joyful') || key.includes('refleksiberkesadaran')) colMap['sintaksInti2'] = idx;
              else if (key.includes('penutup') || key.includes('refleksi321') || key.includes('kaizen')) colMap['sintaksPenutup'] = idx;
              else if (key.includes('asesmenawal') || key.includes('diagnostik')) colMap['asesmenAwal'] = idx;
              else if (key.includes('asesmenproses') || key.includes('formatif') || key.includes('unjukkerja')) colMap['asesmenProses'] = idx;
              else if (key.includes('pengayaan') || key.includes('remedial')) colMap['pengayaan'] = idx;
              else if (key.includes('tabeleksplorasi') || key.includes('hasileksplorasi') || key.includes('eksplorasi') || key.includes('datapengamatan')) colMap['tabelEksplorasi'] = idx;
              else if (key.includes('tautanmateri') || key.includes('linkmateri')) colMap['tautanMateri'] = idx;
              else if (key.includes('embedmateri') || key.includes('scriptmateri') || key.includes('htmlmateri')) colMap['embedMateri'] = idx;
              else if (key.includes('tautanlkpd') || key.includes('linklkpd')) colMap['tautanLkpd'] = idx;
              else if (key.includes('embedlkpd') || key.includes('scriptlkpd') || key.includes('htmllkpd')) colMap['embedLkpd'] = idx;
              else if (key.includes('embedrubrik') || key.includes('rubrikembed')) colMap['embedRubrik'] = idx;
            });
            break;
          }
        }

        // Fallback for default CP layout if no header found
        if (headerRowIndex === -1) {
          headerRowIndex = 0;
          colMap = {
            no: 0,
            elemen: 1,
            cp: 2,
            materi: 3,
            jp: 4,
          };
          isRppFormat = false;
        }

        const cpRows: ExcelRawRow[] = [];
        const rppRows: ExcelRppRawRow[] = [];
        let detectedSubject: string | undefined;
        let detectedClass: string | undefined;
        let detectedPhase: string | undefined;
        let detectedCategory: 'kejuruan' | 'umum' = 'kejuruan';

        // Check top metadata rows
        for (let r = 0; r < headerRowIndex; r++) {
          const rowText = (rawAoA[r] || []).join(' ');
          const lower = rowText.toLowerCase();
          if (lower.includes('mata pelajaran') || lower.includes('mapel')) {
            const parts = rowText.split(/[:=]/);
            if (parts.length > 1) {
              detectedSubject = parts[1].trim();
              if (
                lower.includes('indonesia') ||
                lower.includes('matematika') ||
                lower.includes('pancasila') ||
                lower.includes('inggris') ||
                lower.includes('sejarah') ||
                lower.includes('agama') ||
                lower.includes('pjok') ||
                lower.includes('seni') ||
                lower.includes('umum') ||
                lower.includes('normatif')
              ) {
                detectedCategory = 'umum';
              }
            }
          }
          if (lower.includes('kelas') || lower.includes('fase')) {
            if (rowText.includes('XI') || rowText.includes('11')) detectedClass = 'XI';
            else if (rowText.includes('XII') || rowText.includes('12')) detectedClass = 'XII';
            else if (rowText.includes('X') || rowText.includes('10')) detectedClass = 'X';

            if (rowText.includes('Fase F') || rowText.includes('F')) detectedPhase = 'F';
            else if (rowText.includes('Fase E') || rowText.includes('E')) detectedPhase = 'E';
          }
        }

        // Parse content rows
        for (let r = headerRowIndex + 1; r < rawAoA.length; r++) {
          const row = rawAoA[r];
          if (!row || !Array.isArray(row) || row.every((c) => c === undefined || c === null || String(c).trim() === '')) {
            continue;
          }

          const elemenVal = colMap['elemen'] !== undefined ? String(row[colMap['elemen']] || '').trim() : '';
          const cpVal = colMap['cp'] !== undefined ? String(row[colMap['cp']] || '').trim() : '';
          const materiVal = colMap['materi'] !== undefined ? String(row[colMap['materi']] || '').trim() : '';
          const jpRaw = colMap['jp'] !== undefined ? row[colMap['jp']] : '';
          const faseVal = colMap['fase'] !== undefined ? String(row[colMap['fase']] || '').trim() : '';
          const kelasVal = colMap['kelas'] !== undefined ? String(row[colMap['kelas']] || '').trim() : '';
          const semesterVal = colMap['semester'] !== undefined ? String(row[colMap['semester']] || '').trim() : '';
          const tpVal = colMap['tp'] !== undefined ? String(row[colMap['tp']] || '').trim() : '';
          const alurVal = colMap['alur'] !== undefined ? String(row[colMap['alur']] || '').trim() : '';
          const lintasVal = colMap['lintasDisiplin'] !== undefined ? String(row[colMap['lintasDisiplin']] || '').trim() : '';
          const kesiapanVal = colMap['kesiapan'] !== undefined ? String(row[colMap['kesiapan']] || '').trim() : '';
          const karakteristikVal = colMap['karakteristik'] !== undefined ? String(row[colMap['karakteristik']] || '').trim() : '';
          const profilVal = colMap['profil'] !== undefined ? String(row[colMap['profil']] || '').trim() : '';
          const metodeVal = colMap['metode'] !== undefined ? String(row[colMap['metode']] || '').trim() : '';
          const kemitraanVal = colMap['kemitraan'] !== undefined ? String(row[colMap['kemitraan']] || '').trim() : '';
          const digitalVal = colMap['digital'] !== undefined ? String(row[colMap['digital']] || '').trim() : '';
          const sintaksAwalVal = colMap['sintaksAwal'] !== undefined ? String(row[colMap['sintaksAwal']] || '').trim() : '';
          const sintaksInti1Val = colMap['sintaksInti1'] !== undefined ? String(row[colMap['sintaksInti1']] || '').trim() : '';
          const sintaksInti2Val = colMap['sintaksInti2'] !== undefined ? String(row[colMap['sintaksInti2']] || '').trim() : '';
          const sintaksPenutupVal = colMap['sintaksPenutup'] !== undefined ? String(row[colMap['sintaksPenutup']] || '').trim() : '';
          const asesmenAwalVal = colMap['asesmenAwal'] !== undefined ? String(row[colMap['asesmenAwal']] || '').trim() : '';
          const asesmenProsesVal = colMap['asesmenProses'] !== undefined ? String(row[colMap['asesmenProses']] || '').trim() : '';
          const asesmenAkhirVal = colMap['asesmenAkhir'] !== undefined ? String(row[colMap['asesmenAkhir']] || '').trim() : '';
          const pengayaanVal = colMap['pengayaan'] !== undefined ? String(row[colMap['pengayaan']] || '').trim() : '';
          const tabelEksplorasiVal = colMap['tabelEksplorasi'] !== undefined ? String(row[colMap['tabelEksplorasi']] || '').trim() : '';
          const tautanMateriVal = colMap['tautanMateri'] !== undefined ? String(row[colMap['tautanMateri']] || '').trim() : '';
          const embedMateriVal = colMap['embedMateri'] !== undefined ? String(row[colMap['embedMateri']] || '').trim() : '';
          const tautanLkpdVal = colMap['tautanLkpd'] !== undefined ? String(row[colMap['tautanLkpd']] || '').trim() : '';
          const embedLkpdVal = colMap['embedLkpd'] !== undefined ? String(row[colMap['embedLkpd']] || '').trim() : '';
          const embedRubrikVal = colMap['embedRubrik'] !== undefined ? String(row[colMap['embedRubrik']] || '').trim() : '';

          // Skip purely blank or explanatory rows
          if (!elemenVal && !cpVal && !materiVal && !tpVal) continue;
          if (elemenVal.toLowerCase().startsWith('catatan') || elemenVal.toLowerCase().startsWith('keterangan') || elemenVal.toLowerCase().startsWith('petunjuk')) continue;

          const numJp = typeof jpRaw === 'number' ? jpRaw : parseInt(String(jpRaw).replace(/\D/g, ''), 10) || 12;

          const standardElemen = elemenVal || (cpRows.length > 0 ? cpRows[cpRows.length - 1].elemen : 'Elemen Pembelajaran');
          const standardCp = cpVal || (cpRows.length > 0 ? cpRows[cpRows.length - 1].capaianPembelajaran : 'Memahami konsep dan menerapkannya dalam pemecahan masalah');
          const standardMateri = materiVal || standardElemen || `Materi Unit ${cpRows.length + 1}`;

          cpRows.push({
            no: cpRows.length + 1,
            elemen: standardElemen,
            capaianPembelajaran: standardCp,
            materi: standardMateri,
            jp: numJp,
            fase: faseVal || detectedPhase || 'E',
            kelas: kelasVal || detectedClass || 'X',
            semester: semesterVal || '1 (Ganjil)',
            lintasDisiplin: lintasVal,
          });

          if (isRppFormat) {
            rppRows.push({
              no: rppRows.length + 1,
              elemen: standardElemen,
              capaianPembelajaran: standardCp,
              tujuanPembelajaran: tpVal || `Peserta didik mampu menganalisis, mempraktikkan, dan memecahkan permasalahan pada materi ${standardMateri} dengan bernalar kritis dan mandiri.`,
              alurPembelajaran: alurVal,
              materi: standardMateri,
              jp: numJp,
              fase: faseVal || detectedPhase || 'E',
              kelas: kelasVal || detectedClass || 'X',
              semester: semesterVal || '1 (Ganjil)',
              lintasDisiplin: lintasVal,
              kesiapanPesertaDidik: kesiapanVal,
              karakteristikMateri: karakteristikVal,
              profilLulusan: profilVal || 'Bernalar Kritis, Kreativitas, Kolaborasi, Kemandirian',
              metodePembelajaran: metodeVal || 'Problem-Based Learning (PBL) & Praktik Eksploratif',
              kemitraan: kemitraanVal,
              lingkunganDigital: digitalVal,
              sintaksPendahuluan: sintaksAwalVal,
              sintaksInti1: sintaksInti1Val,
              sintaksInti2: sintaksInti2Val,
              sintaksPenutup: sintaksPenutupVal,
              asesmenAwal: asesmenAwalVal,
              asesmenProses: asesmenProsesVal,
              asesmenAkhir: asesmenAkhirVal,
              pengayaanRemedial: pengayaanVal,
              tabelEksplorasi: tabelEksplorasiVal,
              tautanMateri: tautanMateriVal,
              embedMateri: embedMateriVal,
              tautanLkpd: tautanLkpdVal,
              embedLkpd: embedLkpdVal,
              embedRubrik: embedRubrikVal,
            });
          }
        }

        if (cpRows.length === 0) {
          throw new Error('Tidak ada data yang dapat diekstrak dari file Excel. Pastikan terdapat kolom Elemen, Capaian Pembelajaran, dan Materi.');
        }

        resolve({
          fileType: isRppFormat ? 'rpp' : 'cp',
          cpRows,
          rppRows: isRppFormat ? rppRows : undefined,
          detectedSubject,
          detectedClass,
          detectedPhase,
          detectedCategory,
        });
      } catch (err: any) {
        reject(new Error(err.message || 'Gagal memproses file Excel'));
      }
    };

    reader.onerror = () => reject(new Error('Gagal membaca file dari disk'));
    reader.readAsBinaryString(file);
  });
}

/**
 * 1. DOWNLOAD TEMPLATE FORMAT EXCEL ATP (Alur Tujuan Pembelajaran)
 * Format standar resmi bagi guru memasukkan Elemen, CP, ATP/TP, Materi, JP, Fase, Kelas, dan Semester.
 */
export function downloadAtpExcelTemplate(type: 'kejuruan' | 'umum' | 'blank' = 'kejuruan') {
  const wb = XLSX.utils.book_new();

  let templateTitle = '';
  let filename = '';
  let sampleDataRows: any[][] = [];

  if (type === 'umum') {
    templateTitle = 'FORMAT EXCEL ATP MAPEL NORMATIF-ADAPTIF / UMUM - SMK MUHAMMADIYAH BAWANG, BATANG';
    filename = 'Template_ATP_Mapel_Umum_SMK_Muhammadiyah_Bawang.xlsx';
    sampleDataRows = [
      [
        1,
        'Menyimak dan Berbicara (Listening & Speaking)',
        'Pada akhir fase F, peserta didik mampu menggunakan bahasa Inggris untuk berkomunikasi dalam situasi kerja dan sosial, menangani pertanyaan pelanggan (handling inquiries & complaints), berpartisipasi dalam diskusi kelompok kerja, serta melakukan presentasi proyek kejuruan dengan percaya diri.',
        '1. Menganalisis frasa profesional dalam menangani keluhan pelanggan.\n2. Mensimulasikan percakapan kerja dengan percaya diri dan santun.',
        'Tahap 1: Video simulasi, Tahap 2: Analisis frasa kunci, Tahap 3: Roleplay berpasangan, Tahap 4: Refleksi 3-2-1',
        'Workplace Conversations, Asking & Giving Opinions, Handling Inquiries and Complaints, Job Interview Simulation',
        16,
        'Fase F',
        'XI',
        '1 (Ganjil)',
        'Bahasa Inggris, Komunikasi Bisnis, dan Kejuruan Terkait',
      ],
      [
        2,
        'Membaca dan Memirsa (Reading & Viewing)',
        'Pada akhir fase F, peserta didik mampu memahami, menganalisis, dan mengevaluasi teks informatif, manual instruksi teknis (Technical Operating Manuals / SOP), email bisnis, serta artikel industri berbahasa Inggris secara tepat.',
        '1. Menelaah manual operasional mesin dan SOP industri berbahasa Inggris.\n2. Menemukan informasi rinci dalam korespondensi bisnis digital.',
        'Tahap 1: Skimming & scanning manual, Tahap 2: Glosarium istilah teknis, Tahap 3: Diskusi kelompok, Tahap 4: Presentasi temuan',
        'Reading Technical Specifications & User Manuals, Understanding Business Emails, Procedural Text in Vocational Context',
        14,
        'Fase F',
        'XI',
        '1 (Ganjil)',
        'Bahasa Inggris Terapan dan Literasi Digital',
      ],
      [
        3,
        'Menulis dan Mempresentasikan (Writing & Presenting)',
        'Pada akhir fase F, peserta didik mampu memproduksi teks tertulis resmi seperti surat lamaran kerja (Application Letter), resume / Curriculum Vitae (CV), laporan hasil pekerjaan (Work Progress Report), serta mempresentasikannya dengan percaya diri.',
        '1. Menyusun curriculum vitae (CV) dan surat lamaran kerja profesional.\n2. Mempresentasikan portofolio kejuruan dalam bahasa Inggris dengan percaya diri.',
        'Tahap 1: Analisis format standar internasional, Tahap 2: Drafting resume, Tahap 3: Peer review, Tahap 4: Presentasi pitch deck',
        'Drafting Professional CV & Cover Letter, Work Report Summaries, Project Presentation Pitch Deck',
        12,
        'Fase F',
        'XI',
        '1 (Ganjil)',
        'Bahasa Inggris Terapan dan Manajemen Perkantoran',
      ],
    ];
  } else if (type === 'blank') {
    templateTitle = 'FORMAT EXCEL ATP KOSONG SIAP INPUT - SMK MUHAMMADIYAH BAWANG, BATANG';
    filename = 'Format_ATP_Kosong_SMK_Muhammadiyah_Bawang.xlsx';
    sampleDataRows = [
      [1, '', '', '', '', '', 18, 'F', 'XI', '1 (Ganjil)', ''],
      [2, '', '', '', '', '', 18, 'F', 'XI', '1 (Ganjil)', ''],
      [3, '', '', '', '', '', 18, 'F', 'XI', '1 (Ganjil)', ''],
    ];
  } else {
    templateTitle = 'FORMAT EXCEL ATP MAPEL KEJURUAN (AKL & TSM) - SMK MUHAMMADIYAH BAWANG, BATANG';
    filename = 'Template_ATP_Kejuruan_AKL_TSM_SMK_Muhammadiyah_Bawang.xlsx';
    sampleDataRows = [
      [
        1,
        'Praktikum Akuntansi Perusahaan Jasa dan Dagang',
        'Pada akhir fase F, peserta didik mampu menganalisis dokumen sumber dan pendukung transaksi keuangan, mencatat transaksi ke jurnal khusus dan umum, memposting ke buku besar utama dan pembantu, menyusun neraca lajur, serta menyusun laporan keuangan laba rugi, perubahan ekuitas, neraca, dan arus kas.',
        '1. Menganalisis bukti transaksi keuangan perusahaan dagang secara teliti.\n2. Mengentri transaksi ke dalam jurnal khusus dan memposting ke buku besar utama dan pembantu.',
        'Tahap 1: Telaah bukti transaksi, Tahap 2: Pencatatan jurnal khusus, Tahap 3: Posting buku besar, Tahap 4: Penyusunan neraca saldo',
        'Analisis Bukti Transaksi, Jurnal Khusus & Umum, Buku Besar Pembantu, Neraca Lajur 10 Kolom, Laporan Keuangan SAK EMKM',
        24,
        'Fase F',
        'XI',
        '1 (Ganjil)',
        'Akuntansi Keuangan, Matematika Bisnis, dan Manajemen Perkantoran',
      ],
      [
        2,
        'Komputer Akuntansi (Spreadsheet & Software Akuntansi)',
        'Pada akhir fase F, peserta didik mampu mengoperasikan aplikasi komputer akuntansi dan spreadsheet untuk membuat data baru perusahaan, menyusun bagan akun (Chart of Accounts), mengelola kartu piutang/utang, mengentri saldo awal dan transaksi penyesuaian, serta mencetak laporan keuangan digital.',
        '1. Melakukan setup data awal perusahaan dan bagan akun pada aplikasi akuntansi.\n2. Mengentri transaksi pembelian, penjualan, dan rekonsiliasi kas bank secara digital.',
        'Tahap 1: Pengenalan interface, Tahap 2: Setup file perusahaan baru, Tahap 3: Entri transaksi, Tahap 4: Cetak laporan digital',
        'Setup Data Awal Perusahaan, Bagan Akun (COA), Entri Transaksi Pembelian & Penjualan, Rekonsiliasi Bank, Laporan Digital',
        18,
        'Fase F',
        'XI',
        '1 (Ganjil)',
        'Komputer Akuntansi dan Teknologi Informasi Komunikasi (TIK)',
      ],
      [
        3,
        'Akuntansi Lembaga / Instansi Pemerintah & Perpajakan',
        'Pada akhir fase F, peserta didik mampu memahami struktur akuntansi keuangan lembaga pemerintah, pencatatan transaksi anggaran pendapatan dan belanja daerah (APBD), serta menghitung dan menyusun formulir surat pemberitahuan (SPT) pajak PPh Pasal 21 dan PPN.',
        '1. Menelaah struktur dokumen APBD dan akun belanja modal pemerintah daerah.\n2. Menghitung PPh Pasal 21 pegawai dan mengisi formulir SPT masa pajak secara cermat.',
        'Tahap 1: Analisis dokumen APBD, Tahap 2: Perhitungan PTKP & tarif progresif, Tahap 3: Simulasi pengisian SPT, Tahap 4: Diskusi kepatuhan pajak',
        'Struktur APBD, Jurnal Akuntansi Lembaga, Perhitungan PPh Pasal 21 & PPN, Pengisian Formulir SPT Pajak',
        12,
        'Fase F',
        'XI',
        '1 (Ganjil)',
        'Perpajakan, Hukum Administrasi, dan Akuntansi Pemerintah',
      ],
    ];
  }

  const templateData = [
    [templateTitle],
    ['PETUNJUK: Isi Elemen, Capaian Pembelajaran (CP), Alur & Tujuan Pembelajaran (ATP/TP), Lingkup Materi / Topik, Alokasi Waktu (JP), dan Lintas Disiplin.'],
    ['Sistem akan secara otomatis menyusun matriks ATP dan mendistribusikannya ke lembar RPP terpisah.'],
    [],
    ['No', 'Elemen', 'Capaian Pembelajaran (CP)', 'Alur & Tujuan Pembelajaran (ATP / TP)', 'Tahapan Alur Pembelajaran', 'Lingkup Materi / Topik', 'Alokasi Waktu (JP)', 'Fase', 'Kelas', 'Semester', 'Lintas Disiplin Ilmu'],
    ...sampleDataRows,
  ];

  const ws = XLSX.utils.aoa_to_sheet(templateData);

  ws['!cols'] = [
    { wch: 6 },
    { wch: 32 },
    { wch: 55 },
    { wch: 45 },
    { wch: 35 },
    { wch: 40 },
    { wch: 18 },
    { wch: 10 },
    { wch: 10 },
    { wch: 14 },
    { wch: 35 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Format_ATP_SMK_Bawang');
  XLSX.writeFile(wb, filename);
}

// Alias untuk kompatibilitas ke belakang
export const downloadCpExcelTemplate = downloadAtpExcelTemplate;

/**
 * 2. DOWNLOAD TEMPLATE FORMAT EXCEL RPP TERINTEGRASI (Semua Kolom Lengkap)
 * Format terintegrasi penuh: CP, ATP/TP, Materi, Metode, Sintaks Pembelajaran, dan Asesmen.
 */
export function downloadRppExcelTemplate(type: 'kejuruan' | 'umum' | 'blank' = 'kejuruan') {
  const wb = XLSX.utils.book_new();

  let templateTitle = '';
  let filename = '';
  let sampleRows: any[][] = [];

  if (type === 'umum') {
    templateTitle = 'FORMAT EXCEL RPP DEEP LEARNING TERINTEGRASI (MAPEL UMUM) - SMK MUHAMMADIYAH BAWANG';
    filename = 'Template_RPP_DeepLearning_Mapel_Umum_SMK_Muhammadiyah_Bawang.xlsx';
    sampleRows = [
      [
        1,
        'Menyimak dan Berbicara (Listening & Speaking)',
        'Pada akhir fase F, peserta didik mampu menggunakan bahasa Inggris untuk berkomunikasi dalam situasi kerja dan sosial, menangani pertanyaan pelanggan (handling inquiries & complaints), berpartisipasi dalam diskusi kelompok kerja, serta melakukan presentasi proyek kejuruan dengan percaya diri.',
        '1. Peserta didik mampu menganalisis frasa profesional dalam menangani keluhan pelanggan (handling inquiries & complaints).\n2. Peserta didik mampu mempraktikkan simulasi komunikasi percakapan kerja dengan percaya diri dan santun.',
        'Tahap 1: Pengamatan video simulasi pelanggan, Tahap 2: Analisis frasa kunci, Tahap 3: Roleplay berpasangan, Tahap 4: Refleksi 3-2-1.',
        'Workplace Communication: Handling Inquiries and Complaints',
        16,
        'F',
        'XI',
        '1 (Ganjil)',
        'Bahasa Inggris Bisnis dan Pelayanan Konsumen',
        'Minat: Percakapan interaktif, video roleplay, media sosial. 40% Visual, 40% Auditory, 20% Kinestetik. Lingkungan: Sekitar Bawang & Batang.',
        'Materi konseptual mengenai etika komunikasi profesional dan aplikatif berupa simulasi percakapan di tempat kerja secara langsung.',
        'Bernalar Kritis, Kreativitas, Kolaborasi, Kemandirian, Komunikasi',
        'Problem-Based Learning (PBL) dan Roleplay Simulation terstruktur',
        'Mitra DUDI: Dunia Usaha & Industri Perdagangan Batang. Peran Ortu: Pendampingan rekaman video latihan mandiri.',
        'Ruang Fisik: Kelas kolaboratif melingkar. Ruang Virtual: Google Classroom & audio script podcast digital.',
        'Google Classroom, Google Voice Recorder, YouTube Vocational Learning',
        'Mindful Learning: Guru menyapa, doa, cek kesiapan emosional, memutar cuplikan 2 menit rekaman percakapan pelanggan komplain, dan mengajukan pertanyaan pemantik: "Bagaimana cara merespon pelanggan marah secara profesional?"',
        'Meaningful Learning: Murid berkelompok menganalisis naskah transkrip keluhan pelanggan, membedah ungkapan empati dan solutif, serta menyusun tabel frasa profesional.',
        'Joyful Learning: Setiap pasangan melakukan simulasi roleplay "Customer Service vs Client" dengan skenario acak menyenangkan, dilanjutkan saling memberikan umpan balik konstruktif (peer assessment).',
        'Refleksi 3-2-1: 3 frasa kerja paling bermanfaat, 2 kesulitan artikulasi yang dihadapi, 1 strategi perbaikan. Guru memberi kesimpulan dan apresiasi.',
        'Kuis lisan awal 5 pertanyaan singkat tentang salam dan frasa dasar percakapan kantor.',
        'Formatif: Observasi keaktifan diskusi, rubrik penilaian pelafalan (pronunciation), kelancaran (fluency), dan kesopanan saat roleplay.',
        'Sumatif: Unjuk kerja rekaman video roleplay skenario penanganan komplain pelanggan (LKPD 1) dan tes tertulis pemahaman teks.',
        'Pengayaan: Penugasan menyusun naskah simulasi wawancara kerja (Job Interview). Remedial: Bimbingan pelafalan frasa dasar dengan pendampingan teman sebaya.',
        'Tabel Analisis Ungkapan Komplain :: Situasi Kasus Komplain | Ungkapan Standar SOP Penanganan :: Barang Rusak Saat Pengiriman | We sincerely apologize for the inconvenience and will replace it immediately ; Keterlambatan Pengiriman | Let me check your tracking number and expedite the delivery ; Kesalahan Jumlah Pesanan | We will dispatch the remaining items at no additional cost',
        'https://guru.kemdikbud.go.id/',
        '<iframe width="100%" height="380" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>',
        'https://docs.google.com/document/d/1sample-lkpd-bahasa-inggris/preview',
        '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc_sample/viewform?embedded=true" width="100%" height="480"></iframe>',
        '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc_rubrik/viewform?embedded=true" width="100%" height="480"></iframe>',
      ],
    ];
  } else if (type === 'blank') {
    templateTitle = 'FORMAT EXCEL RPP TERINTEGRASI KOSONG SIAP INPUT - SMK MUHAMMADIYAH BAWANG';
    filename = 'Format_RPP_Terintegrasi_Kosong_SMK_Muhammadiyah_Bawang.xlsx';
    sampleRows = [
      [
        1, '', '', '', '', '', 12, 'F', 'XI', '1 (Ganjil)',
        '', '', '', 'Bernalar Kritis, Kreativitas, Kolaborasi, Kemandirian',
        'Problem-Based Learning (PBL)', '', '', 'Google Classroom',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      ],
    ];
  } else {
    templateTitle = 'FORMAT EXCEL RPP DEEP LEARNING TERINTEGRASI (MAPEL KEJURUAN AKL/TSM) - SMK MUHAMMADIYAH BAWANG';
    filename = 'Template_RPP_DeepLearning_Kejuruan_AKL_TSM_SMK_Muhammadiyah_Bawang.xlsx';
    sampleRows = [
      [
        1,
        'Praktikum Akuntansi Perusahaan Jasa dan Dagang',
        'Pada akhir fase F, peserta didik mampu menganalisis dokumen sumber dan pendukung transaksi keuangan, mencatat transaksi ke jurnal khusus dan umum, memposting ke buku besar utama dan pembantu, menyusun neraca lajur, serta menyusun laporan keuangan laba rugi, perubahan ekuitas, neraca, dan arus kas.',
        '1. Peserta didik mampu menganalisis keabsahan bukti transaksi keuangan perusahaan dagang secara teliti dan kritis.\n2. Peserta didik mampu mencatat bukti transaksi ke dalam jurnal khusus (pembelian, penjualan, penerimaan, dan pengeluaran kas) sesuai SAK EMKM.',
        'Tahap 1: Pengamatan bukti transaksi riil, Tahap 2: Analisis rekening akun debit/kredit, Tahap 3: Entri jurnal khusus kelompok, Tahap 4: Verifikasi silang saldo.',
        'Analisis Dokumen Transaksi dan Pencatatan Jurnal Khusus Perusahaan Dagang',
        18,
        'F',
        'XI',
        '1 (Ganjil)',
        'Akuntansi Keuangan, Matematika Bisnis, dan Manajemen Perkantoran',
        'Minat: Literasi finansial, spreadsheet akuntansi, wirausaha. 40% Visual, 40% Auditory, 20% Kinestetik. Lingkungan: UMKM & Lembaga Keuangan sekitar Bawang, Batang.',
        'Materi konseptual prinsip debet-kredit yang terintegrasi secara aplikatif dengan pencatatan pembukuan riil usaha dagang/jasa.',
        'Bernalar Kritis, Kreativitas, Kolaborasi, Kemandirian, Integritas',
        'Problem-Based Learning (PBL) berbasis dokumen transaksi otentik',
        'Mitra DUDI: Kantor Akuntan Publik & Bank Mini SMK Muhammadiyah Bawang. Peran Ortu: Pendampingan observasi pencatatan keuangan usaha di rumah.',
        'Ruang Fisik: Lab Akuntansi / Bengkel Kejuruan berstandar 5S. Ruang Virtual: Google Classroom & Spreadsheet Kolaboratif.',
        'Google Classroom, Spreadsheet Keuangan / Software Komputer Akuntansi, LCD Proyektor',
        'Mindful Learning: Guru mengajak berkesadaran, doa, apersepsi mengecek kesiapan fisik dan mental. Menampilkan sebuah kuitansi dan faktur bermasalah dengan pertanyaan pemantik nalar kritis: "Apa dampak bagi pemilik usaha bila dokumen ini salah catat?"',
        'Meaningful Learning: Murid berkelompok mengamati satu bundel bukti transaksi nyata. Murid mengidentifikasi nama akun, menghitung nominal, menganalisis posisi debet/kredit, dan mengisi lembar kerja analisis transaksi.',
        'Joyful Learning: Setiap kelompok berlomba melakukan pencatatan ke lembar jurnal khusus berformat standar industri dengan pembagian peran terstruktur (analis bukti, pencatat jurnal, dan verifikator saldo), dilanjutkan verifikasi silang antar-kelompok.',
        'Refleksi 3-2-1 & Kaizen: 3 akun yang paling sering tertukar debet/kreditnya, 2 langkah pencegahan salah catat, 1 komitmen ketelitian kerja akuntansi. Guru memberi penguatan konsep SAK EMKM.',
        'Asesmen Awal: Tanya jawab lisan 5 butir soal mengenai saldo normal akun harta, utang, modal, pendapatan, dan beban.',
        'Asesmen Formatif: Lembar observasi diskusi kelompok, rubrik keterampilan analisis bukti transaksi, dan ketepatan entri jurnal khusus.',
        'Asesmen Sumatif: Penilaian hasil lembar kerja job sheet (LKPD 1) pencatatan 15 transaksi komprehensif ke jurnal khusus dan tes formatif tertulis.',
        'Pengayaan: Penugasan entri bukti transaksi penyesuaian (adjusting entries) ke spreadsheet mandiri. Remedial: Pendampingan analisis debet-kredit dengan kartu bantu akun.',
        'Tabel Rekapitulasi Bukti Transaksi :: Jenis Bukti Transaksi | Akun Debet / Kredit Terkait :: Faktur Penjualan No. F-01 | Piutang Dagang (D) / Penjualan (K) ; Bukti Kas Masuk No. BKM-01 | Kas di Bank (D) / Piutang Dagang (K) ; Nota Kontan Pembelian | Persediaan Barang (D) / Kas (K)',
        'https://guru.kemdikbud.go.id/',
        '<iframe width="100%" height="380" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>',
        'https://docs.google.com/document/d/1sample-lkpd-akuntansi/preview',
        '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc_sample/viewform?embedded=true" width="100%" height="480"></iframe>',
        '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc_rubrik/viewform?embedded=true" width="100%" height="480"></iframe>',
      ],
      [
        2,
        'Komputer Akuntansi (Spreadsheet & Software Akuntansi)',
        'Pada akhir fase F, peserta didik mampu mengoperasikan aplikasi komputer akuntansi dan spreadsheet untuk membuat data baru perusahaan, menyusun bagan akun (Chart of Accounts), mengelola kartu piutang/utang, mengentri saldo awal dan transaksi penyesuaian, serta mencetak laporan keuangan digital.',
        '1. Peserta didik mampu membuat file data baru perusahaan dan menyusun daftar akun (Chart of Accounts) pada aplikasi akuntansi.\n2. Peserta didik mampu mengentri saldo awal neraca dan daftar pelanggan/pemasok secara presisi.',
        'Tahap 1: Eksplorasi menu software, Tahap 2: Input profil perusahaan & COA, Tahap 3: Entri saldo buku pembantu, Tahap 4: Pengecekan keseimbangan neraca (Historical Balancing = 0).',
        'Setup Data Baru Perusahaan dan Chart of Accounts (COA) Digital',
        18,
        'F',
        'XI',
        '1 (Ganjil)',
        'Komputer Akuntansi dan Teknologi Informasi Terapan (TIK)',
        'Minat: Aplikasi software komputer, spreadsheet, teknologi digital. Cara belajar praktikum lab 50% kinestetik, 30% visual, 20% auditory.',
        'Materi aplikatif praktikum komputer akuntansi yang menuntut ketelitian tinggi, pemahaman alur sistem, dan kepatuhan SOP digital.',
        'Bernalar Kritis, Kemandirian, Kreativitas, Teliti',
        'Project-Based Learning (PjBL) simulasi pendirian pembukuan digital perusahaan',
        'Mitra DUDI: CV/PT Mitra Rekanan dan Software House Akuntansi. Peran Ortu: Menjaga kedisiplinan belajar komputer.',
        'Ruang Fisik: Laboratorium Komputer SMK Muhammadiyah Bawang ber-AC dan berstandar K3LH. Ruang Virtual: Google Classroom.',
        'Software Komputer Akuntansi, Aplikasi Spreadsheet Google Sheets / Excel, Cloud Drive',
        'Mindful Learning: Doa bersama, cek kerapian ruang lab (budaya 5S), penayangan studi kasus perbandingan efisiensi pembukuan manual vs digital, pertanyaan pemantik: "Mengapa dunia industri saat ini beralih total ke software akuntansi?"',
        'Meaningful Learning: Murid membuka lembar profil usaha dagang "Batang Sejahtera" dan mengikuti demonstrasi guru dalam membuat data baru perusahaan, menentukan periode akuntansi 13 bulan, serta menyusun struktur akun.',
        'Joyful Learning: Murid secara mandiri dan saling berpasangan (peer-tutoring) menyelesaikan penginputan 35 akun dan menguji saldo awal sampai Historical Balancing menunjukkan angka 0 (seimbang).',
        'Refleksi 3-2-1: 3 menu utama yang dikuasai, 2 kendala saat import akun, 1 trik cepat mencari selisih saldo. Guru memberikan verifikasi dan file cadangan (backup).',
        'Asesmen Awal: Pengecekan kesiapan login akun komputer dan pengetahuan dasar penggolongan kode akun akuntansi.',
        'Asesmen Formatif: Observasi unjuk kerja proses di komputer lab, kecepatan setup akun, dan ketepatan konfigurasi link account.',
        'Asesmen Sumatif: Job Sheet praktik mandiri setup data awal perusahaan dan pembuatan laporan daftar akun digital.',
        'Pengayaan: Penugasan kustomisasi format laporan neraca dan laba rugi ke bentuk PDF siap cetak. Remedial: Praktik ulang setup bagan akun dengan panduan modul bergambar.',
        'Tabel Bagan Akun Digital :: Kode Akun (COA) | Klasifikasi & Saldo Normal :: 1-1100 Kas di Bank | Harta Lancar (Debet) ; 1-1200 Piutang Dagang | Harta Lancar (Debet) ; 2-1100 Utang Dagang | Kewajiban Lancar (Kredit)',
        'https://guru.kemdikbud.go.id/',
        '<iframe width="100%" height="380" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>',
        'https://docs.google.com/document/d/1sample-lkpd-komputer-akuntansi/preview',
        '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc_sample/viewform?embedded=true" width="100%" height="480"></iframe>',
        '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc_rubrik/viewform?embedded=true" width="100%" height="480"></iframe>',
      ],
    ];
  }

  const headers = [
    'No / Unit',
    'Elemen',
    'Capaian Pembelajaran (CP)',
    'Alur & Tujuan Pembelajaran (ATP / TP)',
    'Tahapan Alur Pembelajaran',
    'Lingkup Materi Pokok',
    'Alokasi Waktu (JP)',
    'Fase',
    'Kelas',
    'Semester',
    'Lintas Disiplin Ilmu',
    'Kesiapan Peserta Didik (Minat & Gaya Belajar)',
    'Karakteristik & Sifat Materi',
    'Dimensi Profil Lulusan / P5',
    'Metode & Model Pembelajaran',
    'Kemitraan Industri & Orang Tua',
    'Lingkungan Belajar (Fisik & Virtual)',
    'Pemanfaatan Digital',
    'Sintaks Pendahuluan (Mindful Learning)',
    'Sintaks Inti 1 - Memahami & Eksplorasi (Meaningful Learning)',
    'Sintaks Inti 2 - Mengaplikasi & Merefleksi (Joyful Learning)',
    'Sintaks Penutup (Refleksi 3-2-1 & Kaizen)',
    'Asesmen Awal (Diagnostik)',
    'Asesmen Proses (Formatif - Diskusi / Presentasi / Unjuk Kerja)',
    'Asesmen Akhir (Sumatif - Job Sheet / Proyek / LKPD)',
    'Pengayaan dan Remedial',
    'Tabel Hasil Eksplorasi (Judul :: Kolom1 | Kolom2 :: Data)',
    'Tautan Materi (Hyperlink)',
    'Kode Embed Materi (HTML / Script)',
    'Tautan LKPD (Hyperlink)',
    'Kode Embed LKPD (HTML / Iframe)',
    'Kode Embed Rubrik (HTML)',
  ];

  const templateData = [
    [templateTitle],
    ['PETUNJUK PENGISIAN FORMAT RPP TERINTEGRASI: Seluruh kolom di bawah ini terhubung langsung dengan dokumen RPP Deep Learning dan ATP.'],
    ['Setiap baris mewakili 1 Unit Dokumen RPP terpisah. Saat diunggah, dokumen cetak F4 langsung otomatis terisi sesuai kolom ini.'],
    [],
    headers,
    ...sampleRows,
  ];

  const ws = XLSX.utils.aoa_to_sheet(templateData);

  ws['!cols'] = [
    { wch: 8 },  // No
    { wch: 28 }, // Elemen
    { wch: 45 }, // CP
    { wch: 45 }, // TP
    { wch: 35 }, // Alur
    { wch: 35 }, // Materi
    { wch: 16 }, // JP
    { wch: 8 },  // Fase
    { wch: 8 },  // Kelas
    { wch: 12 }, // Semester
    { wch: 28 }, // Lintas Disiplin
    { wch: 35 }, // Kesiapan
    { wch: 35 }, // Karakteristik
    { wch: 30 }, // Profil Lulusan
    { wch: 30 }, // Metode
    { wch: 32 }, // Kemitraan
    { wch: 30 }, // Lingkungan
    { wch: 28 }, // Digital
    { wch: 45 }, // Sintaks Awal (Mindful)
    { wch: 45 }, // Sintaks Inti 1 (Meaningful)
    { wch: 45 }, // Sintaks Inti 2 (Joyful)
    { wch: 40 }, // Sintaks Penutup
    { wch: 32 }, // Asesmen Awal
    { wch: 35 }, // Asesmen Proses
    { wch: 35 }, // Asesmen Akhir
    { wch: 35 }, // Pengayaan & Remedial
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Format_RPP_Terintegrasi');
  XLSX.writeFile(wb, filename);
}

/**
 * Backward compatibility alias for downloading CP template
 */
export function downloadExcelTemplate(type: 'kejuruan' | 'umum' | 'blank' = 'kejuruan') {
  downloadCpExcelTemplate(type);
}

/**
 * Exports generated ATP matrix to an Excel workbook
 */
export function exportAtpToExcel(atpList: AlurTujuanPembelajaranItem[], identity: SchoolIdentity) {
  const wb = XLSX.utils.book_new();

  const rows = [
    ['ALUR TUJUAN PEMBELAJARAN (ATP) - KURIKULUM MERDEKA'],
    ['SMK MUHAMMADIYAH BAWANG, BATANG'],
    [],
    ['Kategori Mapel', ':', identity.kategoriMapel === 'umum' ? 'Normatif-Adaptif (Mata Pelajaran Umum)' : 'Kejuruan (Mata Pelajaran Produktif)'],
    ['Program Keahlian', ':', identity.programKeahlian],
    ['Konsentrasi Keahlian', ':', identity.konsentrasiKeahlian],
    ['Mata Pelajaran', ':', identity.mataPelajaran],
    ['Fase / Kelas / Semester', ':', `Fase ${identity.fase} / Kelas ${identity.kelas} / Semester ${identity.semester}`],
    ['Tahun Pelajaran', ':', identity.tahunPelajaran],
    ['Guru Pengampu', ':', `${identity.namaGuru} (NIP: ${identity.nipGuru})`],
    [],
    [
      'Kode TP',
      'Elemen',
      'Capaian Pembelajaran (CP)',
      'Lingkup Materi',
      'Tujuan Pembelajaran (TP)',
      'Alur Tujuan Pembelajaran (ATP)',
      'Profil Pelajar Pancasila',
      'Alokasi Waktu (JP)',
      'Rencana Asesmen Formatif & Sumatif',
    ],
  ];

  atpList.forEach((item) => {
    rows.push([
      item.kodeTp,
      item.elemen,
      item.capaianPembelajaran,
      item.lingkupMateri,
      item.tujuanPembelajaran,
      item.alurTujuanPembelajaran,
      item.profilPelajarPancasila.join(', '),
      String(item.alokasiWaktuJp),
      `Formatif: ${item.asesmenRencana.formatif} | Sumatif: ${item.asesmenRencana.sumatif}`,
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [
    { wch: 10 },
    { wch: 28 },
    { wch: 45 },
    { wch: 30 },
    { wch: 45 },
    { wch: 45 },
    { wch: 25 },
    { wch: 16 },
    { wch: 40 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'ATP_SMK_Bawang');
  const safeSubject = identity.mataPelajaran.replace(/[^a-zA-Z0-9]/g, '_');
  XLSX.writeFile(wb, `ATP_${safeSubject}_SMK_Muhammadiyah_Bawang_${identity.tahunPelajaran.replace('/', '-')}.xlsx`);
}

/**
 * Exports all active RPP units to the full integrated Excel format
 */
export function exportRppToExcel(modulList: ModulAjarData[], identity: SchoolIdentity) {
  const wb = XLSX.utils.book_new();

  const headers = [
    'No / Unit',
    'Elemen',
    'Capaian Pembelajaran (CP)',
    'Alur & Tujuan Pembelajaran (ATP / TP)',
    'Lingkup Materi Pokok',
    'Alokasi Waktu (JP)',
    'Fase',
    'Kelas',
    'Semester',
    'Lintas Disiplin Ilmu',
    'Kesiapan Peserta Didik (Minat & Gaya Belajar)',
    'Karakteristik & Sifat Materi',
    'Dimensi Profil Lulusan / P5',
    'Metode & Model Pembelajaran',
    'Kemitraan Industri & Orang Tua',
    'Lingkungan Belajar (Fisik & Virtual)',
    'Pemanfaatan Digital',
    'Sintaks Pendahuluan (Mindful Learning)',
    'Sintaks Inti 1 - Memahami & Eksplorasi (Meaningful Learning)',
    'Sintaks Inti 2 - Mengaplikasi & Merefleksi (Joyful Learning)',
    'Sintaks Penutup (Refleksi 3-2-1 & Kaizen)',
    'Asesmen Awal (Diagnostik)',
    'Asesmen Proses (Formatif)',
    'Asesmen Akhir (Sumatif)',
    'Pengayaan dan Remedial',
  ];

  const dataRows = modulList.map((m, idx) => {
    const rpp = m.rppFormat;
    const ident = rpp.perencanaanMendalam.identifikasi;
    const desain = rpp.perencanaanMendalam.desainPembelajaran;
    const peng = rpp.pengalamanBelajar;
    const ases = rpp.asesmen;

    const profilList: string[] = [];
    if (ident.dimensiProfilLulusan.bernalarKritis) profilList.push('Bernalar Kritis');
    if (ident.dimensiProfilLulusan.kreativitas) profilList.push('Kreativitas');
    if (ident.dimensiProfilLulusan.kolaborasi) profilList.push('Kolaborasi');
    if (ident.dimensiProfilLulusan.kemandirian) profilList.push('Kemandirian');
    if (ident.dimensiProfilLulusan.keimananKetakwaan) profilList.push('Keimanan & Ketakwaan');
    if (ident.dimensiProfilLulusan.komunikasi) profilList.push('Komunikasi');
    if (ident.dimensiProfilLulusan.kewargaan) profilList.push('Kewargaan');
    if (ident.dimensiProfilLulusan.kesehatan) profilList.push('Kesehatan');

    return [
      idx + 1,
      m.elemenTerkait,
      desain.capaianPembelajaran,
      desain.tujuanPembelajaran.join('\n'),
      m.judulMateri,
      m.alokasiWaktuMateri.replace(/\D/g, '') || 12,
      identity.fase,
      identity.kelas,
      identity.semester,
      desain.lintasDisiplinIlmu,
      `Minat: ${ident.kesiapanPesertaDidik.minat}. Gaya Belajar: ${ident.kesiapanPesertaDidik.caraBelajar}. Lingkungan: ${ident.kesiapanPesertaDidik.lingkunganTempatTinggal}`,
      `${ident.karakteristikMateri.deskripsiMateri} | Sifat: ${ident.karakteristikMateri.sifatMateri.konseptualDanAplikatif}`,
      profilList.join(', '),
      `${desain.kerangkaPembelajaran.praktikPedagogik.pbl} | ${desain.kerangkaPembelajaran.praktikPedagogik.pjbl}`,
      `Mitra: ${desain.kerangkaPembelajaran.kemitraanPembelajaran.mitraIndustri.nama} | Ortu: ${desain.kerangkaPembelajaran.kemitraanPembelajaran.orangTuaWali.peran.join(', ')}`,
      `Fisik: ${desain.kerangkaPembelajaran.lingkunganBelajar.ruangFisik.join(', ')} | Virtual: ${desain.kerangkaPembelajaran.lingkunganBelajar.ruangVirtual.join(', ')}`,
      desain.kerangkaPembelajaran.pemanfaatanDigital.join(', '),
      peng.kegiatanInti.memahamiBermaknaMenggembirakan.instruksiGuru,
      peng.kegiatanInti.memahamiBermaknaMenggembirakan.rangkumanTemuan.join('; '),
      peng.kegiatanInti.merefleksiBerkesadaranBermakna.instruksiAplikasi,
      `Refleksi 3-2-1: ${peng.kegiatanPenutup.refleksiIndividu321.tigaHalPenting} | ${peng.kegiatanPenutup.kesimpulanDanPenguatan}`,
      ases.ringkasan.asesmenAwal,
      `${ases.ringkasan.asesmenProses} (Diskusi: ${ases.asesmenProsesDetail.diskusi})`,
      ases.ringkasan.asesmenAkhir,
      `${rpp.pengayaanDanRemedial.pengayaan} | ${rpp.pengayaanDanRemedial.remedial}`,
    ];
  });

  const fullSheet = [
    ['REKAPITULASI RENCANA PELAKSANAAN PEMBELAJARAN (RPP) DEEP LEARNING - SMK MUHAMMADIYAH BAWANG'],
    [`Mata Pelajaran: ${identity.mataPelajaran} | Kelas/Fase: ${identity.kelas}/Fase ${identity.fase} | Semester: ${identity.semester}`],
    [],
    headers,
    ...dataRows,
  ];

  const ws = XLSX.utils.aoa_to_sheet(fullSheet);
  XLSX.utils.book_append_sheet(wb, ws, 'RPP_DeepLearning');
  const safeSubject = identity.mataPelajaran.replace(/[^a-zA-Z0-9]/g, '_');
  XLSX.writeFile(wb, `RPP_DeepLearning_${safeSubject}_SMK_Muhammadiyah_Bawang.xlsx`);
}

/**
 * Unduh template Excel (.xlsx) khusus untuk Tabel Hasil Eksplorasi RPP
 */
export function downloadTabelEksplorasiTemplate(
  judul: string = 'Tabel Hasil Eksplorasi Data & Parameter',
  kolom1: string = 'Parameter / Kondisi Pengamatan',
  kolom2: string = 'Hasil Analisis & Tindakan Perbaikan',
  sampleRows: [string, string][] = [
    ['Pengukuran / Transaksi 1', 'Hasil Analisis & Rekomendasi 1'],
    ['Pengukuran / Transaksi 2', 'Hasil Analisis & Rekomendasi 2'],
    ['Pengukuran / Transaksi 3', 'Hasil Analisis & Rekomendasi 3'],
  ]
) {
  const wb = XLSX.utils.book_new();
  const sheetData = [
    ['TABEL HASIL EKSPLORASI PENGAMATAN RPP DEEP LEARNING'],
    [`Judul Tabel: ${judul}`],
    [],
    [kolom1, kolom2],
    ...sampleRows,
  ];
  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  ws['!cols'] = [{ wch: 35 }, { wch: 45 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Tabel_Eksplorasi');
  const safeTitle = judul.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
  XLSX.writeFile(wb, `Template_Tabel_Eksplorasi_${safeTitle}.xlsx`);
}

/**
 * Parse an uploaded Excel/CSV file into Tabel Eksplorasi structure:
 * { judul: string, kolom: [string, string], data: [string, string][] }
 */
export async function parseTabelEksplorasiFile(file: File): Promise<{
  judul: string;
  kolom: [string, string];
  data: [string, string][];
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawAoA: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!rawAoA || rawAoA.length === 0) {
          throw new Error('File Excel tabel eksplorasi kosong.');
        }

        let detectedJudul = 'Tabel Hasil Eksplorasi Pengamatan Murid';
        let headerRowIndex = -1;
        let col1 = 'Parameter / Kondisi Pengamatan';
        let col2 = 'Hasil Analisis & Rekomendasi';

        for (let r = 0; r < Math.min(rawAoA.length, 10); r++) {
          const row = rawAoA[r];
          if (!Array.isArray(row)) continue;
          const firstCell = String(row[0] || '').trim();
          if (firstCell.toLowerCase().includes('judul') || firstCell.toLowerCase().includes('tabel')) {
            const split = firstCell.split(':');
            if (split.length > 1 && split[1].trim()) {
              detectedJudul = split[1].trim();
            } else if (firstCell.length > 5) {
              detectedJudul = firstCell;
            }
          }
          // Detect header row when there are 2 columns filled
          if (row.length >= 2 && row[0] && row[1]) {
            const c0 = String(row[0]).trim();
            const c1 = String(row[1]).trim();
            if (!c0.toLowerCase().includes('rekapitulasi') && !c0.toLowerCase().includes('tabel hasil eksplorasi pengamatan rpp')) {
              headerRowIndex = r;
              col1 = c0;
              col2 = c1;
              break;
            }
          }
        }

        const dataRows: [string, string][] = [];
        const startRow = headerRowIndex !== -1 ? headerRowIndex + 1 : 0;
        for (let r = startRow; r < rawAoA.length; r++) {
          const row = rawAoA[r];
          if (!Array.isArray(row) || row.length === 0) continue;
          const val1 = String(row[0] !== undefined ? row[0] : '').trim();
          const val2 = String(row[1] !== undefined ? row[1] : '').trim();
          if (val1 || val2) {
            dataRows.push([val1, val2]);
          }
        }

        if (dataRows.length === 0) {
          throw new Error('Tidak ditemukan baris data pada file Excel tabel eksplorasi.');
        }

        resolve({
          judul: detectedJudul,
          kolom: [col1, col2],
          data: dataRows,
        });
      } catch (err: any) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
}
