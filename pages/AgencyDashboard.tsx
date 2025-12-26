
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { MagicTextArea } from '../components/MagicTextArea';
import { ShareButton } from '../components/ShareButton';
import { generateAudit } from '../services/gemini';

import { toast } from '../services/toast';
import { User, AuditResult } from '../types';

interface AgencyDashboardProps {
  user: User;
  updateUser: (user: User) => Promise<void>;
}

export const AgencyDashboard: React.FC<AgencyDashboardProps> = ({ user, updateUser }) => {
  const [clientNiche, setClientNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);


  const handleAudit = async () => {
      if(!clientNiche) return;

      // Credit Check
      // Credits removed - app is now free

      setLoading(true);
      try {
          const data = await generateAudit(clientNiche);
          setResult(data);

          // No credit deduction - app is free
      } catch(e) {
          toast.error('Error generating audit');
      } finally {
          setLoading(false);
      }
  };



  return (
    <div className="space-y-8 pb-12">
        <div className="flex items-end justify-between">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Client Success Hub</h2>
                <p className="text-slate-500 dark:text-slate-400">Win more pitches and deliver expert audits in record time.</p>
            </div>
            <div className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-xs font-bold uppercase">
                Agency Mode
            </div>
        </div>

        <Card title="Instant Client Audit">
            <div className="flex flex-col gap-4">
                <MagicTextArea 
                    label="Client Niche / Industry"
                    placeholder="e.g. Luxury Real Estate in Miami..."
                    value={clientNiche}
                    onChange={(e) => setClientNiche(e.target.value)}
                    context="agency"
                    className="h-24"
                    user={user}
                />
                <div className="w-full md:w-1/3 self-end">
                    <Button fullWidth onClick={handleAudit} isLoading={loading} className="h-12 mb-2">Run Audit</Button>
                </div>
            </div>
        </Card>

        {result && (
            <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
                <Card className="md:col-span-2 bg-slate-900 text-white border-slate-800">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-emerald-400">Competitor Analysis</h3>
                        <ShareButton title={`Audit for ${clientNiche}`} text={`Competitor Analysis: ${result.competitorAnalysis}`} className="bg-white/10 text-white hover:bg-white/20" />
                    </div>
                    <p className="text-slate-300 leading-relaxed">{result.competitorAnalysis}</p>
                </Card>

                <Card title="Content Gaps (Missed Opportunities)">
                    <ul className="space-y-3">
                        {result.contentGaps.map((gap, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                <span className="text-red-500 font-bold">✗</span>
                                {gap}
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card title="Recommended Strategy Pillars">
                    <ul className="space-y-3">
                        {result.recommendedPillars.map((pillar, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                <span className="text-green-500 font-bold">✓</span>
                                {pillar}
                            </li>
                        ))}
                    </ul>
                </Card>
                

            </div>
        )}
    </div>
  );
};
