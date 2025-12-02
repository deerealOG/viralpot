import React, { useState } from 'react';
import { User } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input, Select } from '../components/Input';
import { MagicTextArea } from '../components/MagicTextArea';
import { db } from '../services/db';
import { toast } from '../services/toast';
import { ArrowRight, Check, Target, Smartphone, User as UserIcon, Sparkles } from 'lucide-react';

interface OnboardingProps {
  user: User;
  onComplete: () => void;
}

const NICHES = [
  'Tech & Coding', 'Health & Fitness', 'Fashion & Style', 
  'Business & Finance', 'Travel & Adventure', 'Food & Cooking',
  'Gaming', 'Education', 'Entertainment', 'Motivation'
];

const PLATFORMS = [
  'Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Twitter/X', 'Facebook'
];

export const Onboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState('');
  const [customNiche, setCustomNiche] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlatformToggle = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleNext = () => {
    if (step === 1 && !niche && !customNiche) {
      toast.error('Please select or enter a niche');
      return;
    }
    if (step === 2 && selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const finalNiche = niche === 'Other' ? customNiche : niche;
      const updatedUser: User = {
        ...user,
        niche: finalNiche,
        platforms: selectedPlatforms,
        bio,
        onboardingCompleted: true
      };
      
      await db.auth.updateUser(updatedUser);
      toast.success("Profile setup complete! Let's go viral.");
      onComplete();
    } catch (e) {
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
            <span className={step >= 1 ? 'text-orange-500' : ''}>1. Niche</span>
            <span className={step >= 2 ? 'text-orange-500' : ''}>2. Platforms</span>
            <span className={step >= 3 ? 'text-orange-500' : ''}>3. Bio</span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="p-8 animate-fade-in-up">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">What's your content niche?</h2>
                <p className="text-slate-500">This helps us generate relevant ideas for you.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {NICHES.map(n => (
                  <button
                    key={n}
                    onClick={() => setNiche(n)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      niche === n 
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                    onClick={() => setNiche('Other')}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      niche === 'Other' 
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Other
                  </button>
              </div>

              {niche === 'Other' && (
                <Input 
                  label="Enter your specific niche"
                  placeholder="e.g. Underwater Basket Weaving"
                  value={customNiche}
                  onChange={(e) => setCustomNiche(e.target.value)}
                  autoFocus
                />
              )}

              <Button fullWidth onClick={handleNext} disabled={!niche}>
                Next Step <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Where do you post?</h2>
                <p className="text-slate-500">Select all platforms you want to dominate.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {PLATFORMS.map(p => (
                  <button
                    key={p}
                    onClick={() => handlePlatformToggle(p)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      selectedPlatforms.includes(p)
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 ring-1 ring-teal-500'
                        : 'border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedPlatforms.includes(p) ? 'bg-teal-500 border-teal-500' : 'border-slate-300'
                    }`}>
                      {selectedPlatforms.includes(p) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="font-medium">{p}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                 <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                 <Button fullWidth onClick={handleNext} disabled={selectedPlatforms.length === 0}>
                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                 </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                  <UserIcon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Tell us about you</h2>
                <p className="text-slate-500">A short bio helps AI match your tone.</p>
              </div>

              <MagicTextArea 
                label="Your Bio / Brand Statement"
                placeholder="I help small businesses scale using Facebook Ads..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                context="bio"
                user={{
                  ...user,
                  niche: niche === 'Other' ? customNiche : niche,
                  platforms: selectedPlatforms,
                  bio: ''
                }}
              />

              <div className="flex gap-3">
                 <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                 <Button fullWidth onClick={handleSubmit} isLoading={loading}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Complete Setup
                 </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
