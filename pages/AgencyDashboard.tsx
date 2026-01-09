
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { MagicTextArea } from '../components/MagicTextArea';
import { ShareButton } from '../components/ShareButton';
import { generateAudit } from '../services/gemini';

import { toast } from '../services/toast';
import { User, AuditResult } from '../types';

interface AgencyDashboardProps {
  user: User;
  updateUser: (user: User) => Promise<void>;
}

export const AgencyDashboard: React.FC<AgencyDashboardProps> = ({ user, updateUser }) => {
  const [clientNiche, setClientNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);


  const handleAudit = async () => {
      if(!clientNiche) return;

      // Credit Check
      // Credits removed - app is now free

      setLoading(true);
      try {
          const data = await generateAudit(clientNiche);
          setResult(data);

          // No credit deduction - app is free
      } catch(e) {
          toast.error('Error generating audit');
      } finally {
          setLoading(false);
      }
  };



  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 dark:bg-[#0B1120] overflow-hidden">
      
      {/* Left Pane: Configuration Studio */}
      <aside className="w-full lg:w-[480px] bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-20 shadow-2xl">
        <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-[10px] font-black uppercase tracking-widest">
              <span className="text-lg">⚡</span> Agency Mode
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Client Audit Hub
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Win pitches with instant, data-driven competitor analysis.
            </p>
          </div>

          <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                  Client Niche / Industry <span className="text-teal-500">*</span>
                </label>
                <MagicTextArea 
                    placeholder="e.g. Luxury Real Estate in Miami..."
                    value={clientNiche}
                    onChange={(e) => setClientNiche(e.target.value)}
                    context="agency"
                    className="min-h-[120px] bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-sm font-bold"
                    user={user}
                />
              </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
           <Button 
             fullWidth 
             onClick={handleAudit} 
             isLoading={loading} 
             disabled={!clientNiche}
             className="py-4 text-lg font-black bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-500/20"
           >
             RUN AUDIT
           </Button>
        </div>
      </aside>

      {/* Right Pane: Results Workspace */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0B1120] relative custom-scrollbar">
         {/* Background Decoration */}
         <div className="absolute top-0 left-0 w-full h-[500px] bg-linear-to-b from-teal-500/5 to-transparent pointer-events-none" />
         
         <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-12 relative z-10">
           {!result ? (
             <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 opacity-40">
               <div className="w-24 h-24 rounded-3xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                 <span className="text-4xl text-slate-400 dark:text-slate-600">📊</span>
               </div>
               <div className="space-y-2 max-w-sm">
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ready to Audit?</h3>
                 <p className="text-slate-500">Enter a client niche on the left to generate a comprehensive strategy audit.</p>
               </div>
             </div>
           ) : (
             <div className="space-y-8 animate-fade-in-up">
                 
                 {/* Competitor Analysis Card */}
                 <Card className="bg-slate-900 text-white border-slate-800 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-3xl -mr-16 -mt-16 rounded-full" />
                    <div className="relative z-10 p-2">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-1 block">Strategic Insight</span>
                                <h3 className="text-2xl font-bold text-white">Competitor Analysis</h3>
                            </div>
                            <ShareButton title={`Audit for ${clientNiche}`} text={`Competitor Analysis: ${result.competitorAnalysis}`} className="bg-white/10 text-white hover:bg-white/20" />
                        </div>
                        <p className="text-slate-300 leading-relaxed text-lg font-medium">{result.competitorAnalysis}</p>
                    </div>
                 </Card>

                 <div className="grid md:grid-cols-2 gap-6">
                    <Card title="⚠️ Content Gaps" className="border-l-4 border-l-red-500">
                        <ul className="space-y-4 mt-2">
                            {result.contentGaps.map((gap, i) => (
                                <li key={i} className="flex items-start gap-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                                    <div className="mt-0.5 min-w-[20px] h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">✗</div>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{gap}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <Card title="✅ Recommended Support" className="border-l-4 border-l-teal-500">
                        <ul className="space-y-4 mt-2">
                            {result.recommendedPillars.map((pillar, i) => (
                                <li key={i} className="flex items-start gap-4 p-3 rounded-xl bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30">
                                    <div className="mt-0.5 min-w-[20px] h-5 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs font-bold">✓</div>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{pillar}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                 </div>
             </div>
           )}
         </div>
      </main>
    </div>
  );
};
