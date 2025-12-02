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
      title: '🎁 Daily Login Bonus',
      description: 'Claim 2 free credits every day',
      reward: 2,
      completed: !canClaimDaily,
      canClaim: canClaimDaily,
      type: 'daily',
    },
    {
      id: 'complete_profile',
      title: '👤 Complete Your Profile',
      description: 'Add your name and avatar',
      reward: 5,
      completed: claimedTasks.includes('complete_profile'),
      canClaim: !!(user.name && user.avatar) && !claimedTasks.includes('complete_profile'),
      type: 'onetime',
    },
    {
      id: 'generate_first',
      title: '✨ Create Your First Content',
      description: 'Generate an idea or caption',
      reward: 3,
      completed: claimedTasks.includes('generate_first'),
      canClaim: false, // Requires checking saved items history
      type: 'onetime',
    },
  ];
};

export const PRO_FEATURES = [
  '✨ Unlimited AI Generations',
  '📊 Advanced Analytics Dashboard',
  '🎨 Custom Brand Templates',
  '👥 Team Collaboration (up to 5 members)',
  '📅 Content Calendar & Scheduling',
  '🚀 Priority Support (24/7)',
  '📤 Export to 10+ Formats',
  '🔗 API Access',
];

export const PRO_PRICE = '$19/month';
