/**
 * Mengubah teks instruksi satu paragraf panjang ("1. ... 2. ... • ... • ...") menjadi blok
 * terstruktur: paragraf, daftar bernomor, dan sub-butir, agar mudah dibaca saat tampil maupun cetak.
 */

export interface InstruksiItem {
  text: string;
  subs: string[];
}

export type InstruksiBlock =
  | { type: 'p'; text: string }
  | { type: 'ol'; items: InstruksiItem[] }
  | { type: 'ul'; items: string[] };

/** Pisahkan "• a • b" / "- a" menjadi butir. */
function pecahBullet(teks: string): { head: string; subs: string[] } {
  const bagian = teks.split(/\s*•\s*/).map((b) => b.trim());
  const head = bagian[0] || '';
  const subs = bagian.slice(1).filter(Boolean);
  return { head, subs };
}

/**
 * Cari nomor berurutan 1., 2., 3. di dalam satu paragraf (boleh didahului kalimat pengantar).
 * Nomor yang tidak berurutan (misal "Kelas 10.") diabaikan. Minimal 2 butir agar dianggap daftar.
 */
function pecahNomorBerurutan(teks: string): { pengantar: string; items: string[] } | null {
  const pola = /(^|\s)(\d{1,2})\s*[.)]\s+(?=\S)/g;
  const posisi: { index: number; panjang: number }[] = [];
  let berikutnya = 1;
  let m: RegExpExecArray | null;
  while ((m = pola.exec(teks)) !== null) {
    if (parseInt(m[2], 10) !== berikutnya) continue;
    posisi.push({ index: m.index + m[1].length, panjang: m[0].length - m[1].length });
    berikutnya++;
  }
  if (posisi.length < 2) return null;

  const pengantar = teks.slice(0, posisi[0].index).trim();
  const items = posisi.map((p, i) => {
    const mulai = p.index + p.panjang;
    const akhir = i + 1 < posisi.length ? posisi[i + 1].index : teks.length;
    return teks.slice(mulai, akhir).trim();
  });
  return { pengantar, items: items.filter(Boolean) };
}

export function parseInstruksi(raw: string | undefined | null): InstruksiBlock[] {
  if (!raw) return [];
  const paragraf = String(raw)
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  const blok: InstruksiBlock[] = [];
  for (const p of paragraf) {
    const bernomor = pecahNomorBerurutan(p);
    if (bernomor) {
      if (bernomor.pengantar) blok.push({ type: 'p', text: bernomor.pengantar });
      blok.push({
        type: 'ol',
        items: bernomor.items.map((it) => {
          const { head, subs } = pecahBullet(it);
          return { text: head, subs };
        }),
      });
      continue;
    }
    if (p.includes('•')) {
      const { head, subs } = pecahBullet(p);
      if (head) blok.push({ type: 'p', text: head });
      if (subs.length) blok.push({ type: 'ul', items: subs });
      continue;
    }
    blok.push({ type: 'p', text: p });
  }
  return blok;
}
