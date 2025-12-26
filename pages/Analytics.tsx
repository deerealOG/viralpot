import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Sparkles, MessageSquareText, TrendingUp, Calendar, Clock, Target, ArrowRight, Crown, User } from 'lucide-react';
import { NavTab } from '../types';

interface AnalyticsProps {
  onNavigate?: (tab: NavTab) => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ onNavigate }) => {
  const { user, userProfile } = useAuth();

  if (!user || !userProfile) {
    return (
      <div className="animate-fade-in max-w-2xl mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-lg shadow-purple-500/25">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Your Analytics</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">Sign in to see your content creation stats and track your progress</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onNavigate?.('signin')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center gap-2"
          >
            Sign In
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate?.('signup')}
            className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 transition-all"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalGenerated = userProfile.ideasGenerated + userProfile.captionsGenerated;
  const todayGenerated = userProfile.dailyIdeasUsed + userProfile.dailyCaptionsUsed;
  const daysActive = Math.max(1, Math.floor((Date.now() - (userProfile.createdAt?.toDate?.()?.getTime() || Date.now())) / (1000 * 60 * 60 * 24)));
  const avgPerDay = Math.round(totalGenerated / daysActive);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-4">
          <BarChart3 className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Analytics</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Your Content Stats
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Track your content creation journey
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Ideas</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{userProfile.ideasGenerated}</p>
          <p className="text-xs text-slate-400 mt-1">Total generated</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-2">
            <MessageSquareText className="w-5 h-5" />
            <span className="text-sm font-medium">Captions</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{userProfile.captionsGenerated}</p>
          <p className="text-xs text-slate-400 mt-1">Total created</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Total</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalGenerated}</p>
          <p className="text-xs text-slate-400 mt-1">All content</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm font-medium">Today</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{todayGenerated}</p>
          <p className="text-xs text-slate-400 mt-1">Generated today</p>
        </div>
      </div>

      {/* Usage Today */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          Today's Usage
        </h3>
        
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Ideas Generated
              </span>
              <span className="font-medium text-slate-900 dark:text-white">
                {userProfile.dailyIdeasUsed} / {userProfile.subscription === 'free' ? '5' : '∞'}
              </span>
            </div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ 
                  width: userProfile.subscription === 'free' 
                    ? `${Math.min(userProfile.dailyIdeasUsed / 5 * 100, 100)}%`
                    : '10%'
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <MessageSquareText className="w-4 h-4 text-teal-500" />
                Captions Created
              </span>
              <span className="font-medium text-slate-900 dark:text-white">
                {userProfile.dailyCaptionsUsed} / {userProfile.subscription === 'free' ? '5' : '∞'}
              </span>
            </div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ 
                  width: userProfile.subscription === 'free' 
                    ? `${Math.min(userProfile.dailyCaptionsUsed / 5 * 100, 100)}%`
                    : '10%'
                }}
              />
            </div>
          </div>
        </div>

        {userProfile.subscription === 'free' && (
          <div className="mt-6 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/30">
            <p className="text-sm text-orange-700 dark:text-orange-300">
              You have {Math.max(0, 5 - userProfile.dailyIdeasUsed)} ideas and {Math.max(0, 5 - userProfile.dailyCaptionsUsed)} captions remaining today.
              <button 
                onClick={() => onNavigate?.('pricing')}
                className="ml-2 font-semibold underline hover:no-underline"
              >
                Upgrade for unlimited
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Average Stats */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          Activity Summary
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgPerDay}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Avg. per day</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{daysActive}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Days active</p>
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      <button
        onClick={() => onNavigate?.('pricing')}
        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="text-left">
            <p className="text-white/80 text-sm mb-1">Current Plan</p>
            <p className="text-2xl font-bold capitalize flex items-center gap-2">
              <Crown className="w-6 h-6" />
              {userProfile.subscription}
            </p>
          </div>
          <div className="text-right">
            {userProfile.subscription === 'free' ? (
              <div className="flex items-center gap-2 text-lg font-semibold">
                <span>Go Pro</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-white/80">Manage</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </div>
        </div>
      </button>
    </div>
  );
};
