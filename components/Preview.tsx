import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface PreviewProps {
  code: string;
  isLoading?: boolean;
}

const Preview: React.FC<PreviewProps> = ({ code, isLoading }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      // Direct assignment to srcdoc is fast and secure for this use case
      iframeRef.current.srcdoc = code;
    }
  }, [code]);

  return (
    <div className="h-full w-full bg-white relative">
      <div className="absolute top-0 left-0 right-0 h-8 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
        </div>
        <div className="mx-auto w-1/2 h-5 bg-white border border-slate-200 rounded text-[10px] text-slate-400 flex items-center justify-center font-sans">
          preview.local
        </div>
      </div>
      
      <div className="pt-8 h-full relative">
        {(!code && !isLoading) ? (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm flex-col gap-2">
                <p>Ready to build.</p>
                <p className="text-xs text-slate-300">Enter a prompt below to start.</p>
            </div>
        ) : (
             <iframe
                ref={iframeRef}
                title="Website Preview"
                className="w-full h-full border-none bg-white"
                sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
            />
        )}
       
        {isLoading && (
          <div className="absolute top-12 right-4 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg animate-fade-in">
            <Loader2 size={12} className="animate-spin" />
            <span>Generating...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;