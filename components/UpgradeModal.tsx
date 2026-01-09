import React, { useState } from 'react';
import { X, Crown, Sparkles, Zap, Check, ArrowRight, Loader2 } from 'lucide-react';
import { NavTab } from '../types';
import { useAuth } from '../context/AuthContext';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
  feature?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onNavigate, feature = 'unlimited generations' }) => {
  const { upgradeToPro } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    onClose();
    window.dispatchEvent(new CustomEvent('show-toast', { 
      detail: { message: 'You already have Pro features!', type: 'success' }
    }));
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="relative bg-linear-to-br from-orange-500 to-pink-500 px-6 py-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Unlock Pro Features</h2>
          <p className="text-white/80">Get {feature} and more</p>
        </div>

        {/* Benefits */}
        <div className="p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 text-center">
            Pro members enjoy:
          </p>
          
          <div className="space-y-3 mb-6">
            {[
              'Unlimited ideas & captions',
              'Viral rewrite feature',
              'Priority AI processing',
              'Advanced templates',
              'Export to all formats',
              'Priority support'
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="text-center mb-6 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/20">
            <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Special launch price</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">₦5,000</span>
              <span className="text-slate-500">/month</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">~$9 USD • Cancel anytime</p>
          </div>

          {/* CTA */}
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-linear-to-r from-orange-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
            {loading ? 'Processing...' : 'Upgrade to Pro'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>

          <p className="text-xs text-slate-400 text-center mt-4">
            7-day money-back guarantee • Secure payment
          </p>
        </div>
      </div>
    </div>
  );
};
