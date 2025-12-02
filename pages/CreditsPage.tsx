import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User } from '../types';
import { getCreditTasks, CREDIT_PACKAGES, PRO_FEATURES, PRO_PRICE } from '../services/credits';
import { db } from '../services/db';
import { toast } from '../services/toast';

interface CreditsPageProps {
  user: User;
  updateUser: (user: User) => Promise<void>;
}

export const CreditsPage: React.FC<CreditsPageProps> = ({ user, updateUser }) => {
  const [claiming, setClaiming] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    const checkHistory = async () => {
       const history = await db.saved.list(user.id);
       if (history.length > 0) {
           setHasGenerated(true);
       }
    };
    checkHistory();
  }, [user.id]);

  const tasks = React.useMemo(() => {
      const t = getCreditTasks(user);
      // Override generate_first based on history check
      const genTask = t.find(x => x.id === 'generate_first');
      if (genTask) {
          const claimed = user.claimed_tasks?.includes('generate_first');
          genTask.canClaim = hasGenerated && !claimed;
          genTask.completed = !!claimed;
      }
      return t;
  }, [user, hasGenerated]);

  const handleClaimTask = async (taskId: string) => {
    setClaiming(taskId);
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newClaimed = [...(user.claimed_tasks || [])];
      if (taskId !== 'daily_login') {
          newClaimed.push(taskId);
      }

      const updatedUser: User = {
        ...user,
        credits: user.credits + task.reward,
        last_daily_claim: taskId === 'daily_login' ? Date.now() : user.last_daily_claim,
        claimed_tasks: newClaimed
      };

      await updateUser(updatedUser);
      toast.success(`+${task.reward} credits earned! 🎉`);
    } catch (e) {
      toast.error('Failed to claim reward');
    } finally {
      setClaiming(null);
    }
  };

  const handlePurchase = async (packageId: string) => {
    const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
    if (!pkg) return;
    
    if (confirm(`Mock Payment: Buy ${pkg.credits} credits for ${pkg.price}?`)) {
        try {
            await updateUser({
                ...user,
                credits: user.credits + pkg.credits
            });
            toast.success(`Successfully purchased ${pkg.credits} credits!`);
        } catch (e) {
            toast.error("Purchase failed");
        }
    }
  };

  const handleUpgradePro = async () => {
    if (confirm(`Mock Payment: Upgrade to Pro for ${PRO_PRICE}?`)) {
        try {
            await updateUser({
                ...user,
                tier: 'pro'
            });
            toast.success("Welcome to Pro! 🚀 Unlimited generations unlocked.");
        } catch (e) {
            toast.error("Upgrade failed");
        }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Earn & Buy Credits</h2>
        <p className="text-slate-500 dark:text-slate-400">Complete tasks or purchase credits to unlock more AI generations</p>
      </div>

      {/* Current Balance */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white text-center shadow-xl shadow-blue-500/20">
        <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-2">Your Balance</p>
        <p className="text-6xl font-bold mb-2">{user.tier === 'pro' ? '∞' : user.credits}</p>
        <p className="text-blue-100 text-sm">{user.tier === 'pro' ? 'Pro Plan Active' : 'Credits Available'}</p>
      </div>

      {/* Earn Credits Section */}
      {user.tier !== 'pro' && (
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">🎯</span> Earn Free Credits
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className={task.completed ? 'opacity-60' : ''}>
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white">{task.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    +{task.reward} credits
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleClaimTask(task.id)}
                    disabled={!task.canClaim || claiming === task.id}
                    isLoading={claiming === task.id}
                    className="text-xs"
                    variant={task.completed ? 'secondary' : 'primary'}
                  >
                    {task.completed ? '✓ Claimed' : 'Claim'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      )}

      {/* Buy Credits Section */}
      {user.tier !== 'pro' && (
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">💳</span> Buy Credits
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {CREDIT_PACKAGES.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`relative ${pkg.popular ? 'ring-2 ring-amber-500 dark:ring-amber-400' : ''}`}
            >
              {pkg.label && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {pkg.label}
                </div>
              )}
              <div className="text-center space-y-4 py-4">
                <p className="text-4xl font-bold text-slate-900 dark:text-white">{pkg.credits}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Credits</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{pkg.price}</p>
                <Button
                  fullWidth
                  onClick={() => handlePurchase(pkg.id)}
                  className={pkg.popular ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' : ''}
                >
                  Purchase
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      )}

      {/* Pro Tier Upgrade */}
      {user.tier === 'free' ? (
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200 dark:border-emerald-800">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="text-3xl">✨</span> Upgrade to Pro
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Skip credits entirely. Get unlimited generations plus exclusive features.
              </p>
              <div className="grid md:grid-cols-2 gap-x-4 gap-y-2 mb-4">
                {PRO_FEATURES.map((feature, idx) => (
                  <p key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">{feature.split(' ')[0]}</span>
                    <span>{feature.slice(feature.indexOf(' ') + 1)}</span>
                  </p>
                ))}
              </div>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{PRO_PRICE}</p>
              <Button
                onClick={handleUpgradePro}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20"
              >
                Upgrade Now
              </Button>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Cancel anytime</p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200 dark:border-emerald-800">
            <div className="text-center py-8">
                <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                    ✨ You are a Pro Member
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                    Enjoy unlimited generations and premium features.
                </p>
            </div>
        </Card>
      )}
    </div>
  );
};
