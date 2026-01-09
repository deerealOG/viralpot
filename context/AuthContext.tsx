import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: any;
  subscription: 'free' | 'pro' | 'business';
  subscriptionEndDate: Date | null;
  ideasGenerated: number;
  captionsGenerated: number;
  dailyIdeasUsed: number;
  dailyCaptionsUsed: number;
  lastResetDate: string;
  // Onboarding fields
  onboardingCompleted?: boolean;
  niche?: string;
  bio?: string;
  role?: 'creator' | 'agency' | 'business';
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DAILY_LIMITS = {
  free: { ideas: 100, captions: 100 },
  pro: { ideas: Infinity, captions: Infinity },
  business: { ideas: Infinity, captions: Infinity }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock User constantly available
  const mockUser: any = {
    uid: 'default-user-id',
    email: 'creator@viralpot.com',
    displayName: 'Creator',
    photoURL: '',
    emailVerified: true,
  };

  const mockProfile: UserProfile = {
    uid: 'default-user-id',
    email: 'creator@viralpot.com',
    displayName: 'Creator',
    photoURL: '',
    emailVerified: true,
    createdAt: new Date(),
    subscription: 'pro', // Changed to 'pro' for unlimited access
    subscriptionEndDate: null,
    ideasGenerated: 0,
    captionsGenerated: 0,
    dailyIdeasUsed: 0,
    dailyCaptionsUsed: 0,
    lastResetDate: new Date().toISOString().split('T')[0],
    onboardingCompleted: true,
    niche: 'General',
    bio: 'Content Creator',
    role: 'creator'
  };

  const [user] = useState<FirebaseUser | null>(mockUser);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(mockProfile);
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // No-op functions
  const signIn = async () => {};
  const signUp = async () => {};
  const signInWithGoogle = async () => {};
  const logout = async () => {};
  const resetPassword = async () => {};
  
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    setUserProfile(prev => prev ? { ...prev, ...data } : null);
  };

  const canGenerate = () => true; // Always allow

  const incrementUsage = async (): Promise<boolean> => {
     // Just track locally if needed, but return true always
     return true;
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
