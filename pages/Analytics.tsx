import React from 'react';
import { User } from '../types';
import { Card } from '../components/Card';
import { TrendingUp, Users, Eye, MousePointer, ArrowUp, ArrowDown, Activity } from 'lucide-react';

interface AnalyticsProps {
  user: User;
}

export const Analytics: React.FC<AnalyticsProps> = ({ user }) => {
  // Simulate data based on role
  const isBusiness = user.role === 'business';
  const isAgency = user.role === 'agency';

  const stats = [
    {
      label: isBusiness ? 'Total Revenue' : isAgency ? 'Client Leads' : 'Total Views',
      value: isBusiness ? '$12,450' : isAgency ? '48' : '1.2M',
      change: '+12.5%',
      trend: 'up',
      icon: isBusiness ? <Activity className="w-5 h-5 text-emerald-500" /> : <Eye className="w-5 h-5 text-blue-500" />
    },
    {
      label: isBusiness ? 'Conversion Rate' : 'Engagement Rate',
      value: isBusiness ? '3.2%' : '8.4%',
      change: '+2.1%',
      trend: 'up',
      icon: <MousePointer className="w-5 h-5 text-purple-500" />
    },
    {
      label: 'Follower Growth',
      value: '+2,450',
      change: '-0.5%',
      trend: 'down',
      icon: <Users className="w-5 h-5 text-orange-500" />
    },
    {
      label: 'Viral Score',
      value: '85/100',
      change: '+5.0',
      trend: 'up',
      icon: <TrendingUp className="w-5 h-5 text-pink-500" />
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400">Track your content performance.</p>
        </div>
        <div className="flex gap-2">
            <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
            </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                {stat.icon}
              </div>
              <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                stat.trend === 'up' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {stat.trend === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="md:col-span-2 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Growth Overview</h3>
            <div className="h-64 flex items-end justify-between gap-2">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((height, i) => (
                    <div key={i} className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-t-lg relative group overflow-hidden">
                        <div 
                            className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out ${
                                isBusiness ? 'bg-indigo-500' : isAgency ? 'bg-emerald-500' : 'bg-orange-500'
                            }`}
                            style={{ height: `${height}%`, opacity: 0.8 }}
                        ></div>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-slate-400 uppercase font-bold">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
            </div>
        </Card>

        {/* Side Stats */}
        <div className="space-y-6">
            <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Top Platforms</h3>
                <div className="space-y-4">
                    {[
                        { name: 'Instagram', val: 78, color: 'bg-pink-500' },
                        { name: 'TikTok', val: 64, color: 'bg-black dark:bg-white' },
                        { name: 'LinkedIn', val: 42, color: 'bg-blue-600' }
                    ].map(p => (
                        <div key={p.name}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium dark:text-slate-300">{p.name}</span>
                                <span className="text-slate-500">{p.val}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className={`h-full ${p.color}`} style={{ width: `${p.val}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <SparklesIcon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                        <h3 className="font-bold">AI Insight</h3>
                        <p className="text-xs text-slate-400">Daily Tip</p>
                    </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                    "Your video content on Tuesdays gets <strong>2.5x more engagement</strong>. Try posting your next reel tomorrow at 6 PM."
                </p>
            </Card>
        </div>
      </div>
    </div>
  );
};

function SparklesIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
    )
}
