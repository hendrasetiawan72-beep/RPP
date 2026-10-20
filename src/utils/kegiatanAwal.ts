/**
 * Utilitas Kegiatan Awal (Pendahuluan) RPP.
 *
 * Satu-satunya tempat yang tahu cara mengubah teks bebas (sel Excel / textarea editor)
 * menjadi daftar langkah bernomor, supaya jalur parser Excel, generator, editor manual,
 * ekspor Excel, dan tampilan cetak selalu konsisten.
 */

/** Label bawaan template lama yang tidak perlu ikut tampil di langkah pertama. */
const LABEL_AWAL = /^\s*(?:sintaks\s+)?(?:mindful\s+learning|kegiatan\s+awal|pendahuluan)\s*(?:\([^)]*\))?\s*[:\-–—]\s*/i;

/** Penanda nomor/bullet di awal baris: "1.", "2)", "a.", "-", "•", "*" */
const PENANDA_AWAL_BARIS = /^\s*(?:\d{1,2}\s*[.)]|[-•*–—▪●])\s+/;

/**
 * Pecah satu baris yang memuat nomor berurutan: "1. A. 2. B. 3. C".
 * Hanya dipecah bila baris diawali "1." dan nomor berikutnya benar-benar berurutan,
 * sehingga kalimat seperti "Kelas 10. Guru menyapa." tidak ikut terpotong.
 */
function pecahNomorInline(baris: string): string[] {
  if (!/^\s*1\s*[.)]\s+\S/.test(baris)) return [baris];
  const hasil: string[] = [];
  let awal = 0;
  let berikutnya = 2;
  const pola = /\s(\d{1,2})\s*[.)]\s+(?=\S)/g;
  let m: RegExpExecArray | null;
  while ((m = pola.exec(baris)) !== null) {
    if (parseInt(m[1], 10) !== berikutnya) continue;
    hasil.push(baris.slice(awal, m.index));
    awal = m.index + 1; // tetap sertakan nomor agar dibersihkan seragam di bawah
    berikutnya++;
  }
  hasil.push(baris.slice(awal));
  return hasil.filter((b) => b.trim().length > 0);
}

/**
 * Ubah teks mentah menjadi daftar langkah.
 * Mendukung: satu langkah per baris (Alt+Enter di Excel), nomor "1. 2. 3." dalam satu baris,
 * bullet, dan pemisah titik-koma. Teks prosa tunggal tetap menjadi satu langkah.
 */
export function parseLangkahList(raw: string | undefined | null): string[] {
  if (!raw) return [];
  const text = String(raw).replace(/\r\n?/g, '\n').trim();
  if (!text) return [];

  let potongan = text.split('\n');

  // Nomor berurutan dalam satu baris -> pecah per nomor.
  potongan = potongan.flatMap(pecahNomorInline);

  // Satu baris saja tetapi memakai titik-koma sebagai pemisah langkah.
  if (potongan.length === 1 && potongan[0].includes(';')) {
    const bagian = potongan[0].split(';').map((b) => b.trim()).filter(Boolean);
    if (bagian.length >= 2) potongan = bagian;
  }

  const hasil = potongan
    .map((baris) => baris.replace(PENANDA_AWAL_BARIS, '').trim())
    .filter((baris) => baris.length > 0);

  if (hasil.length > 0) hasil[0] = hasil[0].replace(LABEL_AWAL, '').trim() || hasil[0];
  return hasil.filter((baris) => baris.length > 0);
}

/** Langkah bawaan bila guru belum mengisi apa pun (mengikuti pola RPP guru). */
export function defaultLangkahKegiatanAwal(materi?: string): string[] {
  const topik = (materi || '').trim();
  return [
    'Guru membuka pelajaran dengan salam, doa, dan menyapa murid.',
    'Guru memeriksa kehadiran dan kesiapan belajar murid.',
    topik
      ? `Guru melakukan apersepsi dengan memberikan pertanyaan pemantik yang berkaitan dengan ${topik}.`
      : 'Guru melakukan apersepsi dengan memberikan pertanyaan pemantik yang berkaitan dengan materi.',
    'Guru menyampaikan tujuan pembelajaran dan aktivitas yang akan dilakukan.',
  ];
}

/** Susun langkah dari teks Excel/textarea; jatuh ke bawaan bila kosong. */
export function buildLangkahKegiatanAwal(raw: string | undefined | null, materi?: string): string[] {
  const langkah = parseLangkahList(raw);
  return langkah.length > 0 ? langkah : defaultLangkahKegiatanAwal(materi);
}

/**
 * Ambil langkah yang aman dipakai tampilan/ekspor (tanpa baris kosong).
 * Data yang belum punya kegiatanAwal sama sekali memakai langkah bawaan;
 * bila guru sengaja mengosongkan semua langkah, hasilnya tetap kosong.
 */
export function getLangkahKegiatanAwal(
  pengalamanBelajar: { kegiatanAwal?: { langkah?: string[] } } | undefined,
  materi?: string
): string[] {
  const awal = pengalamanBelajar?.kegiatanAwal;
  if (!awal || !Array.isArray(awal.langkah)) return defaultLangkahKegiatanAwal(materi);
  // Penanda nomor/bullet yang diketik manual dibuang agar tidak bernomor ganda saat cetak.
  return awal.langkah
    .map((l) => String(l ?? '').replace(PENANDA_AWAL_BARIS, '').trim())
    .filter((l) => l.length > 0);
}

/** Satu sel Excel: bernomor, satu langkah per baris (bisa dibaca ulang oleh parser). */
export function langkahToExcelCell(langkah: string[]): string {
  return langkah.map((l, i) => `${i + 1}. ${l}`).join('\n');
}
