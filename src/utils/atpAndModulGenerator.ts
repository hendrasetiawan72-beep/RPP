import {
  ExcelRawRow,
  ExcelRppRawRow,
  SchoolIdentity,
  AlurTujuanPembelajaranItem,
  ModulAjarData,
  GeneratedPerangkatAjar,
} from '../types';

/**
 * Helper to parse exploration table string from Excel or manual input
 * Supports: "Judul :: Kolom1 | Kolom2 :: r1_c1 | r1_c2 ; r2_c1 | r2_c2" or multiline
 */
export function parseTabelEksplorasi(rawStr?: string, defaultMateri?: string): {
  judul: string;
  kolom: [string, string];
  data: [string, string][];
} {
  const defaultTable = {
    judul: `Tabel Hasil Eksplorasi Data & Parameter: ${defaultMateri || 'Materi Pokok'}`,
    kolom: ['Indikator / Parameter Kerja', 'Hasil Analisis & Uji Fungsional'] as [string, string],
    data: [
      ['Parameter 1 (Kondisi Awal)', 'Terverifikasi sesuai spesifikasi dasar'],
      ['Parameter 2 (Pengujian Dinamis)', 'Terdapat deviasi parameter yang dianalisis solusinya'],
      ['Parameter 3 (Verifikasi Akhir)', 'Memenuhi standar toleransi dan kriteria unjuk kerja'],
    ] as [string, string][],
  };

  if (!rawStr || !rawStr.trim()) return defaultTable;

  try {
    if (rawStr.includes('::')) {
      const parts = rawStr.split('::').map((s) => s.trim());
      const judul = parts[0] || defaultTable.judul;
      let kolom: [string, string] = defaultTable.kolom;
      if (parts[1]) {
        const colParts = parts[1].split('|').map((c) => c.trim());
        if (colParts.length >= 2) {
          kolom = [colParts[0], colParts[1]];
        }
      }
      const data: [string, string][] = [];
      if (parts[2]) {
        const rowParts = parts[2].split(';').map((r) => r.trim()).filter(Boolean);
        rowParts.forEach((r) => {
          const cells = r.split('|').map((c) => c.trim());
          if (cells.length >= 2) {
            data.push([cells[0], cells[1]]);
          } else if (cells.length === 1) {
            data.push([cells[0], '-']);
          }
        });
      }
      if (data.length > 0) {
        return { judul, kolom, data };
      }
    }

    const lines = rawStr.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length >= 2) {
      let judul = defaultTable.judul;
      let startIndex = 0;
      if (!lines[0].includes('|')) {
        judul = lines[0];
        startIndex = 1;
      }
      let kolom: [string, string] = defaultTable.kolom;
      if (lines[startIndex] && lines[startIndex].includes('|')) {
        const headerCols = lines[startIndex].split('|').map((c) => c.trim());
        if (headerCols.length >= 2) {
          kolom = [headerCols[0], headerCols[1]];
          startIndex++;
        }
      }
      const data: [string, string][] = [];
      for (let i = startIndex; i < lines.length; i++) {
        const cells = lines[i].split('|').map((c) => c.trim());
        if (cells.length >= 2) {
          data.push([cells[0], cells[1]]);
        }
      }
      if (data.length > 0) {
        return { judul, kolom, data };
      }
    }
  } catch (e) {
    console.warn('Gagal mem-parse tabelEksplorasi dari Excel, menggunakan default:', e);
  }

  return defaultTable;
}

/**
 * Generates an ATP (Alur Tujuan Pembelajaran) matrix and segmented RPP Pendekatan Deep Learning
 * strictly matching the official format from SMK Muhammadiyah Bawang.
 */
export function generatePerangkatAjar(
  rawRows: ExcelRawRow[],
  identity: SchoolIdentity
): GeneratedPerangkatAjar {
  const atpList: AlurTujuanPembelajaranItem[] = [];
  const modulAjarList: ModulAjarData[] = [];

  rawRows.forEach((row, index) => {
    const elemen = row.elemen || `Elemen ${index + 1}`;
    const cp = row.capaianPembelajaran || 'Peserta didik mampu memahami dan menerapkan kompetensi dasar secara profesional.';
    const materi = row.materi || 'Materi Pokok';
    const jp = typeof row.jp === 'number' ? row.jp : parseInt(String(row.jp || '12'), 10) || 12;

    const materiParts = materi.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
    const subTopics = materiParts.length > 0 ? materiParts : [materi];

    // TP 1: Konseptual & Analitis
    const tp1Code = `${index + 1}.1`;
    const kompetensi1 = ['Memahami konsep', 'Menganalisis prinsip kerja', 'Mengidentifikasi karakteristik'];
    const tp1 = `Peserta didik mampu menganalisis konsep dasar dan karakteristik ${subTopics[0] || materi} dengan bernalar kritis dan teliti sesuai standar operasional.`;
    const atp1 = `Mengamati fenomena kasus nyata, mengidentifikasi komponen ${subTopics[0] || materi}, mendiskusikan mekanisme kerja, dan menyimpulkan prinsip fundamental secara terstruktur.`;

    atpList.push({
      id: `atp-${index}-1`,
      kodeTp: `TP ${tp1Code}`,
      elemen,
      capaianPembelajaran: cp,
      lingkupMateri: subTopics[0] || materi,
      kompetensi: kompetensi1,
      tujuanPembelajaran: tp1,
      alurTujuanPembelajaran: atp1,
      profilPelajarPancasila: ['Bernalar Kritis', 'Kemandirian'],
      alokasiWaktuJp: Math.max(2, Math.floor(jp * 0.4)),
      asesmenRencana: {
        diagnostik: 'Kuis kesiapan awal & tes tanya jawab lisan pemahaman prasyarat',
        formatif: 'Lembar observasi diskusi & asesmen diri (self-assessment)',
        sumatif: 'Tes tertulis analisis konsep & studi kasus',
      },
    });

    // TP 2: Aplikatif & Praktik
    const secondTopic = subTopics.length > 1 ? subTopics.slice(1).join(', ') : `${materi} dalam aplikasi nyata`;
    const tp2Code = `${index + 1}.2`;
    const kompetensi2 = ['Mempraktikkan', 'Menguji / Troubleshooting', 'Mengevaluasi hasil'];
    const tp2 = `Peserta didik mampu mempraktikkan, merancang, dan menguji ${secondTopic} dengan mematuhi keselamatan kerja K3LH serta berkolaborasi secara kreatif dalam tim kerja.`;
    const atp2 = `Merancang lembar kerja/job sheet, melaksanakan praktik hands-on ${secondTopic}, menguji fungsionalitas, memecahkan kendala (troubleshooting), serta menyusun laporan hasil kerja.`;

    atpList.push({
      id: `atp-${index}-2`,
      kodeTp: `TP ${tp2Code}`,
      elemen,
      capaianPembelajaran: cp,
      lingkupMateri: secondTopic,
      kompetensi: kompetensi2,
      tujuanPembelajaran: tp2,
      alurTujuanPembelajaran: atp2,
      profilPelajarPancasila: ['Kreativitas', 'Kolaborasi', 'Bernalar Kritis'],
      alokasiWaktuJp: Math.max(2, Math.ceil(jp * 0.6)),
      asesmenRencana: {
        diagnostik: 'Observasi kesiapan keterampilan dasar & alat kerja',
        formatif: 'Penilaian unjuk kerja proses & peer feedback',
        sumatif: 'Penilaian proyek berbasis job sheet praktik / LKPD',
      },
    });

    // Generate RPP Pendekatan Deep Learning for this specific material
    const rppData = generateRppForMaterial(row, index + 1, identity, jp);
    modulAjarList.push(rppData);
  });

  const totalJp = atpList.reduce((acc, curr) => acc + curr.alokasiWaktuJp, 0);
  const updatedIdentity: SchoolIdentity = {
    ...identity,
    alokasiWaktuTotal: `${totalJp} JP`,
  };

  return {
    identity: updatedIdentity,
    atpList,
    modulAjarList,
    createdAt: new Date().toISOString(),
  };
}

function checkProfil(text: string | undefined, ...keywords: string[]): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

/**
 * Generates both ATP and detailed RPP Deep Learning directly from the comprehensive RPP Excel rows.
 * Synchronizes CP, ATP, materi, metode, sintaks pembelajaran, and asesmen.
 */
export function generatePerangkatAjarFromRpp(
  rppRows: ExcelRppRawRow[],
  identity: SchoolIdentity
): GeneratedPerangkatAjar {
  const atpList: AlurTujuanPembelajaranItem[] = [];
  const modulAjarList: ModulAjarData[] = [];

  // Sample student names for Lampiran 4
  const sampleStudentNames = [
    'ACHMAD RIZQI MAULANA', 'AFDAL MAULANA YUSUF', 'ALBANI BUDIHARI', 'ARIF KOMARUDIN',
    'BAGUS ALIFIANSYAH', 'DAVID HELMI ABDILLAH', 'DIMAS WASIS ARDIANTO', 'DINIA FATMA',
    'EKA PUTRA RAMADHANU', 'ESA SIGIT', 'FADHIL HADI NUGROHO', 'FAHMI KHAFID',
    'FARKHAN ASHAR FIRDAUS', 'IFAN MAULANA', 'INDRA RAFI RAMADANI', 'KHOIRIL HADHI',
    'LUKY ANDRIAS IMAWAN', 'M. ARDIYAN AFENDI', 'MOCHAMMAD FACHRUL FAHIM AKBAR',
    'MUHAMAD FAHRUL ARVAN', 'MUHAMAD RIZKI NAFIUDIN', 'MUHAMMAD NURUL AZHAR',
    'PUTRA WILLYAM FAJAR ABDILLAH', 'ROFI VIRMAN MAULANA', 'SYAFI\'IL ANAM',
    'TRI AKBAR NUGROHO', 'WILDAN KHAERUL FAIZ'
  ];

  rppRows.forEach((row, index) => {
    const unitNo = index + 1;
    const elemen = row.elemen || `Elemen ${unitNo}`;
    const cp = row.capaianPembelajaran || 'Peserta didik memahami dan menerapkan kompetensi dasar secara profesional.';
    const materi = row.materi || `Materi Pokok Unit ${unitNo}`;
    const jpNum = typeof row.jp === 'number' ? row.jp : parseInt(String(row.jp || '12'), 10) || 12;

    // Profil list
    const profilList: string[] = [];
    if (row.profilLulusan) {
      if (checkProfil(row.profilLulusan, 'kritis', 'nalar')) profilList.push('Bernalar Kritis');
      if (checkProfil(row.profilLulusan, 'kreatif')) profilList.push('Kreativitas');
      if (checkProfil(row.profilLulusan, 'kolaborasi', 'gotong')) profilList.push('Kolaborasi');
      if (checkProfil(row.profilLulusan, 'mandiri')) profilList.push('Kemandirian');
      if (checkProfil(row.profilLulusan, 'iman', 'takwa', 'akhlak')) profilList.push('Keimanan & Ketakwaan');
      if (checkProfil(row.profilLulusan, 'komunikasi')) profilList.push('Komunikasi');
    }
    if (profilList.length === 0) {
      profilList.push('Bernalar Kritis', 'Kreativitas', 'Kolaborasi');
    }

    // 1. Build ATP Item synchronized with this RPP row
    const tpFormatted = row.tujuanPembelajaran
      ? row.tujuanPembelajaran.trim()
      : `Peserta didik mampu menganalisis, mempraktikkan, dan memecahkan permasalahan pada materi ${materi} dengan bernalar kritis dan mandiri.`;

    const alurFormatted = row.alurPembelajaran ||
      `Tahap 1: Orientasi konsep dasar ${materi}, Tahap 2: Diskusi studi kasus & pembuktian parameter, Tahap 3: Praktik unjuk kerja terapan, Tahap 4: Refleksi 3-2-1 dan asesmen sumatif.`;

    atpList.push({
      id: `atp-rpp-${unitNo}`,
      kodeTp: `TP ${unitNo}.1`,
      elemen,
      capaianPembelajaran: cp,
      lingkupMateri: materi,
      kompetensi: ['Memahami & Menganalisis', 'Mengaplikasikan', 'Mengevaluasi'],
      tujuanPembelajaran: tpFormatted,
      alurTujuanPembelajaran: alurFormatted,
      profilPelajarPancasila: profilList,
      alokasiWaktuJp: jpNum,
      asesmenRencana: {
        diagnostik: row.asesmenAwal || 'Kuis tanya jawab kesiapan mental dan uji prasyarat',
        formatif: row.asesmenProses || 'Observasi unjuk kerja proses & penilaian presentasi kelompok',
        sumatif: row.asesmenAkhir || 'Penilaian tugas job sheet LKPD dan tes tertulis akhir unit',
      },
    });

    // 2. Build ModulAjarData (RPP Deep Learning) synchronized with all columns
    const rekapNilaiSiswaContoh = sampleStudentNames.map((nama, idx) => {
      const keaktifan = (idx % 3 === 0) ? 4 : 3;
      const kerjasama = (idx % 2 === 0) ? 4 : 3;
      const tanggungJawab = (idx % 4 === 0) ? 4 : 3;
      const disiplin = (idx % 5 === 0) ? 3 : 4;
      const ketuntasan = (idx % 6 === 0) ? 2 : 3;
      const totalSkor = keaktifan + kerjasama + tanggungJawab + disiplin + ketuntasan;
      const nilaiAkhir = Math.round((totalSkor / 20) * 100);
      return {
        no: idx + 1,
        nama,
        keaktifan,
        kerjasama,
        tanggungJawab,
        disiplin,
        ketuntasan,
        totalSkor,
        nilaiAkhir,
      };
    });

    const parsedTpList = row.tujuanPembelajaran
      ? row.tujuanPembelajaran
          .split(/\n|;/)
          .map((s) => s.replace(/^\s*(?:\d+[\.\)]|[a-zA-Z][\.\)]|[-•*])\s*/, '').trim())
          .filter(Boolean)
      : [
          `Memahami prinsip kerja, konsep fundamental, dan batasan operasional ${materi}.`,
          `Menganalisis, merancang, dan menguji pemecahan masalah ${materi} secara presisi sesuai standar SOP.`,
        ];

    const rppData: ModulAjarData = {
      id: `rpp-modul-${unitNo}-${Date.now()}`,
      nomorModul: unitNo,
      judulMateri: materi,
      elemenTerkait: elemen,
      alokasiWaktuMateri: `${jpNum} JP`,
      identity,
      rppFormat: {
        identitasTabel: {
          mataPelajaran: identity.mataPelajaran,
          kelas: `${row.kelas || identity.kelas}/Fase ${row.fase || identity.fase}`,
          semesterTahunPelajaran: `${row.semester || identity.semester}/${identity.tahunPelajaran}`,
          lingkupMateri: materi,
          waktuJp: `${jpNum} X 45 menit`,
        },
        perencanaanMendalam: {
          identifikasi: {
            kesiapanPesertaDidik: {
              minat: row.kesiapanPesertaDidik || 'Literasi teknologi terapan, sistem perbengkelan/bisnis finansial, wirausaha, sosial media.',
              caraBelajar: '40% Murid memiliki gaya belajar visual, 40% auditory, dan 20% kinestetik / praktik langsung.',
              lingkunganTempatTinggal: 'Keluarga pengrajin, pedagang, bengkel, perkebunan dan buruh di sekitar Bawang, Batang.',
            },
            karakteristikMateri: {
              deskripsiMateri: row.karakteristikMateri || `Materi yang dipelajari berupa pemahaman mendalam, analisis data, dan aplikasi kontekstual mengenai ${materi}.`,
              poinKarakteristik: [
                `Memberikan pemahaman fundamental tentang konsep dan prinsip kerja ${materi}.`,
                `Mendorong Murid berpikir abstrak, kritis, dan memahami cara menganalisis serta memecahkan problem ${materi}.`,
              ],
              sifatMateri: {
                konseptualDanAplikatif: row.karakteristikMateri || 'Memberikan pemahaman dasar sambil menunjukkan aplikasinya dalam kehidupan nyata dan dunia kerja industri.',
                kemampuanBerpikirIlmiah: 'Mendorong Murid untuk mengamati, menganalisis, dan menyelesaikan masalah secara metodis.',
              },
            },
            dimensiProfilLulusan: {
              keimananKetakwaan: checkProfil(row.profilLulusan, 'iman', 'takwa', 'akhlak'),
              kesehatan: checkProfil(row.profilLulusan, 'sehat', 'jasmani'),
              kemandirian: checkProfil(row.profilLulusan, 'mandiri') || true,
              bernalarKritis: checkProfil(row.profilLulusan, 'kritis', 'nalar') || true,
              kolaborasi: checkProfil(row.profilLulusan, 'kolaborasi', 'gotong') || true,
              komunikasi: checkProfil(row.profilLulusan, 'komunikasi') || true,
              kreativitas: checkProfil(row.profilLulusan, 'kreatif') || true,
              kewargaan: checkProfil(row.profilLulusan, 'kewargaan', 'warga negara'),
            },
          },
          desainPembelajaran: {
            capaianPembelajaran: cp,
            lintasDisiplinIlmu: row.lintasDisiplin || `${identity.mataPelajaran} dan Kejuruan Terkait`,
            tujuanPembelajaran: parsedTpList,
            topikKontekstual: [materi],
            kerangkaPembelajaran: {
              praktikPedagogik: {
                pbl: row.metodePembelajaran || 'Problem-Based Learning (PBL): Murid menyelesaikan masalah kontekstual nyata di tempat kerja/bengkel.',
                pjbl: 'Project-Based Learning (PjBL): Proyek mini penyusunan laporan analisis dan presentasi karya tim.',
              },
              kemitraanPembelajaran: {
                mitraIndustri: {
                  nama: row.kemitraan || 'Dunia Usaha & Dunia Industri (DUDI) Rekanan Batang',
                  peran: [
                    'Memberikan data atau informasi tentang nama alat/dokumen beserta fungsinya.',
                    'Menyediakan narasumber/instruktur untuk menjelaskan standar operasional kerja.',
                  ],
                  terkaitPbl: 'Mendukung Murid dalam studi kasus peralatan, prosedur kerja, dan standar operasional.',
                },
                orangTuaWali: {
                  peran: [
                    'Mendukung kegiatan luar kelas (pengambilan data, observasi lingkungan, wawancara, dan dokumentasi).',
                  ],
                  terkaitMetode: 'Menjadi penguat dan pendamping pembelajaran dari rumah.',
                },
              },
              lingkunganBelajar: {
                ruangFisik: [
                  'Kelas yang Fleksibel dan Kolaboratif',
                  'Bengkel / Laboratorium praktik SMK Muhammadiyah Bawang standar 5S/5R',
                ],
                ruangVirtual: [
                  'Google Classroom (mengatur proyek, tugas, materi digital, dan forum diskusi)',
                  'Platform Kolaborasi Digital (Google Docs / Slides / Spreadsheet)',
                ],
                budayaBelajar: [
                  'Budaya Inkuiri dan Berpikir Kritis',
                  'Budaya Kolaboratif dan Empatik',
                  'Budaya 5S/Kaizen dan K3LH',
                ],
                penerapanNyataBudaya: {
                  ruangFisik: 'Pengamatan alat/data di laboratorium/bengkel dan dikelompokkan sesuai fungsinya secara cermat.',
                  ruangVirtual: 'Murid mengunggah hasil eksperimen/analisis dan berdiskusi di forum online interaktif.',
                  budayaBelajar: 'Murid melakukan diskusi mendalam dan debat ilmiah santun berbasis data hasil pengamatan.',
                },
              },
              pemanfaatanDigital: row.lingkunganDigital ? [row.lingkunganDigital] : [
                'Google Classroom (mengatur proyek, mengunggah tugas, diskusi daring, video pembelajaran)',
                'Platform Kolaborasi Digital (Google Docs / Slides / Spreadsheet)',
              ],
            },
          },
        },
        pengalamanBelajar: {
          kegiatanInti: {
            memahamiBermaknaMenggembirakan: {
              instruksiGuru: row.sintaksInti1 ||
                `Guru meminta murid memperhatikan fenomena, data, dan lembar kerja ${materi} dengan saksama. Guru mengajukan pertanyaan pemantik bernalar kritis dan membimbing eksplorasi berkelompok.`,
              tabelEksplorasi: parseTabelEksplorasi(row.tabelEksplorasi, materi),
              rangkumanTemuan: [
                'Data dan tabel memberikan informasi visual yang akurat mengenai performa sistem.',
                'Pola relasi masukan (input) dan keluaran (output) terukur secara konsisten.',
                'Murid berhasil mengidentifikasi anomali serta merumuskan tindakan perbaikan yang tepat.',
              ],
            },
            merefleksiBerkesadaranBermakna: {
              instruksiAplikasi: row.sintaksInti2 ||
                `Guru membimbing murid mengaplikasikan konsep ${materi} pada permasalahan nyata dan mengulang prosedur teknis dengan berkesadaran, bermakna, dan menggembirakan.`,
              penguatanKonsep: 'Setiap kelompok mempresentasikan cara pemecahan masalah dengan percaya diri, saling melengkapi dan mendiskusikan variasi solusi.',
            },
          },
          kegiatanPenutup: {
            refleksiIndividu321: {
              tigaHalPenting: '3 hal penting yang mereka pelajari dari materi ini.',
              duaPertanyaan: '2 pertanyaan yang masih mereka miliki untuk didiskusikan lebih lanjut.',
              satuHalMenarik: '1 hal yang paling menarik menurut mereka dari pelajaran hari ini.',
            },
            kesimpulanDanPenguatan: row.sintaksPenutup ||
              'Guru memandu Murid menyusun kesimpulan bersama dan memberikan penguatan konsep secara menyeluruh.',
            tindakLanjut:
              'Guru menyampaikan tindak lanjut dengan memberikan gambaran singkat tentang materi berikutnya, serta memberikan latihan penugasan aplikatif sebagai penguatan dari rumah.',
          },
        },
        asesmen: {
          ringkasan: {
            asesmenAwal: row.asesmenAwal || 'Jenis penilaian: tertulis/lisan. Bentuk penilaian: isian singkat & tanya jawab kesiapan belajar.',
            asesmenProses: row.asesmenProses || 'Terlampir (Observasi Diskusi, Presentasi, dan Unjuk Kerja Keterampilan Proses).',
            asesmenAkhir: row.asesmenAkhir || 'Terlampir (Penilaian Sikap Spiritual, Sikap Sosial, Pengetahuan Kelompok, Keterampilan, dan Sumatif).',
          },
          asesmenAwalInstrumen: {
            tujuan: 'Mengetahui pengetahuan awal, kesiapan belajar, serta kondisi awal fisik dan mental para peserta didik.',
            daftarPertanyaan: [
              { no: 1, pertanyaan: 'Apa kabar hari ini? Apakah baik-baik saja dan siap belajar?' },
              { no: 2, pertanyaan: 'Apakah ada yang merasa kurang sehat hari ini?' },
              { no: 3, pertanyaan: `Apa yang kalian ketahui tentang materi ${materi}?` },
              { no: 4, pertanyaan: `Pernahkah melihat penerapan ${materi} di lingkungan sekitar atau tempat kerja?` },
              { no: 5, pertanyaan: 'Apa target keterampilan yang ingin kalian kuasai hari ini?' },
            ],
            tujuanEvaluasi: 'Menilai motivasi dan persepsi awal Murid terhadap pentingnya pembelajaran mendalam ini.',
          },
          asesmenProsesDetail: {
            diskusi: row.asesmenProses || 'Melatih kemampuan peserta didik dalam berkolaborasi dengan kelompoknya, melatih berbicara dan berani mengungkapkan pendapat.',
            presentasi: 'Melatih kemampuan peserta didik dalam berbicara di depan umum, berani mengajukan pertanyaan terhadap pemaparan kelompok lain.',
            unjukKerja: 'Menilai keterampilan proses yang dimiliki setiap anak dan memantau perkembangannya secara berkelanjutan.',
          },
          asesmenSumatifDetail: {
            pengantar: row.asesmenAkhir ||
              'Dilaksanakan di akhir pembelajaran untuk mengukur tingkat capaian pemahaman peserta didik guna menentukan langkah selanjutnya.',
            sikapSpiritual: {
              teknik: 'Penilaian diri',
              instrumen: 'Rubrik Checklist',
              indikator: [
                'Berdoa sebelum dan sesudah kegiatan belajar',
                'Menghargai sesama teman sebagai ciptaan Tuhan YME',
                'Menjaga kejujuran dalam mencatat data pengamatan',
              ],
            },
            sikapSosial: {
              teknik: 'Observasi teman sejawat & jurnal guru',
              instrumen: 'Catatan anekdotal',
              indikator: [
                'Menunjukkan kerjasama dalam kerja kelompok',
                'Mendengarkan pendapat orang lain dengan seksama',
                'Bertanggung jawab menyelesaikan tugas pembagian kelompok',
              ],
            },
            pengetahuanKelompok: {
              aspek: ['Ketepatan analisis', 'Kelengkapan penjelasan', 'Kerapian sajian data'],
              pedomanSkor: [
                { skor: 4, predikat: 'Sangat Baik', kriteria: 'Menjawab tepat dan memberikan alasan analitis mendalam' },
                { skor: 3, predikat: 'Baik', kriteria: 'Menjawab tepat dengan rincian cukup' },
                { skor: 2, predikat: 'Cukup', kriteria: 'Menjawab sebagian dengan bantuan guru' },
                { skor: 1, predikat: 'Perlu Bimbingan', kriteria: 'Belum mampu menjawab' },
              ],
              rumus: 'Nilai = (Skor Perolehan / 12) x 100',
            },
            penilaianKeterampilan: {
              aspek: ['Kesiapan alat', 'Kesesuaian langkah SOP', 'Penyelesaian masalah', 'Kepatuhan K3LH'],
              pedomanSkor: [
                { skor: 4, predikat: 'Sangat Baik', kriteria: 'Melakukan seluruh tahapan mandiri tanpa kesalahan' },
                { skor: 3, predikat: 'Baik', kriteria: 'Melakukan tahapan mandiri dengan kesalahan minor' },
                { skor: 2, predikat: 'Cukup', kriteria: 'Melakukan tahapan dengan arahan guru' },
                { skor: 1, predikat: 'Perlu Bimbingan', kriteria: 'Belum mampu melakukan langkah kerja' },
              ],
              rumus: 'Nilai = (Skor Perolehan / 16) x 100',
            },
            hasilKerjaKelompok: {
              aspek: ['Format laporan', 'Kedalaman interpretasi', 'Presentasi lisan'],
              pedomanSkor: [
                { skor: 4, predikat: 'Sangat Baik', kriteria: 'Karya terstruktur dan penyampaian komunikatif' },
                { skor: 3, predikat: 'Baik', kriteria: 'Karya terstruktur dengan penyampaian jelas' },
                { skor: 2, predikat: 'Cukup', kriteria: 'Karya kurang lengkap namun dipahami' },
                { skor: 1, predikat: 'Perlu Bimbingan', kriteria: 'Karya belum selesai' },
              ],
              rumus: 'Nilai = (Skor Perolehan / 12) x 100',
            },
            rubrikPenilaianSikapObservasi: [
              {
                kriteria: 'Bernalar Kritis',
                sangatBaik: 'Aktif menganalisis dan mengajukan solusi inovatif secara mandiri',
                baik: 'Mampu menganalisis masalah dan menyampaikan argumen runtut',
                cukup: 'Mampu menganalisis jika dibantu pemantik pertanyaan',
                perluDikembangkan: 'Belum menunjukkan kemampuan menganalisis fakta',
              },
              {
                kriteria: 'Gotong Royong & Kolaborasi',
                sangatBaik: 'Sangat kooperatif, menghargai rekan kerja, dan membantu teman',
                baik: 'Bekerja sama dengan baik dalam kelompok',
                cukup: 'Cenderung pasif dalam diskusi kelompok',
                perluDikembangkan: 'Enggan bekerjasama dengan anggota kelompok',
              },
              {
                kriteria: 'Kreativitas & Kemandirian',
                sangatBaik: 'Menghasilkan karya orisinal dan solutif dengan percaya diri',
                baik: 'Mampu menemukan variasi pemecahan masalah dengan baik',
                cukup: 'Meniru model yang ada dengan sedikit modifikasi',
                perluDikembangkan: 'Belum berinisiatif mengembangkan ide baru',
              },
            ],
          },
        },
        pengayaanDanRemedial: {
          pengayaan: row.pengayaanRemedial ? `Pengayaan: ${row.pengayaanRemedial}` : 'Diberikan penugasan studi kasus industri lanjutan dan eksplorasi teknologi terkini bagi peserta didik yang telah melampaui KKTP.',
          remedial: 'Diberikan bimbingan terfokus dan penugasan ulang pada indikator yang belum dikuasai peserta didik.',
        },
        refleksiGuruDanPesertaDidik: {
          refleksiGuru: [
            { no: 1, aspek: 'Keterlibatan Peserta Didik', refleksi: 'Apakah seluruh peserta didik aktif terlibat dalam tahapan pembelajaran?' },
            { no: 2, aspek: 'Pencapaian Tujuan', refleksi: 'Apakah sintaks pembelajaran mendalam berhasil mengantarkan murid mencapai tujuan pembelajaran?' },
            { no: 3, aspek: 'Efektivitas Waktu', refleksi: 'Apakah alokasi waktu yang direncanakan cukup untuk praktik dan refleksi?' },
          ],
          refleksiPesertaDidik: {
            pertanyaanJurnal: [
              'Bagian mana dari pelajaran hari ini yang paling kalian senangi?',
              'Tantangan apa yang paling sulit kalian hadapi saat praktik kerja?',
              'Apa komitmen kalian untuk meningkatkan hasil belajar pada pertemuan berikutnya?',
            ],
            angketEmoticon: [
              { no: 1, kompetensi: `Pemahaman konsep ${materi}` },
              { no: 2, kompetensi: 'Keterampilan praktik dan penerapan SOP' },
              { no: 3, kompetensi: 'Kekompakan tim dalam menyelesaikan tugas' },
            ],
          },
          hasilTindakLanjut: [
            'Mengoptimalkan bimbingan klinis bagi murid yang membutuhkan perhatian khusus.',
            'Memberikan pengayaan berbasis proyek riil industri bagi murid berprestasi tinggi.',
          ],
        },
        lampiran: {
          lkpd: {
            nomor: `LKPD-${unitNo}`,
            judul: `LEMBAR KERJA PESERTA DIDIK (LKPD) - ${materi.toUpperCase()}`,
            tautan: row.tautanLkpd || 'https://docs.google.com/document/d/1sample-lkpd-smk-muhammadiyah-bawang/preview',
            embedCode: row.embedLkpd || '',
          },
          bahanBacaan: {
            judul: `Bahan Bacaan Siswa & Guru: Konsep Fundamental & Terapan ${materi}`,
            tautan: row.tautanMateri || 'https://guru.kemdikbud.go.id/',
            embedCode: row.embedMateri || '',
            pengantarFungsi: `Materi ${materi} merupakan kompetensi inti yang membekali peserta didik dengan kecakapan analitis dan praktis berstandar industri.`,
            analogiIlustrasi: `Memahami ${materi} seperti merawat dan mengoperasikan mesin presisi: setiap bagian memiliki fungsi spesifik yang saling menopang secara harmonis.`,
            pembahasan1: {
              judul: `Prinsip Operasional dan Landasan Teori ${materi}`,
              uraian: `Secara konseptual, materi ini membahas struktur sistematis, klasifikasi parameter, serta mekanisme kerja yang terukur sesuai standar acuan nasional dan internasional.`,
            },
            pembahasan2: {
              judul: `Penerapan Praktik dan Troubleshooting di Tempat Kerja`,
              uraian: `Di lingkungan bengkel atau industri, penerapan kompetensi ini membutuhkan ketelitian, penggunaan alat ukur yang tepat, serta kepatuhan penuh terhadap SOP dan K3LH.`,
            },
            pertanyaanUji: [
              `Sebutkan prinsip dasar dari ${materi}!`,
              `Bagaimana cara mendeteksi kesalahan operasional secara dini?`,
              `Jelaskan pentingnya dokumentasi hasil analisis dalam pekerjaan profesional!`,
            ],
          },
          rubrikObservasiKelompok: [
            {
              no: 1,
              aspek: 'Keaktifan Diskusi',
              kriteria: [
                'Pasif (Skor 1)',
                'Aktif jika ditunjuk (Skor 2)',
                'Aktif berpendapat (Skor 3)',
                'Sangat aktif dan memandu jalannya diskusi (Skor 4)',
              ],
            },
            {
              no: 2,
              aspek: 'Kerjasama Kelompok',
              kriteria: [
                'Bekerja sendiri (Skor 1)',
                'Bekerja sama dengan sedikit kontribusi (Skor 2)',
                'Bekerja sama dengan baik (Skor 3)',
                'Saling membantu dan solid membagi peran (Skor 4)',
              ],
            },
            {
              no: 3,
              aspek: 'Tanggung Jawab & Disiplin',
              kriteria: [
                'Sering mengabaikan tugas (Skor 1)',
                'Menyelesaikan tugas setelah diingatkan (Skor 2)',
                'Menyelesaikan tugas tepat waktu (Skor 3)',
                'Menyelesaikan tugas dengan kualitas prima dan taat K3LH (Skor 4)',
              ],
            },
          ],
          embedCodeRubrik: row.embedRubrik || '',
          rekapNilaiSiswaContoh,
        },
      },
    };

    modulAjarList.push(rppData);
  });

  const totalJp = atpList.reduce((acc, curr) => acc + curr.alokasiWaktuJp, 0);
  const updatedIdentity: SchoolIdentity = {
    ...identity,
    alokasiWaktuTotal: `${totalJp} JP`,
  };

  return {
    identity: updatedIdentity,
    atpList,
    modulAjarList,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Generates an RPP document with Deep Learning approach strictly adhering to the user's PDF sample.
 */
function generateRppForMaterial(
  row: ExcelRawRow,
  modulNumber: number,
  identity: SchoolIdentity,
  jpNum: number
): ModulAjarData {
  const materi = row.materi || `Materi Pokok ${modulNumber}`;
  const elemen = row.elemen || `Elemen ${modulNumber}`;
  const cp = row.capaianPembelajaran || 'Peserta didik memahami dan menerapkan kompetensi dasar.';
  const isUmum = identity.kategoriMapel === 'umum';

  // Topic-specific customizers
  const subjectLower = identity.mataPelajaran.toLowerCase();
  let defaultMitra = 'Bengkel Otomotif dan Industri Rekanan Batang';
  let defaultInterest = 'Otomotif, teknologi permesinan, media sosial, game';
  let defaultDisiplin = `${identity.mataPelajaran} dan Kompetensi Keahlian Otomotif`;
  let tableCol1 = 'Waktu (s)';
  let tableCol2 = 'Nilai Output / Parameter';
  let sampleRows: [string, string][] = [
    ['0', '0'],
    ['1', '2'],
    ['2', '4'],
    ['3', '8'],
    ['4', '10'],
    ['5', '12'],
    ['6', '12'],
    ['7', '12'],
    ['8', '12'],
    ['9', '11'],
    ['10', '9'],
  ];

  if (subjectLower.includes('akuntansi') || subjectLower.includes('keuangan')) {
    defaultMitra = 'Kantor Akuntan Publik / Lembaga Keuangan & Bank Mini SMK';
    defaultInterest = 'Literasi finansial, spreadsheet bisnis, wirausaha, sosial media';
    defaultDisiplin = `${identity.mataPelajaran}, Matematika Bisnis, dan Manajemen Perkantoran`;
    tableCol1 = 'Bulan / Periode';
    tableCol2 = 'Saldo Kas / Arus Kas (Rp)';
    sampleRows = [
      ['Januari', '12.500.000'],
      ['Februari', '14.200.000'],
      ['Maret', '16.800.000'],
      ['April', '15.400.000'],
      ['Mei', '18.900.000'],
      ['Juni', '21.000.000'],
      ['Juli', '20.500.000'],
      ['Agustus', '23.400.000'],
    ];
  } else if (subjectLower.includes('inggris') || subjectLower.includes('english')) {
    defaultMitra = 'Dunia Usaha dan Industri Mitra Perdagangan Global Batang';
    defaultInterest = 'Musik barat, media sosial, video editing, game online';
    defaultDisiplin = 'Bahasa Inggris, Komunikasi Bisnis, dan Kejuruan Terkait';
    tableCol1 = 'Situasi Komunikasi';
    tableCol2 = 'Frasa & Respon Standar Profesional';
    sampleRows = [
      ['Greeting Customer', 'Good morning, how may I assist you today?'],
      ['Handling Inquiries', 'Certainly, let me verify the technical specs for you.'],
      ['Solving Problem', 'We apologize for the inconvenience, we will replace it.'],
      ['Confirming Order', 'Your work order has been verified and processed.'],
      ['Closing Call', 'Thank you for choosing our service, have a great day!'],
    ];
  } else if (subjectLower.includes('matematika')) {
    defaultMitra = 'Bengkel Sepeda Motor Terdekat dan Industri Manufaktur';
    defaultInterest = 'Musik, sosial media, game, teknologi terapan';
    defaultDisiplin = 'Matematika dan Kompetensi Keahlian Otomotif / AKL';
    tableCol1 = 'Waktu (s)';
    tableCol2 = 'Kecepatan (m/s)';
    sampleRows = [
      ['0', '0'],
      ['1', '2'],
      ['2', '4'],
      ['3', '8'],
      ['4', '10'],
      ['5', '12'],
      ['6', '12'],
      ['7', '12'],
      ['8', '12'],
      ['9', '11'],
      ['10', '9'],
    ];
  }

  // 27 Representative Student Sample for Lampiran 4
  const sampleStudentNames = [
    'ACHMAD RIZQI MAULANA', 'AFDAL MAULANA YUSUF', 'ALBANI BUDIHARI', 'ARIF KOMARUDIN',
    'BAGUS ALIFIANSYAH', 'DAVID HELMI ABDILLAH', 'DIMAS WASIS ARDIANTO', 'DINIA FATMA',
    'EKA PUTRA RAMADHANU', 'ESA SIGIT', 'FADHIL HADI NUGROHO', 'FAHMI KHAFID',
    'FARKHAN ASHAR FIRDAUS', 'IFAN MAULANA', 'INDRA RAFI RAMADANI', 'KHOIRIL HADHI',
    'LUKY ANDRIAS IMAWAN', 'M. ARDIYAN AFENDI', 'MOCHAMMAD FACHRUL FAHIM AKBAR',
    'MUHAMAD FAHRUL ARVAN', 'MUHAMAD RIZKI NAFIUDIN', 'MUHAMMAD NURUL AZHAR',
    'PUTRA WILLYAM FAJAR ABDILLAH', 'ROFI VIRMAN MAULANA', 'SYAFI\'IL ANAM',
    'TRI AKBAR NUGROHO', 'WILDAN KHAERUL FAIZ'
  ];

  const rekapNilaiSiswaContoh = sampleStudentNames.map((nama, idx) => {
    const keaktifan = (idx % 3 === 0) ? 4 : 3;
    const kerjasama = (idx % 2 === 0) ? 4 : 3;
    const tanggungJawab = (idx % 4 === 0) ? 4 : 3;
    const disiplin = (idx % 5 === 0) ? 3 : 4;
    const ketuntasan = (idx % 6 === 0) ? 2 : 3;
    const totalSkor = keaktifan + kerjasama + tanggungJawab + disiplin + ketuntasan;
    const nilaiAkhir = Math.round((totalSkor / 20) * 100);
    return {
      no: idx + 1,
      nama,
      keaktifan,
      kerjasama,
      tanggungJawab,
      disiplin,
      ketuntasan,
      totalSkor,
      nilaiAkhir,
    };
  });

  return {
    id: `rpp-modul-${modulNumber}-${Date.now()}`,
    nomorModul: modulNumber,
    judulMateri: materi,
    elemenTerkait: elemen,
    alokasiWaktuMateri: `${jpNum} JP`,
    identity,
    rppFormat: {
      identitasTabel: {
        mataPelajaran: identity.mataPelajaran,
        kelas: `${identity.kelas}/Fase ${identity.fase}`,
        semesterTahunPelajaran: `${identity.semester.includes('1') ? '1' : '2'}/${identity.tahunPelajaran}`,
        lingkupMateri: materi,
        waktuJp: `${jpNum} X 45 menit`,
      },
      perencanaanMendalam: {
        identifikasi: {
          kesiapanPesertaDidik: {
            minat: defaultInterest,
            caraBelajar: '40% Murid memiliki gaya belajar visual, 40% auditory, dan 20% kinestetik.',
            lingkunganTempatTinggal: 'Pertanian, industri tekstil/manufaktur, perbengkelan, dan buruh di sekitar Bawang, Batang.',
          },
          karakteristikMateri: {
            deskripsiMateri: `Materi yang dipelajari berupa pemahaman mendalam, analisis data, dan aplikasi kontekstual mengenai ${materi}.`,
            poinKarakteristik: [
              `Memberikan pemahaman fundamental tentang konsep dan prinsip kerja ${materi}.`,
              `Mendorong Murid berpikir abstrak, kritis, dan memahami cara menganalisis serta memecahkan problem ${materi}.`,
            ],
            sifatMateri: {
              konseptualDanAplikatif: 'Memberikan pemahaman dasar sambil menunjukkan aplikasinya dalam kehidupan nyata dan dunia kerja industri.',
              kemampuanBerpikirIlmiah: 'Mendorong Murid untuk mengamati, menganalisis, dan menyelesaikan masalah secara metodis.',
            },
          },
          dimensiProfilLulusan: {
            keimananKetakwaan: true,
            kesehatan: false,
            kemandirian: true,
            bernalarKritis: true,
            kolaborasi: true,
            komunikasi: true,
            kreativitas: true,
            kewargaan: false,
          },
        },
        desainPembelajaran: {
          capaianPembelajaran: cp,
          lintasDisiplinIlmu: defaultDisiplin,
          tujuanPembelajaran: [
            `Memahami konsep fundamental, prinsip, dan definisi dari ${materi}.`,
            `Menganalisis dan menentukan relasi, komponen kerja, serta pemecahan masalah ${materi} dalam kehidupan sehari-hari maupun dunia kerja.`,
          ],
          topikKontekstual: [
            `Pengelompokan data, analisis masalah riil, dan aplikasi ${materi} dalam kehidupan sehari-hari serta dunia industri.`,
          ],
          kerangkaPembelajaran: {
            praktikPedagogik: {
              pbl: `Problem-Based Learning (PBL): Murid menyelesaikan masalah kontekstual, misalnya membuat daftar komponen/kasus yang ada di tempat kerja/bengkel dan menghubungkan dengan fungsinya masing-masing.`,
              pjbl: `Project-Based Learning (PjBL): Proyek mini penyusunan laporan analisis dan presentasi karya tim.`,
            },
            kemitraanPembelajaran: {
              mitraIndustri: {
                nama: defaultMitra,
                peran: [
                  'Memberikan data atau informasi tentang nama alat/dokumen beserta fungsinya.',
                  'Menyediakan narasumber/instruktur untuk menjelaskan standar operasional kerja.',
                ],
                terkaitPbl: 'Mendukung Murid dalam studi pengelompokan data, peralatan, atau prosedur kerja beserta fungsinya.',
              },
              orangTuaWali: {
                peran: [
                  'Mendukung kegiatan luar kelas (pengambilan data, observasi lingkungan, wawancara, dan dokumentasi).',
                ],
                terkaitMetode: 'Menjadi penguat dan pendamping pembelajaran dari rumah.',
              },
            },
            lingkunganBelajar: {
              ruangFisik: [
                'Kelas yang Fleksibel dan Kolaboratif',
                'Bengkel / Laboratorium praktik SMK Muhammadiyah Bawang yang memadai dan berstandar 5S/5R',
              ],
              ruangVirtual: [
                'Google Classroom (untuk mengatur proyek, mengunggah tugas, diskusi daring, materi dan forum tanya jawab)',
                'Platform Kolaborasi Digital (Google Docs / Google Slides)',
              ],
              budayaBelajar: [
                'Budaya Inkuiri dan Berpikir Kritis',
                'Budaya Kolaboratif dan Empatik',
                'Budaya Literasi dan Refleksi',
              ],
              penerapanNyataBudaya: {
                ruangFisik: 'Pengamatan alat/data yang ada di bengkel/lab dan dikelompokkan sesuai fungsinya secara cermat.',
                ruangVirtual: 'Murid mengunggah hasil eksperimen/analisis dan berdiskusi di forum online interaktif.',
                budayaBelajar: 'Murid melakukan diskusi mendalam dan debat ilmiah santun berbasis data hasil pengamatan.',
              },
            },
            pemanfaatanDigital: [
              'Google Classroom (mengatur proyek, mengunggah tugas, diskusi daring, penyediaan video dan bahan belajar)',
              'Platform Kolaborasi Digital (Google Docs / Slides / Spreadsheet)',
            ],
          },
        },
      },
      pengalamanBelajar: {
        kegiatanInti: {
          memahamiBermaknaMenggembirakan: {
            instruksiGuru: `Guru meminta murid memperhatikan data dan grafik/bagan ${materi} dengan saksama. Guru memulai dengan pertanyaan pemantik: "Apakah yang ingin dijelaskan oleh data dan fenomena ini?" dan meminta murid berdiskusi dalam kelompok secara aktif.`,
            tabelEksplorasi: {
              judul: `Tabel Hasil Eksplorasi Data & Parameter: ${materi}`,
              kolom: [tableCol1, tableCol2],
              data: sampleRows,
            },
            rangkumanTemuan: [
              'Tabel dan grafik memberikan informasi visual yang akurat mengenai suatu keadaan atau kinerja sistem.',
              'Data menunjukkan pola relasi masukan (input) dan keluaran (output) yang teratur.',
              'Informasi dalam bentuk masukan dan keluaran yang diberikan oleh representasi data menunjukkan suatu relasi yang fungsional.',
            ],
          },
          merefleksiBerkesadaranBermakna: {
            instruksiAplikasi: `Guru membimbing murid mengaplikasikan konsep ${materi} pada permasalahan nyata dan mengulang prosedur teknis dengan berkesadaran, bermakna, dan menggembirakan.`,
            penguatanKonsep: `Setiap kelompok mempresentasikan cara pemecahan masalah dengan percaya diri, saling melengkapi dan mendiskusikan variasi solusi.`,
          },
        },
        kegiatanPenutup: {
          refleksiIndividu321: {
            tigaHalPenting: '3 hal penting yang mereka pelajari hari ini.',
            duaPertanyaan: '2 pertanyaan yang masih mereka miliki untuk didiskusikan lebih lanjut.',
            satuHalMenarik: '1 hal yang paling menarik menurut mereka dari pelajaran hari ini.',
          },
          kesimpulanDanPenguatan:
            'Guru memandu Murid menyusun kesimpulan bersama dan memberikan penguatan konsep secara menyeluruh.',
          tindakLanjut:
            'Guru menyampaikan tindak lanjut dengan memberikan gambaran singkat tentang materi berikutnya, serta memberikan latihan soal ringan atau penugasan aplikatif sebagai penguatan dari rumah.',
        },
      },
      asesmen: {
        ringkasan: {
          asesmenAwal: 'Jenis penilaian: tertulis. Bentuk penilaian: isian singkat / tanya jawab sebanyak 5 butir soal.',
          asesmenProses: 'Terlampir (Observasi Diskusi, Presentasi, dan Unjuk Kerja Keterampilan Proses).',
          asesmenAkhir: 'Terlampir (Penilaian Sikap Spiritual, Sikap Sosial, Pengetahuan Kelompok, Keterampilan, dan Sumatif).',
        },
        asesmenAwalInstrumen: {
          tujuan: 'Mengetahui pengetahuan awal, kesiapan belajar, serta kondisi awal fisik dan mental para peserta didik.',
          daftarPertanyaan: [
            { no: 1, pertanyaan: 'Apa kabar hari ini? Apakah baik-baik saja?' },
            { no: 2, pertanyaan: 'Apakah ada yang sakit hari ini?' },
            { no: 3, pertanyaan: 'Apakah kalian dalam keadaan sehat?' },
            { no: 4, pertanyaan: 'Apakah anak-anak merasa bersemangat hari ini?' },
            { no: 5, pertanyaan: 'Apakah tadi malam sudah belajar materi persiapan?' },
          ],
          tujuanEvaluasi: 'Menilai motivasi dan persepsi awal Murid terhadap pentingnya pembelajaran mendalam ini.',
        },
        asesmenProsesDetail: {
          diskusi: 'Melatih kemampuan peserta didik dalam berkolaborasi dengan kelompoknya, melatih berbicara dan berani mengungkapkan pendapat, memunculkan ide-idenya, serta bekerja sama dalam tim.',
          presentasi: 'Melatih kemampuan peserta didik dalam berbicara di depan umum, berani mengajukan pertanyaan terhadap pemaparan hasil kerja kelompok lain, dan memaksimalkan kerja tim.',
          unjukKerja: 'Menilai keterampilan proses yang dimiliki setiap anak dan memantau perkembangannya secara berkelanjutan.',
        },
        asesmenSumatifDetail: {
          pengantar:
            'Dilaksanakan di akhir pembelajaran untuk mengukur tingkat capaian pemahaman peserta didik guna menentukan langkah selanjutnya. Asesmen ini mencakup instrumen individu, kelompok, performa, dan tertulis.',
          sikapSpiritual: {
            teknik: 'Penilaian diri',
            instrumen: 'Rubrik Cheklist',
            indikator: [
              'Berdoa sebelum dan sesudah kegiatan belajar',
              'Menghargai sesama teman sebagai ciptaan Tuhan YME',
              'Menjaga kejujuran dalam mencatat data pengamatan',
              'Menunjukkan rasa syukur atas ilmu dan keselamatan kerja',
              'Bersikap amanah terhadap peralatan dan tugas yang diberikan',
            ],
          },
          sikapSosial: {
            teknik: 'Penilaian Antar Teman',
            instrumen: 'Rubrik Cheklist',
            indikator: [
              'Menghargai pendapat teman dalam diskusi kelompok',
              'Tidak memaksakan kehendak pribadi kepada orang lain',
              'Membantu rekan satu tim yang mengalami kesulitan',
              'Bersikap sopan dan santun saat berkomunikasi',
              'Menjaga ketertiban dan kebersihan area belajar bersama',
            ],
          },
          pengetahuanKelompok: {
            aspek: ['Ketertiban', 'Kekompakan', 'Performance'],
            pedomanSkor: [
              { skor: 4, predikat: 'Sangat baik', kriteria: 'Sangat tertib, kompak, dan presentasi meyakinkan' },
              { skor: 3, predikat: 'Baik', kriteria: 'Tertib, kompak, dan presentasi lancar' },
              { skor: 2, predikat: 'Cukup', kriteria: 'Cukup tertib, sesekali kurang fokus' },
              { skor: 1, predikat: 'Kurang', kriteria: 'Kurang tertib dan pasif dalam tim' },
            ],
            rumus: 'Nilai Akhir = (Jumlah skor yang diperoleh / 12) x 100',
          },
          penilaianKeterampilan: {
            aspek: ['Pengamatan Cermat', 'Pengoperasian Alat / Prosedur', 'Ketepatan Hasil'],
            pedomanSkor: [
              { skor: 4, predikat: 'Sangat baik', kriteria: 'Terampil mandiri, presisi tinggi, dan sesuai SOP' },
              { skor: 3, predikat: 'Baik', kriteria: 'Terampil dengan sedikit arahan guru' },
              { skor: 2, predikat: 'Cukup', kriteria: 'Memerlukan bantuan pada beberapa tahapan' },
              { skor: 1, predikat: 'Kurang', kriteria: 'Belum mampu melakukan langkah tanpa bantuan penuh' },
            ],
            rumus: 'Nilai Akhir = (Jumlah skor yang diperoleh / 12) x 100',
          },
          hasilKerjaKelompok: {
            aspek: ['Ketepatan Jawaban', 'Estetika (Nilai Seni) Paparan'],
            pedomanSkor: [
              { skor: 8, predikat: 'Sangat baik', kriteria: 'Semua jawaban benar/tepat dan paparan sangat menarik' },
              { skor: 6, predikat: 'Baik', kriteria: 'Sebagian besar jawaban benar dan paparan menarik' },
              { skor: 4, predikat: 'Cukup', kriteria: 'Separuh jawaban benar dan paparan cukup jelas' },
              { skor: 2, predikat: 'Kurang', kriteria: 'Sebagian kecil jawaban benar dan paparan kurang menarik' },
            ],
            rumus: 'Nilai Akhir = (Jumlah skor yang diperoleh / 16) x 100',
          },
          rubrikPenilaianSikapObservasi: [
            {
              kriteria: 'Sopan santun',
              sangatBaik: 'Peserta didik berlaku sopan, baik selama proses pembelajaran maupun di luar kelas.',
              baik: 'Peserta didik berlaku sopan hanya selama proses pembelajaran di kelas.',
              cukup: 'Peserta didik berlaku sopan hanya kepada Guru atau peserta didik tertentu.',
              perluDikembangkan: 'Peserta didik belum menampakkan perilaku sopan dalam interaksi.',
            },
            {
              kriteria: 'Percaya diri',
              sangatBaik: 'Peserta didik berani berpendapat, bertanya, menjawab pertanyaan, serta mengambil keputusan.',
              baik: 'Peserta didik berani berpendapat, bertanya, atau menjawab pertanyaan bila diminta.',
              cukup: 'Peserta didik hanya berani menjawab saat Guru bertanya langsung.',
              perluDikembangkan: 'Peserta didik kesulitan dalam berpendapat, bertanya, maupun menjawab pertanyaan.',
            },
            {
              kriteria: 'Toleransi',
              sangatBaik: 'Peserta didik dapat menghargai pendapat peserta didik lain dan menerima kesepakatan meskipun berbeda dengan pendapatnya.',
              baik: 'Peserta didik dapat menghargai pendapat peserta didik lain dan bersedia menerima kesepakatan kelompok.',
              cukup: 'Peserta didik dapat menghargai pendapat peserta didik lain namun kurang bisa menerima kesepakatan.',
              perluDikembangkan: 'Peserta didik tidak dapat menghargai pendapat orang lain dan menolak hasil kesepakatan bersama.',
            },
          ],
        },
      },
      pengayaanDanRemedial: {
        pengayaan:
          'Bagi siswa dengan kecepatan belajar tinggi (advanced), minta mereka membuat studi kasus atau pertanyaan-pertanyaan tambahan tingkat tinggi untuk dijawab mandiri maupun bersama rekan sebaya. Mereka ditantang menyelesaikan analisis optimasi kompleks dengan media digital/simulator dan sekalian mendokumentasikannya dalam portofolio digital.',
        remedial:
          'Bagi siswa yang mengalami kesulitan memahami konsep dasar materi, berikan analogi konkret dan bimbingan visual bertahap. Pastikan mereka memahami definisi dan prinsip kerja fundamental sebelum melangkah ke tahap latihan lanjutan. Buatlah latihan terbimbing dengan langkah kerja yang telah disederhanakan.',
      },
      refleksiGuruDanPesertaDidik: {
        refleksiGuru: [
          { no: 1, aspek: 'Penguasaan Materi', refleksi: 'Apakah saya sudah memahami cukup baik materi dan aktivitas pembelajaran ini?' },
          { no: 2, aspek: 'Penyampaian Materi', refleksi: 'Apakah materi ini sudah tersampaikan dengan cukup baik, bermakna, dan menyenangkan kepada seluruh peserta didik?' },
          { no: 3, aspek: 'Umpan Balik', refleksi: 'Apakah peserta didik telah mencapai penguasaan tujuan pembelajaran yang ingin dicapai?' },
        ],
        refleksiPesertaDidik: {
          pertanyaanJurnal: [
            `Apakah saya sudah dapat memahami konsep inti ${materi} dalam berbagai bentuk representasi?`,
            `Apakah saya dapat menerapkan dan menganalisis ${materi} dalam pemecahan masalah nyata di lingkungan saya?`,
          ],
          angketEmoticon: [
            { no: 1, kompetensi: 'Bapak/Ibu guru mengajar kami dengan berbagai cara pembelajaran yang menyenangkan dan penuh perhatian.' },
            { no: 2, kompetensi: 'Bapak/Ibu guru menggunakan media dan peralatan belajar yang bermacam-macam dan interaktif.' },
            { no: 3, kompetensi: 'Bapak/Ibu guru menanyakan bagaimana kami memahami pelajaran dan mendengar pendapat kami.' },
            { no: 4, kompetensi: 'Bapak/Ibu guru memberi kami kesempatan bertanya tentang pembelajaran dan hal-hal lainnya.' },
            { no: 5, kompetensi: 'Bapak/Ibu guru mengubah cara mengajar atau media saat mengajari kembali materi yang belum kami pahami.' },
            { no: 6, kompetensi: 'Bapak/Ibu guru tampil ceria, berwibawa, rapi, memotivasi, tenang, adil, objektif, dan penuh kasih sayang.' },
            { no: 7, kompetensi: 'Bapak/Ibu guru mengajak diskusi, tanya jawab, dan permainan seru dalam pembelajaran.' },
            { no: 8, kompetensi: 'Bapak/Ibu guru membaca referensi dan memiliki sumber belajar yang bervariasi.' },
            { no: 9, kompetensi: 'Bapak/Ibu guru membimbing, menasihati, dan memberi teladan karakter Profil Pelajar Pancasila.' },
            { no: 10, kompetensi: 'Bapak/Ibu guru memberikan motivasi, apresiasi, dan semangat dalam setiap kegiatan belajar.' },
          ],
        },
        hasilTindakLanjut: [
          'Dengan menggunakan digitalisasi dan visualisasi dalam proses pembelajaran, siswa semakin bersemangat dan termotivasi.',
          'Menggunakan model pembelajaran PBL / PjBL membuat siswa bertambah pemahamannya di mana siswa saling berkolaborasi dan memberikan masukan suportif.',
          'Siswa aktif dalam diskusi kelompok dan berani mengemukakan pendapat secara mandiri tanpa rasa takut salah.',
          'Penggunaan media interaktif digital dan pendekatan Deep Learning akan terus dioptimalkan dalam proses pembelajaran berikutnya.',
        ],
      },
      lampiran: {
        lkpd: {
          nomor: `LKPD-DEEP-${modulNumber}`,
          judul: `LEMBAR KERJA PESERTA DIDIK (LKPD) - ${materi.toUpperCase()}`,
          rangkumanHasilDiskusi: 'Tuliskan rangkuman pokok bahasan dan kesimpulan hasil diskusi kelompok kalian di sini...',
          pertanyaanDiskusi: [
            { no: 1, pertanyaan: `Jelaskan pengertian fundamental dan fungsi utama dari ${materi}!` },
            { no: 2, pertanyaan: 'Bagaimana cara membedakan kondisi normal dan anomali/penyimpangan pada data pengamatan?' },
            { no: 3, pertanyaan: 'Sebutkan contoh penerapan nyata topik ini di lingkungan industri maupun kehidupan sehari-hari!' },
            { no: 4, pertanyaan: 'Bagaimana peran kolaborasi tim dalam memastikan pekerjaan selesai tepat waktu dan presisi?' },
            { no: 5, pertanyaan: 'Apa langkah keselamatan kerja (K3LH) yang paling krusial saat menangani peralatan terkait?' },
          ],
          soalAnalisisKontekstual: [
            `Analisis Hubungan Kasus Nyata: Jika suatu sistem ${materi} mengalami peningkatan beban operasional sebesar 30%, bagaimana dampak langsung terhadap keandalan keluaran? Jelaskan solusinya!`,
            'Berikan satu contoh situasi nyata di dunia industri Kabupaten Batang yang secara langsung mengadopsi prinsip ini!',
            'Buatlah diagram alir alur proses kerja sistematis untuk mengatasi gangguan pada sistem tersebut!',
            'Berdasarkan data tabel hasil pengamatan di atas, rumuskan kesimpulan matematis atau teknis yang dapat dipertanggungjawabkan!',
          ],
        },
        bahanBacaan: {
          judul: `BAHAN BACAAN GURU DAN PESERTA DIDIK: ${materi.toUpperCase()}`,
          pengantarFungsi: `${materi} merupakan komponen esensial dalam penguasaan kompetensi kejuruan Kurikulum Merdeka. Memahami konsep ini dapat dianalogikan seperti suatu mesin terpadu yang memproses variabel masukan (input) secara terstruktur menjadi variabel keluaran (output) yang terukur dan fungsional.`,
          analogiIlustrasi: 'Analogi Mesin Fungsional: Masukan (Input x) ---> [ PROSES SISTEM ] ---> Keluaran (Output y). Setiap elemen masukan tepat memiliki satu relasi keluaran yang terdefinisi.',
          pembahasan1: {
            judul: `1. Pemahaman Konseptual & Prinsip Inti ${materi}`,
            uraian: `Pada bagian ini, peserta didik belajar mengidentifikasi unsur-unsur pembentuk, mengenali karakteristik relasi normal vs anomali, serta mengklasifikasikan komponen sesuai fungsinya menggunakan diagram, tabel, dan representasi nyata.`,
          },
          pembahasan2: {
            judul: `2. Pengukuran, Pembacaan Data, dan Troubleshooting Praktis`,
            uraian: `Setiap data yang dicatat selama pengamatan lapangan memberikan gambaran akurat mengenai dinamika performa sistem. Analisis tren data memungkinkan teknisi memprediksi kebutuhan pemeliharaan sebelum terjadi kerusakan total (preventive maintenance).`,
          },
          pertanyaanUji: [
            'Buatlah tabel rekapitulasi data dari pengamatan objek kerja kalian!',
            'Nyatakan himpunan masukan (input) yang kalian catat dalam notasi terstruktur!',
            'Nyatakan hasil keluaran (output) yang dihasilkan dan evaluasi kesesuaiannya dengan standar SOP!',
          ],
        },
        rubrikObservasiKelompok: [
          {
            no: 1,
            aspek: 'Keaktifan',
            kriteria: [
              'Terlihat, dengan dorongan guru (Skor 1)',
              'Terlihat, bila bersama temannya (Skor 2)',
              'Terlihat, berani sendiri tapi kurang tepat (Skor 3)',
              'Terlihat, berani sendiri dan tepat (Skor 4)',
            ],
          },
          {
            no: 2,
            aspek: 'Kerjasama',
            kriteria: [
              'Mau menang sendiri (Skor 1)',
              'Mau bekerjasama tapi pasif (Skor 2)',
              'Mau bekerjasama tapi mengatur orang lain (Skor 3)',
              'Mau bekerjasama dan menghargai pendapat temannya (Skor 4)',
            ],
          },
          {
            no: 3,
            aspek: 'Tanggung Jawab',
            kriteria: [
              'Tidak serius (Skor 1)',
              'Serius, tapi tidak memahami tugas (Skor 2)',
              'Serius, memahami tugas tapi kadang-kadang (Skor 3)',
              'Serius, memahami dan konsekuen terhadap tugas (Skor 4)',
            ],
          },
          {
            no: 4,
            aspek: 'Kedisiplinan',
            kriteria: [
              'Tidak disiplin (Skor 1)',
              'Disiplin setelah ditegur (Skor 2)',
              'Disiplin tetapi kadang melanggar aturan (Skor 3)',
              'Sangat disiplin terhadap peraturan yang ada (Skor 4)',
            ],
          },
          {
            no: 5,
            aspek: 'Ketuntasan',
            kriteria: [
              'Tidak tuntas (Skor 1)',
              'Tuntas tetapi tidak paham (Skor 2)',
              'Tuntas tetapi ada bagian yang kurang paham (Skor 3)',
              'Tuntas dan memahami terhadap pelajaran yang diberikan (Skor 4)',
            ],
          },
        ],
        rekapNilaiSiswaContoh,
      },
    },
  };
}
