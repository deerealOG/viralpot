
import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Toast, ToastType } from './components/Toast';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { IdeaGenerator } from './pages/IdeaGenerator';
import { CaptionGenerator } from './pages/CaptionGenerator';
import { BusinessHub } from './pages/BusinessHub';
import { AgencyDashboard } from './pages/AgencyDashboard';
import { History } from './pages/History';
import { Profile } from './pages/Profile';
import { Analytics } from './pages/Analytics';
import { Onboarding } from './pages/Onboarding';
import { ErrorBoundary } from './components/ErrorBoundary';
import { db } from './services/db';
import { User, NavTab } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [initializing, setInitializing] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [toastConfig, setToastConfig] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  // Initialize app state
  useEffect(() => {
    const init = async () => {
      const currentUser = db.auth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }

      // Initialize theme
      const savedTheme = localStorage.getItem('cv_theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        setTheme(savedTheme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
         setTheme('dark');
      } else {
         setTheme('light');
      }

      setInitializing(false);
    };
    init();

    // Toast Event Listener
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

  // Update theme class on HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cv_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = async () => {
    await db.auth.logout();
    setUser(null);
    setActiveTab('home');
  };

  const updateUser = async (updatedUser: User) => {
    const saved = await db.auth.updateUser(updatedUser);
    setUser(saved);
  };

  const handleOnboardingComplete = () => {
    if (user) {
      const updated = { ...user, onboardingCompleted: true };
      setUser(updated);
    }
  };

  if (initializing) {
    return <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center text-slate-900 dark:text-white">Loading...</div>;
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  if (!user.onboardingCompleted) {
    return <Onboarding user={user} onComplete={handleOnboardingComplete} />;
  }

  return (
    <ErrorBoundary>
      <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        toggleTheme={toggleTheme} 
        currentTheme={theme}
        user={user}
        onLogout={handleLogout}
      >
        {activeTab === 'home' && (
          <Home 
              user={user} 
              onNavigate={setActiveTab} 
              onLogout={handleLogout}
          />
        )}
        {activeTab === 'idea' && (
          <IdeaGenerator user={user} updateUser={updateUser} />
        )}
        {activeTab === 'caption' && (
          <CaptionGenerator user={user} updateUser={updateUser} />
        )}
        {activeTab === 'business' && user.role === 'business' && (
          <BusinessHub user={user} updateUser={updateUser} />
        )}
        {activeTab === 'agency' && user.role === 'agency' && (
          <AgencyDashboard user={user} updateUser={updateUser} />
        )}
        {activeTab === 'history' && (
          <History user={user} />
        )}
        {activeTab === 'analytics' && (
          <Analytics user={user} />
        )}
        {activeTab === 'profile' && (
          <Profile user={user} onLogout={handleLogout} onNavigate={setActiveTab} />
        )}
        <Toast 
          message={toastConfig.message}
          type={toastConfig.type}
          isVisible={toastConfig.isVisible}
          onClose={() => setToastConfig(prev => ({ ...prev, isVisible: false }))}
        />
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
