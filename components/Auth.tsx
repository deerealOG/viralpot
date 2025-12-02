
import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { db } from '../services/db';
import { User, LastLoginUser } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<'welcome-back' | 'login'>('login');
  const [lastUser, setLastUser] = useState<LastLoginUser | null>(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'creator' | 'business' | 'agency'>('creator');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const last = db.auth.getLastLogin();
    if (last) {
        setLastUser(last);
        setView('welcome-back');
    }
  }, []);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const user = await db.auth.login(email, role);
      onLogin(user);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
      if(!lastUser) return;
      setLoading(true);
      try {
          const user = await db.auth.login(lastUser.email, lastUser.role, lastUser.name, lastUser.avatar);
          onLogin(user);
      } catch(e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
      setLoading(true);
      setRedirecting(true);
      
      // Simulate real redirect delay
      setTimeout(async () => {
        try {
            let simulatedEmail = '';
            let simulatedName = '';
            let simulatedAvatar = '';
            
            if (provider === 'google') {
                simulatedEmail = 'alex.creator@gmail.com';
                simulatedName = 'Alex Creator';
                simulatedAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
            } else {
                simulatedEmail = 'sarah.design@icloud.com';
                simulatedName = 'Sarah Designer';
                simulatedAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
            }
            
            const user = await db.auth.login(simulatedEmail, role, simulatedName, simulatedAvatar);
            onLogin(user);
        } catch (e) {
            console.error(e);
            setRedirecting(false);
        } finally {
            setLoading(false);
        }
      }, 2000);
  };

  if (redirecting) {
      return (
          <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0f172a]">
              <div className="text-center space-y-4 animate-fade-in">
                  <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">Redirecting to Google...</h3>
                  <p className="text-sm text-slate-500">Please wait while we verify your credentials.</p>
              </div>
          </div>
      );
  }

  if (view === 'welcome-back' && lastUser) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#0f172a] p-4">
             <div className="w-full max-w-sm animate-scale-in">
                 <div className="text-center mb-6">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-orange-600 text-white font-bold text-xl shadow-lg">
                        V
                    </div>
                 </div>
                 <Card className="text-center p-8 border-slate-200 dark:border-slate-800 shadow-2xl">
                     <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 p-1 mb-4 relative">
                        <img src={lastUser.avatar} alt="Avatar" className="w-full h-full rounded-full" />
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                     </div>
                     <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome back, {lastUser.name || 'Creator'}!</h2>
                     <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{lastUser.email}</p>
                     
                     <Button fullWidth onClick={handleQuickLogin} isLoading={loading}>
                         Continue as {lastUser.role}
                     </Button>

                     <button 
                        onClick={() => setView('login')}
                        className="mt-4 text-sm text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                     >
                         Switch Account
                     </button>
                 </Card>
             </div>
        </div>
      );
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0B1120]">
      {/* Left Side - Visual (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/40 via-purple-500/40 to-blue-500/40 opacity-70"></div>
         <div className="absolute inset-0 backdrop-blur-3xl"></div>
         <div className="relative z-10 flex flex-col justify-between p-16 text-white h-full">
             <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 font-bold text-xl">V</div>
                <span className="text-xl font-bold tracking-tight">ViralPot</span>
             </div>
             
             <div className="space-y-6 max-w-lg">
                 <h2 className="text-5xl font-bold leading-tight">Create content that <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">stops the scroll.</span></h2>
                 <p className="text-lg text-slate-300 leading-relaxed">Join 10,000+ creators and brands using AI to generate viral hooks, captions, and strategies in seconds.</p>
             </div>

             <div className="flex items-center gap-4 text-sm text-slate-400">
                 <div className="flex -space-x-2">
                     {[1,2,3,4].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900"></div>
                     ))}
                 </div>
                 <p>Trusted by top creators</p>
             </div>
         </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
            <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h1>
                <p className="text-slate-500 dark:text-slate-400">Enter your details to access your workspace.</p>
            </div>

            <div className="space-y-6">
                {/* Role Selector - Segmented Control */}
                <div className="bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl flex">
                    {[
                        { id: 'creator', label: 'Creator' },
                        { id: 'business', label: 'Business' },
                        { id: 'agency', label: 'Agency' }
                    ].map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setRole(option.id as any)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                                role === option.id 
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <div className="grid gap-3">
                    <button
                        onClick={() => handleSocialLogin('google')}
                        disabled={loading}
                        className="flex items-center justify-center gap-3 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Continue with Google
                    </button>
                    <button
                        onClick={() => handleSocialLogin('apple')}
                        disabled={loading}
                        className="flex items-center justify-center gap-3 w-full bg-black text-white rounded-xl px-4 py-3 font-medium hover:opacity-90 transition-opacity"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74s2.57-.99 4.31-.74c.58.03 2.2.21 3.24 1.73-2.87 1.47-2.4 5.22.62 6.38-.68 1.83-1.61 3.55-3.25 4.86zM13 6.6c1.11-1.39 1.84-3.37 1.67-5.4-1.66.08-3.7 1.15-4.88 2.53-1.02 1.25-1.92 3.33-1.68 5.35 1.87.14 3.82-1.03 4.89-2.48z"/></svg>
                        Continue with Apple
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-[#0B1120] px-2 text-slate-500">Or continue with email</span>
                    </div>
                </div>

                <form onSubmit={handleStandardLogin} className="space-y-4">
                    <Input 
                        type="email" 
                        placeholder="name@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 rounded-xl py-3"
                    />
                    <Button type="submit" fullWidth isLoading={loading} className="py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90">
                        Sign In
                    </Button>
                </form>

                <button
                    onClick={async () => {
                        setLoading(true);
                        const user = await db.auth.loginAsGuest();
                        onLogin(user);
                        setLoading(false);
                    }}
                    disabled={loading}
                    className="w-full text-center text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    Continue as Guest
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
