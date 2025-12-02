
import { User, SavedItem, SavedItemType, IdeaResult, CaptionResult, LastLoginUser } from '../types';

// Keys for LocalStorage
const STORAGE_KEYS = {
  USER: 'cv_user',
  LAST_LOGIN: 'cv_last_login',
  SAVED: 'cv_saved_items',
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

  saved: {
    list: async (userId: string): Promise<SavedItem[]> => {
      await delay(400);
      const str = localStorage.getItem(STORAGE_KEYS.SAVED);
      if (!str) return [];
      const allItems: SavedItem[] = JSON.parse(str);
      return allItems.filter(item => item.user_id === userId).sort((a, b) => b.created_at - a.created_at);
    },

    add: async (userId: string, type: SavedItemType, content: any, topic: string, platform: string): Promise<SavedItem> => {
      await delay(300);
      const newItem: SavedItem = {
        id: crypto.randomUUID(),
        user_id: userId,
        type,
        content,
        topic,
        platform,
        created_at: Date.now(),
      };
      
      const str = localStorage.getItem(STORAGE_KEYS.SAVED);
      const allItems: SavedItem[] = str ? JSON.parse(str) : [];
      allItems.push(newItem);
      localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(allItems));
      
      return newItem;
    },
    
    delete: async (itemId: string): Promise<void> => {
       await delay(300);
       const str = localStorage.getItem(STORAGE_KEYS.SAVED);
       if(!str) return;
       let allItems: SavedItem[] = JSON.parse(str);
       allItems = allItems.filter(i => i.id !== itemId);
       localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(allItems));
    },
    
    update: async (itemId: string, updates: Partial<SavedItem>): Promise<void> => {
      await delay(300);
      const str = localStorage.getItem(STORAGE_KEYS.SAVED);
      if (!str) return;
      const allItems: SavedItem[] = JSON.parse(str);
      const index = allItems.findIndex(i => i.id === itemId);
      if (index !== -1) {
        allItems[index] = { ...allItems[index], ...updates };
        localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(allItems));
      }
    },

    toggleFavorite: async (itemId: string): Promise<void> => {
      await delay(200);
      const str = localStorage.getItem(STORAGE_KEYS.SAVED);
      if (!str) return;
      const allItems: SavedItem[] = JSON.parse(str);
      const index = allItems.findIndex(i => i.id === itemId);
      if (index !== -1) {
        allItems[index].isFavorite = !allItems[index].isFavorite;
        localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(allItems));
      }
    },

    saveAsTemplate: async (itemId: string, templateName: string): Promise<void> => {
      await delay(300);
      const str = localStorage.getItem(STORAGE_KEYS.SAVED);
      if (!str) return;
      const allItems: SavedItem[] = JSON.parse(str);
      const index = allItems.findIndex(i => i.id === itemId);
      if (index !== -1) {
        allItems[index].isTemplate = true;
        allItems[index].templateName = templateName;
        localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(allItems));
      }
    }
  }
};
