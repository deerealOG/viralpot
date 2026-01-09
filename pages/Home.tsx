import React from 'react';
import { User, NavTab } from '../types';
import { Lightbulb, PenTool, BarChart, Zap, Crown, ArrowRight, Sparkles } from 'lucide-react';

interface HomeProps {
  user: User;
  onNavigate: (tab: NavTab) => void;
  onLogout: () => void;
}

export function Home({ user, onNavigate, onLogout }: HomeProps) {
  // Primary actions - Generators (shown first, side-by-side)
  const generators = [
    {
      id: 'idea',
      title: 'Idea Generator',
      description: 'Generate high-retention viral content ideas powered by Viral Engine V5',
      icon: Lightbulb,
      color: 'from-orange-500 to-amber-500',
      bgGlow: 'bg-orange-500',
      nav: 'idea' as NavTab
    },
    {
      id: 'caption',
      title: 'Caption Generator',
      description: 'Create high-engagement AI-optimized captions powered by Viral Engine V5',
      icon: PenTool,
      color: 'from-pink-500 to-rose-500',
      bgGlow: 'bg-pink-500',
      nav: 'caption' as NavTab
    }
  ];

  return (
    <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back, {user.name?.split(' ')[0] || 'Creator'}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Ready to create something viral today?
          </p>
        </div>
      </div>


      {/* PRIMARY: Generators Side-by-Side (Don't Make Me Think) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {generators.map((gen) => (
          <div 
            key={gen.id}
            onClick={() => onNavigate(gen.nav)}
            className="group relative p-8 rounded-3xl bg-white dark:bg-[#1f2937] border border-slate-200 dark:border-slate-800 hover:border-transparent transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl"
          >
            {/* Glow effect on hover */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 ${gen.bgGlow} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500 rounded-full`} />
            
            {/* Gradient Border on Hover */}
            <div className={`absolute inset-0 bg-linear-to-br ${gen.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            <div className={`absolute bottom-0 left-0 h-1.5 w-full bg-linear-to-r ${gen.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
            
            <div className="relative z-10">
              <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${gen.color} flex items-center justify-center text-white shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <gen.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {gen.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {gen.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                <Sparkles size={16} className="text-orange-500" />
                <span>Start Creating</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

         <div className="p-6 rounded-2xl bg-white dark:bg-[#1f2937] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <Lightbulb size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ideas Generated</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">0</h3>
              </div>
            </div>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1f2937] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <PenTool size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Captions Created</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">0</h3>
              </div>
            </div>
        </div>
      </div>

      {/* Quick Access: Analytics */}


      {/* Daily Tips Section */}
      <div className="p-8 rounded-3xl bg-linear-to-br from-indigo-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
           <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
             <Lightbulb size={32} className="text-yellow-400" />
           </div>
           <div>
             <h3 className="text-xl font-bold mb-2">Tip of the Day</h3>
             <p className="text-slate-300 max-w-2xl leading-relaxed font-medium">
               Use the generators to batch-create content for the whole week. Generate multiple ideas at once, 
               pick your favorites, and schedule them for consistent growth!
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}

