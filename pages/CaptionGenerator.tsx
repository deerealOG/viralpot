
import React, { useState, useEffect } from 'react';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { Sparkles, Lightbulb, Copy, Download, Save } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { TextExpander } from '../components/TextExpander';
import { MagicTextArea } from '../components/MagicTextArea';
import { ShareButton } from '../components/ShareButton';
import { CaptionGeneratorSkeleton } from '../components/Skeleton';
import { generateCaptions, rewriteViral } from '../services/gemini';
import { db } from '../services/db';
import { toast } from '../services/toast';
import { exportAllCaptions, copyToClipboard as exportCopy } from '../services/export';
import { CaptionResult, User } from '../types';

interface CaptionGeneratorProps {
  user: User;
  updateUser: (user: User) => Promise<void>;
}

export const CaptionGenerator: React.FC<CaptionGeneratorProps> = ({ user, updateUser }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CaptionResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [rewritingIndex, setRewritingIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    // Credit Check
    // Credits removed - app is now free
    
    setLoading(true);
    setSaved(false);
    setResult(null);

    try {
      // Defaulting to Instagram Post and Casual & Friendly tone for simplicity
      const data = await generateCaptions(topic, 'Casual & Friendly', 'Instagram', 'Post', []);
      setResult(data);

      // No credit deduction - app is free
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
      await db.saved.add(user.id, 'caption', result, topic || "Visual Post", 'Instagram');
      setSaved(true);
      toast.success("Captions saved to history!");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleExportAll = async () => {
    if (!result) return;
    const formatted = exportAllCaptions(result);
    const success = await exportCopy(formatted);
    if (success) {
      toast.success('All captions copied to clipboard!');
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleViralRewrite = async (index: number) => {
      if(!result) return;

      // Credit Check
      // Credits removed - app is now free

      setRewritingIndex(index);
      try {
          const newCaption = await rewriteViral(result.captions[index]);
          const newCaptions = [...result.captions];
          newCaptions[index] = newCaption;
          setResult({ ...result, captions: newCaptions });

          // No credit deduction - app is free
      } finally {
          setRewritingIndex(null);
      }
  };





  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
      
      {/* Left Panel: Controls */}
      <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-6 overflow-y-auto pr-2 pb-20">
          <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Caption Writer</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Turn your photos into stories that drive engagement.</p>
          </div>

          <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <MagicTextArea 
                  label="What is your post about?"
                  placeholder="e.g. A photo of me drinking coffee in Paris..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  context="caption"
                  className="min-h-[140px] text-base"
                  user={user}
              />

              <div className="flex flex-wrap gap-2">
                  {['☕ Morning Coffee', '✈️ Travel Vlog', '💼 Work Life', '🎉 Celebration', '🐶 Pet Love', '💪 Gym Progress'].map((t) => (
                      <button
                          key={t}
                          onClick={() => setTopic(t)}
                          className="text-xs px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400 transition-colors border border-slate-200 dark:border-slate-700 hover:border-teal-200 dark:hover:border-teal-800"
                      >
                          {t}
                      </button>
                  ))}
              </div>

              <Button 
                  fullWidth 
                  onClick={handleGenerate} 
                  disabled={!topic.trim() || loading} 
                  isLoading={loading}
                  className="py-4 text-base bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg shadow-teal-500/20"
              >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Captions
              </Button>
          </div>
      </div>

      {/* Right Panel: Results */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 lg:p-10 overflow-y-auto relative">
          {!result && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 opacity-60">
                  <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                      <Sparkles className="w-10 h-10" />
                  </div>
                  <p className="text-lg font-medium">Your captions will appear here.</p>
                  <p className="text-sm">Describe your image to get started.</p>
              </div>
          )}

          {loading && <CaptionGeneratorSkeleton />}

          {result && !loading && (
              <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                  
                  {/* Strategy Card */}
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-2xl p-6 border border-teal-100 dark:border-teal-900/50">
                      <h3 className="flex items-center gap-2 text-teal-900 dark:text-teal-300 font-bold mb-4">
                          <Lightbulb className="w-5 h-5" />
                          Posting Strategy
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                          <div>
                              <p className="text-xs font-bold uppercase text-teal-400 mb-1">Best Time to Post</p>
                              <p className="text-slate-800 dark:text-slate-200 font-medium">{result.strategy.bestTime}</p>
                          </div>
                          <div>
                              <p className="text-xs font-bold uppercase text-teal-400 mb-1">Tactical Advice</p>
                              <ul className="space-y-1">
                                  {result.strategy.postingTips.slice(0, 2).map((tip, i) => (
                                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                          <span className="text-teal-500 mt-1">•</span>
                                          {tip}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>
                  </div>

                  {/* Captions List */}
                  <div className="space-y-6">
                      {result.captions.map((caption, idx) => (
                          <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow relative group">
                              <div className="flex justify-between items-start mb-4">
                                  <span className="inline-block px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-bold text-slate-500 uppercase">
                                      {idx === 0 ? 'Short & Punchy' : idx === 1 ? 'Engaging / Question' : 'Storytelling'}
                                  </span>
                                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => copyToClipboard(caption)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                          <Copy className="w-4 h-4" />
                                      </button>
                                      <ShareButton title={`Caption ${idx+1}`} text={caption} />
                                  </div>
                              </div>
                              
                              <TextExpander text={caption} className="text-slate-800 dark:text-slate-200 text-base leading-relaxed whitespace-pre-wrap" />
                              
                              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                  <button 
                                      onClick={() => handleViralRewrite(idx)}
                                      disabled={rewritingIndex === idx}
                                      className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2 hover:underline"
                                  >
                                      {rewritingIndex === idx ? (
                                          <>
                                              <Sparkles className="w-3 h-3 animate-spin" />
                                              Rewriting...
                                          </>
                                      ) : (
                                          <>
                                              <Sparkles className="w-3 h-3" />
                                              Make it Viral (AI Rewrite)
                                          </>
                                      )}
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* Hashtags */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Recommended Hashtags</h3>
                      <div className="flex flex-wrap gap-2">
                          {result.hashtags.map((tag, idx) => (
                              <span key={idx} className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer" onClick={() => copyToClipboard(tag)}>
                                  {tag.startsWith('#') ? tag : `#${tag}`}
                              </span>
                          ))}
                      </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 pb-20">
                      <Button variant="secondary" onClick={handleExportAll}>
                          <Download className="w-4 h-4 mr-2" />
                          Export All
                      </Button>
                      <Button onClick={handleSave} disabled={saved || saving} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                          <Save className="w-4 h-4 mr-2" />
                          {saved ? 'Saved' : 'Save Results'}
                      </Button>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};
