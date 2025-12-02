
import React, { useState } from 'react';
import { Button } from '../components/Button';

interface CreditStoreProps {
  onPurchase: (amount: number, cost: string) => Promise<void>;
  onClose: () => void;
}

const PACKAGES = [
  { id: 'starter', credits: 10, price: '$4.99', label: 'Starter Pack', popular: false },
  { id: 'pro', credits: 50, price: '$19.99', label: 'Power Pack', popular: true },
  { id: 'whale', credits: 100, price: '$34.99', label: 'Mega Pack', popular: false },
];

export const CreditStore: React.FC<CreditStoreProps> = ({ onPurchase, onClose }) => {
  const [processing, setProcessing] = useState<string | null>(null);

  const handleBuy = async (pkgId: string, amount: number, price: string) => {
    setProcessing(pkgId);
    try {
      await onPurchase(amount, price);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-slate-600 dark:text-slate-300">
          Invest in your content strategy. Credits never expire.
        </p>
      </div>

      <div className="space-y-4">
        {PACKAGES.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              pkg.popular 
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' 
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50'
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                Best Value
              </span>
            )}
            
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 dark:text-white text-lg">{pkg.credits} Credits</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{pkg.label}</span>
            </div>

            <div className="flex items-center gap-3">
               <span className="font-semibold text-slate-900 dark:text-white text-sm md:text-base">{pkg.price}</span>
               <Button 
                 variant={pkg.popular ? 'primary' : 'outline'}
                 onClick={() => handleBuy(pkg.id, pkg.credits, pkg.price)}
                 isLoading={processing === pkg.id}
                 disabled={processing !== null}
                 className="min-w-[80px] py-2 px-3 text-sm h-10"
               >
                 Buy
               </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Payment Method</h4>
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-7 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 flex items-center justify-center">
                <span className="text-[10px] font-bold text-slate-500 italic">VISA</span>
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Visa ending in 4242</p>
                <p className="text-xs text-slate-500">Expires 12/28</p>
            </div>
            <button className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">Change</button>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3 text-center flex items-center justify-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          Secure payment processing powered by Stripe (Demo)
        </p>
      </div>
    </div>
  );
};
