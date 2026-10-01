import { X, BookOpen, Brain, Compass, CheckCircle2, ShieldCheck } from 'lucide-react';

interface GuidelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidelineModal: React.FC<GuidelineModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div className="bg-[#FFFDF7] neo-box-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-100 hover:bg-rose-100 border-2 border-black"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b-2 border-black">
          <div className="w-9 h-9 rounded-xl bg-blue-400 border-2 border-black flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-neutral-900">
              Landasan Regulasi & Pendekatan Pedagogis
            </h3>
            <p className="text-xs text-neutral-600">
              Kurikulum Merdeka 2024 & Kerangka Deep Learning SMK Muhammadiyah Bawang
            </p>
          </div>
        </div>

        <div className="space-y-5 text-xs text-neutral-800 leading-relaxed">
          {/* 3 Pilar Deep Learning */}
          <div className="p-4 bg-amber-50 border-2 border-black rounded-xl">
            <h4 className="font-display font-black text-sm text-neutral-900 mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber-700" />
              <span>3 Pilar Utama Deep Learning (Kemendikdasmen)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              <div className="bg-white p-3 border-2 border-black rounded-lg">
                <div className="font-extrabold text-neutral-900 text-[11px] uppercase tracking-wider text-amber-800 mb-1">
                  1. Mindful Learning
                </div>
                <p className="text-[11px] text-neutral-700">
                  Aktivitas yang mendorong keterlibatan kognitif dan emosional siswa secara penuh, memantik nalar kritis, kesadaran diri (mindfulness), dan fokus mendalam tanpa distraksi.
                </p>
              </div>

              <div className="bg-white p-3 border-2 border-black rounded-lg">
                <div className="font-extrabold text-neutral-900 text-[11px] uppercase tracking-wider text-emerald-800 mb-1">
                  2. Meaningful Learning
                </div>
                <p className="text-[11px] text-neutral-700">
                  Mengaitkan konsep teori dengan konteks nyata di industri kejuruan dan kehidupan sehari-hari siswa di daerah Batang, sehingga materi memiliki signifikansi nyata.
                </p>
              </div>

              <div className="bg-white p-3 border-2 border-black rounded-lg">
                <div className="font-extrabold text-neutral-900 text-[11px] uppercase tracking-wider text-rose-800 mb-1">
                  3. Joyful Learning
                </div>
                <p className="text-[11px] text-neutral-700">
                  Pengalaman belajar yang interaktif, menantang namun menyenangkan, bebas dari rasa takut salah (fear of failure), memicu antusiasme eksplorasi intrinsik.
                </p>
              </div>
            </div>
          </div>

          {/* Regulasi Resmi */}
          <div className="p-4 bg-emerald-50 border-2 border-black rounded-xl">
            <h4 className="font-display font-black text-sm text-neutral-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Regulasi & Dokumen Acuan Resmi</span>
            </h4>
            <ul className="space-y-1.5 list-disc pl-5">
              <li>
                <strong>Keputusan Kepala BSKAP No 032/H/KR/2024:</strong> Capaian Pembelajaran (CP) PAUD, Pendidikan Dasar, dan Pendidikan Menengah (SMK Fase E & F).
              </li>
              <li>
                <strong>Panduan Pembelajaran dan Asesmen (PPA 2024):</strong> Prinsip perumusan Tujuan Pembelajaran (Kompetensi + Konten + Keterampilan Berpikir), asesmen formatif as & for learning, asesmen sumatif, serta Tangga Umpan Balik (Ladder of Feedback).
              </li>
              <li>
                <strong>Panduan Asesmen Siswa dalam Layanan Bimbingan & Konseling:</strong> Identifikasi profil kebutuhan siswa (need assessment) awal secara komprehensif.
              </li>
              <li>
                <strong>Format ATP & Modul Ajar Resmi:</strong> Standar format matriks beralur terintegrasi dengan identitas tetap <strong>SMK Muhammadiyah Bawang, Batang</strong>.
              </li>
            </ul>
          </div>

          {/* Model Refleksi Kaizen & 3-2-1 */}
          <div className="p-4 bg-violet-50 border-2 border-black rounded-xl">
            <h4 className="font-display font-black text-sm text-neutral-900 mb-1 flex items-center gap-2">
              <Compass className="w-4 h-4 text-violet-700" />
              <span>Model Refleksi Kaizen, Model 3-2-1, & Tangga Umpan Balik</span>
            </h4>
            <p className="text-[11px] text-neutral-700 mb-2">
              Setiap akhir pertemuan Modul Ajar dilengkapi instrumen refleksi untuk menumbuhkan <em>Growth Mindset</em>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white p-2.5 border border-black rounded-lg">
                <strong>Model 3-2-1:</strong>
                <ul className="list-disc pl-4 mt-1 text-neutral-600">
                  <li>3 hal yang telah dikuasai dengan baik.</li>
                  <li>2 hal yang masih perlu ditingkatkan/dilatih.</li>
                  <li>1 strategi konkret perbaikan mandiri.</li>
                </ul>
              </div>
              <div className="bg-white p-2.5 border border-black rounded-lg">
                <strong>Tangga Umpan Balik (Ladder of Feedback):</strong>
                <ul className="list-disc pl-4 mt-1 text-neutral-600">
                  <li>Klarifikasi → Nilai → Perhatian → Saran → Apresiasi.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="neo-btn px-5 py-2 bg-neutral-900 text-white font-bold text-xs rounded-lg"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
