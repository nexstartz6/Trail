import React from 'react';
import { 
  Monitor, 
  Code, 
  Columns, 
  Download, 
  Share2, 
  ExternalLink,
  Clipboard,
  Check
} from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onDownload: () => void;
  onShare: () => void;
  onOpenNewTab: () => void;
  onCopy: () => void;
  hasCopied: boolean;
}

const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  onDownload,
  onShare,
  onOpenNewTab,
  onCopy,
  hasCopied
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          G
        </div>
        <h1 className="text-lg font-semibold text-slate-800 tracking-tight">GenWeb <span className="text-slate-400 font-normal">Builder</span></h1>
      </div>

      <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
        <button
          onClick={() => setViewMode(ViewMode.CODE)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            viewMode === ViewMode.CODE ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Code size={14} />
            <span>Code</span>
          </div>
        </button>
        <button
          onClick={() => setViewMode(ViewMode.SPLIT)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            viewMode === ViewMode.SPLIT ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Columns size={14} />
            <span>Split</span>
          </div>
        </button>
        <button
          onClick={() => setViewMode(ViewMode.PREVIEW)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            viewMode === ViewMode.PREVIEW ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Monitor size={14} />
            <span>Preview</span>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-2">
         <button
          onClick={onCopy}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors group relative"
          title="Copy Code"
        >
          {hasCopied ? <Check size={18} className="text-green-600" /> : <Clipboard size={18} />}
        </button>

        <button
          onClick={onOpenNewTab}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Open in New Tab"
        >
          <ExternalLink size={18} />
        </button>
        
        <button
          onClick={onShare}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Share Link"
        >
          <Share2 size={18} />
        </button>

        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </header>
  );
};

export default Header;