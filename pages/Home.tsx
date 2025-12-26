import React from 'react';
import { User, NavTab } from '../types';
import { Lightbulb, PenTool, BarChart, Zap, Crown } from 'lucide-react';
import { Card } from '../components/Card'; // Assuming Card exists based on file list, or I will use simple div
// Actually Card.tsx exists in components. I should probably check it but I'll write a defensive import or just standard div if I'm not sure of its API. 
// Let's assume standard div structure for stability first, or check Card.tsx.
// I'll stick to standard tailwind classes to be safe and fast, unless I want to view Card.tsx first. 
// Given the user wants "Rich Aesthetics", I will make it look good.

interface HomeProps {
  user: User;
  onNavigate: (tab: NavTab) => void;
  onLogout: () => void;
}

export function Home({ user, onNavigate, onLogout }: HomeProps) {
  const features = [
    {
      id: 'idea',
      title: 'Idea Generator',
      description: 'Generate viral content ideas tailored to your niche using AI.',
      icon: Lightbulb,
      color: 'from-yellow-400 to-orange-500',
      nav: 'idea' as NavTab
    },
    {
      id: 'caption',
      title: 'Caption Generator',
      description: 'Create engaging captions with optimized hashtags.',
      icon: PenTool,
      color: 'from-pink-500 to-rose-500',
      nav: 'caption' as NavTab
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Track your growth and understand your audience.',
      icon: BarChart,
      color: 'from-purple-500 to-indigo-500',
      nav: 'analytics' as NavTab
    }
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
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
        
        {user.role === 'creator' && (
           <button 
             onClick={() => onNavigate('pricing')}
             className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-8 font-medium text-white transition-all duration-300 hover:w-full hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
           >
             <span className="mr-2"><Crown size={18} /></span>
             <span>Upgrade to Pro</span>
             <div className="absolute inset-0 -z-10 bg-gradient-to-r from-orange-600 to-pink-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
           </button>
        )}
      </div>

      {/* Stats Overview (Mock Data) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1f2937] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Zap size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Generations Left</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Free Plan</h3>
            </div>
          </div>
        </div>
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

      {/* Quick Actions / Features */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
             <div 
               key={feature.id}
               onClick={() => onNavigate(feature.nav)}
               className="group relative p-6 rounded-3xl bg-white dark:bg-[#1f2937] border border-slate-200 dark:border-slate-800 hover:border-transparent transition-all duration-300 cursor-pointer overflow-hidden"
             >
                {/* Gradient Border/Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
                
                <div className="relative z-10">
                   <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon size={28} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-700 dark:group-hover:from-white dark:group-hover:to-slate-300">
                     {feature.title}
                   </h3>
                   <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                     {feature.description}
                   </p>
                   <span className="inline-flex items-center text-sm font-semibold text-slate-900 dark:text-white group-hover:translate-x-1 transition-transform duration-300">
                     Try it now →
                   </span>
                </div>
             </div>
          ))}
        </div>
      </div>

      {/* Daily Tips Section */}
      <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
           <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
             <Lightbulb size={32} className="text-yellow-400" />
           </div>
           <div>
             <h3 className="text-xl font-bold mb-2">Tip of the Day</h3>
             <p className="text-slate-300 max-w-2xl leading-relaxed">
               Consistency is key! Try to post at least 3 times a week to keep your audience engaged. 
               Use our Idea Generator to batch create content for the whole week in just 5 minutes.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
