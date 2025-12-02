import React, { useState, useEffect } from 'react';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { Lightbulb, Copy, Download, Share2, Save, Settings2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Select } from '../components/Input';
import { MagicTextArea } from '../components/MagicTextArea';
import { ShareButton } from '../components/ShareButton';
import { IdeaGeneratorSkeleton } from '../components/Skeleton';
import { generateIdeas } from '../services/gemini';
import { db } from '../services/db';
import { toast } from '../services/toast';
import { exportAllIdeas, exportIdeasAsJSON, exportIdeasAsMarkdown, downloadAsFile } from '../services/export';
import { IdeaResult, User } from '../types';

interface IdeaGeneratorProps {
  user: User;
  updateUser: (user: User) => Promise<void>;
}

const PLATFORM_POST_TYPES: Record<string, string[]> = {
  'Instagram': ['Reel', 'Carousel', 'Post', 'Story'],
  'TikTok': ['Video', 'Photo Mode'],
  'LinkedIn': ['Post', 'Article', 'Newsletter'],
  'Twitter / X': ['Tweet', 'Thread'],
  'Facebook': ['Post', 'Reel', 'Story'],
  'YouTube': ['Shorts', 'Long-form Video']
};

const TONE_OPTIONS = [
    { value: 'Professional & Authoritative', label: 'Professional' },
    { value: 'Witty & Sarcastic', label: 'Witty' },
    { value: 'Warm & Empathetic', label: 'Empathetic' },
    { value: 'Bold & Controversial', label: 'Bold' },
    { value: 'Educational & Informative', label: 'Educational' },
    { value: 'Casual & Friendly', label: 'Casual' },
];

export const IdeaGenerator: React.FC<IdeaGeneratorProps> = ({ user, updateUser }) => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [postType, setPostType] = useState('Post');
  const [tone, setTone] = useState('Professional & Authoritative');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IdeaResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setPostType(PLATFORM_POST_TYPES[platform][0]);
  }, [platform]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setSaved(false);
    setResult(null);

    try {
      const data = await generateIdeas(topic, tone, platform, postType);
      setResult(data);
    } catch (e) {
      toast.error("Something went wrong. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  useKeyboardShortcut('Enter', handleGenerate);

  const handleSave = async () => {
    if (!result || !user) return;
    setSaving(true);
    try {
      await db.saved.add(user.id, 'idea', result, topic, platform);
      setSaved(true);
      toast.success("Saved to vault");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const VIRAL_TOPICS = [
    "AI tools for productivity",
    "Sustainable living hacks",
    "Remote work lifestyle",
    "Personal finance tips for 20s",
    "Fitness myths debunked",
    "Hidden travel gems in Europe",
    "Easy meal prep recipes",
    "Digital marketing trends 2024"
  ];

  const handleSurpriseMe = () => {
      const random = VIRAL_TOPICS[Math.floor(Math.random() * VIRAL_TOPICS.length)];
      setTopic(random);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
      
      {/* Left Panel: Controls */}
      <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-6 overflow-y-auto pr-2 pb-20">
          <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Idea Generator</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Configure your parameters to generate viral concepts.</p>
          </div>

          <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                  <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Topic or Niche</label>
                      <button onClick={handleSurpriseMe} className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1 transition-colors">
                          <Sparkles className="w-3 h-3" /> Surprise Me
                      </button>
                  </div>
                  <MagicTextArea 
                      label=""
                      placeholder="e.g. Sustainable fashion tips for Gen Z..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      context="idea"
                      className="min-h-[100px] text-base"
                      user={user}
                  />
              </div>

              <div className="space-y-4">
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Platform</label>
                      <div className="grid grid-cols-3 gap-2">
                          {['Instagram', 'TikTok', 'LinkedIn', 'Twitter / X', 'YouTube', 'Facebook'].map(p => (
                              <button
                                  key={p}
                                  onClick={() => setPlatform(p)}
                                  className={`px-2 py-2 rounded-lg text-xs font-medium transition-all border ${
                                      platform === p 
                                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
                                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                                  }`}
                              >
                                  {p}
                              </button>
                          ))}
                      </div>
                  </div>

                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Format</label>
                      <select 
                          value={postType} 
                          onChange={(e) => setPostType(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                      >
                          {(PLATFORM_POST_TYPES[platform] || []).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                  </div>

                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Tone</label>
                      <select 
                          value={tone} 
                          onChange={(e) => setTone(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm px-4 py-2.5 outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                      >
                          {TONE_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                  </div>
              </div>

              <Button 
                  fullWidth 
                  onClick={handleGenerate} 
                  disabled={!topic.trim() || loading} 
                  isLoading={loading}
                  className="py-4 text-base bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg shadow-orange-500/20"
              >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Concepts
              </Button>
          </div>
      </div>

      {/* Right Panel: Results */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 lg:p-10 overflow-y-auto relative">
          {!result && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 opacity-60">
                  <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                      <Lightbulb className="w-10 h-10" />
                  </div>
                  <p className="text-lg font-medium">Your viral ideas will appear here.</p>
                  <p className="text-sm">Select your parameters and hit generate.</p>
              </div>
          )}

          {loading && <IdeaGeneratorSkeleton />}

          {result && !loading && (
              <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                  {/* Hook Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border-l-4 border-orange-500 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                          <Sparkles className="w-32 h-32" />
                      </div>
                      <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-4">The Golden Hook</h3>
                      <p className="text-2xl md:text-3xl font-serif italic text-slate-900 dark:text-white leading-tight">
                          "{result.hook}"
                      </p>
                      <div className="mt-6 flex gap-3">
                          <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(result.hook)}>
                              <Copy className="w-4 h-4 mr-2" /> Copy Hook
                          </Button>
                      </div>
                  </div>

                  {/* Ideas List */}
                  <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs">3</span>
                          Content Concepts
                      </h3>
                      {result.ideas.map((idea, idx) => (
                          <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-500/50 transition-colors group">
                              <div className="flex gap-4">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm">
                                      {idx + 1}
                                  </div>
                                  <div className="flex-1">
                                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{idea}</p>
                                  </div>
                                  <button onClick={() => navigator.clipboard.writeText(idea)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-opacity self-start">
                                      <Copy className="w-4 h-4" />
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* Strategy Box */}
                  <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                          <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-3 uppercase">Best Time to Post</h4>
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">{result.strategy.bestTime}</p>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800">
                          <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-3 uppercase">Pro Tips</h4>
                          <ul className="space-y-2">
                              {result.strategy.postingTips.slice(0, 2).map((tip, i) => (
                                  <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex gap-2">
                                      <span>•</span> {tip}
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>

                  <div className="flex justify-end pt-8 pb-20">
                      <Button onClick={handleSave} disabled={saved || saving}>
                          <Save className="w-4 h-4 mr-2" />
                          {saved ? 'Saved to Vault' : 'Save All Results'}
                      </Button>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};
