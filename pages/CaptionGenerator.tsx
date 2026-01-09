import React, { useState, useEffect } from 'react';
import { User, NavTab, CaptionResult, Platform, PostType } from '../types';
import { 
  PenTool, 
  Loader2, 
  Copy, 
  Check, 
  Instagram, 
  Youtube, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Music2, 
  Video, 
  Layers, 
  FileText, 
  Layout,
  MessageSquare,
  Clock,
  ArrowRight,
  Zap,
  Target,
  Sparkles,
  RotateCcw,
  TrendingUp,
  ShieldCheck,
  Hash,
  Type,
  Smile,
  Settings2,
  Save,
  Trash2,
  ChevronRight,
  Smartphone,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ExportButton from '../components/ExportButton';

interface CaptionGeneratorProps {
  user: User;
  updateUser: (user: User) => Promise<void>;
  onNavigate: (tab: NavTab) => void;
}

const PLATFORMS: { id: Platform; label: string; icon: any; color: string }[] = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'from-indigo-600 to-indigo-500' },
  { id: 'tiktok', label: 'TikTok', icon: Music2, color: 'from-slate-900 to-slate-800' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'from-blue-800 to-blue-700' },
  { id: 'x', label: 'X / Twitter', icon: Twitter, color: 'from-slate-950 to-slate-900' },
];

const POST_TYPES: Record<Platform, { id: PostType; label: string; icon: any }[]> = {
  instagram: [
    { id: 'reel', label: 'Reel', icon: Video },
    { id: 'carousel', label: 'Carousel', icon: Layers },
    { id: 'post', label: 'Post', icon: Layout },
  ],
  tiktok: [
    { id: 'video', label: 'Video', icon: Video },
    { id: 'story', label: 'Story', icon: Clock },
  ],
  linkedin: [
    { id: 'post', label: 'Post', icon: MessageSquare },
    { id: 'article', label: 'Article', icon: FileText },
  ],
  x: [
    { id: 'thread', label: 'Thread', icon: Layers },
    { id: 'post', label: 'Post', icon: MessageSquare },
  ],
  youtube: [],
  facebook: []
};

const TONES = [
  { id: 'professional', label: 'Professional', icon: ShieldCheck },
  { id: 'casual', label: 'Casual', icon: Sparkles },
  { id: 'bold', label: 'Bold / Viral', icon: Zap },
  { id: 'educational', label: 'Educational', icon: FileText },
];

export function CaptionGenerator({ user, updateUser, onNavigate }: CaptionGeneratorProps) {
  const { canGenerate, incrementUsage } = useAuth();
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram');
  const [selectedPostType, setSelectedPostType] = useState<PostType>('reel');
  const [selectedTone, setSelectedTone] = useState('casual');
  const [lengthPref, setLengthPref] = useState<'short' | 'long'>('long');
  const [emojiPref, setEmojiPref] = useState<'expressive' | 'minimal'>('expressive');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CaptionResult | null>(null);
  const [editableCaptions, setEditableCaptions] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (result) {
      setEditableCaptions(result.captions);
    }
  }, [result]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const updateCaption = (index: number, value: string) => {
    const newCaptions = [...editableCaptions];
    newCaptions[index] = value;
    setEditableCaptions(newCaptions);
  };

  const [rewritingIndex, setRewritingIndex] = useState<number | null>(null);

  const handleRewrite = async (index: number) => {
    setRewritingIndex(index);
    try {
      const { rewriteViral } = await import('../services/gemini');
      const optimized = await rewriteViral(editableCaptions[index], true);
      updateCaption(index, optimized);
      window.dispatchEvent(new CustomEvent('show-toast', { 
        detail: { message: 'Caption virally optimized!', type: 'success' } 
      }));
    } catch (error) {
      console.error('Rewrite error:', error);
    } finally {
      setRewritingIndex(null);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setResult(null);
    
    await incrementUsage('caption');
    
    try {
      // Import and call the real AI generation function
      const { generateCaptions } = await import('../services/gemini');
      const result = await generateCaptions(
        topic,
        selectedTone,
        selectedPlatform,
        selectedPostType,
        audience,
        [],
        user.subscription !== 'free'
      );
      
      setResult({
        captions: result.captions || [],
        hashtags: result.hashtags || [],
        overall_strategy: (result as any).strategy || (result as any).overall_strategy || {
          bestTime: selectedPlatform === 'linkedin' ? "8:45 AM" : "7:15 PM",
          postingTips: [`Use the '${selectedTone}' tone consistently`, `Engage with comments in first hour`],
          visualAdvice: `Visuals for ${selectedPostType} should be high-contrast and branded.`
        },
        platform: selectedPlatform,
        tone: selectedTone,
        goal: 'engagement'
      });
    } catch (error: any) {
      console.error('Caption generation error:', error);
      window.dispatchEvent(new CustomEvent('show-toast', { 
        detail: { 
          message: error.message || 'Failed to generate captions. Please try again.', 
          type: 'error' 
        } 
      }));
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
              <div className="p-8 space-y-6">
                
                {/* Standardized Header */}
                <div className="space-y-3 pb-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                    <Sparkles size={12} className="animate-pulse" /> Viral Engine V5
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Caption Generator
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                    Create high-engagement AI-optimized captions powered by Viral Engine V5.
                  </p>
                </div>
                {/* Platform Selection */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Smartphone size={14} className="text-indigo-500" /> Platform & Format
                  </label>
                  <div className="flex gap-2">
                    {PLATFORMS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPlatform(p.id)}
                        className={`p-3 rounded-xl border transition-all ${
                          selectedPlatform === p.id 
                            ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                        }`}
                      >
                        <p.icon size={18} />
                      </button>
                    ))}
                  </div>
                  <select 
                    value={selectedPostType}
                    onChange={(e) => setSelectedPostType(e.target.value as PostType)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold outline-none ring-offset-0 focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                  >
                    {POST_TYPES[selectedPlatform].map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>

                {/* Writing Inputs */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Hash size={14} className="text-indigo-500" /> Main Topic
                    </label>
                    <input 
                      type="text" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="What is this post about?"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold placeholder:text-slate-400 outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Target size={14} className="text-indigo-500" /> Target Audience
                    </label>
                    <input 
                      type="text" 
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      placeholder="Who is this for?"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold placeholder:text-slate-400 outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Tone & Style Controls */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Length</p>
                        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                           <button onClick={() => setLengthPref('short')} className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${lengthPref === 'short' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>PUNCHY</button>
                           <button onClick={() => setLengthPref('long')} className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${lengthPref === 'long' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>DETAILLIED</button>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Emojis</p>
                        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                           <button onClick={() => setEmojiPref('minimal')} className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${emojiPref === 'minimal' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>MINIMAL</button>
                           <button onClick={() => setEmojiPref('expressive')} className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${emojiPref === 'expressive' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>LIVE</button>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tone of Voice</p>
                    <div className="grid grid-cols-2 gap-2">
                       {TONES.map(t => (
                         <button
                           key={t.id}
                           onClick={() => setSelectedTone(t.id)}
                           className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[10px] font-black uppercase transition-all ${
                             selectedTone === t.id 
                               ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                               : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-400'
                           }`}
                         >
                           <t.icon size={12} />
                           {t.label}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading || !topic.trim()}
                  className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Zap size={18} fill="currentColor" />
                      Generate Drafts
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Pane: Writing Workspace */}
        <main className="space-y-6">
          <div className="flex items-center justify-between px-4 py-2">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 animate-pulse">
                   <Type size={24} />
                </div>
                <div>
                   <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Draft Workspace</h1>
                   <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Refine, edit, and export your professional copy.</p>
                </div>
             </div>
             {result && (
               <div className="flex items-center gap-3">
                  <ExportButton 
                    content={editableCaptions} 
                    filename={`captions_${topic.toLowerCase().replace(/\s+/g, '_')}`} 
                    user={user} 
                  />
                  <span className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={12} className="text-indigo-500" /> Score: 98%
                  </span>
               </div>
             )}
          </div>

          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-[600px] border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 space-y-6"
              >
                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-700">
                  <PenTool size={48} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-400 dark:text-slate-600">Workspace Empty</h3>
                  <p className="text-slate-400 dark:text-slate-700 font-medium max-w-sm mx-auto">Configure your post and click 'Generate Drafts' to start writing.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-6 pb-20"
              >
                {editableCaptions.map((caption, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white dark:bg-[#1e293b] rounded-4xl shadow-xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                       <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-lg ring-4 ring-indigo-500/10">
                            {index + 1}
                          </span>
                          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Variation {index + 1}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleRewrite(index)} 
                            disabled={rewritingIndex === index}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                              rewritingIndex === index 
                                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 text-orange-500'
                                : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-orange-500 hover:border-orange-500/30'
                            }`}
                          >
                             {rewritingIndex === index ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} className="fill-current" />}
                             <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Viral Rewrite</span>
                          </button>
                          <button onClick={() => handleCopy(caption, index)} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors">
                             {copiedIndex === index ? <Check size={18} /> : <Copy size={18} />}
                          </button>
                          <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                    <div className="p-8">
                       <textarea 
                         value={caption}
                         onChange={(e) => updateCaption(index, e.target.value)}
                         className="w-full min-h-[200px] bg-transparent text-slate-700 dark:text-slate-300 font-medium leading-relaxed resize-none outline-none focus:ring-4 focus:ring-indigo-500/5 p-4 rounded-2xl transition-all"
                       />
                       
                       {/* Context Chips */}
                       <div className="mt-8 flex flex-wrap gap-2">
                          <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                             Audience: {audience || 'General'}
                          </span>
                          <span className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-[10px] font-black text-indigo-500 uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/50">
                             Tone: {selectedTone}
                          </span>
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/50">
                             Goal: Engagement
                          </span>
                       </div>
                    </div>
                  </motion.div>
                ))}

                {/* Strategy Footer */}
                <div className="grid md:grid-cols-3 gap-6">
                   <div className="md:col-span-2 bg-indigo-600 rounded-4xl p-8 text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32 rounded-full group-hover:bg-white/20 transition-all duration-700" />
                      <div className="relative z-10 space-y-6">
                         <div className="flex items-center gap-3">
                            <Settings2 size={24} className="text-indigo-200" />
                            <h3 className="font-black text-xl tracking-tight uppercase">Master Copy Strategy</h3>
                         </div>
                         <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Ideal Posting Hour</p>
                               <p className="text-3xl font-black text-white">{result.overall_strategy.bestTime}</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Visual Direction</p>
                               <p className="text-sm font-bold leading-snug text-indigo-50">{result.overall_strategy.visualAdvice}</p>
                            </div>
                         </div>
                         <div className="pt-4 border-t border-white/10 flex gap-6">
                            {result.overall_strategy.postingTips.map((tip, i) => (
                              <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tight text-indigo-100">
                                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
                                 {tip}
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="bg-white dark:bg-[#1e293b] rounded-4xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                      <div className="flex items-center gap-3">
                         <Hash size={24} className="text-indigo-500" />
                         <h3 className="font-black text-xl tracking-tight uppercase dark:text-white">Smart Tags</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {result.hashtags.map((tag, i) => (
                           <span key={i} className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 text-xs font-black border border-slate-200 dark:border-slate-800">
                             {tag}
                           </span>
                         ))}
                      </div>
                      <button className="w-full py-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 text-slate-400 hover:text-indigo-500 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest">
                         <Copy size={16} /> Copy All Tags
                      </button>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

