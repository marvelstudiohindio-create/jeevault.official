import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Download,
  ExternalLink,
  FileText,
  Sparkles,
  AlertCircle,
  Maximize2,
} from 'lucide-react';

export const PdfViewerModal: React.FC = () => {
  const { activePdf, setActivePdf } = useApp();
  const [iframeError, setIframeError] = useState(false);

  if (!activePdf) return null;

  const formattedSize = activePdf.fileSizeBytes
    ? `${(activePdf.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
    : 'Document';

  return (
    <div
      id="pdf-viewer-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl h-[92vh] rounded-3xl bg-[#0d0f22] border-2 border-indigo-700/50 shadow-2xl flex flex-col overflow-hidden text-white">
        {/* PDF Top Navigation Bar */}
        <div className="px-5 py-3.5 bg-[#131631] border-b border-indigo-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-purple-600/20 text-fuchsia-300 border border-purple-500/30 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md">
                  {activePdf.title}
                </h3>
                {activePdf.isProOnly && (
                  <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> PRO
                  </span>
                )}
              </div>
              <span className="text-[11px] text-purple-300/80 truncate block">
                {activePdf.subject} • {activePdf.chapter} • {activePdf.examCategory} • {activePdf.levelOrYear}
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Open in new tab */}
            <a
              href={activePdf.fileUrl}
              target="_blank"
              rel="noreferrer"
              id="pdf-btn-open-external"
              className="p-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/40 text-cyan-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Open full PDF in new tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Open Tab</span>
            </a>

            {/* Download Link */}
            <a
              href={activePdf.fileUrl}
              download={`${activePdf.title}.pdf`}
              target="_blank"
              rel="noreferrer"
              id="pdf-btn-download"
              className="p-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/40 text-emerald-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </a>

            {/* Close */}
            <button
              onClick={() => setActivePdf(null)}
              id="pdf-btn-close"
              className="p-2 rounded-xl bg-indigo-950/80 hover:bg-red-950/60 hover:text-red-400 border border-indigo-700/40 text-slate-400 transition-colors cursor-pointer"
              title="Close PDF"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Document Canvas View: Renders the genuine uploaded PDF */}
        <div className="flex-1 w-full h-full bg-slate-950 relative overflow-hidden flex flex-col">
          {iframeError ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 mb-4">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Direct Preview Restricted</h4>
              <p className="text-xs text-slate-400 mb-6">
                This PDF is hosted on a remote server that may require direct browser opening or download.
              </p>
              <div className="flex gap-3">
                <a
                  href={activePdf.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-lg"
                >
                  Open in New Tab
                </a>
                <a
                  href={activePdf.fileUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-indigo-950 border border-indigo-700 text-slate-200 text-xs font-semibold"
                >
                  Download File
                </a>
              </div>
            </div>
          ) : (
            <iframe
              src={`${activePdf.fileUrl}#toolbar=1&navpanes=0`}
              title={activePdf.title}
              className="w-full h-full border-0 bg-slate-900"
              onError={() => setIframeError(true)}
            />
          )}
        </div>

        {/* PDF Bottom Details Footer */}
        <div className="px-5 py-2.5 bg-[#131631] border-t border-indigo-900/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-purple-300">
              {activePdf.pageCount} {activePdf.pageCount === 1 ? 'Page' : 'Pages'}
            </span>
            <span>•</span>
            <span>{formattedSize}</span>
            {activePdf.description && (
              <>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline truncate max-w-sm text-slate-400">
                  {activePdf.description}
                </span>
              </>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            Source: {activePdf.fileUrl.startsWith('http') ? 'Cloud Vault' : 'Uploaded File'}
          </div>
        </div>
      </div>
    </div>
  );
};
