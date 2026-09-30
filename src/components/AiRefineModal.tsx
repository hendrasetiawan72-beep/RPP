import React, { useState } from 'react';
import { X, Sparkles, Wand2, Check, RefreshCw } from 'lucide-react';
import { ModulAjarData, SchoolIdentity } from '../types';

interface AiRefineModalProps {
  isOpen: boolean;
  onClose: () => void;
  modulAjar: ModulAjarData;
  identity: SchoolIdentity;
  onApplyEnrichment: (enrichedModul: ModulAjarData) => void;
}

export const AiRefineModal: React.FC<AiRefineModalProps> = ({
  isOpen,
  onClose,
  modulAjar,
  identity,
  onApplyEnrichment,
}) => {
  const [instruction, setInstruction] = useState('');
  const [targetPillar, setTargetPillar] = useState<'all' | 'mindful' | 'meaningful' | 'joyful' | 'asesmen'>('all');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleApplyQuickEnhancement = (type: 'batang_industry' | 'gamification' | 'mindfulness_safety' | 'differentiated') => {
    setIsProcessing(true);
    setTimeout(() => {
      const updated = JSON.parse(JSON.stringify(modulAjar)) as ModulAjarData;

      if (type === 'batang_industry') {
        updated.komponenInti.deepLearningApproach.meaningfulLearning.koneksiIndustri = [
          'Kunjungan dan studi kasus lapangan di Kawasan Industri Terpadu Batang (KITB) dan PLTU Batang.',
          'Penerapan standar operasional bengkel/lab mitra resmi SMK Muhammadiyah Bawang di wilayah Batang dan Pekalongan.',
          'Penyesuaian spesifikasi produk dengan standar vendor industri manufaktur dan teknologi terdekat.',
        ];
        updated.komponenInti.pemahamanBermakna.push(
          'Keterampilan ini merupakan kebutuhan prioritas tenaga kerja di zona industri Kabupaten Batang dan koridor Jawa Tengah.'
        );
      } else if (type === 'gamification') {
        updated.komponenInti.deepLearningApproach.joyfulLearning.metodeInteraktif = [
          'Troubleshooting Speedrun: Simulasi kompetisi kelompok memecahkan teka-teki gangguan teknis tercepat.',
          'Sistem Badging: Siswa mengumpulkan badge "Master Presisi", "Safety Champion", dan "Best Collaborator".',
          'Pameran mini (Gallery Walk) dengan stiker apresiasi bintang dari rekan sekelas.',
        ];
      } else if (type === 'mindfulness_safety') {
        updated.komponenInti.deepLearningApproach.mindfulLearning.aktivitas = [
          'Mindful Check-in: Berdoa dan visualisasi langkah kerja aman sebelum menyentuh trainer/mesin.',
          'Safety Pause: 30 detik berhenti sejenak di tengah praktik untuk mengevaluasi posisi tubuh dan kelengkapan APD.',
          'Refleksi jurnal harian fokus nalar kritis terhadap keputusan teknis yang diambil.',
        ];
      } else if (type === 'differentiated') {
        updated.komponenInti.pengayaanRemedial.pengayaan = [
          'Proyek Mandiri Tantangan Industri: Siswa merancang optimasi sistem dengan efisiensi daya/waktu 15% lebih cepat.',
          'Penugasan peran sebagai Kepala Regu / Instruktur Sebaya (Peer Instructor) di meja kerja praktik.',
        ];
        updated.komponenInti.pengayaanRemedial.remedial = [
          'Pemecahan langkah kerja menjadi kartu panduan bergambar (Visual Cue Cards) untuk kemudahan memori.',
          'Praktik pendampingan intensif satu-lawan-satu dengan fokus pada 1 indikator esensial.',
        ];
      }

      onApplyEnrichment(updated);
      setIsProcessing(false);
      onClose();
    }, 400);
  };

  const handleCustomInstructionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      const updated = JSON.parse(JSON.stringify(modulAjar)) as ModulAjarData;

      // Inject custom instruction contextually
      if (targetPillar === 'mindful' || targetPillar === 'all') {
        updated.komponenInti.deepLearningApproach.mindfulLearning.aktivitas.unshift(
          `Fokus Penyesuaian: ${instruction} (Dilatihkan melalui kesadaran kritis siswa).`
        );
      }
      if (targetPillar === 'meaningful' || targetPillar === 'all') {
        updated.komponenInti.deepLearningApproach.meaningfulLearning.koneksiIndustri.unshift(
          `Konteks Khusus: Mengintegrasikan ${instruction} dengan kebutuhan nyata di industri.`
        );
      }
      if (targetPillar === 'joyful' || targetPillar === 'all') {
        updated.komponenInti.deepLearningApproach.joyfulLearning.metodeInteraktif.unshift(
          `Aktivitas Menyenangkan: Eksplorasi interaktif berbasis ${instruction}.`
        );
      }

      onApplyEnrichment(updated);
      setIsProcessing(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div className="bg-[#FFFDF7] neo-box-lg max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-100 hover:bg-rose-100 border-2 border-black"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b-2 border-black">
          <div className="w-9 h-9 rounded-xl bg-rose-400 border-2 border-black flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-neutral-900">
              AI Refiner & Pedagogical Enricher
            </h3>
            <p className="text-xs text-neutral-600">
              Pengayaan Cerdas Modul Ajar Deep Learning SMK Muhammadiyah Bawang
            </p>
          </div>
        </div>

        {/* Preset Enrichments */}
        <div className="space-y-3 mb-5">
          <label className="text-xs font-black uppercase tracking-wider text-neutral-700 block">
            Pilihan Modifikasi Cepat (1-Klik):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleApplyQuickEnhancement('batang_industry')}
              className="neo-btn p-3 bg-white hover:bg-amber-100 text-left rounded-xl border-2 border-black"
              disabled={isProcessing}
            >
              <div className="font-extrabold text-neutral-900 text-xs">
                Konteks Industri Batang & KITB
              </div>
              <p className="text-[10px] text-neutral-600 mt-0.5">
                Koneksikan proyek ke industri terpadu Batang dan PLTU.
              </p>
            </button>

            <button
              onClick={() => handleApplyQuickEnhancement('gamification')}
              className="neo-btn p-3 bg-white hover:bg-rose-100 text-left rounded-xl border-2 border-black"
              disabled={isProcessing}
            >
              <div className="font-extrabold text-neutral-900 text-xs">
                Gamifikasi Joyful Learning
              </div>
              <p className="text-[10px] text-neutral-600 mt-0.5">
                Tambahkan speedrun troubleshooting, badging, dan tantangan tim.
              </p>
            </button>

            <button
              onClick={() => handleApplyQuickEnhancement('mindfulness_safety')}
              className="neo-btn p-3 bg-white hover:bg-teal-100 text-left rounded-xl border-2 border-black"
              disabled={isProcessing}
            >
              <div className="font-extrabold text-neutral-900 text-xs">
                Penguatan Safety & Mindful
              </div>
              <p className="text-[10px] text-neutral-600 mt-0.5">
                Integrasikan meditasi keselamatan kerja dan check-in emosi.
              </p>
            </button>

            <button
              onClick={() => handleApplyQuickEnhancement('differentiated')}
              className="neo-btn p-3 bg-white hover:bg-emerald-100 text-left rounded-xl border-2 border-black"
              disabled={isProcessing}
            >
              <div className="font-extrabold text-neutral-900 text-xs">
                Diferensiasi Pembelajaran
              </div>
              <p className="text-[10px] text-neutral-600 mt-0.5">
                Pertegas scaffolding remedial dan tantangan pengayaan industri.
              </p>
            </button>
          </div>
        </div>

        {/* Custom Prompt Form */}
        <form onSubmit={handleCustomInstructionSubmit} className="pt-4 border-t-2 border-black space-y-3">
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-neutral-700 block mb-1">
              Instruksi Kustom Tambahan:
            </label>
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Contoh: Tambahkan penekanan pada penggunaan alat uji digital terbaru dan proyek pembuatan portofolio siswa..."
              className="w-full p-2.5 border-2 border-black rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-800 block mb-1">
              Fokus Bagian Modul:
            </label>
            <select
              value={targetPillar}
              onChange={(e) => setTargetPillar(e.target.value as any)}
              className="w-full px-3 py-2 border-2 border-black rounded-lg text-xs bg-white"
            >
              <option value="all">Semua Pilar (Mindful, Meaningful, Joyful)</option>
              <option value="mindful">Pilar Mindful Learning (Kognitif & Kesadaran)</option>
              <option value="meaningful">Pilar Meaningful Learning (Koneksi Industri)</option>
              <option value="joyful">Pilar Joyful Learning (Interaktif & Antusiasme)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="neo-btn px-4 py-2 bg-neutral-200 text-black text-xs font-bold rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isProcessing || !instruction.trim()}
              className="neo-btn px-5 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black rounded-lg flex items-center gap-1.5 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Terapkan Pengayaan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
