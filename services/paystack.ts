// Paystack Integration for ViralPot
// Documentation: https://paystack.com/docs/

export interface PricePlan {
  id: string;
  name: string;
  price: number; // In NGN
  priceUSD: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
}

export const PRICE_PLANS: PricePlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceUSD: 0,
    interval: 'monthly',
    features: [
      '5 ideas per day',
      '5 captions per day',
      'Basic templates',
      'Community support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 5000, // ₦5,000/month
    priceUSD: 9,
    interval: 'monthly',
    popular: true,
    features: [
      'Unlimited ideas',
      'Unlimited captions',
      'Viral rewrite feature',
      'Priority support',
      'Advanced templates',
      'Export to all formats'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    price: 15000, // ₦15,000/month
    priceUSD: 29,
    interval: 'monthly',
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'API access',
      'Custom branding',
      'Analytics dashboard',
      'Dedicated support'
    ]
  }
];

// Paystack public key
const getPaystackKey = (): string => {
  const key = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  console.log('[Paystack] Public key configured:', key ? 'Yes' : 'No');
  return key || '';
};

interface PaystackConfig {
  email: string;
  amount: number; // In kobo (NGN * 100)
  currency?: string;
  ref?: string;
  metadata?: Record<string, any>;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

// Load Paystack script dynamically
const loadPaystackScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      console.log('[Paystack] Script already loaded');
      resolve();
      return;
    }

    console.log('[Paystack] Loading script...');
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      console.log('[Paystack] Script loaded successfully');
      resolve();
    };
    script.onerror = () => {
      console.error('[Paystack] Failed to load script');
      reject(new Error('Failed to load Paystack script'));
    };
    document.head.appendChild(script);
  });
};

// Initialize Paystack payment
export const initializePayment = async (config: PaystackConfig): Promise<void> => {
  const publicKey = getPaystackKey();
  
  if (!publicKey) {
    throw new Error('Paystack public key not configured. Add VITE_PAYSTACK_PUBLIC_KEY to .env.local');
  }

  await loadPaystackScript();

  if (!window.PaystackPop) {
    throw new Error('Paystack failed to initialize');
  }

  console.log('[Paystack] Initializing payment:', {
    amount: config.amount,
    email: config.email,
    currency: config.currency || 'NGN'
  });

  const handler = window.PaystackPop.setup({
    key: publicKey,
    email: config.email,
    amount: config.amount,
    currency: config.currency || 'NGN',
    ref: config.ref || `VP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    metadata: config.metadata,
    callback: (response: { reference: string }) => {
      console.log('[Paystack] Payment successful:', response.reference);
      config.onSuccess(response.reference);
    },
    onClose: () => {
      console.log('[Paystack] Payment popup closed');
      config.onClose();
    }
  });

  handler.openIframe();
};

// Create payment for subscription (one-time payment that activates subscription)
export const createSubscription = async (
  planId: string,
  email: string,
  userId: string,
  onSuccess: (reference: string) => void,
  onClose: () => void
): Promise<void> => {
  const plan = PRICE_PLANS.find(p => p.id === planId);
  if (!plan || plan.id === 'free') {
    throw new Error('Invalid plan selected');
  }

  if (!email) {
    throw new Error('Email is required for payment');
  }

  try {
    await initializePayment({
      email,
      amount: plan.price * 100, // Convert to kobo
      metadata: {
        userId,
        planId,
        planName: plan.name,
        custom_fields: [
          {
            display_name: 'User ID',
            variable_name: 'user_id',
            value: userId
          },
          {
            display_name: 'Plan',
            variable_name: 'plan',
            value: plan.name
          }
        ]
      },
      onSuccess,
      onClose
    });
  } catch (error) {
    console.error('[Paystack] Payment error:', error);
    throw error;
  }
};

// One-time payment (for donations, etc.)
export const makePayment = async (
  amount: number,
  email: string,
  metadata?: Record<string, any>,
  onSuccess?: (reference: string) => void,
  onClose?: () => void
): Promise<void> => {
  await initializePayment({
    email,
    amount: amount * 100,
    metadata,
    onSuccess: onSuccess || (() => {}),
    onClose: onClose || (() => {})
  });
};

// Format price for display
export const formatPrice = (amount: number, currency: string = 'NGN'): string => {
  if (amount === 0) return 'Free';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0
  }).format(amount);
};
