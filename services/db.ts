
import { User, LastLoginUser } from '../types';

// Keys for LocalStorage
const STORAGE_KEYS = {
  USER: 'cv_user',
  LAST_LOGIN: 'cv_last_login',

};

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const db = {
  auth: {
    login: async (email: string, role: 'creator' | 'business' | 'agency', name?: string, avatar?: string): Promise<User> => {
      await delay(800);
      
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name: name || email.split('@')[0],
        role,
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        created_at: Date.now(),
      };
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      
      // Save to last login for "Welcome Back" screen
      const lastLogin: LastLoginUser = {
          email: newUser.email,
          name: newUser.name || '',
          avatar: newUser.avatar || '',
          role: newUser.role,
          lastSeen: Date.now()
      };
      localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, JSON.stringify(lastLogin));

      return newUser;
    },

    loginAsGuest: async (): Promise<User> => {
        await delay(500);
        const guestUser: User = {
            id: crypto.randomUUID(),
            email: 'guest@viralpot.com',
            name: 'Guest User',
            role: 'creator',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
            created_at: Date.now(),
            isGuest: true,
            onboardingCompleted: false, // Guests still need to onboard to get value
            niche: 'General Content',
            bio: 'Content Creator'
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(guestUser));
        return guestUser;
    },
    
    updateUser: async (user: User): Promise<User> => {
        await delay(300);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        
        // Update last login too if it matches
        const last = localStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
        if(last) {
            const parsed = JSON.parse(last);
            if(parsed.email === user.email) {
                 localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, JSON.stringify({ 
                     ...parsed, 
                     avatar: user.avatar, 
                     name: user.name,
                     role: user.role 
                 }));
            }
        }
        return user;
    },
    
    getLastLogin: (): LastLoginUser | null => {
        const str = localStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
        return str ? JSON.parse(str) : null;
    },

    getCurrentUser: (): User | null => {
      const u = localStorage.getItem(STORAGE_KEYS.USER);
      return u ? JSON.parse(u) : null;
    },

    logout: async () => {
      await delay(200);
      localStorage.removeItem(STORAGE_KEYS.USER);
      // We purposefully DO NOT remove LAST_LOGIN to enable the re-login flow
    }
  },


};
