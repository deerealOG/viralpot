import React from 'react';
import { X, Sparkles, Check, ArrowRight, Gift, Zap, Crown } from 'lucide-react';
import { NavTab } from '../types';

interface SignupPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
  usedCount: number;
  limitCount: number;
  type: 'ideas' | 'captions';
}

export const SignupPrompt: React.FC<SignupPromptProps> = ({ 
  isOpen, 
  onClose, 
  onNavigate, 
  usedCount, 
  limitCount,
  type 
}) => {
  if (!isOpen) return null;

  const remaining = Math.max(0, limitCount - usedCount);
  const isAtLimit = remaining === 0;

  const handleSignUp = () => {
    onClose();
    onNavigate('signup');
  };

  const handleSignIn = () => {
    onClose();
    onNavigate('signin');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className={`relative px-6 py-8 text-center ${
          isAtLimit 
            ? 'bg-gradient-to-br from-amber-500 to-orange-500' 
            : 'bg-gradient-to-br from-emerald-500 to-teal-500'
        }`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
            {isAtLimit ? (
              <Crown className="w-8 h-8 text-white" />
            ) : (
              <Gift className="w-8 h-8 text-white" />
            )}
          </div>
          
          {isAtLimit ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">You've Used All Free Tries!</h2>
              <p className="text-white/80">Create a free account to get more {type}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Nice! Your Idea is Ready 🎉</h2>
              <p className="text-white/80">You have {remaining} free {type} left today</p>
            </>
          )}
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Free {type} used</span>
            <span>{usedCount} / {limitCount}</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isAtLimit ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}
              style={{ width: `${Math.min((usedCount / limitCount) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Benefits */}
        <div className="p-6">
          <p className="text-sm font-medium text-slate-900 dark:text-white mb-3">
            ✨ Create a free account to get:
          </p>
          
          <div className="space-y-2 mb-6">
            {[
              '5 ideas & 5 captions daily (instead of 3)',
              'Save your favorite generations',
              'Track your content history',
              'Sync across all devices'
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-500" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Pro Upsell */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-slate-700 dark:text-slate-300">
                <strong className="text-orange-600 dark:text-orange-400">Go Pro</strong> for unlimited generations!
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <button
              onClick={handleSignUp}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleSignIn}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Already have an account? Sign in
            </button>

            {!isAtLimit && (
              <button
                onClick={onClose}
                className="w-full py-2 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                Continue as guest ({remaining} {type} left)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
