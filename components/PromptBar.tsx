import React, { useState, KeyboardEvent } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

interface PromptBarProps {
  onSubmit: (prompt: string) => void;
  isGenerating: boolean;
}

const PromptBar: React.FC<PromptBarProps> = ({ onSubmit, isGenerating }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim() || isGenerating) return;
    onSubmit(input);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white p-4">
      <div className="max-w-4xl mx-auto relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your website... (e.g., 'A modern landing page for a coffee shop with a hero section and menu grid')"
          className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-800 text-sm shadow-sm transition-all focus:bg-white custom-scrollbar h-[56px] focus:h-[100px]"
          disabled={isGenerating}
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isGenerating}
          className={`absolute right-3 bottom-3 p-1.5 rounded-lg transition-colors ${
            input.trim() && !isGenerating
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
      <div className="max-w-4xl mx-auto mt-2 flex gap-2 overflow-x-auto pb-2">
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap px-1 py-1">Try:</span>
        <button onClick={() => onSubmit("A minimalistic personal portfolio with a dark theme")} className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600 transition-colors whitespace-nowrap border border-slate-200">Portfolio</button>
        <button onClick={() => onSubmit("A responsive pricing table with 3 tiers")} className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600 transition-colors whitespace-nowrap border border-slate-200">Pricing Table</button>
        <button onClick={() => onSubmit("A login page with glassmorphism effect")} className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600 transition-colors whitespace-nowrap border border-slate-200">Login Form</button>
      </div>
    </div>
  );
};

export default PromptBar;