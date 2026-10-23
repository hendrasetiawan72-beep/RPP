/**
 * Penyimpanan data di browser (localStorage) agar hasil editan tidak hilang saat halaman di-refresh.
 *
 * - Setiap bagian data disimpan pada kunci terpisah, sehingga jika satu bagian gagal disimpan
 *   (misalnya kuota penuh), bagian lain tetap aman.
 * - Data dibungkus "envelope" berversi. Jika struktur data berubah di masa depan,
 *   naikkan STORAGE_VERSION agar data lama diabaikan, bukan merusak aplikasi.
 * - Semua akses dibungkus try/catch karena localStorage bisa diblokir (mode privat, kebijakan browser)
 *   atau penuh (QuotaExceededError).
 */

const STORAGE_NS = 'rpp-generator';
const STORAGE_VERSION = 1;

export type StorageKey = 'identity' | 'rows' | 'perangkat' | 'modul' | 'ui';

const ALL_KEYS: StorageKey[] = ['identity', 'rows', 'perangkat', 'modul', 'ui'];

interface Envelope<T> {
  v: number;
  savedAt: number;
  data: T;
}

export type SaveResult =
  | { ok: true; bytes: number }
  | { ok: false; reason: 'unavailable' | 'quota' | 'error' };

function fullKey(key: StorageKey): string {
  return `${STORAGE_NS}:v${STORAGE_VERSION}:${key}`;
}

function getStorage(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    // Akses localStorage dapat melempar error jika diblokir oleh browser
    return null;
  }
}

/** Cache string terakhir yang ditulis, agar data yang tidak berubah tidak ditulis ulang. */
const lastWritten = new Map<StorageKey, string>();

function isQuotaError(err: unknown): boolean {
  if (!(err instanceof DOMException)) return false;
  return (
    err.name === 'QuotaExceededError' ||
    err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    err.code === 22 ||
    err.code === 1014
  );
}

/** Baca data tersimpan. Mengembalikan null jika tidak ada, rusak, atau versinya tidak cocok. */
export function loadStored<T>(key: StorageKey): T | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(fullKey(key));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Envelope<T>;
    if (!parsed || parsed.v !== STORAGE_VERSION || parsed.data === undefined || parsed.data === null) {
      return null;
    }
    lastWritten.set(key, JSON.stringify(parsed.data));
    return parsed.data;
  } catch {
    // JSON rusak: abaikan dan pakai data awal
    return null;
  }
}

/**
 * Simpan data. Nilai null/undefined berarti "tidak ada data" sehingga kunci dihapus.
 * Jika penulisan gagal, kunci lama dihapus supaya tidak tersisa data usang yang tidak sinkron.
 */
export function saveStored<T>(key: StorageKey, value: T | null | undefined): SaveResult {
  const storage = getStorage();
  if (!storage) return { ok: false, reason: 'unavailable' };

  try {
    if (value === null || value === undefined) {
      storage.removeItem(fullKey(key));
      lastWritten.delete(key);
      return { ok: true, bytes: 0 };
    }

    const dataStr = JSON.stringify(value);
    if (lastWritten.get(key) === dataStr) {
      // Tidak ada perubahan sejak penyimpanan terakhir
      return { ok: true, bytes: dataStr.length };
    }

    // Susun envelope sebagai string agar data besar tidak perlu di-parse ulang
    const payload = `{"v":${STORAGE_VERSION},"savedAt":${Date.now()},"data":${dataStr}}`;
    storage.setItem(fullKey(key), payload);
    lastWritten.set(key, dataStr);
    return { ok: true, bytes: payload.length };
  } catch (err) {
    try {
      storage.removeItem(fullKey(key));
    } catch {
      /* diabaikan */
    }
    lastWritten.delete(key);
    return { ok: false, reason: isQuotaError(err) ? 'quota' : 'error' };
  }
}

/** Hapus seluruh data tersimpan milik aplikasi ini. */
export function clearAllStored(): void {
  const storage = getStorage();
  lastWritten.clear();
  if (!storage) return;
  for (const key of ALL_KEYS) {
    try {
      storage.removeItem(fullKey(key));
    } catch {
      /* diabaikan */
    }
  }
}

/** Perkiraan total ukuran data tersimpan (dalam KB), untuk ditampilkan ke pengguna. */
export function getStoredSizeKb(): number {
  const storage = getStorage();
  if (!storage) return 0;
  let total = 0;
  for (const key of ALL_KEYS) {
    try {
      total += (storage.getItem(fullKey(key)) || '').length;
    } catch {
      /* diabaikan */
    }
  }
  return Math.round(total / 1024);
}
