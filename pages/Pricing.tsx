import React from 'react';
import { NavTab } from '../types';
import { Check, Star } from 'lucide-react';

interface PricingProps {
  onNavigateToSignUp: () => void;
  onNavigate: (tab: NavTab) => void;
}

export function Pricing({ onNavigateToSignUp, onNavigate }: PricingProps) {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: '/month',
      description: 'Perfect for trying out ViralPot',
      features: ['5 AI Ideas / day', '2 Caption Generations / day', 'Basic Analytics', 'Community Support'],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro Creator',
      price: '$29',
      period: '/month',
      description: 'For serious content creators',
      features: ['Unlimited AI Ideas', 'Unlimited Captions', 'Advanced Analytics', 'Trend Forecasting', 'Priority Support'],
      cta: 'Get Pro Now',
      popular: true
    }
  ];

  return (
    <div className="min-h-full p-6 lg:p-10 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
          Simple, Transparent Pricing
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Choose the plan that best fits your content creation needs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`
              relative p-8 rounded-3xl border 
              ${plan.popular 
                ? 'bg-slate-900 text-white border-transparent shadow-2xl scale-105 z-10' 
                : 'bg-white dark:bg-[#1f2937] text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-orange-500/50'}
              transition-all duration-300
            `}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
                 <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
                   <Star size={14} fill="currentColor" /> Most Popular
                 </span>
              </div>
            )}

            <div className="mb-8">
              <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={`text-sm ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>
              </div>
              <p className={`mt-4 ${plan.popular ? 'text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>
                {plan.description}
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className={`p-1 rounded-full ${plan.popular ? 'bg-white/20' : 'bg-green-100 dark:bg-green-900/30'}`}>
                    <Check size={14} className={plan.popular ? 'text-white' : 'text-green-600 dark:text-green-400'} />
                  </div>
                  <span className={plan.popular ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={onNavigateToSignUp}
              className={`
                w-full py-4 rounded-xl font-bold text-lg transition-all
                ${plan.popular
                  ? 'bg-linear-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg hover:shadow-orange-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'}
              `}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
