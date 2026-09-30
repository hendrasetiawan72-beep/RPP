import React from 'react';
import { X, Check, School, User, Calendar, BookOpen } from 'lucide-react';
import { SchoolIdentity } from '../types';

interface SchoolIdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
  identity: SchoolIdentity;
  onSave: (updated: SchoolIdentity) => void;
}

export const SchoolIdentityModal: React.FC<SchoolIdentityModalProps> = ({
  isOpen,
  onClose,
  identity,
  onSave,
}) => {
  const [formData, setFormData] = React.useState<SchoolIdentity>(identity);

  React.useEffect(() => {
    setFormData(identity);
  }, [identity]);

  if (!isOpen) return null;

  const handleChange = (field: keyof SchoolIdentity, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Enforce strictly that the school name remains SMK Muhammadiyah Bawang
      schoolName: 'SMK Muhammadiyah Bawang',
      kabupaten: 'Batang',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div className="bg-[#FFFDF7] neo-box-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-100 hover:bg-rose-100 border-2 border-black"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-black">
          <div className="w-8 h-8 rounded-lg bg-amber-400 border-2 border-black flex items-center justify-center">
            <School className="w-4 h-4 text-black" />
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-neutral-900">
              Identitas Satuan Pendidikan & Guru
            </h3>
            <p className="text-xs text-neutral-600">
              SMK Muhammadiyah Bawang, Batang · Kurikulum Merdeka
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-amber-50 border-2 border-black rounded-xl">
            <label className="text-xs font-black uppercase tracking-wider text-neutral-700 block mb-1">
              Satuan Pendidikan (Terkunci Otomatis)
            </label>
            <input
              type="text"
              readOnly
              value="SMK Muhammadiyah Bawang, Batang"
              className="w-full bg-neutral-100 font-bold px-3 py-2 border-2 border-black rounded-lg text-sm text-neutral-800 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                Kategori Mata Pelajaran
              </label>
              <select
                value={formData.kategoriMapel || 'kejuruan'}
                onChange={(e) => handleChange('kategoriMapel', e.target.value as any)}
                className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm bg-white"
              >
                <option value="kejuruan">Kejuruan (Produktif)</option>
                <option value="umum">Normatif-Adaptif (Mapel Umum)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                Program Keahlian
              </label>
              <input
                type="text"
                value={formData.programKeahlian}
                onChange={(e) => handleChange('programKeahlian', e.target.value)}
                className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm bg-white"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                Konsentrasi Keahlian
              </label>
              <input
                type="text"
                value={formData.konsentrasiKeahlian}
                onChange={(e) => handleChange('konsentrasiKeahlian', e.target.value)}
                className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-800 block mb-1">
              Mata Pelajaran
            </label>
            <input
              type="text"
              value={formData.mataPelajaran}
              onChange={(e) => handleChange('mataPelajaran', e.target.value)}
              className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                Fase
              </label>
              <select
                value={formData.fase}
                onChange={(e) => handleChange('fase', e.target.value)}
                className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm bg-white"
              >
                <option value="E">Fase E (Kelas X)</option>
                <option value="F">Fase F (Kelas XI/XII)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                Kelas
              </label>
              <select
                value={formData.kelas}
                onChange={(e) => handleChange('kelas', e.target.value)}
                className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm bg-white"
              >
                <option value="X">Kelas X</option>
                <option value="XI">Kelas XI</option>
                <option value="XII">Kelas XII</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) => handleChange('semester', e.target.value)}
                className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm bg-white"
              >
                <option value="1 (Ganjil)">1 (Ganjil)</option>
                <option value="2 (Genap)">2 (Genap)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1">
                Tahun Pelajaran
              </label>
              <input
                type="text"
                value={formData.tahunPelajaran}
                onChange={(e) => handleChange('tahunPelajaran', e.target.value)}
                className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm bg-white"
                required
              />
            </div>
          </div>

          <div className="pt-2 border-t border-black/20">
            <h4 className="text-xs font-black uppercase text-neutral-700 tracking-wider mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Data Pengampu & Pengesahan</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Nama Guru Pengampu
                </label>
                <input
                  type="text"
                  value={formData.namaGuru}
                  onChange={(e) => handleChange('namaGuru', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm bg-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  NIP / NBM Guru
                </label>
                <input
                  type="text"
                  value={formData.nipGuru}
                  onChange={(e) => handleChange('nipGuru', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Nama Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={formData.namaKepalaSekolah}
                  onChange={(e) => handleChange('namaKepalaSekolah', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm bg-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  NIP / NBM Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={formData.nipKepalaSekolah}
                  onChange={(e) => handleChange('nipKepalaSekolah', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm bg-white"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-bold text-neutral-800 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Tanggal Penetapan Dokumen</span>
              </label>
              <input
                type="text"
                value={formData.tanggalPenyusunan}
                onChange={(e) => handleChange('tanggalPenyusunan', e.target.value)}
                placeholder="Misal: 15 Juli 2026"
                className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm bg-white"
              />
            </div>
          </div>

          {/* Pengaturan Kop Surat Resmi (Sesuai Gambar) */}
          <div className="pt-2 border-t border-black/20">
            <h4 className="text-xs font-black uppercase text-neutral-700 tracking-wider mb-2 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5" />
              <span>Detail Kop Surat & Alamat Resmi</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-neutral-800 block mb-1">
                  Status Akreditasi
                </label>
                <input
                  type="text"
                  value={formData.statusAkreditasi || 'TERAKREDITASI “A”'}
                  onChange={(e) => handleChange('statusAkreditasi', e.target.value)}
                  className="w-full px-2.5 py-1.5 border-2 border-black rounded-lg text-xs bg-white font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-neutral-800 block mb-1">
                  Kode Pos
                </label>
                <input
                  type="text"
                  value={formData.kodePos || '51274'}
                  onChange={(e) => handleChange('kodePos', e.target.value)}
                  className="w-full px-2.5 py-1.5 border-2 border-black rounded-lg text-xs bg-white font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-neutral-800 block mb-1">
                  Alamat Lengkap Sekolah
                </label>
                <input
                  type="text"
                  value={formData.alamatLengkap || 'Jl. Bawang-Sukorejo Km 01 Ds. Jlamprang Kec. Bawang Kab. Batang.'}
                  onChange={(e) => handleChange('alamatLengkap', e.target.value)}
                  className="w-full px-2.5 py-1.5 border-2 border-black rounded-lg text-xs bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-neutral-800 block mb-1">
                  Email Resmi
                </label>
                <input
                  type="text"
                  value={formData.email || 'smkmuhbawang@gmail.com'}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-2.5 py-1.5 border-2 border-black rounded-lg text-xs bg-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-neutral-800 block mb-1">
                  Website Resmi
                </label>
                <input
                  type="text"
                  value={formData.website || 'www.smkmuhiba.sch.id'}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full px-2.5 py-1.5 border-2 border-black rounded-lg text-xs bg-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-neutral-800 block mb-1">
                  Telepon
                </label>
                <input
                  type="text"
                  value={formData.telepon || '(0285) 4486909'}
                  onChange={(e) => handleChange('telepon', e.target.value)}
                  className="w-full px-2.5 py-1.5 border-2 border-black rounded-lg text-xs bg-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-neutral-800 block mb-1">
                  Fax
                </label>
                <input
                  type="text"
                  value={formData.fax || '(0285) 4486899'}
                  onChange={(e) => handleChange('fax', e.target.value)}
                  className="w-full px-2.5 py-1.5 border-2 border-black rounded-lg text-xs bg-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t-2 border-black">
            <button
              type="button"
              onClick={onClose}
              className="neo-btn px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-black text-xs font-bold rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="neo-btn px-5 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black rounded-lg flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Identitas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
