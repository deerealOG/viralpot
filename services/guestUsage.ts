// Guest usage tracking service
// Allows non-logged-in users to try the generators with limits

const GUEST_STORAGE_KEY = 'viralpot_guest_usage';
const GUEST_LIMIT = 3; // Number of free generations before requiring signup

interface GuestUsage {
  ideas: number;
  captions: number;
  lastReset: string;
  hasSeenSignupPrompt: boolean;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

const getDefaultUsage = (): GuestUsage => ({
  ideas: 0,
  captions: 0,
  lastReset: getTodayString(),
  hasSeenSignupPrompt: false
});

export const getGuestUsage = (): GuestUsage => {
  try {
    const stored = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!stored) return getDefaultUsage();
    
    const usage = JSON.parse(stored) as GuestUsage;
    
    // Reset if it's a new day
    if (usage.lastReset !== getTodayString()) {
      const resetUsage = getDefaultUsage();
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(resetUsage));
      return resetUsage;
    }
    
    return usage;
  } catch {
    return getDefaultUsage();
  }
};

export const incrementGuestUsage = (type: 'ideas' | 'captions') => {
  const usage = getGuestUsage();
  usage[type] += 1;
  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(usage));
  return usage;
};

export const canGuestGenerate = (type: 'ideas' | 'captions'): boolean => {
  const usage = getGuestUsage();
  return usage[type] < GUEST_LIMIT;
};

export const getGuestRemaining = (type: 'ideas' | 'captions'): number => {
  const usage = getGuestUsage();
  return Math.max(0, GUEST_LIMIT - usage[type]);
};

export const getTotalGuestRemaining = (): number => {
  const usage = getGuestUsage();
  return Math.max(0, (GUEST_LIMIT * 2) - usage.ideas - usage.captions);
};

export const markSignupPromptSeen = () => {
  const usage = getGuestUsage();
  usage.hasSeenSignupPrompt = true;
  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(usage));
};

export const hasSeenSignupPrompt = (): boolean => {
  return getGuestUsage().hasSeenSignupPrompt;
};

export const GUEST_LIMIT_COUNT = GUEST_LIMIT;
