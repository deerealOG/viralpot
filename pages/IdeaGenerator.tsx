import React, { useState } from 'react';
import { User, NavTab, IdeaResult, Platform, PostType, IdeaDetail } from '../types';
import { 
  Sparkles, 
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
  Target,
  Zap,
  ChevronDown,
  ChevronUp,
  Heart,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Brain,
  Rocket,
  Download
} from 'lucide-react';
import ExportButton from '../components/ExportButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface IdeaGeneratorProps {
  user: User;
  updateUser: (user: User) => Promise<void>;
  onNavigate: (tab: NavTab) => void;
}

const PLATFORMS: { id: Platform; label: string; icon: any; color: string }[] = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'from-purple-500 via-pink-500 to-orange-500' },
  { id: 'tiktok', label: 'TikTok', icon: Music2, color: 'from-gray-900 via-gray-800 to-gray-700' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'from-red-600 to-red-500' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'from-blue-700 to-blue-600' },
  { id: 'x', label: 'X / Twitter', icon: Twitter, color: 'from-slate-900 to-slate-800' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'from-blue-600 to-blue-500' },
];

const POST_TYPES: Record<Platform, { id: PostType; label: string; icon: any }[]> = {
  instagram: [
    { id: 'reel', label: 'Reel', icon: Video },
    { id: 'carousel', label: 'Carousel', icon: Layers },
    { id: 'post', label: 'Post', icon: Layout },
    { id: 'story', label: 'Story', icon: Clock },
  ],
  tiktok: [
    { id: 'video', label: 'Video', icon: Video },
    { id: 'story', label: 'Story', icon: Clock },
  ],
  youtube: [
    { id: 'short', label: 'Short', icon: Video },
    { id: 'video', label: 'Video', icon: Youtube },
  ],
  linkedin: [
    { id: 'post', label: 'Post', icon: MessageSquare },
    { id: 'article', label: 'Article', icon: FileText },
  ],
  x: [
    { id: 'thread', label: 'Thread', icon: Layers },
    { id: 'post', label: 'Post', icon: MessageSquare },
  ],
  facebook: [
    { id: 'post', label: 'Post', icon: MessageSquare },
    { id: 'reel', label: 'Reel', icon: Video },
  ],
};

const TONES = [
  { id: 'professional', label: 'Professional', icon: ShieldCheck },
  { id: 'casual', label: 'Casual & Fun', icon: Sparkles },
  { id: 'controversial', label: 'Viral / Bold', icon: Zap },
  { id: 'educational', label: 'Educational', icon: FileText },
];

const GOALS = [
  { id: 'engagement', label: 'Max Engagement', icon: Heart },
  { id: 'sales', label: 'Drive Sales', icon: Target },
  { id: 'growth', label: 'Follower Growth', icon: TrendingUp },
];

export function IdeaGenerator({ user, updateUser, onNavigate }: IdeaGeneratorProps) {
  const { canGenerate, incrementUsage } = useAuth();
  const [niche, setNiche] = useState(user.niche || '');
  const [audience, setAudience] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram');
  const [selectedPostType, setSelectedPostType] = useState<PostType>('reel');
  const [selectedTone, setSelectedTone] = useState('casual');
  const [selectedGoal, setSelectedGoal] = useState('engagement');
  const [selectedFramework, setSelectedFramework] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IdeaResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (index: number) => {
    setFavorites(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handlePlatformChange = (platform: Platform) => {
    setSelectedPlatform(platform);
    setSelectedPostType(POST_TYPES[platform][0].id);
    setResult(null); // Clear result for continuity
  };

  const handleGenerate = async () => {
    if (!niche.trim()) return; // Prevent empty generation

    setLoading(true);
    setResult(null);
    setExpandedIndex(null);
    setFavorites([]);
    
    await incrementUsage('idea');

    try {
      // Import and call the real AI generation function
      const { generateIdeas } = await import('../services/gemini');
      const result = await generateIdeas(
        niche,
        selectedTone,
        selectedPlatform,
        selectedPostType,
        audience,
        selectedGoal,
        selectedFramework,
        user.subscription !== 'free'
      );
      
      // Map the API response to our expected format
      setResult({
        ideas: result.ideas || [],
        overall_strategy: result.overall_strategy || {
          bestTime: selectedPlatform === 'linkedin' ? "8:30 AM" : "7:00 PM",
          postingTips: [
            `Post on ${selectedPlatform} with trending assets matched to a '${selectedTone}' vibe`,
            `The ${selectedTone} tone works best when you show a "behind the scenes" look`,
            `For ${selectedGoal} goals, reply to every comment in the first 60 mins`
          ],
          visualAdvice: `Use high-contrast text overlays for ${audience || 'your audience'}.`
        },
        platform: selectedPlatform,
        postType: selectedPostType,
        tone: selectedTone,
        goal: selectedGoal
      });
    } catch (error: any) {
      console.error('AI Generation error:', error);
      // Show error toast
      window.dispatchEvent(new CustomEvent('show-toast', { 
        detail: { 
          message: error.message || 'Failed to generate ideas. Please try again.', 
          type: 'error' 
        } 
      }));
    } finally {
      setLoading(false);
    }
  };

  const currentPlatformInfo = PLATFORMS.find(p => p.id === selectedPlatform);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] font-sans">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-12 grid lg:grid-cols-[400px_1fr] gap-8 h-full">
        
        {/* Left Pane: Configuration Studio */}
        <aside className="space-y-6">
          <div className="sticky top-8 space-y-6">
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="p-8 space-y-6">
          
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={12} className="animate-pulse" /> Viral Engine V5
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Idea Generator
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
              Generate high-retention content ideas powered by Viral Engine V5 scoring.
            </p>
          </div>

          <div className="space-y-1">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Platform</label>
             <div className="grid grid-cols-3 gap-3">
               {PLATFORMS.map((platform) => {
                 const Icon = platform.icon;
                 const isSelected = selectedPlatform === platform.id;
                 return (
                   <button
                     key={platform.id}
                     onClick={() => handlePlatformChange(platform.id)}
                     className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 overflow-hidden ${
                       isSelected 
                         ? 'bg-slate-900 dark:bg-slate-800 border-slate-900 dark:border-slate-700 text-white shadow-xl' 
                         : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-orange-500/50 hover:bg-white dark:hover:bg-slate-800'
                     }`}
                   >
                     {isSelected && <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-transparent" />}
                     <Icon size={24} className={`relative z-10 mb-2 ${isSelected ? 'text-orange-500' : 'group-hover:text-orange-500 transition-colors'}`} />
                     <span className="relative z-10 text-[10px] font-black uppercase tracking-tight">{platform.label.split(' ')[0]}</span>
                   </button>
                 );
               })}
             </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Format</label>
              <div className="flex flex-wrap gap-2">
                 {POST_TYPES[selectedPlatform].map((type) => {
                   const isSelected = selectedPostType === type.id;
                   return (
                     <button
                       key={type.id}
                       onClick={() => setSelectedPostType(type.id)}
                       className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                         isSelected 
                           ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' 
                           : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-orange-300'
                       }`}
                     >
                       <type.icon size={14} />
                       {type.label}
                     </button>
                   );
                 })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tone</label>
                 <select 
                   value={selectedTone}
                   onChange={(e) => setSelectedTone(e.target.value)}
                   className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                 >
                   {TONES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                 </select>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Goal</label>
                 <select 
                   value={selectedGoal}
                   onChange={(e) => setSelectedGoal(e.target.value)}
                   className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                 >
                   {GOALS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                 </select>
               </div>
            </div>

            {/* Advanced Frameworks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pl-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Brain size={12} className="text-orange-500" /> Advanced Frameworks
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'standard', label: 'Standard', icon: Rocket },
                  { id: 'aida', label: 'AIDA', icon: Target },
                  { id: 'pas', label: 'PAS', icon: ShieldCheck },
                  { id: 'story', label: 'Story', icon: Sparkles },
                ].map((fw) => (
                  <button
                    key={fw.id}
                    onClick={() => setSelectedFramework(fw.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-tight transition-all ${
                      selectedFramework === fw.id 
                        ? 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-orange-200'
                    }`}
                  >
                    <fw.icon size={12} />
                    {fw.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                  Topic / Niche <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g. AI Marketing, Vegan Fitness..."
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Audience</label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Busy Founders, New Moms..."
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
           <button
             onClick={handleGenerate}
             disabled={loading || !niche}
             className="relative group w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-lg shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:shadow-none transition-all overflow-hidden"
           >
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
             <span className="relative flex items-center justify-center gap-2">
               {loading ? (
                 <><Loader2 className="animate-spin" size={20} /> Generating Insights...</>
               ) : (
                 <><Zap size={20} className="fill-white" /> IGNITE IDEAS</>
               )}
             </span>
           </button>
        </div>
            </div>
          </div>
        </aside>

      {/* Right Pane: Results Workspace */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-slate-50 dark:bg-[#0B1120] relative custom-scrollbar">
         {/* Background Decoration */}
         <div className="absolute top-0 left-0 w-full h-[500px] bg-linear-to-b from-orange-500/5 to-transparent pointer-events-none" />
         
         <div className="max-w-4xl mx-auto p-6 lg:p-12 space-y-12 relative z-10">
           {!result ? (
             <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 opacity-40">
               <div className="w-24 h-24 rounded-3xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                 <Layout size={40} className="text-slate-400 dark:text-slate-600" />
               </div>
               <div className="space-y-2 max-w-sm">
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ready to Brainstorm?</h3>
                 <p className="text-slate-500">Configure your parameters on the left and hit "Ignite" to generate rigorous content frameworks.</p>
               </div>
             </div>
           ) : (
             <AnimatePresence mode="wait">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="space-y-10"
               >
                 {/* Header */}
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <span className="px-3 py-1 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-black uppercase tracking-widest border border-orange-200 dark:border-orange-800">
                       {result.ideas.length} Concepts Generated
                     </span>
                     <span className="text-slate-400 text-sm">
                       for <strong className="text-slate-700 dark:text-slate-200">{niche}</strong>
                     </span>
                   </div>
                 </div>

                 {/* Idea Cards */}
                 <div className="grid gap-6">
                   {result.ideas.map((idea, index) => (
                     <motion.div
                       key={index}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: index * 0.1 }}
                       className={`group bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300 ${expandedIndex === index ? 'ring-2 ring-orange-500/50' : 'hover:border-orange-500/30'}`}
                     >
                        <div className="p-6 md:p-8 flex items-start gap-6 relative">
                          <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-lg text-slate-500 border border-slate-200 dark:border-slate-700 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-colors duration-300">
                            {index + 1}
                          </div>
                          
                          <div className="flex-1 space-y-3">
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1">
                                   <Zap size={10} className="fill-current" /> Viral Score: {idea.viral_score}%
                                </span>
                             </div>
                             <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                               {idea.title}
                             </h3>
                          </div>

                          <div className="flex flex-col gap-2">
                            <button 
                               onClick={() => toggleFavorite(index)}
                               className={`p-2.5 rounded-xl border transition-all ${
                                 favorites.includes(index) 
                                   ? 'bg-red-50 dark:bg-red-900/20 border-red-200 text-red-500' 
                                   : 'bg-transparent border-transparent text-slate-300 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                               }`}
                            >
                               <Heart size={20} fill={favorites.includes(index) ? 'currentColor' : 'none'} />
                            </button>
                            <button 
                               onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                               className={`p-2.5 rounded-xl border transition-all ${
                                 expandedIndex === index 
                                   ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 text-orange-500' 
                                   : 'bg-transparent border-slate-100 dark:border-slate-800 text-slate-300 hover:text-orange-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                               }`}
                            >
                               {expandedIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedIndex === index && (
                             <motion.div
                               initial={{ height: 0, opacity: 0 }}
                               animate={{ height: 'auto', opacity: 1 }}
                               exit={{ height: 0, opacity: 0 }}
                               className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30"
                             >
                                <div className="p-6 md:p-8 space-y-6">
                                   <div className="grid gap-6">
                                      <div className="space-y-2">
                                         <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hook</span>
                                            <button onClick={() => handleCopy(idea.blueprint.hook, 100+index)} className="text-slate-400 hover:text-orange-500 transition-colors">
                                               {copiedIndex === 100+index ? <Check size={14} /> : <Copy size={14} />}
                                            </button>
                                         </div>
                                         <p className="text-sm font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm leading-relaxed">
                                            {idea.blueprint.hook}
                                         </p>
                                      </div>
                                      
                                      <div className="space-y-2">
                                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Content</span>
                                         <div className="text-sm font-medium text-slate-600 dark:text-slate-300 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-transparent leading-relaxed whitespace-pre-wrap">
                                            {idea.blueprint.body}
                                         </div>
                                      </div>

                                      <div className="space-y-2">
                                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Call to Action</span>
                                         <div className="inline-block px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold border border-green-200 dark:border-green-800">
                                            {idea.blueprint.cta}
                                         </div>
                                      </div>
                                   </div>

                                   <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30">
                                      <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-800/50 text-orange-600">
                                         <TrendingUp size={16} />
                                      </div>
                                      <div>
                                         <p className="text-[10px] font-bold text-orange-800 dark:text-orange-300 uppercase opacity-70">Why it works</p>
                                         <p className="text-xs font-medium text-orange-900 dark:text-orange-200 italic">"{idea.why_it_works}"</p>
                                      </div>
                                   </div>
                                </div>
                             </motion.div>
                          )}
                        </AnimatePresence>
                     </motion.div>
                   ))}
                 </div>
                 
                 {/* Strategy Footer */}
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 dark:bg-black rounded-3xl p-8 text-white relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-orange-500/30 transition-all" />
                       <p className="relative z-10 text-[10px] font-black text-orange-400 uppercase tracking-widest mb-4">Posting Window</p>
                       <div className="relative z-10 text-4xl font-black mb-2">{result.overall_strategy.bestTime}</div>
                       <p className="relative z-10 text-sm text-slate-400 font-medium">Optimal engagement time for {niche}</p>
                    </div>

                    <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Growth Tactics</p>
                       <ul className="space-y-3">
                          {result.overall_strategy.postingTips.map((tip, i) => (
                             <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                                {tip}
                             </li>
                          ))}
                       </ul>
                    </div>
                 </div>

               </motion.div>
             </AnimatePresence>
           )}
         </div>
      </main>
      </div>
    </div>
  );
}

