export interface SyntaxStep {
  no: number;
  namaLangkah: string;
  alurMendalam: 'memahami' | 'mengaplikasi' | 'merefleksi';
  deskripsi: string;
}

export interface SyntaxOption {
  id: string;
  model: 'PjBL' | 'PBL';
  namaOpsi: string;
  label: string;
  ringkasan: string;
  langkah: SyntaxStep[];
  catatanPenerapan: {
    pedagogis: string;
    kemitraan: string;
    lingkunganDanDigital: string;
    asesmen: string;
  };
}

export const DEEP_LEARNING_SYNTAX_OPTIONS: SyntaxOption[] = [
  // A. Project Based Learning (PjBL) - Opsi 1 (6 Langkah)
  {
    id: 'pjbl_opsi_1',
    model: 'PjBL',
    namaOpsi: 'PjBL Opsi 1 (6 Langkah, Klasik yang Diperkaya)',
    label: 'PjBL 6 Langkah (Memahami → Mengaplikasi → Merefleksi)',
    ringkasan: 'Alur lengkap 6 langkah kontekstual berbasis proyek industri nyata dengan pendampingan intensif.',
    langkah: [
      {
        no: 1,
        namaLangkah: 'Pertanyaan Pemantik',
        alurMendalam: 'memahami',
        deskripsi: 'Masalah atau tantangan kontekstual yang membangkitkan rasa ingin tahu dan nalar kritis peserta didik.',
      },
      {
        no: 2,
        namaLangkah: 'Eksplorasi Konsep dan Konteks',
        alurMendalam: 'memahami',
        deskripsi: 'Peserta didik menggali materi fundamental, standar SOP, dan kebutuhan mitra industri/lingkungan.',
      },
      {
        no: 3,
        namaLangkah: 'Perencanaan Proyek',
        alurMendalam: 'mengaplikasi',
        deskripsi: 'Rancangan desain proyek, pembagian peran kerja kelompok, dan jadwal pelaksanaan disusun bersama.',
      },
      {
        no: 4,
        namaLangkah: 'Pelaksanaan dan Monitoring',
        alurMendalam: 'mengaplikasi',
        deskripsi: 'Proyek dikerjakan secara kolaboratif, guru memantau keaktifan dan memberi umpan balik formatif.',
      },
      {
        no: 5,
        namaLangkah: 'Presentasi dan Publikasi Produk',
        alurMendalam: 'mengaplikasi',
        deskripsi: 'Pameran karya, unjuk kerja demonstrasi, publikasi video, atau presentasi kolaborasi dengan mitra industri dan masyarakat.',
      },
      {
        no: 6,
        namaLangkah: 'Refleksi dan Tindak Lanjut',
        alurMendalam: 'merefleksi',
        deskripsi: 'Evaluasi proses pengerjaan, telaah capaian kompetensi, refleksi diri (3-2-1), dan perbaikan berkelanjutan.',
      },
    ],
    catatanPenerapan: {
      pedagogis: 'Gunakan pertanyaan terbuka, fasilitasi diskusi nalar kritis, dan dorong kolaborasi aktif antar peserta didik.',
      kemitraan: 'Libatkan orang tua, komunitas, atau dunia usaha/DUDI rekanan SMK Muhammadiyah Bawang sebagai penguji dan narasumber.',
      lingkunganDanDigital: 'Manfaatkan ruang belajar fleksibel (bengkel/lab standar 5S) dan teknologi digital sebagai alat eksplorasi serta publikasi.',
      asesmen: 'Nilai proses (formatif unjuk kerja), produk proyek, dan refleksi mandiri terkait dimensi Profil Lulusan (penalaran kritis, kolaborasi, kreativitas, dan komunikasi).',
    },
  },

  // A. Project Based Learning (PjBL) - Opsi 2 (3 Fase Ringkas)
  {
    id: 'pjbl_opsi_2',
    model: 'PjBL',
    namaOpsi: 'PjBL Opsi 2 (3 Fase, Ringkas)',
    label: 'PjBL 3 Fase Ringkas (Memahami → Mengaplikasi → Merefleksi)',
    ringkasan: 'Alur terpadu 3 fase yang fleksibel untuk proyek modular atau berdurasi sedang.',
    langkah: [
      {
        no: 1,
        namaLangkah: 'Fase Memahami',
        alurMendalam: 'memahami',
        deskripsi: 'Pertanyaan pemantik kontekstual, eksplorasi konsep dasar materi, dan penentuan lingkup proyek kerja.',
      },
      {
        no: 2,
        namaLangkah: 'Fase Mengaplikasi',
        alurMendalam: 'mengaplikasi',
        deskripsi: 'Perencanaan teknis, pembagian tugas kelompok, pembuatan/eksekusi karya, pengujian fungsional, dan penyajian produk.',
      },
      {
        no: 3,
        namaLangkah: 'Fase Merefleksi',
        alurMendalam: 'merefleksi',
        deskripsi: 'Umpan balik konstruktif dari rekan sebaya, mitra industri DUDI, guru, dan evaluasi refleksi diri sendiri (3-2-1).',
      },
    ],
    catatanPenerapan: {
      pedagogis: 'Fokus pada bimbingan terarah dan pembelajaran berkesadaran yang menumbuhkan kemandirian murid.',
      kemitraan: 'Konsultasikan kriteria hasil produk dengan kebutuhan standar dunia kerja industri Batang.',
      lingkunganDanDigital: 'Gunakan platform kolaborasi digital (Google Classroom / Drive / Spreadsheet) untuk koordinasi fase.',
      asesmen: 'Penilaian portofolio proses dan hasil akhir dengan rubrik ketercapaian tujuan pembelajaran (KKTP).',
    },
  },

  // B. Problem Based Learning (PBL) - Opsi 1 (5 Langkah)
  {
    id: 'pbl_opsi_1',
    model: 'PBL',
    namaOpsi: 'PBL Opsi 1 (5 Langkah Terstruktur)',
    label: 'PBL 5 Langkah (Memahami → Mengaplikasi → Merefleksi)',
    ringkasan: 'Alur ilmiah terstruktur untuk memecahkan problem atau kerusakan teknis otentik.',
    langkah: [
      {
        no: 1,
        namaLangkah: 'Orientasi pada Masalah Nyata',
        alurMendalam: 'memahami',
        deskripsi: 'Masalah kontekstual yang bermakna dan sering terjadi di lapangan/dunia kerja disajikan ke murid.',
      },
      {
        no: 2,
        namaLangkah: 'Organisasi Belajar',
        alurMendalam: 'memahami',
        deskripsi: 'Peserta didik mengidentifikasi apa yang diketahui, apa yang perlu dipelajari, serta membagi peran penyelidikan.',
      },
      {
        no: 3,
        namaLangkah: 'Penyelidikan Mandiri & Kelompok',
        alurMendalam: 'mengaplikasi',
        deskripsi: 'Mengumpulkan data, mengukur parameter, dan menganalisis informasi dari berbagai sumber manual/digital.',
      },
      {
        no: 4,
        namaLangkah: 'Pengembangan & Penyajian Solusi',
        alurMendalam: 'mengaplikasi',
        deskripsi: 'Merumuskan solusi pemecahan masalah terbaik, menyusun laporan analisis, dan mempresentasikannya di depan kelas.',
      },
      {
        no: 5,
        namaLangkah: 'Analisis, Evaluasi & Refleksi',
        alurMendalam: 'merefleksi',
        deskripsi: 'Meninjau proses berpikir, mengevaluasi efektivitas solusi, dan transfer pemahaman ke konteks masalah lain.',
      },
    ],
    catatanPenerapan: {
      pedagogis: 'Ajukan pertanyaan pelacak mengapa dan bagaimana untuk memicu daya analisis ilmiah peserta didik.',
      kemitraan: 'Gunakan data kasus riil dari bengkel rekanan atau unit produksi SMK Muhammadiyah Bawang.',
      lingkunganDanDigital: 'Eksplorasi manual book digital, video tutorial industri, dan simulator troubleshooting.',
      asesmen: 'Observasi penalaran kritis saat diskusi kelompok dan rubrik presentasi solusi.',
    },
  },

  // B. Problem Based Learning (PBL) - Opsi 2 (4 Langkah, Cocok 1-2 Pertemuan)
  {
    id: 'pbl_opsi_2',
    model: 'PBL',
    namaOpsi: 'PBL Opsi 2 (4 Langkah, Cocok untuk 1–2 Pertemuan)',
    label: 'PBL 4 Langkah Cepat (1–2 Pertemuan)',
    ringkasan: 'Alur ringkas dan padat untuk pembelajaran berbasis pemecahan masalah dengan alokasi waktu singkat.',
    langkah: [
      {
        no: 1,
        namaLangkah: 'Sajian Masalah dan Pemantik',
        alurMendalam: 'memahami',
        deskripsi: 'Pemaparan studi kasus riil yang memancing rasa penasaran dan pertanyaan pemantik nalar kritis.',
      },
      {
        no: 2,
        namaLangkah: 'Investigasi Kolaboratif',
        alurMendalam: 'memahami',
        deskripsi: 'Diskusi kelompok mengumpulkan bukti data, menganalisis hubungan sebab-akibat, dan menguji dugaan.',
      },
      {
        no: 3,
        namaLangkah: 'Solusi dan Komunikasi',
        alurMendalam: 'mengaplikasi',
        deskripsi: 'Penyusunan simpulan pemecahan masalah dan pengomunikasian hasil kerja secara percaya diri.',
      },
      {
        no: 4,
        namaLangkah: 'Refleksi Bermakna',
        alurMendalam: 'merefleksi',
        deskripsi: 'Refleksi pengalaman belajar, penguatan konsep oleh guru, dan penarikan benang merah pembelajaran mendalam.',
      },
    ],
    catatanPenerapan: {
      pedagogis: 'Manajemen waktu yang ketat dan efisien, pastikan setiap kelompok aktif berkontribusi.',
      kemitraan: 'Studi kasus dikaitkan langsung dengan etika kerja dan kepuasan pelanggan industri.',
      lingkunganDanDigital: 'Penggunaan LKPD digital ringkas atau lembar kerja interaktif.',
      asesmen: 'Penilaian formatif cepat berbasis kuis diagnostik dan checklist ketercapaian solusi.',
    },
  },
];
