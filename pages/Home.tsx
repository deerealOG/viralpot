import React, { useEffect, useState } from 'react';
import { NavTab, User, SavedItem } from '../types';
import { db } from '../services/db';
import { Sparkles, MessageSquareText, Rocket, Briefcase, ArrowUpRight, Zap, TrendingUp } from 'lucide-react';

interface HomeProps {
  user: User;
  onNavigate: (tab: NavTab) => void;
  onLogout: () => void;
}

export const Home: React.FC<HomeProps> = ({ user, onNavigate }) => {
    const [recentItems, setRecentItems] = useState<SavedItem[]>([]);

    useEffect(() => {
        db.saved.list(user.id).then(items => {
            setRecentItems(items.slice(0, 4));
        });
    }, [user.id]);

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            {/* Trending Ticker */}
            <div className="w-full bg-slate-900 dark:bg-slate-800 text-white overflow-hidden py-2 mb-2 rounded-xl relative">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900 dark:from-slate-800 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900 dark:from-slate-800 to-transparent z-10"></div>
                <div className="animate-marquee whitespace-nowrap flex gap-8 items-center">
                    {["#AIRevolution", "#SummerVibes", "#RemoteWork", "#HealthyLiving", "#CryptoNews", "#TravelHacks", "#SustainableFashion", "#ViralMarketing", "#ContentCreation", "#GrowthHacking"].map((t, i) => (
                        <span key={i} className="font-bold text-xs tracking-wider opacity-80 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-orange-500" /> {t}
                        </span>
                    ))}
                    {["#AIRevolution", "#SummerVibes", "#RemoteWork", "#HealthyLiving", "#CryptoNews", "#TravelHacks", "#SustainableFashion", "#ViralMarketing", "#ContentCreation", "#GrowthHacking"].map((t, i) => (
                        <span key={i+'dup'} className="font-bold text-xs tracking-wider opacity-80 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-orange-500" /> {t}
                        </span>
                    ))}
                </div>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight text-slate-900 dark:text-white">
                        Good afternoon, <span className="opacity-60">{user.name.split(' ')[0]}</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Ready to create something viral today?
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300">
                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>Pro Plan Active</span>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[180px]">
                
                {/* Main Action: Idea Generator (Large) */}
                <div 
                    onClick={() => onNavigate('idea')}
                    className="group relative md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                        <Sparkles className="w-40 h-40" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Generate Ideas</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md">
                                Overcome writer's block. Generate hooks, concepts, and viral angles in seconds.
                            </p>
                        </div>
                        <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                            <ArrowUpRight className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                </div>

                {/* Secondary Action: Captions */}
                <div 
                    onClick={() => onNavigate('caption')}
                    className="group relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md"
                >
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <MessageSquareText className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Captions</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Write engaging stories.</p>
                        </div>
                    </div>
                </div>

                {/* Role Specific Card */}
                {user.role === 'business' && (
                     <div 
                        onClick={() => onNavigate('business')}
                        className="group relative bg-slate-900 dark:bg-white rounded-3xl p-8 border border-transparent transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md md:col-span-1"
                    >
                        <div className="relative z-10 h-full flex flex-col justify-between text-white dark:text-slate-900">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-slate-900/10 flex items-center justify-center">
                                <Rocket className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-1">Launchpad</h3>
                                <p className="text-sm opacity-70">Campaign strategy.</p>
                            </div>
                        </div>
                    </div>
                )}

                {user.role === 'agency' && (
                     <div 
                        onClick={() => onNavigate('agency')}
                        className="group relative bg-emerald-900 dark:bg-emerald-100 rounded-3xl p-8 border border-transparent transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md md:col-span-1"
                    >
                        <div className="relative z-10 h-full flex flex-col justify-between text-white dark:text-emerald-900">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-emerald-900/10 flex items-center justify-center">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-1">Client Hub</h3>
                                <p className="text-sm opacity-70">Audit & Strategy.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats / Daily Tip */}
                <div className="md:col-span-2 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 dark:from-violet-500/10 dark:to-fuchsia-500/10 rounded-3xl p-8 border border-violet-500/10 dark:border-violet-500/20 flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-medium text-sm">
                            <Sparkles className="w-4 h-4" />
                            <span>Daily Insight</span>
                        </div>
                        <p className="text-lg font-medium text-slate-800 dark:text-slate-200 max-w-lg">
                            "Carousel posts on LinkedIn are currently seeing <span className="text-violet-600 dark:text-violet-400 font-bold">2.4x higher engagement</span> than text-only posts."
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-16 h-16 rounded-full border-4 border-violet-500/20 flex items-center justify-center">
                            <span className="font-bold text-violet-600 dark:text-violet-400">+24%</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Recent Activity List - Minimal */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Recent Drafts</h3>
                    <button onClick={() => onNavigate('history')} className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">View All</button>
                </div>
                
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {recentItems.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentItems.map(item => (
                                <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                        item.type === 'idea' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' : 
                                        'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                    }`}>
                                        {item.type === 'idea' ? <Sparkles className="w-5 h-5" /> : <MessageSquareText className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{item.topic}</h4>
                                        <p className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString()} • {item.platform}</p>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-500">
                            No recent activity.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
