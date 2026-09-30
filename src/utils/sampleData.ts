import { ExcelRawRow, ExcelRppRawRow, SchoolIdentity } from '../types';

export interface MajorSample {
  id: string;
  name: string;
  kategoriMapel: 'kejuruan' | 'umum';
  programKeahlian: string;
  konsentrasiKeahlian: string;
  mataPelajaran: string;
  fase: string;
  kelas: string;
  semester: string;
  rows: ExcelRawRow[];
  rppRows?: ExcelRppRawRow[];
}

export const DEFAULT_SCHOOL_IDENTITY: SchoolIdentity = {
  schoolName: 'SMK Muhammadiyah Bawang',
  kabupaten: 'Batang',
  provinsi: 'Jawa Tengah',
  majelisLine1: 'MAJLIS PENDIDIKAN DASAR DAN MENENGAH',
  majelisLine2: 'DAERAH MUHAMMADIYAH BATANG',
  statusAkreditasi: 'TERAKREDITASI “A”',
  alamatLengkap: 'Jl. Bawang-Sukorejo Km 01 Ds. Jlamprang Kec. Bawang Kab. Batang.',
  email: 'smkmuhbawang@gmail.com',
  website: 'www.smkmuhiba.sch.id',
  kodePos: '51274',
  telepon: '(0285) 4486909',
  fax: '(0285) 4486899',
  kategoriMapel: 'kejuruan',
  programKeahlian: 'Akuntansi dan Keuangan Lembaga',
  konsentrasiKeahlian: 'Akuntansi',
  mataPelajaran: 'Praktikum Akuntansi Perusahaan Jasa, Dagang, dan Manufaktur',
  fase: 'F',
  kelas: 'XI',
  semester: '1 (Ganjil)',
  tahunPelajaran: '2026/2027',
  alokasiWaktuTotal: '54 JP',
  namaGuru: 'Nurul Hidayati, S.E., M.Pd.',
  nipGuru: '19870512 201203 2 003',
  namaKepalaSekolah: 'Imam Pamungkas, S.Pd., M.Si.',
  nipKepalaSekolah: '19750821 200501 1 008',
  tanggalPenyusunan: '15 Juli 2026',
};

export const MAJOR_SAMPLES: MajorSample[] = [
  // ================= KELOMPOK KEJURUAN =================
  {
    id: 'akl',
    name: 'Akuntansi dan Keuangan Lembaga (AKL)',
    kategoriMapel: 'kejuruan',
    programKeahlian: 'Akuntansi dan Keuangan Lembaga',
    konsentrasiKeahlian: 'Akuntansi',
    mataPelajaran: 'Praktikum Akuntansi Perusahaan Jasa, Dagang, dan Manufaktur',
    fase: 'F',
    kelas: 'XI',
    semester: '1 (Ganjil)',
    rows: [
      {
        no: 1,
        elemen: 'Praktikum Akuntansi Perusahaan Jasa dan Dagang',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu menganalisis dokumen sumber dan pendukung transaksi keuangan, mencatat transaksi ke jurnal khusus dan umum, memposting ke buku besar utama dan pembantu, menyusun neraca saldo dan neraca lajur, serta menyusun laporan keuangan laba rugi, perubahan ekuitas, neraca, dan arus kas sesuai SAK EMKM / ETAP.',
        materi: 'Analisis Bukti Transaksi, Jurnal Khusus & Umum, Buku Besar Pembantu, Neraca Lajur 10 Kolom, Laporan Keuangan SAK EMKM',
        jp: 24,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
      },
      {
        no: 2,
        elemen: 'Komputer Akuntansi (Aplikasi Spreadsheet & Software Akuntansi)',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu mengoperasikan aplikasi komputer akuntansi dan spreadsheet terstandar untuk membuat data baru perusahaan, menyusun daftar akun (Chart of Accounts), mengelola kartu piutang/utang, mengentri saldo awal dan transaksi penyesuaian, serta mencetak laporan keuangan digital secara akurat.',
        materi: 'Setup Data Awal Perusahaan, Bagan Akun (COA), Entri Transaksi Pembelian & Penjualan, Rekonsiliasi Bank, Pencetakan Laporan Keuangan Digital',
        jp: 18,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
      },
      {
        no: 3,
        elemen: 'Akuntansi Lembaga / Instansi Pemerintah dan Perpajakan',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu memahami struktur akuntansi keuangan lembaga pemerintah dan instansi nirlaba, pencatatan transaksi anggaran pendapatan dan belanja daerah (APBD), serta menghitung dan menyusun formulir surat pemberitahuan (SPT) pajak PPh Pasal 21 dan PPN.',
        materi: 'Struktur Anggaran Pendapatan & Belanja Daerah, Jurnal Akuntansi Lembaga, Perhitungan PPh Pasal 21 & PPN, Pengisian Formulir SPT Pajak',
        jp: 12,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
      },
    ],
    rppRows: [
      {
        no: 1,
        elemen: 'Praktikum Akuntansi Perusahaan Jasa dan Dagang',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu menganalisis dokumen sumber dan pendukung transaksi keuangan, mencatat transaksi ke jurnal khusus dan umum, memposting ke buku besar utama dan pembantu, menyusun neraca saldo dan neraca lajur, serta menyusun laporan keuangan laba rugi, perubahan ekuitas, neraca, dan arus kas sesuai SAK EMKM / ETAP.',
        tujuanPembelajaran:
          '1. Peserta didik mampu menganalisis keabsahan bukti transaksi keuangan perusahaan dagang secara teliti dan kritis.\n2. Peserta didik mampu mencatat bukti transaksi ke dalam jurnal khusus (pembelian, penjualan, penerimaan kas, pengeluaran kas) sesuai SAK EMKM.',
        alurPembelajaran:
          'Tahap 1: Pengamatan bukti transaksi riil, Tahap 2: Analisis posisi debet-kredit, Tahap 3: Entri jurnal khusus kelompok, Tahap 4: Verifikasi silang saldo.',
        materi: 'Analisis Bukti Transaksi dan Pencatatan Jurnal Khusus Perusahaan Dagang',
        jp: 24,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
        lintasDisiplin: 'Akuntansi Keuangan, Matematika Bisnis, dan Manajemen Perkantoran',
        kesiapanPesertaDidik:
          'Minat: Literasi finansial, spreadsheet bisnis, wirausaha. 40% Visual, 40% Auditory, 20% Kinestetik. Lingkungan: UMKM & perbengkelan sekitar Bawang, Batang.',
        karakteristikMateri:
          'Materi konseptual prinsip debet-kredit yang terintegrasi secara aplikatif dengan pencatatan pembukuan riil usaha dagang/jasa.',
        profilLulusan: 'Bernalar Kritis, Kreativitas, Kolaborasi, Kemandirian, Integritas',
        metodePembelajaran: 'Problem-Based Learning (PBL) berbasis dokumen transaksi otentik',
        kemitraan:
          'Mitra DUDI: Kantor Akuntan Publik & Bank Mini SMK Muhammadiyah Bawang. Peran Ortu: Pendampingan observasi pembukuan usaha keluarga.',
        lingkunganDigital:
          'Ruang Fisik: Lab Akuntansi standar 5S. Ruang Virtual: Google Classroom & Spreadsheet Kolaboratif.',
        sintaksPendahuluan:
          'Mindful Learning: Guru mengajak berkesadaran, doa, apersepsi mengecek kesiapan fisik dan mental. Menampilkan kuitansi dan faktur bermasalah dengan pertanyaan pemantik: "Apa dampak bagi pemilik usaha bila dokumen transaksi salah catat?"',
        sintaksInti1:
          'Meaningful Learning: Murid berkelompok mengamati satu bundel bukti transaksi nyata perusahaan dagang, mengidentifikasi nama akun, menghitung nominal, menganalisis posisi debet/kredit, dan mengisi lembar kerja analisis.',
        sintaksInti2:
          'Joyful Learning: Setiap kelompok berlomba melakukan pencatatan ke lembar jurnal khusus berformat standar industri dengan pembagian peran terstruktur (analis bukti, pencatat jurnal, dan verifikator saldo), dilanjutkan verifikasi silang antar-kelompok.',
        sintaksPenutup:
          'Refleksi 3-2-1 & Kaizen: 3 akun yang paling sering tertukar debet/kreditnya, 2 langkah pencegahan salah catat, 1 komitmen ketelitian kerja akuntansi. Guru memberi penguatan konsep SAK EMKM.',
        asesmenAwal:
          'Asesmen Awal: Tanya jawab lisan 5 butir soal mengenai saldo normal akun harta, utang, modal, pendapatan, dan beban.',
        asesmenProses:
          'Asesmen Formatif: Lembar observasi diskusi kelompok, rubrik keterampilan analisis bukti transaksi, dan ketepatan entri jurnal khusus.',
        asesmenAkhir:
          'Asesmen Sumatif: Penilaian hasil lembar kerja job sheet (LKPD 1) pencatatan 15 transaksi komprehensif ke jurnal khusus dan tes formatif tertulis.',
        pengayaanRemedial:
          'Pengayaan: Penugasan entri bukti transaksi penyesuaian (adjusting entries) ke spreadsheet mandiri. Remedial: Pendampingan analisis debet-kredit dengan kartu bantu akun.',
      },
      {
        no: 2,
        elemen: 'Komputer Akuntansi (Aplikasi Spreadsheet & Software Akuntansi)',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu mengoperasikan aplikasi komputer akuntansi dan spreadsheet terstandar untuk membuat data baru perusahaan, menyusun daftar akun (Chart of Accounts), mengelola kartu piutang/utang, mengentri saldo awal dan transaksi penyesuaian, serta mencetak laporan keuangan digital secara akurat.',
        tujuanPembelajaran:
          '1. Peserta didik mampu membuat file data baru perusahaan dan menyusun daftar akun (Chart of Accounts) pada aplikasi akuntansi.\n2. Peserta didik mampu mengentri saldo awal neraca dan daftar pelanggan/pemasok secara presisi.',
        alurPembelajaran:
          'Tahap 1: Eksplorasi menu software, Tahap 2: Input profil perusahaan & COA, Tahap 3: Entri saldo buku pembantu, Tahap 4: Pengecekan keseimbangan neraca (Historical Balancing = 0).',
        materi: 'Setup Data Awal Perusahaan dan Bagan Akun (COA) Digital',
        jp: 18,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
        lintasDisiplin: 'Komputer Akuntansi dan Teknologi Informasi Terapan (TIK)',
        kesiapanPesertaDidik:
          'Minat: Aplikasi software komputer, spreadsheet, teknologi digital. Cara belajar praktikum lab 50% kinestetik, 30% visual, 20% auditory.',
        karakteristikMateri:
          'Materi aplikatif praktikum komputer akuntansi yang menuntut ketelitian tinggi, pemahaman alur sistem, dan kepatuhan SOP digital.',
        profilLulusan: 'Bernalar Kritis, Kemandirian, Kreativitas, Teliti',
        metodePembelajaran: 'Project-Based Learning (PjBL) simulasi pendirian pembukuan digital perusahaan',
        kemitraan:
          'Mitra DUDI: CV/PT Mitra Rekanan dan Software House Akuntansi. Peran Ortu: Menjaga kedisiplinan belajar komputer.',
        lingkunganDigital:
          'Ruang Fisik: Laboratorium Komputer SMK Muhammadiyah Bawang standar K3LH. Ruang Virtual: Google Classroom.',
        sintaksPendahuluan:
          'Mindful Learning: Doa bersama, cek kerapian ruang lab (budaya 5S), penayangan studi kasus perbandingan efisiensi pembukuan manual vs digital, pertanyaan pemantik: "Mengapa dunia industri beralih ke software akuntansi?"',
        sintaksInti1:
          'Meaningful Learning: Murid membuka lembar profil usaha dagang dan mengikuti demonstrasi guru dalam membuat data baru perusahaan, menentukan periode akuntansi 13 bulan, serta menyusun struktur akun.',
        sintaksInti2:
          'Joyful Learning: Murid secara mandiri dan saling berpasangan (peer-tutoring) menyelesaikan penginputan 35 akun dan menguji saldo awal sampai Historical Balancing menunjukkan angka 0 (seimbang).',
        sintaksPenutup:
          'Refleksi 3-2-1: 3 menu utama yang dikuasai, 2 kendala saat import akun, 1 trik cepat mencari selisih saldo. Guru memberikan verifikasi dan file cadangan.',
        asesmenAwal:
          'Asesmen Awal: Pengecekan kesiapan login akun komputer dan pengetahuan dasar penggolongan kode akun akuntansi.',
        asesmenProses:
          'Asesmen Formatif: Observasi unjuk kerja proses di komputer lab, kecepatan setup akun, dan ketepatan konfigurasi link account.',
        asesmenAkhir:
          'Asesmen Sumatif: Job Sheet praktik mandiri setup data awal perusahaan dan pembuatan laporan daftar akun digital.',
        pengayaanRemedial:
          'Pengayaan: Penugasan kustomisasi format laporan neraca dan laba rugi ke PDF siap cetak. Remedial: Praktik ulang setup bagan akun dengan panduan modul bergambar.',
      },
      {
        no: 3,
        elemen: 'Akuntansi Lembaga / Instansi Pemerintah dan Perpajakan',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu memahami struktur akuntansi keuangan lembaga pemerintah dan instansi nirlaba, pencatatan transaksi anggaran pendapatan dan belanja daerah (APBD), serta menghitung dan menyusun formulir surat pemberitahuan (SPT) pajak PPh Pasal 21 dan PPN.',
        tujuanPembelajaran:
          '1. Peserta didik mampu menguraikan struktur APBD dan akun belanja modal pemerintah daerah.\n2. Peserta didik mampu menghitung pajak PPh Pasal 21 dan mengisi formulir SPT masa pajak secara cermat.',
        alurPembelajaran:
          'Tahap 1: Telaah dokumen APBD, Tahap 2: Simulasi perhitungan PTKP dan tarif PPh Pasal 21, Tahap 3: Pengisian SPT elektronik, Tahap 4: Diskusi kepatuhan pajak.',
        materi: 'Struktur Anggaran APBD dan Perhitungan Pajak PPh Pasal 21',
        jp: 12,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
        lintasDisiplin: 'Perpajakan, Hukum Administrasi, dan Akuntansi Pemerintah',
        kesiapanPesertaDidik:
          'Minat: Kepatuhan hukum pajak, administrasi instansi, pelayanan publik. 40% Visual, 35% Auditory, 25% Kinestetik.',
        karakteristikMateri:
          'Materi konseptual yuridis dan aplikatif perhitungan pajak perorangan dan tata kelola anggaran daerah.',
        profilLulusan: 'Bernalar Kritis, Kewargaan, Integritas, Teliti',
        metodePembelajaran: 'Problem-Based Learning (PBL) studi kasus perhitungan pajak karyawan lokal Batang',
        kemitraan:
          'Mitra DUDI: Kantor Pelayanan Pajak Pratama / BPKAD Batang. Peran Ortu: Observasi bukti potong pajak orang tua.',
        lingkunganDigital:
          'Ruang Fisik: Kelas diskusi dan lab akuntansi. Ruang Virtual: Portal simulasi pajak DJP Online.',
        sintaksPendahuluan:
          'Mindful Learning: Refleksi peran pajak bagi pembangunan sekolah dan jalan di Batang, doa bersama, pertanyaan pemantik: "Bagaimana bila wajib pajak salah menghitung PTKP?"',
        sintaksInti1:
          'Meaningful Learning: Analisis slip gaji pegawai dengan variasi status kawin dan tanggungan anak (PTKP K/0, K/1, K/2), menghitung penghasilan neto dan PKP sesuai tarif UU HPP.',
        sintaksInti2:
          'Joyful Learning: Game simulasi "Konsultan Pajak Muda": murid bergantian memeriksa kebenaran pengisian formulir SPT rekan sekelas dan memberikan stempel validasi.',
        sintaksPenutup:
          'Refleksi 3-2-1: 3 aturan tarif PPh 21, 2 kendala penentuan PTKP, 1 kesadaran pentingnya taat pajak. Penguatan oleh guru.',
        asesmenAwal:
          'Asesmen Awal: Tanya jawab singkat tentang pengertian NPWP dan jenis-jenis pajak daerah vs pusat.',
        asesmenProses:
          'Asesmen Formatif: Penilaian proses diskusi kelompok dan ketelitian lembar perhitungan tarif progresif pajak.',
        asesmenAkhir:
          'Asesmen Sumatif: Uji tertulis studi kasus penghitungan PPh Pasal 21 atas penghasilan 3 pegawai dengan status berbeda.',
        pengayaanRemedial:
          'Pengayaan: Studi regulasi insentif pajak bagi UMKM. Remedial: Latihan bertahap perhitungan tarif lapis pertama PPh 21 (5%).',
      },
    ],
  },
  {
    id: 'tsm',
    name: 'Teknik Sepeda Motor (TSM)',
    kategoriMapel: 'kejuruan',
    programKeahlian: 'Teknik Otomotif',
    konsentrasiKeahlian: 'Teknik Sepeda Motor (TSM)',
    mataPelajaran: 'Pemeliharaan Mesin dan Kelistrikan Sepeda Motor',
    fase: 'F',
    kelas: 'XI',
    semester: '1 (Ganjil)',
    rows: [
      {
        no: 1,
        elemen: 'Sistem Bahan Bakar Injeksi (Electronic Fuel Injection / PGM-FI)',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu mendiagnosis dan memperbaiki gangguan sistem bahan bakar injeksi bensin (PGM-FI), membaca kode kedipan kerusakan (MIL) dan scanner diagnostik motor, melakukan pembersihan injektor, memeriksa tekanan fuel pump, serta menyetel putaran stasioner sesuai buku manual servis resmi pabrikan.',
        materi: 'Sensor & Aktuator PGM-FI, Diagnostik Scanner Motor & Reset ECU/ECM, Pengukuran Tekanan Fuel Pump, Troubleshooting Kerusakan Sistem Injeksi',
        jp: 24,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
      },
      {
        no: 2,
        elemen: 'Mekanisme Engine & Transmisi Otomatis (CVT Sepeda Motor)',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu melakukan overhaul kepala silinder dan mekanisme katup, memeriksa keausan piston dan silinder, serta melakukan servis berkala sistem Continuously Variable Transmission (CVT) meliputi pemeriksaan v-belt, roller pemberat, dan kopling sentrifugal.',
        materi: 'Penyetelan Celah Katup Engine, Overhaul Silinder & Piston, Pemeriksaan Komponen CVT (V-Belt & Roller), Penggantian Pelumas Gardan & Mesin',
        jp: 18,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
      },
      {
        no: 3,
        elemen: 'Sistem Kelistrikan Bodi, Pengapian, dan Pengisian Sepeda Motor',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu mendiagnosis dan memperbaiki sistem starter elektrik, sistem pengisian kiprok/regulator rectifier, baterai/aki, sistem pengapian CDI/TCI, serta merangkai sistem penerangan dan sinyal tanda belok sesuai wiring diagram resmi pabrikan.',
        materi: 'Pemeriksaan Baterai & Tegangan Pengisian, Sirkuit Starter Elektrik, Penelusuran Wiring Diagram Lampu & Klakson, K3 Bengkel Sepeda Motor 5S/5R',
        jp: 12,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
      },
    ],
  },
  {
    id: 'tkro',
    name: 'Teknik Kendaraan Ringan Otomotif (TKRO)',
    kategoriMapel: 'kejuruan',
    programKeahlian: 'Teknik Otomotif',
    konsentrasiKeahlian: 'Teknik Kendaraan Ringan (TKR)',
    mataPelajaran: 'Pemeliharaan Mesin Kendaraan Ringan',
    fase: 'F',
    kelas: 'XI',
    semester: '1 (Ganjil)',
    rows: [
      {
        no: 1,
        elemen: 'Sistem EFI dan Manajemen Mesin',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu mendiagnosis dan memperbaiki gangguan pada sistem Electronic Fuel Injection (EFI), membaca data scanner diagnostik OBD-II, dan menyetel parameter kerja sensor-aktuator sesuai SOP industri otomotif.',
        materi: 'Sensor & Aktuator EFI, Diagnostik OBD-II Scanner, Analisis Data Stream, Troubleshooting DTC',
        jp: 24,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
      },
      {
        no: 2,
        elemen: 'Sistem Pengapian Elektronik (ESA/DIS)',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu melakukan overhaul, pengujian tahanan koil pengapian, pemeriksaan busi dan dwell angle, serta penanganan gangguan sistem Direct Ignition System (DIS).',
        materi: 'Coil on Plug (COP), Waktu Pengapian Elektronik, Pemeriksaan Busi, Sirkuit Igniter',
        jp: 18,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
      },
      {
        no: 3,
        elemen: 'Perawatan Berkala 10.000 KM & K3 Bengkel Otomotif',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu melakukan prosedur periodic maintenance kendaraan ringan interval 10.000 km sesuai petunjuk manual servis bengkel resmi dan menerapkan standar keselamatan K3LH 5S/5R.',
        materi: 'Tune-up Mesin EFI, Pemeriksaan Emisi Gas Buang, Penggantian Fluida & Filter, K3LH Bengkel Resmi',
        jp: 14,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
      },
    ],
  },
  {
    id: 'tkj',
    name: 'Teknik Komputer dan Jaringan (TKJ)',
    kategoriMapel: 'kejuruan',
    programKeahlian: 'Teknik Jaringan Komputer dan Telekomunikasi',
    konsentrasiKeahlian: 'Teknik Komputer dan Jaringan',
    mataPelajaran: 'Administrasi Infrastruktur Jaringan',
    fase: 'F',
    kelas: 'XI',
    semester: '1 (Ganjil)',
    rows: [
      {
        no: 1,
        elemen: 'Perencanaan dan Pengalamatan Jaringan (Routing & Subnetting)',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu merancang topologi jaringan lokal dan luas (LAN/WAN), menghitung subnetting VLSM/CIDR, serta mengonfigurasi routing statis dan dinamis (OSPF/BGP) pada router manageable.',
        materi: 'Subnetting VLSM IPv4, Konfigurasi Static Routing, Protokol Dynamic Routing OSPF, Packet Tracer Lab',
        jp: 24,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
      },
      {
        no: 2,
        elemen: 'Manajemen Bandwidth dan Keamanan Jaringan',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu mengonfigurasi Virtual LAN (VLAN), access control list (ACL), firewall filter rules, serta melakukan manajemen bandwidth menggunakan Simple Queue dan Queue Tree.',
        materi: 'VLAN Trunking, Firewall NAT & Filter Rules, Manajemen Bandwidth Mikrotik, Wi-Fi Hotspot Radius',
        jp: 18,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
      },
      {
        no: 3,
        elemen: 'Monitoring dan Troubleshooting Jaringan Terpadu',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu memonitor lalu lintas jaringan menggunakan SNMP/The Dude, menganalisis kegagalan koneksi kabel dan nirkabel, serta menyusun dokumentasi topologi jaringan industri.',
        materi: 'Network Monitoring System (NMS), WireShark Packet Analysis, Kabel UTP Cat6 & Fiber Optic Patching',
        jp: 12,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
      },
    ],
  },
  {
    id: 'dasar-kejuruan',
    name: 'Dasar Program Keahlian (Fase E - Kelas X)',
    kategoriMapel: 'kejuruan',
    programKeahlian: 'Teknik Otomotif / AKL / TJKT',
    konsentrasiKeahlian: 'Dasar-dasar Kejuruan SMK',
    mataPelajaran: 'Dasar-Dasar Kejuruan dan Proses Bisnis Industri',
    fase: 'E',
    kelas: 'X',
    semester: '1 (Ganjil)',
    rows: [
      {
        no: 1,
        elemen: 'Proses Bisnis dan Budaya Kerja Industri',
        capaianPembelajaran:
          'Pada akhir fase E, peserta didik mampu memahami alur proses bisnis secara menyeluruh pada industri kejuruan, profesi dan peluang wirausaha (technopreneur), serta menerapkan budaya kerja 5S/5R.',
        materi: 'Alur Bisnis Industri, Budaya 5S/5R, Etika Kerja Profesional, Profil Technopreneur Sukses',
        jp: 18,
        fase: 'E',
        kelas: 'X',
        semester: '1 (Ganjil)',
      },
      {
        no: 2,
        elemen: 'Keselamatan, Kesehatan Kerja dan Lingkungan Hidup (K3LH)',
        capaianPembelajaran:
          'Pada akhir fase E, peserta didik mampu menerapkan K3LH dan budaya kerja industri, mengenali potensi bahaya di lingkungan kerja laboratorium/bengkel, dan melakukan tindakan tanggap darurat kecelakaan kerja.',
        materi: 'SOP APD (Alat Pelindung Diri), Penanganan Bahan Berbahaya, Prosedur Pemadaman APAR, Pertolongan Pertama (P3K)',
        jp: 18,
        fase: 'E',
        kelas: 'X',
        semester: '1 (Ganjil)',
      },
    ],
  },
  {
    id: 'blank-kejuruan',
    name: '📄 [LEMBAR KOSONG] Format Input Kejuruan',
    kategoriMapel: 'kejuruan',
    programKeahlian: 'Program Keahlian SMK',
    konsentrasiKeahlian: 'Konsentrasi Keahlian',
    mataPelajaran: 'Mata Pelajaran Kejuruan',
    fase: 'F',
    kelas: 'XI',
    semester: '1 (Ganjil)',
    rows: [
      {
        no: 1,
        elemen: 'Nama Elemen Kejuruan 1',
        capaianPembelajaran: 'Tuliskan atau paste Capaian Pembelajaran (CP) Elemen 1 di sini dari dokumen kurikulum...',
        materi: 'Materi Pokok / Lingkup Konten 1',
        jp: 18,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
      },
      {
        no: 2,
        elemen: 'Nama Elemen Kejuruan 2',
        capaianPembelajaran: 'Tuliskan atau paste Capaian Pembelajaran (CP) Elemen 2 di sini...',
        materi: 'Materi Pokok / Lingkup Konten 2',
        jp: 18,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
      },
    ],
  },

  // ================= KELOMPOK MAPEL UMUM / NORMATIF-ADAPTIF =================
  {
    id: 'bahasa-inggris',
    name: 'Bahasa Inggris (Workplace English)',
    kategoriMapel: 'umum',
    programKeahlian: 'Semua Program Keahlian (Umum / Normatif-Adaptif)',
    konsentrasiKeahlian: 'Umum / Normatif-Adaptif',
    mataPelajaran: 'Bahasa Inggris',
    fase: 'F',
    kelas: 'XI',
    semester: '1 (Ganjil)',
    rows: [
      {
        no: 1,
        elemen: 'Menyimak dan Berbicara (Listening & Speaking)',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu menggunakan bahasa Inggris untuk berkomunikasi dalam situasi kerja dan sosial, menangani pertanyaan pelanggan (handling inquiries & complaints), berpartisipasi dalam diskusi kelompok kerja, serta melakukan presentasi proyek kejuruan dengan percaya diri dan pelafalan yang tepat.',
        materi: 'Workplace Conversations, Asking & Giving Opinions, Handling Inquiries and Complaints, Professional Job Interview Simulation',
        jp: 16,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
      },
      {
        no: 2,
        elemen: 'Membaca dan Memirsa (Reading & Viewing)',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu memahami, menganalisis, dan mengevaluasi teks informatif, manual instruksi teknis (Technical Operating Manuals / SOP), email bisnis, serta artikel industri berbahasa Inggris untuk menemukan gagasan pokok dan instruksi detail secara tepat.',
        materi: 'Reading Technical Specifications & User Manuals, Understanding Business Emails & Memorandums, Procedural Text in Vocational Context',
        jp: 14,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
      },
      {
        no: 3,
        elemen: 'Menulis dan Mempresentasikan (Writing & Presenting)',
        capaianPembelajaran:
          'Pada akhir fase F, peserta didik mampu memproduksi teks tertulis resmi seperti surat lamaran kerja (Application Letter), resume / Curriculum Vitae (CV), laporan hasil pekerjaan (Work Progress Report), serta mempresentasikannya dengan bantuan media digital secara komunikatif.',
        materi: 'Drafting Professional CV & Cover Letter, Work Report Summaries, Project Presentation Pitch Deck, Business Vocabulary',
        jp: 12,
        fase: 'F',
        kelas: 'XI',
        semester: '1 (Ganjil)',
      },
    ],
  },
  {
    id: 'bahasa-indonesia',
    name: 'Bahasa Indonesia (Fase E/F)',
    kategoriMapel: 'umum',
    programKeahlian: 'Semua Program Keahlian (Umum / Normatif-Adaptif)',
    konsentrasiKeahlian: 'Umum / Normatif-Adaptif',
    mataPelajaran: 'Bahasa Indonesia',
    fase: 'E',
    kelas: 'X',
    semester: '1 (Ganjil)',
    rows: [
      {
        no: 1,
        elemen: 'Menyimak dan Membaca Teks Laporan Hasil Observasi (LHO)',
        capaianPembelajaran:
          'Pada akhir fase E, peserta didik mampu mengevaluasi informasi berupa gagasan, pikiran, perasaan, pandangan, arahan atau pesan yang akurat dari menyimak teks laporan hasil observasi dan teks eksposisi di bidang kejuruan/lingkungan hidup.',
        materi: 'Struktur Teks LHO, Ciri Kebahasaan Objektif, Fakta vs Opini, Ringkasan Laporan Observasi',
        jp: 16,
        fase: 'E',
        kelas: 'X',
        semester: '1 (Ganjil)',
      },
      {
        no: 2,
        elemen: 'Menulis dan Mempresentasikan Teks Negosiasi Bisnis',
        capaianPembelajaran:
          'Pada akhir fase E, peserta didik mampu menyusun teks negosiasi dalam bentuk dialog dan surat penawaran barang/jasa sesuai struktur dan kaidah kebahasaan, serta mempraktikkannya dalam simulasi kesepakatan bisnis yang santun dan persuasif.',
        materi: 'Struktur Negosiasi, Surat Penawaran Kerja Sama, Bahasa Persuasif, Simulasi Kesepakatan Usaha',
        jp: 14,
        fase: 'E',
        kelas: 'X',
        semester: '1 (Ganjil)',
      },
    ],
  },
  {
    id: 'matematika',
    name: 'Matematika Umum (Fase E/F)',
    kategoriMapel: 'umum',
    programKeahlian: 'Semua Program Keahlian (Umum / Normatif-Adaptif)',
    konsentrasiKeahlian: 'Umum / Normatif-Adaptif',
    mataPelajaran: 'Matematika',
    fase: 'E',
    kelas: 'X',
    semester: '1 (Ganjil)',
    rows: [
      {
        no: 1,
        elemen: 'Bilangan Eksponen dan Logaritma',
        capaianPembelajaran:
          'Pada akhir fase E, peserta didik mampu menggeneralisasi sifat-sifat bilangan berpangkat (eksponen) dan logaritma, serta menerapkannya untuk menyelesaikan masalah kontekstual pemodelan pertumbuhan, peluruhan, dan skala teknis.',
        materi: 'Sifat Operasi Eksponen, Fungsi Pertumbuhan & Peluruhan, Logaritma, Penerapan Perhitungan Teknis',
        jp: 16,
        fase: 'E',
        kelas: 'X',
        semester: '1 (Ganjil)',
      },
      {
        no: 2,
        elemen: 'Barisan dan Deret Aritmetika serta Geometri',
        capaianPembelajaran:
          'Pada akhir fase E, peserta didik mampu menentukan pola barisan dan deret aritmetika serta geometri, dan menggunakannya dalam menyelesaikan masalah kontekstual perencanaan keuangan, bunga tunggal/majemuk, dan kapasitas produksi.',
        materi: 'Pola Barisan Aritmetika & Geometri, Deret Bilangan, Masalah Keuangan & Produksi, Simulasi Angsuran',
        jp: 16,
        fase: 'E',
        kelas: 'X',
        semester: '1 (Ganjil)',
      },
    ],
  },
  {
    id: 'pendidikan-pancasila',
    name: 'Pendidikan Pancasila',
    kategoriMapel: 'umum',
    programKeahlian: 'Semua Program Keahlian (Umum / Normatif-Adaptif)',
    konsentrasiKeahlian: 'Umum / Normatif-Adaptif',
    mataPelajaran: 'Pendidikan Pancasila',
    fase: 'E',
    kelas: 'X',
    semester: '1 (Ganjil)',
    rows: [
      {
        no: 1,
        elemen: 'Pancasila dalam Kehidupan Berbangsa dan Bernegara',
        capaianPembelajaran:
          'Pada akhir fase E, peserta didik mampu menganalisis cara pandang para pendiri bangsa tentang rumusan dasar negara, kedudukan Pancasila sebagai ideologi terbuka, dan menerapkan nilai-nilai Pancasila dalam kehidupan bermasyarakat dan dunia kerja.',
        materi: 'Sejarah Perumusan Pancasila, Dimensi Ideologi Pancasila, Implementasi Gotong Royong di Lingkungan Kerja',
        jp: 12,
        fase: 'E',
        kelas: 'X',
        semester: '1 (Ganjil)',
      },
      {
        no: 2,
        elemen: 'Undang-Undang Dasar NRI 1945 dan Hak Asasi Manusia',
        capaianPembelajaran:
          'Pada akhir fase E, peserta didik mampu menganalisis hak dan kewajiban warga negara yang diatur dalam UUD NRI Tahun 1945, perlindungan ketenagakerjaan, serta mempraktikkan perilaku taat hukum dalam kehidupan sehari-hari.',
        materi: 'Konstitusi UUD NRI 1945, Hak & Kewajiban Tenaga Kerja, Budaya Taat Aturan Hukum & Disiplin Sosial',
        jp: 12,
        fase: 'E',
        kelas: 'X',
        semester: '1 (Ganjil)',
      },
    ],
  },
  {
    id: 'blank-umum',
    name: '📄 [LEMBAR KOSONG] Format Input Mapel Umum',
    kategoriMapel: 'umum',
    programKeahlian: 'Semua Program Keahlian (Umum / Normatif-Adaptif)',
    konsentrasiKeahlian: 'Umum / Normatif-Adaptif',
    mataPelajaran: 'Mata Pelajaran Umum (Normatif-Adaptif)',
    fase: 'E',
    kelas: 'X',
    semester: '1 (Ganjil)',
    rows: [
      {
        no: 1,
        elemen: 'Nama Elemen Mapel Umum 1',
        capaianPembelajaran: 'Tuliskan atau paste Capaian Pembelajaran (CP) Elemen 1 di sini dari naskah Keputusan BSKAP...',
        materi: 'Topik / Lingkup Materi 1',
        jp: 14,
        fase: 'E',
        kelas: 'X',
        semester: '1 (Ganjil)',
      },
      {
        no: 2,
        elemen: 'Nama Elemen Mapel Umum 2',
        capaianPembelajaran: 'Tuliskan atau paste Capaian Pembelajaran (CP) Elemen 2 di sini...',
        materi: 'Topik / Lingkup Materi 2',
        jp: 14,
        fase: 'E',
        kelas: 'X',
        semester: '1 (Ganjil)',
      },
    ],
  },
];
