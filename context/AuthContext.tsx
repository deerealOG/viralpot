import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: any;
  subscription: 'free' | 'pro' | 'business';
  subscriptionEndDate: Date | null;
  ideasGenerated: number;
  captionsGenerated: number;
  dailyIdeasUsed: number;
  dailyCaptionsUsed: number;
  lastResetDate: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  incrementUsage: (type: 'idea' | 'caption') => Promise<boolean>;
  canGenerate: (type: 'idea' | 'caption') => boolean;
  upgradeToPro: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DAILY_LIMITS = {
  free: { ideas: 5, captions: 5 },
  pro: { ideas: Infinity, captions: Infinity },
  business: { ideas: Infinity, captions: Infinity }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get today's date string for daily reset tracking
  const getTodayString = () => new Date().toISOString().split('T')[0];

  // Fetch or create user profile from Firestore
  const fetchUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        
        // Check if we need to reset daily counters
        const today = getTodayString();
        if (data.lastResetDate !== today) {
          try {
            await updateDoc(userRef, {
              dailyIdeasUsed: 0,
              dailyCaptionsUsed: 0,
              lastResetDate: today
            });
          } catch (updateErr) {
            console.warn('Could not update daily counters:', updateErr);
          }
          data.dailyIdeasUsed = 0;
          data.dailyCaptionsUsed = 0;
          data.lastResetDate = today;
        }
        
        setUserProfile(data);
      } else {
        // Create new user profile
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          createdAt: serverTimestamp(),
          subscription: 'free',
          subscriptionEndDate: null,
          ideasGenerated: 0,
          captionsGenerated: 0,
          dailyIdeasUsed: 0,
          dailyCaptionsUsed: 0,
          lastResetDate: getTodayString()
        };
        try {
          await setDoc(userRef, newProfile);
        } catch (setErr) {
          console.warn('Could not save profile to Firestore:', setErr);
        }
        setUserProfile(newProfile);
      }
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      // If Firestore is offline or has permission issues, create a local fallback profile
      if (err.code === 'unavailable' || err.code === 'permission-denied' || err.message?.includes('offline')) {
        console.log('Creating fallback profile due to Firestore error');
        const fallbackProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          createdAt: null,
          subscription: 'free',
          subscriptionEndDate: null,
          ideasGenerated: 0,
          captionsGenerated: 0,
          dailyIdeasUsed: 0,
          dailyCaptionsUsed: 0,
          lastResetDate: getTodayString()
        };
        setUserProfile(fallbackProfile);
        setError('Unable to sync with database. Some features may be limited.');
      }
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, data);
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const canGenerate = (type: 'idea' | 'caption'): boolean => {
    if (!userProfile) return true; // Allow guest usage
    
    const limits = DAILY_LIMITS[userProfile.subscription];
    if (type === 'idea') {
      return userProfile.dailyIdeasUsed < limits.ideas;
    } else {
      return userProfile.dailyCaptionsUsed < limits.captions;
    }
  };

  const incrementUsage = async (type: 'idea' | 'caption'): Promise<boolean> => {
    if (!user || !userProfile) return true; // Guest mode
    
    if (!canGenerate(type)) return false;

    try {
      const userRef = doc(db, 'users', user.uid);
      if (type === 'idea') {
        await updateDoc(userRef, {
          ideasGenerated: userProfile.ideasGenerated + 1,
          dailyIdeasUsed: userProfile.dailyIdeasUsed + 1
        });
        setUserProfile(prev => prev ? {
          ...prev,
          ideasGenerated: prev.ideasGenerated + 1,
          dailyIdeasUsed: prev.dailyIdeasUsed + 1
        } : null);
      } else {
        await updateDoc(userRef, {
          captionsGenerated: userProfile.captionsGenerated + 1,
          dailyCaptionsUsed: userProfile.dailyCaptionsUsed + 1
        });
        setUserProfile(prev => prev ? {
          ...prev,
          captionsGenerated: prev.captionsGenerated + 1,
          dailyCaptionsUsed: prev.dailyCaptionsUsed + 1
        } : null);
      }
      return true;
    } catch (err) {
      console.error('Error incrementing usage:', err);
      return false;
    }
  };

  const upgradeToPro = async () => {
    if (!user) return;
    try {
      // Simulate API call/Payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        subscription: 'pro',
        subscriptionEndDate: null // Permanent for this mock
      });
      setUserProfile(prev => prev ? { ...prev, subscription: 'pro' } : null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      error,
      signIn,
      signUp,
      signInWithGoogle,
      logout,
      resetPassword,
      updateUserProfile,
      incrementUsage,
      canGenerate,
      upgradeToPro
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
