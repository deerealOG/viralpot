import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MagicTextArea } from '../components/MagicTextArea';
import { ShareButton } from '../components/ShareButton';
import { generateCampaign } from '../services/gemini';
import { toast } from '../services/toast';
import { User, CampaignResult, NavTab } from '../types';
import { Rocket, Sparkles, TrendingUp, Lock, Crown, ArrowRight } from 'lucide-react';

interface BusinessHubProps {
  user: User;
  onNavigate: (tab: NavTab) => void;
}

export const BusinessHub: React.FC<BusinessHubProps> = ({ user, onNavigate }) => {
  const [product, setProduct] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CampaignResult | null>(null);



  const handleGenerate = async () => {

    
    if(!product || !goal) return;

    setLoading(true);
    try {
        const data = await generateCampaign(product, goal);
        setResult(data);
        toast.success(`Strategy Generated!`);
    } catch(e) {
        toast.error('Error generating campaign');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] font-sans">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-12 grid lg:grid-cols-[400px_1fr] gap-8 h-full">
        
        {/* Left Pane: Configuration Studio */}
        <aside className="space-y-6">
          <div className="sticky top-8 space-y-6">
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="p-8 space-y-8">
                
                {/* Header */}
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest">
                    <Rocket size={12} className="animate-pulse" /> Viral Engine
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Business Hub
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                    Generate data-driven campaign strategies to scale your product or service.
                  </p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                        Product / Service <span className="text-amber-500">*</span>
                      </label>
                      <MagicTextArea 
                          placeholder="e.g. Summer Skincare Line for Gen Z..."
                          value={product}
                          onChange={(e) => setProduct(e.target.value)}
                          context="business"
                          className="min-h-[140px] bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-sm font-bold rounded-2xl focus:ring-4 focus:ring-amber-500/10 transition-all"
                          user={user}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                        Campaign Goal <span className="text-amber-500">*</span>
                      </label>
                      <MagicTextArea 
                          placeholder="e.g. Drive 500 sales through TikTok ads..."
                          value={goal}
                          onChange={(e) => setGoal(e.target.value)}
                          context="business"
                          className="min-h-[140px] bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-sm font-bold rounded-2xl focus:ring-4 focus:ring-amber-500/10 transition-all"
                          user={user}
                      />
                    </div>
                </div>

                <Button 
                  fullWidth 
                  onClick={handleGenerate} 
                  isLoading={loading} 
                  disabled={loading || !product || !goal}
                  className={`py-6 text-lg font-black shadow-lg rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-500/20`}
                >
                    <span className="flex items-center justify-center gap-2">
                      <Rocket size={20} /> LAUNCH CAMPAIGN
                    </span>
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Pane: Results Workspace */}
        <main className="flex-1 overflow-y-auto min-h-screen bg-slate-50 dark:bg-[#0B1120] relative custom-scrollbar rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
           {/* Background Decoration */}
           <div className="absolute top-0 left-0 w-full h-[600px] bg-linear-to-b from-amber-500/5 to-transparent pointer-events-none" />
           
           <div className="max-w-4xl mx-auto p-6 lg:p-12 space-y-12 relative z-10">
             {!result ? (
               <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 opacity-40">
                 <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-xl">
                   <TrendingUp className="w-12 h-12 text-amber-500" />
                 </div>
                 <div className="space-y-2 max-w-sm">
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Ready to Scale?</h3>
                   <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Define your product and goal to generate a comprehensive execution roadmap.</p>
                 </div>
               </div>
             ) : (
               <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                   
                   {/* Main Strategy Card */}
                   <div className="bg-white dark:bg-[#111827] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-8 md:p-12">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] -z-10" />
                     
                     <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
                         <div className="space-y-3">
                             <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-200 dark:border-amber-800">Campaign Strategy</span>
                             <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[0.95]">{result.campaignName}</h3>
                         </div>
                         <ShareButton title="Campaign Plan" text={`Campaign: ${result.campaignName}\nKPI: ${result.kpi}\nTarget: ${result.targetAudience}`} />
                     </div>
                     
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-4xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 group hover:border-amber-500/30 transition-all">
                            <span className="block font-black text-slate-400 text-[10px] uppercase tracking-widest mb-4">Target Audience</span>
                            <span className="text-slate-900 dark:text-white font-black text-xl leading-tight group-hover:text-amber-500 transition-colors">{result.targetAudience}</span>
                        </div>
                        <div className="p-8 rounded-4xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 group hover:border-amber-500/30 transition-all">
                            <span className="block font-black text-slate-400 text-[10px] uppercase tracking-widest mb-4">Primary KPI</span>
                            <span className="text-slate-900 dark:text-white font-black text-xl leading-tight group-hover:text-amber-500 transition-colors">{result.kpi}</span>
                        </div>
                     </div>
                   </div>

                   {/* Weekly Plan */}
                   <div className="space-y-8">
                       <div className="flex items-center gap-4 px-2">
                          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Execution Roadmap</h3>
                          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                       </div>
                       <div className="grid gap-6">
                          {result.weeklyPlan.map((day, idx) => (
                              <div key={idx} className="group relative flex flex-col md:flex-row items-start gap-6 p-8 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-4xl transition-all hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/5">
                                  <div className="shrink-0 w-16 h-16 bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex flex-col items-center justify-center font-black">
                                      <span className="text-[10px] uppercase opacity-60">Day</span>
                                      <span className="text-2xl leading-none">{day.day.replace(/\D/g,'') || (idx + 1)}</span>
                                  </div>
                                  <div className="space-y-3 flex-1">
                                      <div className="flex items-center gap-3">
                                         <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">{day.focus}</span>
                                      </div>
                                      <p className="text-slate-800 dark:text-slate-200 font-black text-xl leading-snug">{day.contentIdea}</p>
                                  </div>
                              </div>
                          ))}
                       </div>
                   </div>

               </div>
             )}
           </div>
        </main>
      </div>
    </div>
  );
};
