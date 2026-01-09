import React from 'react';
import { Download, FileText, FileCode, Table, FileJson, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface ExportButtonProps {
  content: any;
  filename: string;
  user: User;
}

const ExportButton: React.FC<ExportButtonProps> = ({ content, filename, user }) => {
  const isPro = user.subscription !== 'free';

  const downloadFile = (data: string, type: string, extension: string) => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAsTxt = () => {
    let text = "";
    if (typeof content === 'string') {
      text = content;
    } else if (Array.isArray(content)) {
      text = content.join('\n\n---\n\n');
    } else if (content.ideas) {
      text = content.ideas.map((i: any, idx: number) => 
        `# ${idx + 1}. ${i.title}\n\nHook: ${i.blueprint?.hook}\nBody: ${i.blueprint?.body}\nCTA: ${i.blueprint?.cta}\n\nViral Score: ${i.viral_score}%\nWhy it works: ${i.why_it_works}`
      ).join('\n\n' + '='.repeat(40) + '\n\n');
    } else {
      text = JSON.stringify(content, null, 2);
    }
    downloadFile(text, 'text/plain', 'txt');
  };

  const exportAsCsv = () => {
    let csv = "";
    if (Array.isArray(content)) {
      csv = "Content\n" + content.map(c => `"${c.replace(/"/g, '""')}"`).join('\n');
    } else if (content.ideas) {
      csv = "Title,Hook,Body,CTA,Score\n" + content.ideas.map((i: any) => 
        `"${i.title}","${i.blueprint?.hook}","${i.blueprint?.body}","${i.blueprint?.cta}",${i.viral_score}`
      ).join('\n');
    }
    downloadFile(csv, 'text/csv', 'csv');
  };

  const exportAsJson = () => {
    downloadFile(JSON.stringify(content, null, 2), 'application/json', 'json');
  };

  const handleExport = (format: 'txt' | 'csv' | 'json') => {
    if (!isPro) {
      window.dispatchEvent(new CustomEvent('show-toast', { 
        detail: { message: 'Exporting is a Pro feature. Please upgrade!', type: 'info' } 
      }));
      return;
    }

    switch (format) {
      case 'txt': exportAsTxt(); break;
      case 'csv': exportAsCsv(); break;
      case 'json': exportAsJson(); break;
    }

    window.dispatchEvent(new CustomEvent('show-toast', { 
      detail: { message: `Exported as ${format.toUpperCase()}`, type: 'success' } 
    }));
  };

  return (
    <div className="relative group">
      <button 
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
          isPro 
            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700' 
            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-indigo-500/30'
        }`}
      >
        <Download size={18} />
        <span className="text-sm font-bold">Export</span>
        {!isPro && <ShieldCheck size={14} className="text-indigo-500" />}
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50 p-2 space-y-1">
        <button onClick={() => handleExport('txt')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-xs font-bold whitespace-nowrap">
          <FileText size={16} className="text-blue-500" /> Export as .TXT
        </button>
        <button onClick={() => handleExport('csv')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-xs font-bold whitespace-nowrap">
          <Table size={16} className="text-emerald-500" /> Export as .CSV
        </button>
        <button onClick={() => handleExport('json')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-xs font-bold whitespace-nowrap">
          <FileJson size={16} className="text-orange-500" /> Export as .JSON
        </button>
        {!isPro && (
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-center">
            <p className="text-[10px] text-slate-400 font-bold px-2">Upgrade to Pro for more formats like PDF & CSV</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportButton;
