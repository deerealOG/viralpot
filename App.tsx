import React, { useState, useEffect } from 'react';
import { Toast, ToastType } from './components/Toast';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { IdeaGenerator } from './pages/IdeaGenerator';
import { CaptionGenerator } from './pages/CaptionGenerator';
import { Contact } from './pages/Contact';
import { Info } from './pages/Info';
import { BusinessHub } from './pages/BusinessHub';


import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './context/AuthContext';
import { User, NavTab } from './types';

const DEFAULT_USER: User = {
  id: 'default-user',
  email: 'user@viralpot.com',
  name: 'Creator',
  role: 'creator',
  avatar: '',
  created_at: Date.now(),
  onboardingCompleted: true,
  niche: 'General',
  bio: 'Content Creator',
  subscription: 'free',
  isGuest: false
};



function AppContent() {
  const { user, userProfile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showFloatingBanner, setShowFloatingBanner] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('unlimited generations');
  const [toastConfig, setToastConfig] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  });
  
  // Auth flow state removed

  
  // Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('viralpot_onboarding_completed');
  });

  useEffect(() => {
    // Only force onboarding for NEW authenticated users if they didn't do it as guest
    if (!loading && user && userProfile) {
      if (userProfile.onboardingCompleted === false && !localStorage.getItem('viralpot_onboarding_completed')) {
        setShowOnboarding(true);
      }
    }
  }, [loading, user, userProfile]);

  const handleOnboardingComplete = async (data: Partial<User>) => {
    localStorage.setItem('viralpot_onboarding_completed', 'true');
    setShowOnboarding(false);
    
    // Save onboarding data to Firestore if logged in
    if (user) {
      try {
        const { doc, updateDoc } = await import('firebase/firestore');
        const { db } = await import('./services/firebase');
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          niche: data.niche || 'General',
          role: data.role || 'creator',
          bio: data.bio || 'Content Creator',
          onboardingCompleted: true
        });
      } catch (err) {
        console.error('Error saving onboarding data:', err);
      }
    }
  };

  // Create a user object from auth (no more guest mode)
  const appUser: User = user ? {
    id: user.uid,
    email: user.email || '',
    name: userProfile?.displayName || user.displayName || 'User',
    role: 'creator',
    avatar: userProfile?.photoURL || user.photoURL || '',
    created_at: userProfile?.createdAt?.toDate?.()?.getTime() || Date.now(),
    onboardingCompleted: userProfile?.onboardingCompleted ?? false,
    niche: userProfile?.niche || 'General',
    bio: userProfile?.bio || 'Content Creator',
    subscription: userProfile?.subscription || 'free',
    isGuest: false
  } : DEFAULT_USER;

  // Floating banner removed


  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('cv_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
       setTheme('dark');
    } else {
       setTheme('light');
    }
  }, []);

  // Update theme class on HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cv_theme', theme);
  }, [theme]);

  // Toast Event Listener
  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type: ToastType }>;
      setToastConfig({
        message: customEvent.detail.message,
        type: customEvent.detail.type,
        isVisible: true
      });
    };

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  // Listen for upgrade prompts from components
  useEffect(() => {
    const handleShowUpgrade = (e: Event) => {
      const customEvent = e as CustomEvent<{ feature?: string }>;
      setUpgradeFeature(customEvent.detail?.feature || 'unlimited generations');
      setShowUpgradeModal(true);
    };

    window.addEventListener('show-upgrade-modal', handleShowUpgrade);
    return () => window.removeEventListener('show-upgrade-modal', handleShowUpgrade);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const updateUser = async (updatedUser: User) => {
    // For future use with profile updates
  };

  const handleAuthSuccess = () => {
    setActiveTab('home');
    setShowOnboarding(false); // Ensure onboarding is hidden if they sign in
  };

  const handleDismissBanner = () => {
    setShowFloatingBanner(false);
    sessionStorage.setItem('upgrade_banner_dismissed', 'true');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1120]">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isFreeUser = user && userProfile?.subscription === 'free';

  // Auth check removed - always allow access


  return (
    <>
      
      <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        toggleTheme={toggleTheme} 
        currentTheme={theme}
      >
        {activeTab === 'home' && (
          <Home 
            user={appUser} 
            onNavigate={setActiveTab} 
            onLogout={() => {}}
          />
        )}
        {activeTab === 'idea' && (
          <IdeaGenerator user={appUser} updateUser={updateUser} onNavigate={setActiveTab} />
        )}
        {activeTab === 'caption' && (
          <CaptionGenerator user={appUser} updateUser={updateUser} onNavigate={setActiveTab} />
        )}
        {activeTab === 'contact' && (
          <Contact />
        )}
        {activeTab === 'info' && (
          <Info />
        )}

        {activeTab === 'business' && (
          <BusinessHub user={appUser} onNavigate={setActiveTab} />
        )}



        <Toast 
          message={toastConfig.message}
          type={toastConfig.type}
          isVisible={toastConfig.isVisible}
          onClose={() => setToastConfig(prev => ({ ...prev, isVisible: false }))}
        />
      </Layout>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
