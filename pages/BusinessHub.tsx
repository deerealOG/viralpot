
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MagicTextArea } from '../components/MagicTextArea';
import { ShareButton } from '../components/ShareButton';
import { generateCampaign } from '../services/gemini';

import { toast } from '../services/toast';
import { User, CampaignResult } from '../types';

interface BusinessHubProps {
  user: User;
  updateUser: (user: User) => Promise<void>;
}

export const BusinessHub: React.FC<BusinessHubProps> = ({ user, updateUser }) => {
  const [product, setProduct] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CampaignResult | null>(null);


  const handleGenerate = async () => {
      if(!product || !goal) return;

      // Credit Check
      // Credits removed - app is now free

      setLoading(true);
      try {
          const data = await generateCampaign(product, goal);
          setResult(data);

          // No credit deduction - app is free
          toast.success(`Generated!`);
      } catch(e) {
          toast.error('Error generating campaign');
      } finally {
          setLoading(false);
      }
  };



  return (
    <div className="space-y-8 pb-12">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Growth Launchpad</h2>
            <p className="text-slate-500 dark:text-slate-400">Data-driven campaign strategies to scale your business.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
            <Card className="h-fit">
                <div className="space-y-6">
                    <MagicTextArea 
                        label="Product / Service Name"
                        placeholder="e.g. Summer Skincare Line..."
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        context="business"
                        className="h-24"
                        user={user}
                    />
                    <MagicTextArea 
                        label="Campaign Goal"
                        placeholder="e.g. Drive 500 signups, Increase brand awareness..."
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        context="business"
                        className="h-24"
                        user={user}
                    />
                    <Button fullWidth onClick={handleGenerate} isLoading={loading} disabled={!product || !goal}>
                        Generate Campaign Strategy
                    </Button>
                </div>
            </Card>

            {result && (
                <div className="space-y-6 animate-fade-in-up">
                    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-orange-900 dark:text-orange-300 mb-2">{result.campaignName}</h3>
                            <ShareButton title="Campaign Plan" text={`Campaign: ${result.campaignName}\nKPI: ${result.kpi}\nTarget: ${result.targetAudience}`} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                                <span className="block font-bold text-orange-400 text-xs uppercase">Target Audience</span>
                                <span className="text-slate-700 dark:text-slate-300">{result.targetAudience}</span>
                            </div>
                            <div>
                                <span className="block font-bold text-orange-400 text-xs uppercase">Main KPI</span>
                                <span className="text-slate-700 dark:text-slate-300">{result.kpi}</span>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-4">
                        {result.weeklyPlan.map((day, idx) => (
                            <div key={idx} className="flex gap-4 p-4 bg-white dark:bg-surface border border-slate-100 dark:border-slate-800 rounded-xl items-start">
                                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center font-bold text-sm">
                                    {day.day}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase mb-1">{day.focus}</h4>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm">{day.contentIdea}</p>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            )}
        </div>
    </div>
  );
};
