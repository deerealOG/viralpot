import React, { useState, useEffect } from 'react';
import { Toast, ToastType } from './components/Toast';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { IdeaGenerator } from './pages/IdeaGenerator';
import { CaptionGenerator } from './pages/CaptionGenerator';
import { Contact } from './pages/Contact';
import { Info } from './pages/Info';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Pricing } from './pages/Pricing';
import { Profile } from './pages/Profile';
import { Analytics } from './pages/Analytics';
import { UpgradeModal } from './components/UpgradeModal';
import { UpgradeBanner } from './components/UpgradeBanner';

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

  // Create a user object from auth or use default
  const appUser: User = user ? {
    id: user.uid,
    email: user.email || '',
    name: userProfile?.displayName || user.displayName || 'User',
    role: 'creator',
    avatar: userProfile?.photoURL || user.photoURL || '',
    created_at: userProfile?.createdAt?.toDate?.()?.getTime() || Date.now(),
    onboardingCompleted: true,
    niche: 'General',
    bio: 'Content Creator',
    isGuest: false
  } : DEFAULT_USER;

  // Show floating banner for free users after a delay
  useEffect(() => {
    if (user && userProfile?.subscription === 'free') {
      const timer = setTimeout(() => {
        const dismissed = sessionStorage.getItem('upgrade_banner_dismissed');
        if (!dismissed) {
          setShowFloatingBanner(true);
        }
      }, 30000); // Show after 30 seconds
      return () => clearTimeout(timer);
    }
  }, [user, userProfile]);

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

  return (
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
      {activeTab === 'signin' && (
        <SignIn 
          onNavigateToSignUp={() => setActiveTab('signup')}
          onSuccess={handleAuthSuccess}
          onForgotPassword={() => {}}
        />
      )}
      {activeTab === 'signup' && (
        <SignUp 
          onNavigateToSignIn={() => setActiveTab('signin')}
          onSuccess={handleAuthSuccess}
        />
      )}
      {activeTab === 'pricing' && (
        <Pricing 
          onNavigateToSignUp={() => setActiveTab('signup')}
          onNavigate={setActiveTab}
        />
      )}
      {activeTab === 'profile' && (
        <Profile 
          onNavigateToPricing={() => setActiveTab('pricing')}
          onLogout={() => setActiveTab('home')}
        />
      )}
      {activeTab === 'analytics' && (
        <Analytics onNavigate={setActiveTab} />
      )}

      {/* Floating Upgrade Banner for Free Users */}
      {showFloatingBanner && isFreeUser && activeTab !== 'pricing' && (
        <UpgradeBanner 
          onNavigate={setActiveTab}
          variant="floating"
          message="Unlock unlimited AI generations"
          dismissible
          onDismiss={handleDismissBanner}
        />
      )}

      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onNavigate={setActiveTab}
        feature={upgradeFeature}
      />

      <Toast 
        message={toastConfig.message}
        type={toastConfig.type}
        isVisible={toastConfig.isVisible}
        onClose={() => setToastConfig(prev => ({ ...prev, isVisible: false }))}
      />
    </Layout>
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
