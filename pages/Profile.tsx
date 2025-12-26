import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Crown, Sparkles, MessageSquareText, LogOut, Settings, Calendar, Shield, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

interface ProfileProps {
  onNavigateToPricing: () => void;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigateToPricing, onLogout }) => {
  const { user, userProfile, logout, signIn, signUp, signInWithGoogle, error, loading } = useAuth();
  
  // Sign in/up form states
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setLocalError('Please enter your name');
          setIsLoading(false);
          return;
        }
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLocalError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setLocalError(err.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading only during initial auth check
  if (loading && !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not logged in, show auth form
  if (!user) {
    return (
      <div className="animate-fade-in max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 mb-4 shadow-lg shadow-orange-500/25">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {isSignUp ? 'Join ViralPot and start creating viral content' : 'Welcome back! Sign in to your account'}
          </p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-sm text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {(localError || error) && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{localError || error}</span>
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors shadow-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {isSignUp && (
              <p className="text-xs text-slate-400 mt-1">Must be at least 6 characters</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Sign In / Sign Up */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setLocalError('');
            }}
            className="text-orange-600 dark:text-orange-400 font-medium hover:underline"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    );
  }

  // If logged in but profile not loaded yet, wait a bit
  if (!userProfile) {
    console.log('Waiting for profile...', { user: user?.uid, userProfile });
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading your profile...</p>
      </div>
    );
  }

  const subscriptionLabel = {
    free: 'Free Plan',
    pro: 'Pro Plan',
    business: 'Business Plan'
  }[userProfile.subscription];

  const subscriptionColor = {
    free: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300',
    pro: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
    business: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400'
  }[userProfile.subscription];

  // Get avatar - use Google photo if available, otherwise show initial
  const avatarUrl = userProfile.photoURL || user.photoURL;
  const displayName = userProfile.displayName || user.displayName || user.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  // Format date
  const formatDate = () => {
    try {
      if (userProfile.createdAt?.toDate) {
        return userProfile.createdAt.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      return 'Recently joined';
    } catch {
      return 'Recently joined';
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-6 shadow-lg">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-12 mb-4">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={displayName}
                className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                {initial}
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {displayName}
              </h1>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mt-1">
                <Mail className="w-4 h-4" />
                <span>{userProfile.email || user.email}</span>
              </div>
            </div>
            
            <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${subscriptionColor}`}>
              <Crown className="w-4 h-4" />
              {subscriptionLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6 shadow-lg">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-orange-500" />
          Usage Statistics
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-orange-100 dark:border-orange-900/30">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Ideas Generated</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {userProfile.ideasGenerated}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Today: {userProfile.dailyIdeasUsed} / {userProfile.subscription === 'free' ? '5' : '∞'}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-teal-100 dark:border-teal-900/30">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-2">
              <MessageSquareText className="w-5 h-5" />
              <span className="font-medium">Captions Created</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {userProfile.captionsGenerated}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Today: {userProfile.dailyCaptionsUsed} / {userProfile.subscription === 'free' ? '5' : '∞'}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6 shadow-lg">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-orange-500" />
          Subscription
        </h2>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-900 dark:text-white">{subscriptionLabel}</p>
            {userProfile.subscription === 'free' && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Upgrade to unlock unlimited generations
              </p>
            )}
          </div>
          
          {userProfile.subscription === 'free' ? (
            <button
              onClick={onNavigateToPricing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all"
            >
              Upgrade Now
            </button>
          ) : (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6 shadow-lg">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Calendar className="w-5 h-5" />
          <span className="text-sm">Member since {formatDate()}</span>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
};
