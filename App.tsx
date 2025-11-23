import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import CodeEditor from './components/CodeEditor';
import Preview from './components/Preview';
import PromptBar from './components/PromptBar';
import { ViewMode, GenerationState } from './types';
import { generateWebsiteStream } from './services/geminiService';
import { GenerateContentResponse } from '@google/genai';

const INITIAL_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
    </style>
</head>
<body class="bg-slate-50 min-h-screen flex items-center justify-center font-sans text-slate-800">
    <div class="text-center p-8 max-w-lg">
        <div class="mb-6 inline-block p-4 bg-white rounded-2xl shadow-xl animate-[float_3s_ease-in-out_infinite]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-7z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
            </svg>
        </div>
        <h1 class="text-3xl font-bold mb-3 tracking-tight">Ready to Build</h1>
        <p class="text-slate-500 mb-8 leading-relaxed">Enter a prompt below to generate a new website using AI. You can edit the code directly or iterate with more prompts.</p>
        <div class="inline-flex gap-2 text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <span>Powered by Gemini 2.5 Flash</span>
        </div>
    </div>
</body>
</html>`;

function App() {
  const [code, setCode] = useState<string>(INITIAL_CODE);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
  const [genState, setGenState] = useState<GenerationState>({ isGenerating: false, error: null });
  const [hasCopied, setHasCopied] = useState(false);

  // Handle window resize to switch to code view on mobile automatically
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && viewMode === ViewMode.SPLIT) {
        setViewMode(ViewMode.PREVIEW);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const handlePromptSubmit = async (prompt: string) => {
    setGenState({ isGenerating: true, error: null });
    
    // Clear code if it's a completely new request (optional logic, kept simple here to append/modify)
    // If we want a fresh start every time: setCode(''); 
    // But context-aware modification is better.
    
    // Temporary buffer to accumulate stream
    let accumulatedCode = '';
    // If we are modifying, we keep the previous code as context in the service, 
    // but the output will be the NEW full file. So we reset the display code to empty 
    // to show the streaming effect clearly.
    setCode('<!-- Generating... -->'); 

    try {
      const stream = await generateWebsiteStream(prompt, code === INITIAL_CODE ? undefined : code);
      
      let isFirstChunk = true;
      
      for await (const chunk of stream) {
        const text = (chunk as GenerateContentResponse).text;
        if (text) {
          if (isFirstChunk) {
            accumulatedCode = text;
            isFirstChunk = false;
          } else {
            accumulatedCode += text;
          }
          // Remove potential markdown blocks if the model slips up
          const cleanCode = accumulatedCode.replace(/```html/g, '').replace(/```/g, '');
          setCode(cleanCode);
        }
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setGenState({ isGenerating: false, error: "Failed to generate website. Please check your API key or try again." });
      setCode(INITIAL_CODE); // Revert on error
    } finally {
      setGenState({ isGenerating: false, error: null });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    });
  }, [code]);

  const handleShare = () => {
    // Simple share implementation - copies a data URI or just the code
    // Since we don't have a backend to host, we can't share a permanent link.
    // We will simulate a share action by copying a message.
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank'); 
    alert("Opened in a new tab. To share, save this file (Export) and send it!");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Header 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        onDownload={handleDownload}
        onShare={handleShare}
        onOpenNewTab={handleOpenNewTab}
        onCopy={handleCopy}
        hasCopied={hasCopied}
      />

      <main className="flex-1 flex overflow-hidden relative">
        {/* Code Editor Panel */}
        <div 
          className={`transition-all duration-300 ease-in-out ${
            viewMode === ViewMode.SPLIT ? 'w-1/2 border-r border-slate-200' : 
            viewMode === ViewMode.CODE ? 'w-full' : 'w-0 hidden'
          }`}
        >
          <CodeEditor 
            code={code} 
            onChange={setCode} 
            readOnly={genState.isGenerating}
          />
        </div>

        {/* Preview Panel */}
        <div 
          className={`transition-all duration-300 ease-in-out bg-white ${
            viewMode === ViewMode.SPLIT ? 'w-1/2' : 
            viewMode === ViewMode.PREVIEW ? 'w-full' : 'w-0 hidden'
          }`}
        >
          <Preview code={code} isLoading={genState.isGenerating} />
        </div>
      </main>

      {/* Prompt Bar (Fixed at bottom) */}
      <div className="z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <PromptBar onSubmit={handlePromptSubmit} isGenerating={genState.isGenerating} />
        {genState.error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 text-xs text-center border-t border-red-100">
                {genState.error}
            </div>
        )}
      </div>
    </div>
  );
}

export default App;