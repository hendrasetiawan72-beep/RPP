export interface ExcelRawRow {
  no?: number | string;
  elemen: string;
  capaianPembelajaran: string;
  materi: string;
  jp?: number | string;
  fase?: string;
  kelas?: string;
  semester?: string;
  lintasDisiplin?: string;
}

/**
 * Format Excel RPP Terintegrasi dengan seluruh kolom yang disesuaikan
 * agar terhubung langsung dengan CP, ATP, materi, metode, sintaks dan asesmen
 */
export interface ExcelRppRawRow {
  no?: number | string;
  elemen: string;
  capaianPembelajaran: string;
  tujuanPembelajaran: string; // ATP / TP
  alurPembelajaran?: string; // Urutan logis / tahapan alur ATP
  materi: string; // Lingkup materi pokok
  jp?: number | string; // Alokasi waktu (JP)
  fase?: string;
  kelas?: string;
  semester?: string;
  lintasDisiplin?: string;
  kesiapanPesertaDidik?: string; // Minat, cara belajar, latar belakang
  karakteristikMateri?: string; // Deskripsi & sifat materi (konseptual & aplikatif)
  profilLulusan?: string; // Dimensi profil pelajar pancasila / profil lulusan
  metodePembelajaran?: string; // Model/metode (PBL, PjBL, Inquiry, dll.)
  kemitraan?: string; // Mitra industri & Orang Tua
  lingkunganDigital?: string; // Ruang fisik, virtual, digital tools
  sintaksPendahuluan?: string; // Kegiatan Awal (Mindful Learning)
  sintaksInti1?: string; // Kegiatan Inti 1 (Memahami & Eksplorasi - Meaningful)
  sintaksInti2?: string; // Kegiatan Inti 2 (Aplikasi & Refleksi - Joyful)
  sintaksPenutup?: string; // Kegiatan Penutup (Refleksi 3-2-1 & Kaizen)
  asesmenAwal?: string; // Asesmen Awal / Diagnostik
  asesmenProses?: string; // Asesmen Proses / Formatif (Diskusi, Presentasi, Unjuk Kerja)
  asesmenAkhir?: string; // Asesmen Akhir / Sumatif (LKPD, Proyek, Uji Teori/Praktik)
  pengayaanRemedial?: string; // Program pengayaan dan bimbingan remedial
}

export interface ParsedExcelResult {
  fileType: 'cp' | 'rpp';
  cpRows: ExcelRawRow[];
  rppRows?: ExcelRppRawRow[];
  detectedSubject?: string;
  detectedClass?: string;
  detectedPhase?: string;
  detectedCategory?: 'kejuruan' | 'umum';
}

export interface SchoolIdentity {
  schoolName: string;
  kabupaten: string;
  provinsi: string;
  majelisLine1: string;
  majelisLine2: string;
  statusAkreditasi: string;
  alamatLengkap: string;
  email: string;
  website: string;
  kodePos: string;
  telepon: string;
  fax: string;
  kategoriMapel?: 'kejuruan' | 'umum'; // Kejuruan (Produktif) vs Normatif-Adaptif (Umum)
  programKeahlian: string;
  konsentrasiKeahlian: string;
  mataPelajaran: string;
  fase: string; // 'E' | 'F'
  kelas: string; // 'X' | 'XI' | 'XII'
  semester: string; // '1 (Ganjil)' | '2 (Genap)'
  tahunPelajaran: string;
  alokasiWaktuTotal: string;
  namaGuru: string;
  nipGuru: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  tanggalPenyusunan: string;
}

export interface AlurTujuanPembelajaranItem {
  id: string;
  kodeTp: string;
  elemen: string;
  capaianPembelajaran: string;
  lingkupMateri: string;
  kompetensi: string[];
  tujuanPembelajaran: string; // [Kompetensi + Konten + Keterampilan Berpikir]
  alurTujuanPembelajaran: string; // Urutan logis pembelajaran dalam fase
  profilPelajarPancasila: string[];
  alokasiWaktuJp: number;
  asesmenRencana: {
    diagnostik: string;
    formatif: string;
    sumatif: string;
  };
}

export interface DeepLearningPillars {
  mindfulLearning: {
    definisi: string;
    aktivitas: string[];
    pemicuNalarKritis: string[];
  };
  meaningfulLearning: {
    definisi: string;
    aktivitas?: string[];
    koneksiIndustri: string[];
    aplikasiDuniaNyata: string[];
  };
  joyfulLearning: {
    definisi: string;
    aktivitas?: string[];
    metodeInteraktif: string[];
    eksplorasiMenyenangkan: string[];
  };
}

export interface PertemuanPembelajaran {
  pertemuanKe: number;
  alokasiWaktu: string;
  topikFokus: string;
  pendahuluan: {
    durasi: string;
    kegiatan: string[];
    mindfulActivity: string;
  };
  kegiatanInti: {
    durasi: string;
    sintaksModel: string;
    kegiatan: string[];
    meaningfulActivity: string;
    joyfulActivity: string;
  };
  penutup: {
    durasi: string;
    kegiatan: string[];
    refleksiKaizen: string;
    refleksi321: {
      tigaHalDikuasai: string;
      duaHalDitingkatkan: string;
      satuStrategiPerbaikan: string;
    };
  };
}

export interface AsesmenFormatifRubrik {
  indikator: string;
  skor1: string; // Perlu Bimbingan (0-60)
  skor2: string; // Cukup (61-75)
  skor3: string; // Baik (76-88)
  skor4: string; // Sangat Baik (89-100)
}

/**
 * Format RPP Pendekatan Deep Learning lengkap sesuai dokumen PDF resmi
 */
export interface ModulAjarData {
  id: string;
  nomorModul: number;
  judulMateri: string;
  elemenTerkait: string;
  alokasiWaktuMateri: string;
  identity: SchoolIdentity;
  // Format RPP Deep Learning
  rppFormat: {
    // A. Identitas
    identitasTabel: {
      mataPelajaran: string;
      kelas: string;
      semesterTahunPelajaran: string;
      lingkupMateri: string;
      waktuJp: string;
    };
    // B. Perencanaan Pembelajaran Mendalam
    perencanaanMendalam: {
      // 1. Identifikasi
      identifikasi: {
        kesiapanPesertaDidik: {
          minat: string;
          caraBelajar: string;
          lingkunganTempatTinggal: string;
        };
        karakteristikMateri: {
          deskripsiMateri: string;
          poinKarakteristik: string[];
          sifatMateri: {
            konseptualDanAplikatif: string;
            kemampuanBerpikirIlmiah: string;
          };
        };
        dimensiProfilLulusan: {
          keimananKetakwaan: boolean;
          kesehatan: boolean;
          kemandirian: boolean;
          bernalarKritis: boolean;
          kolaborasi: boolean;
          komunikasi: boolean;
          kreativitas: boolean;
          kewargaan: boolean;
        };
      };
      // 2. Desain Pembelajaran
      desainPembelajaran: {
        capaianPembelajaran: string;
        lintasDisiplinIlmu: string;
        tujuanPembelajaran: string[];
        topikKontekstual: string[];
        kerangkaPembelajaran: {
          praktikPedagogik: {
            pbl: string;
            pjbl: string;
          };
          kemitraanPembelajaran: {
            mitraIndustri: { nama: string; peran: string[]; terkaitPbl: string };
            orangTuaWali: { peran: string[]; terkaitMetode: string };
          };
          lingkunganBelajar: {
            ruangFisik: string[];
            ruangVirtual: string[];
            budayaBelajar: string[];
            penerapanNyataBudaya: {
              ruangFisik: string;
              ruangVirtual: string;
              budayaBelajar: string;
            };
          };
          pemanfaatanDigital: string[];
        };
      };
    };
    // 3. Pengalaman Belajar (Langkah Pembelajaran)
    pengalamanBelajar: {
      kegiatanInti: {
        memahamiBermaknaMenggembirakan: {
          instruksiGuru: string;
          tabelEksplorasi?: {
            judul: string;
            kolom: [string, string];
            data: [string, string][];
          };
          rangkumanTemuan: string[];
        };
        merefleksiBerkesadaranBermakna: {
          instruksiAplikasi: string;
          penguatanKonsep: string;
        };
      };
      kegiatanPenutup: {
        refleksiIndividu321: {
          tigaHalPenting: string;
          duaPertanyaan: string;
          satuHalMenarik: string;
        };
        kesimpulanDanPenguatan: string;
        tindakLanjut: string;
      };
    };
    // 4. Asesmen
    asesmen: {
      ringkasan: {
        asesmenAwal: string;
        asesmenProses: string;
        asesmenAkhir: string;
      };
      asesmenAwalInstrumen: {
        tujuan: string;
        daftarPertanyaan: { no: number; pertanyaan: string }[];
        tujuanEvaluasi: string;
      };
      asesmenProsesDetail: {
        diskusi: string;
        presentasi: string;
        unjukKerja: string;
      };
      asesmenSumatifDetail: {
        pengantar: string;
        sikapSpiritual: { teknik: string; instrumen: string; indikator: string[] };
        sikapSosial: { teknik: string; instrumen: string; indikator: string[] };
        pengetahuanKelompok: {
          aspek: string[];
          pedomanSkor: { skor: number; predikat: string; kriteria: string }[];
          rumus: string;
        };
        penilaianKeterampilan: {
          aspek: string[];
          pedomanSkor: { skor: number; predikat: string; kriteria: string }[];
          rumus: string;
        };
        hasilKerjaKelompok: {
          aspek: string[];
          pedomanSkor: { skor: number; predikat: string; kriteria: string }[];
          rumus: string;
        };
        rubrikPenilaianSikapObservasi: {
          kriteria: string;
          sangatBaik: string; // 4
          baik: string; // 3
          cukup: string; // 2
          perluDikembangkan: string; // 1
        }[];
      };
    };
    // F. Pengayaan dan Remedial
    pengayaanDanRemedial: {
      pengayaan: string;
      remedial: string;
    };
    // G. Refleksi Guru dan Peserta Didik
    refleksiGuruDanPesertaDidik: {
      refleksiGuru: { no: number; aspek: string; refleksi: string }[];
      refleksiPesertaDidik: {
        pertanyaanJurnal: string[];
        angketEmoticon: { no: number; kompetensi: string }[];
      };
      hasilTindakLanjut: string[];
    };
    // Lampiran-Lampiran
    lampiran: {
      lkpd: {
        nomor: string;
        judul: string;
        tautan?: string;
        embedCode?: string;
        rangkumanHasilDiskusi?: string;
        pertanyaanDiskusi?: { no: number; pertanyaan: string }[];
        soalAnalisisKontekstual?: string[];
      };
      bahanBacaan: {
        judul: string;
        tautan?: string;
        embedCode?: string;
        pengantarFungsi?: string;
        analogiIlustrasi?: string;
        pembahasan1?: { judul: string; uraian: string };
        pembahasan2?: { judul: string; uraian: string };
        pertanyaanUji?: string[];
      };
      rubrikObservasiKelompok: {
        no: number;
        aspek: string;
        kriteria: string[];
        embedCode?: string;
      }[];
      embedCodeRubrik?: string;
      rekapNilaiSiswaContoh: {
        no: number;
        nama: string;
        keaktifan: number;
        kerjasama: number;
        tanggungJawab: number;
        disiplin: number;
        ketuntasan: number;
        totalSkor: number;
        nilaiAkhir: number;
      }[];
    };
  };
  // Fallbacks for older compatibility
  informasiUmum?: any;
  komponenInti?: any;
  lampiran?: any;
}

export interface GeneratedPerangkatAjar {
  identity: SchoolIdentity;
  atpList: AlurTujuanPembelajaranItem[];
  modulAjarList: ModulAjarData[];
  createdAt: string;
}
