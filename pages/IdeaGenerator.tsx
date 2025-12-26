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
  TrendingUp
} from 'lucide-react';
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

    if (!canGenerate('idea')) {
      window.dispatchEvent(new CustomEvent('show-upgrade-modal', { 
        detail: { feature: 'unlimited ideas' } 
      }));
      return;
    }

    setLoading(true);
    setResult(null);
    setExpandedIndex(null);
    setFavorites([]);
    
    await incrementUsage('idea');

    // Smart Generation Logic V4
    setTimeout(() => {
      const toneData = TONES.find(t => t.id === selectedTone) || TONES[1];
      const goalData = GOALS.find(g => g.id === selectedGoal) || GOALS[0];
      
      const hooksByTone: Record<string, string[]> = {
        professional: [
          `The strategic framework for ${niche} that drives ROI.`,
          `Why most ${audience || 'professionals'} are failing at ${niche}.`,
          `Analysis: The future of ${niche} in 2025.`
        ],
        casual: [
          `My honest thoughts on ${niche}... 🤭`,
          `POV: You just mastered ${niche} as a ${audience || 'beginner'}.`,
          `How to do ${niche} without the burnout.`
        ],
        controversial: [
          `Stop listening to ${niche} "gurus". 🚩`,
          `${niche} is dead. Here's what's actually working.`,
          `Why I'm quitting ${niche} (and why you should too).`
        ],
        educational: [
          `Step-by-step: How I handle ${niche}.`,
          `The only ${niche} guide ${audience || 'you'} will ever need.`,
          `3 tools that will 10x your ${niche} results.`
        ]
      };

      const ctasByGoal: Record<string, string[]> = {
        engagement: [
          `Which one are you? Comment below! 👇`,
          `Tag a friend who needs to see this! 🏷️`,
          `Vote in my stories for the next topic!`
        ],
        sales: [
          `DM me '${niche.toUpperCase()}' to get started! 📩`,
          `Link in bio to join the ${niche} masterclass!`,
          `Limited spots open for ${niche} coaching. Apply now!`
        ],
        growth: [
          `Follow for daily ${niche} secrets! ✨`,
          `Save this for your next ${niche} session! 📌`,
          `Share this to your story if you agree!`
        ]
      };

      const whyWorksByGoal: Record<string, string> = {
        engagement: "Uses high-arousal emotion or relatable scenarios to trigger comments.",
        sales: "Creates a specific pain-point realization and provides a direct solution path.",
        growth: "Provides high-value 'saveable' content that builds authority and trust."
      };

      const selectedHooks = hooksByTone[selectedTone] || hooksByTone.casual;
      const selectedCtas = ctasByGoal[selectedGoal] || ctasByGoal.engagement;

      let generatedIdeas: IdeaDetail[] = [];

      // SPECIAL LOGIC: X Threads (Hyper-Descriptive)
      if (selectedPlatform === 'x' && selectedPostType === 'thread') {
        generatedIdeas = [
          {
            title: `How ${audience || 'you'} can transform your ${niche} results by shifting to a 2025-first framework.`,
            blueprint: {
              hook: `If you're still using 2024 tactics for ${niche}, you're already behind. Here's the 5-step pivot ${audience || 'for creators'} (🧵)`,
              body: `1/5: The ${niche} market has shifted. Here's the data...\n2/5: Stop focusing on [Common Mistake] and start [New Strategy].\n3/5: Real-world example: How I applied this to [Scenario].\n4/5: The exact tools you need for this ${niche} transition.\n5/5: Final takeaway for ${audience || 'your team'}.`,
              cta: `I'm helping ${audience || 'my followers'} scale their ${niche} this month. RT to help another creator! 🔁`
            },
            viral_score: 98,
            why_it_works: `Explicitly targets the fear of being outdated in ${niche}, which triggers high bookmark and RT rates from ${audience || 'your specific audience'}.`
          }
        ];
      } 
      // SPECIAL LOGIC: Instagram Carousel (Hyper-Descriptive)
      else if (selectedPlatform === 'instagram' && selectedPostType === 'carousel') {
        generatedIdeas = [
          {
            title: `The 3 ${niche} secrets ${audience || 'successful people'} never tell you about scaling.`,
            blueprint: {
              hook: `Slide 1: ${selectedHooks[1].replace('${niche}', niche)} (Stop scrolling if you want to master ${niche})`,
              body: `Slide 2: The struggle of ${audience || 'most people'} in ${niche} today.\nSlide 3: Secret #1: The [Specific Concept] shift.\nSlide 4: Secret #2: Why [Specific Tool] is your best friend.\nSlide 5: Step-by-step roadmap for ${audience || 'you'}.`,
              cta: `Check the link in bio for a deep dive into ${niche}! 📌`
            },
            viral_score: 94,
            why_it_works: `Combines "Insider Secrets" curiosity with a clear roadmap for ${audience || 'beginners'}, optimizing for saves and shares.`
          }
        ];
      }
      // ZERO-THINKING VIDEO LOGIC (Reels/TikTok/Shorts)
      else if (['reel', 'video', 'short', 'story'].includes(selectedPostType)) {
         generatedIdeas = [
          {
            title: `POV: You finally stopped overcomplicating ${niche}.`,
            blueprint: {
              hook: `(0:00-0:03) Visual: You drinking coffee, looking unbothered. Text Overlay: 'When you realize ${niche} is actually simple...'`,
              body: `(0:03-0:08) Audio/Script: "Stop trying to do everything. Just focus on one thing."\n(0:08-0:15) Visual: Quick cuts of you working/showing results. Script: "The moment I simplified my workflow for ${audience || 'clients'}, everything scaled."`,
              cta: `Caption: Comment 'SIMPLE' and I'll send you my workflow! 👇`
            },
            viral_score: 96,
            why_it_works: "Low-effort, high-relatability visual hook that stops the scroll immediately."
          },
          {
            title: `The 'Green Screen' Rant: Why ${niche} is broken.`,
            blueprint: {
              hook: `(0:00-0:05) Visual: Green screen background of a trending ${niche} news article or chart. Script: "Does anyone else see what's happening in ${niche} right now?"`,
              body: `(0:05-0:20) Script: "Everyone is telling you to X, but look at this data. The real production hack is actually Y. ${audience || 'Beginners'} are getting crushed because they ignore this."`,
              cta: `Caption: Are you seeing this too? Let's argue in the comments. 🗣️`
            },
            viral_score: 92,
            why_it_works: "Controversial opinion backed by 'proof' (green screen) drives massive comment engagement."
          }
        ];
      }
      // DEFAULT GENERATION (Hyper-Descriptive)
      else {
        generatedIdeas = [
          {
            title: `The mid-2025 ${niche} survival guide: How ${audience || 'you'} can navigate the new algorithm saturation.`,
            blueprint: {
              hook: `${selectedHooks[0].replace('${niche}', niche)} This isn't just about ${niche}, it's about staying relevant.`,
              body: `Step 1: Audit your current ${niche} assets. Step 2: Identify where ${audience || 'your people'} are dropping off. Step 3: Implement the [New Strategy] technique.`,
              cta: selectedCtas[0]
            },
            viral_score: 92 + Math.floor(Math.random() * 7),
            why_it_works: `Addresses the problem of market saturation specifically for ${audience || 'those in the ' + niche + ' space'}.`
          },
          {
            title: `Why ${audience || 'the traditional ' + niche + ' world'} is about to be disrupted by [Emerging Trend].`,
            blueprint: {
              hook: `${selectedHooks[1].replace('${niche}', niche)} The status quo in ${niche} is failing ${audience || 'us'}.`,
              body: `Analysis: The rise of [Trend] and how it impacts ${niche}. Action: How ${audience || 'you'} can adapt before and during the shift.`,
              cta: selectedCtas[1]
            },
            viral_score: 85 + Math.floor(Math.random() * 10),
            why_it_works: `Leverages a "${selectedTone}" tone to create a sense of urgency and authority around ${niche} for ${audience || 'your followers'}.`
          }
        ];
      }

      setResult({
        ideas: generatedIdeas,
        overall_strategy: {
          bestTime: selectedPlatform === 'linkedin' ? "8:30 AM" : "7:00 PM",
          postingTips: [
            `Post on ${selectedPlatform} with trending assets matched to a '${selectedTone}' vibe`,
            `The ${selectedTone} tone works best when you show a "behind the scenes" look`,
            `For ${selectedGoal} goals, reply to every comment in the first 60 mins`
          ],
          visualAdvice: `Use high-contrast text overlays. Since you're targeting ${audience || 'a broad audience'}, keep visuals clean and professional.`
        },
        platform: selectedPlatform,
        postType: selectedPostType,
        tone: selectedTone,
        goal: selectedGoal
      });
      setLoading(false);
    }, 1500);
  };

  const currentPlatformInfo = PLATFORMS.find(p => p.id === selectedPlatform);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 dark:bg-[#0B1120] overflow-hidden">
      
      {/* Left Pane: Configuration Studio */}
      <aside className="w-full lg:w-[480px] bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-20 shadow-2xl">
        <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={12} /> Viral Engine V5
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Idea Studio
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Generate high-retention concepts for your next viral hit.
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
                     {isSelected && <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent" />}
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
      </aside>

      {/* Right Pane: Results Workspace */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0B1120] relative custom-scrollbar">
         {/* Background Decoration */}
         <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
         
         <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-12 relative z-10">
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
  );
}

