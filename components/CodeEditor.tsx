import React, { useRef, useEffect, useState, useMemo } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, readOnly = false }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [highlightedCode, setHighlightedCode] = useState('');

  // Declare Prism globally to avoid TS errors since it's loaded via CDN
  const Prism = (window as any).Prism;

  // Effect to handle highlighting
  useEffect(() => {
    if (Prism && code) {
      // Highlight using Prism's HTML grammar
      // We wrap the result in spans to prevent hydration mismatches if we were SSR, 
      // but here it ensures clean updates.
      const html = Prism.highlight(code, Prism.languages.html, 'html');
      setHighlightedCode(html);
    } else {
      // Fallback if Prism isn't loaded yet
      setHighlightedCode(code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
    }
  }, [code, Prism]);

  // Synchronize scrolling between textarea, pre (highlight layer), and line numbers
  const handleScroll = () => {
    if (textareaRef.current && preRef.current && lineNumbersRef.current) {
      const { scrollTop, scrollLeft } = textareaRef.current;
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
      lineNumbersRef.current.scrollTop = scrollTop;
    }
  };

  // Generate line numbers
  const lineCount = useMemo(() => code.split('\n').length, [code]);
  const lineNumbers = useMemo(() => Array.from({ length: lineCount }, (_, i) => i + 1), [lineCount]);

  // Handle Tab key to insert spaces
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert 2 spaces
      const spaces = '  ';
      const newCode = code.substring(0, start) + spaces + code.substring(end);
      
      onChange(newCode);

      // Restore cursor position (React state update is async, so we need to wait slightly or use layout effect, 
      // but setting selectionRange immediately after onChange usually works in controlled inputs if value is consistent)
      setTimeout(() => {
        if (textareaRef.current) {
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + spaces.length;
        }
      }, 0);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#0f172a] border-r border-slate-800">
      {/* File Header */}
      <div className="flex-none px-4 py-2 bg-[#1e293b] border-b border-slate-700 text-xs font-mono flex justify-between items-center text-slate-400 select-none">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          index.html
        </span>
        <span className="text-slate-500">HTML5 • Tailwind</span>
      </div>

      {/* Editor Container */}
      <div className="relative flex-1 flex overflow-hidden">
        
        {/* Line Numbers Gutter */}
        <div 
          ref={lineNumbersRef}
          className="flex-none w-12 bg-[#0f172a] text-slate-600 text-right pr-3 pt-4 editor-font select-none overflow-hidden border-r border-slate-800"
          aria-hidden="true"
        >
          {lineNumbers.map(num => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Code Area */}
        <div className="relative flex-1 overflow-hidden h-full bg-[#0f172a]">
          
          {/* Syntax Highlight Layer (Background) */}
          <pre 
            ref={preRef}
            aria-hidden="true"
            className="absolute inset-0 m-0 p-4 pointer-events-none editor-font overflow-hidden whitespace-pre custom-scrollbar text-left"
            style={{ color: '#e2e8f0' }} // Slate-200 base color
          >
            {/* We add a break at the end to ensure the last empty line is rendered correctly if needed */}
            <code dangerouslySetInnerHTML={{ __html: highlightedCode + '<br/>' }} />
          </pre>

          {/* Input Layer (Foreground) */}
          <textarea
            ref={textareaRef}
            className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white resize-none border-none focus:outline-none editor-font overflow-auto whitespace-pre custom-scrollbar"
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            disabled={readOnly}
            placeholder="<!-- Start coding... -->"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;