import React from 'react';
import { Crown, ArrowRight, Zap, X } from 'lucide-react';
import { NavTab } from '../types';

interface UpgradeBannerProps {
  onNavigate: (tab: NavTab) => void;
  variant?: 'inline' | 'floating';
  message?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const UpgradeBanner: React.FC<UpgradeBannerProps> = ({ 
  onNavigate, 
  variant = 'inline',
  message = 'Unlock unlimited generations',
  dismissible = false,
  onDismiss
}) => {
  if (variant === 'floating') {
    return (
      <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40 animate-fade-in">
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-4 shadow-2xl shadow-orange-500/30">
          {dismissible && (
            <button 
              onClick={onDismiss}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">{message}</p>
              <p className="text-white/70 text-xs">Upgrade to Pro • ₦5,000/mo</p>
            </div>
            <button
              onClick={() => onNavigate('pricing')}
              className="px-4 py-2 rounded-xl bg-white text-orange-600 font-semibold text-sm hover:bg-orange-50 transition-colors flex items-center gap-1"
            >
              <Zap className="w-4 h-4" />
              Upgrade
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 rounded-xl p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{message}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Get Pro for only ₦5,000/month</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('pricing')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center gap-2"
        >
          Upgrade Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Usage limit warning component
interface UsageLimitWarningProps {
  used: number;
  limit: number;
  type: 'ideas' | 'captions';
  onUpgrade: () => void;
}

export const UsageLimitWarning: React.FC<UsageLimitWarningProps> = ({ used, limit, type, onUpgrade }) => {
  const remaining = limit - used;
  const percentage = (used / limit) * 100;
  
  if (remaining > 2) return null;

  const isAtLimit = remaining <= 0;
  
  return (
    <div className={`rounded-xl p-4 mb-4 ${
      isAtLimit 
        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30' 
        : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isAtLimit ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
        }`}>
          {isAtLimit ? (
            <X className={`w-5 h-5 text-red-500`} />
          ) : (
            <Zap className={`w-5 h-5 text-amber-500`} />
          )}
        </div>
        <div className="flex-1">
          <p className={`font-semibold ${isAtLimit ? 'text-red-700 dark:text-red-300' : 'text-amber-700 dark:text-amber-300'}`}>
            {isAtLimit 
              ? `You've reached your daily ${type} limit`
              : `Only ${remaining} ${type} remaining today`
            }
          </p>
          <p className={`text-sm ${isAtLimit ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {isAtLimit 
              ? 'Upgrade to Pro for unlimited access'
              : 'Upgrade to Pro for unlimited generations'
            }
          </p>
          
          {/* Progress bar */}
          <div className="mt-2 h-2 bg-white dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                isAtLimit ? 'bg-red-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
        <button
          onClick={onUpgrade}
          className={`px-4 py-2 rounded-lg font-semibold text-sm ${
            isAtLimit 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-amber-500 text-white hover:bg-amber-600'
          } transition-colors`}
        >
          Upgrade
        </button>
      </div>
    </div>
  );
};
