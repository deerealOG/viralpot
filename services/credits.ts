import { CreditTask, CreditPackage } from '../types';

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'starter',
    credits: 50,
    price: '$9.99',
  },
  {
    id: 'popular',
    credits: 150,
    price: '$24.99',
    label: 'Best Value',
    popular: true,
  },
  {
    id: 'pro',
    credits: 500,
    price: '$69.99',
    label: 'Save 30%',
  },
];

export const getCreditTasks = (user: any): CreditTask[] => {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const canClaimDaily = !user.last_daily_claim || user.last_daily_claim < oneDayAgo;
  const claimedTasks = user.claimed_tasks || [];

  return [
    {
      id: 'daily_login',
      title: '🎁 Welcome',
      description: 'You have unlimited access!',
      reward: 9999,
      completed: !canClaimDaily,
      canClaim: canClaimDaily,
      type: 'daily',
    },


  ];
};

export const PRO_FEATURES = [
  '✨ Unlimited AI Generations',

  '🎨 Custom Brand Templates',
  '👥 Team Collaboration (up to 5 members)',
  '📅 Content Calendar & Scheduling',
  '🚀 Priority Support (24/7)',
  '📤 Export to 10+ Formats',
  '🔗 API Access',
];

export const PRO_PRICE = '$19/month';
