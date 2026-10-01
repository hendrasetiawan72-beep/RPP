import { Printer, Download, FileSpreadsheet, Wand2, BookOpen, Settings, School, FileText, Table } from 'lucide-react';
import { SchoolIdentity } from '../types';

interface HeaderNavProps {
  identity: SchoolIdentity;
  onOpenIdentityModal: () => void;
  onOpenAiRefineModal: () => void;
  onOpenGuidelineModal: () => void;
  onDownloadCpTemplate: (type?: 'kejuruan' | 'umum' | 'blank') => void;
  onDownloadRppTemplate: (type?: 'kejuruan' | 'umum' | 'blank') => void;
  onExportAtp: () => void;
  onExportRpp: () => void;
  documentMode: 'atp_only' | 'modul_selected' | 'lampiran_selected' | 'modul_all' | 'both_separate';
  setDocumentMode: (mode: 'atp_only' | 'modul_selected' | 'lampiran_selected' | 'modul_all' | 'both_separate') => void;
  onOpenRppEditor?: () => void;
  onOpenExcelGuideModal?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  identity,
  onOpenIdentityModal,
  onOpenAiRefineModal,
  onOpenGuidelineModal,
  onDownloadCpTemplate,
  onDownloadRppTemplate,
  onExportAtp,
  onExportRpp,
  documentMode,
  setDocumentMode,
  onOpenRppEditor,
  onOpenExcelGuideModal,
}) => {
  const handlePrint = (mode?: 'atp_only' | 'modul_selected' | 'lampiran_selected' | 'modul_all' | 'both_separate') => {
    if (mode && mode !== documentMode) {
      setDocumentMode(mode);
      setTimeout(() => {
        window.print();
      }, 300);
    } else {
      window.print();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF7] border-b-[3px] border-black px-4 sm:px-6 py-3 shadow-[0_4px_0_0_#000] no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] shrink-0 overflow-hidden">
              <img
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgzWdtCjCcX2chJuhLX_26N5MmkVK-1SkyO7kgXznQQJPQa6_TB_EJzD1WWpztg7yX9RBRE7rGn0t2Z3FdG06mwwT6pQix8t6vnlcOBm_EgGl9z0jeJemJkppP0KIIjkXGksQvaCLh2dz-gOF6a2H213VQBL6Am8Elhmd76OOnphogk-EoTTbkYbg0TQJhv/s512/34690.png"
                alt="Logo SMK Muhammadiyah Bawang"
                className="w-8 h-8 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-lg md:text-xl tracking-tight text-neutral-900 leading-none">
                  SMK Muhammadiyah Bawang
                </span>
                <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border border-black shadow-[1px_1px_0px_#000] ${
                  identity.kategoriMapel === 'umum' ? 'bg-blue-300 text-black' : 'bg-emerald-400 text-black'
                }`}>
                  {identity.kategoriMapel === 'umum' ? 'Mapel Umum' : 'Kejuruan'}
                </span>
              </div>
              <p className="text-xs font-semibold text-neutral-600 mt-0.5">
                ATP & RPP Deep Learning Terpisah per Materi · Batang, Jawa Tengah
              </p>
            </div>
          </div>

          <button
            onClick={onOpenIdentityModal}
            className="md:hidden p-2 rounded-lg bg-amber-100 border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-bold"
            title="Edit Identitas"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={onOpenGuidelineModal}
            className="neo-btn px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-black rounded-lg text-xs font-bold flex items-center gap-1.5"
            title="Panduan Regulasi Kurikulum Merdeka & Deep Learning"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-700" />
            <span>Regulasi</span>
          </button>

          <div className="relative group">
            <button
              onClick={() => onDownloadRppTemplate(identity.kategoriMapel === 'umum' ? 'umum' : 'kejuruan')}
              className="neo-btn px-2.5 py-1.5 bg-emerald-200 hover:bg-emerald-300 text-black rounded-lg text-xs font-bold flex items-center gap-1.5"
              title="Unduh Template Excel RPP Terintegrasi (Semua Kolom)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-900" />
              <span>Template RPP (.xlsx)</span>
            </button>
          </div>

          <div className="relative group">
            <button
              onClick={() => onDownloadCpTemplate(identity.kategoriMapel === 'umum' ? 'umum' : 'kejuruan')}
              className="neo-btn px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-black rounded-lg text-xs font-bold flex items-center gap-1.5"
              title="Unduh Template Excel CP Dasar"
            >
              <Download className="w-3.5 h-3.5 text-amber-800" />
              <span>Template ATP (.xlsx)</span>
            </button>
          </div>

          <button
            onClick={onExportAtp}
            className="neo-btn px-2.5 py-1.5 bg-blue-100 hover:bg-blue-200 text-black rounded-lg text-xs font-bold flex items-center gap-1.5"
            title="Ekspor matriks ATP ke spreadsheet Excel"
          >
            <Table className="w-3.5 h-3.5 text-blue-700" />
            <span>Ekspor ATP</span>
          </button>

          <button
            onClick={onExportRpp}
            className="neo-btn px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-black rounded-lg text-xs font-bold flex items-center gap-1.5"
            title="Ekspor seluruh RPP Deep Learning ke spreadsheet Excel terintegrasi"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Ekspor RPP</span>
          </button>

          <button
            onClick={onOpenIdentityModal}
            className="neo-btn px-3 py-1.5 bg-violet-100 hover:bg-violet-200 text-black rounded-lg text-xs font-bold flex items-center gap-1.5"
            title="Atur Guru, NIP, Kepala Sekolah, dan Mapel"
          >
            <School className="w-3.5 h-3.5 text-violet-700" />
            <span>Identitas</span>
          </button>

          {onOpenRppEditor && (
            <button
              onClick={onOpenRppEditor}
              className="neo-btn px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black rounded-lg text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
              title="Buka Editor Tabel, Kolom RPP, dan Lampiran Embed"
            >
              <Table className="w-3.5 h-3.5 text-black" />
              <span>Editor RPP</span>
            </button>
          )}

          <button
            onClick={onOpenAiRefineModal}
            className="neo-btn px-3 py-1.5 bg-rose-200 hover:bg-rose-300 text-black rounded-lg text-xs font-bold flex items-center gap-1.5"
            title="Kustomisasi & Perkaya dengan AI"
          >
            <Wand2 className="w-3.5 h-3.5 text-rose-700" />
            <span>AI Refiner</span>
          </button>

          {onOpenExcelGuideModal && (
            <button
              onClick={onOpenExcelGuideModal}
              className="neo-btn px-3 py-1.5 bg-emerald-200 hover:bg-emerald-300 text-black rounded-lg text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
              title="Panduan Skema Excel & Generator Prompt AI (CP ➔ ATP ➔ RPP)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-800" />
              <span>Panduan Excel & AI</span>
            </button>
          )}

          {/* Quick Print Dropdown / Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePrint()}
              className="neo-btn px-3.5 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-black rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[3px_3px_0px_#000]"
              title="Cetak Dokumen yang Sedang Tampil (Format F4 Landscape)"
            >
              <Printer className="w-4 h-4" />
              <span>
                {documentMode === 'atp_only'
                  ? 'Cetak ATP'
                  : documentMode === 'modul_selected'
                  ? 'Cetak RPP Ini'
                  : documentMode === 'lampiran_selected'
                  ? 'Cetak Lampiran'
                  : 'Cetak Dokumen'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
