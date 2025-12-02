import React, { useEffect, useState } from 'react';
import { Star, Bookmark, Trash2, RotateCw, Sparkles } from 'lucide-react';
import { Card } from '../components/Card';
import { TextExpander } from '../components/TextExpander';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { HistorySkeleton } from '../components/Skeleton';
import { db } from '../services/db';
import { generateCaptions } from '../services/gemini';
import { toast } from '../services/toast';
import { SavedItem, User, IdeaResult, CaptionResult } from '../types';

interface HistoryProps {
    user: User;
}

type FilterTab = 'all' | 'favorites' | 'templates';

export const History: React.FC<HistoryProps> = ({ user }) => {
    const [items, setItems] = useState<SavedItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<SavedItem[]>([]);
    const [remixingId, setRemixingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<FilterTab>('all');
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [templateName, setTemplateName] = useState('');

    useEffect(() => {
        loadItems();
    }, [user.id]);

    useEffect(() => {
        filterItems();
    }, [items, activeTab]);

    const loadItems = async () => {
        const data = await db.saved.list(user.id);
        setItems(data);
        setLoading(false);
    };

    const filterItems = () => {
        let filtered = items;
        if (activeTab === 'favorites') {
            filtered = items.filter(i => i.isFavorite);
        } else if (activeTab === 'templates') {
            filtered = items.filter(i => i.isTemplate);
        }
        setFilteredItems(filtered);
    };

    const handleToggleFavorite = async (id: string) => {
        await db.saved.toggleFavorite(id);
        await loadItems();
        toast.success('Updated!');
    };

    const handleSaveAsTemplate = async () => {
        if (!templateName.trim()) return;
        await db.saved.saveAsTemplate(selectedItemId, templateName);
        setShowTemplateModal(false);
        setTemplateName('');
        await loadItems();
        toast.success('Saved as template!');
    };

    const handleDelete = async (id: string) => {
        await db.saved.delete(id);
        setItems(items.filter(i => i.id !== id));
    };

    const handleRemix = async (item: SavedItem) => {
        if (item.type !== 'caption') return;
        setRemixingId(item.id);
        try {
            const newResult = await generateCaptions(
                item.topic,
                'Casual & Friendly',
                item.platform,
                'Post',
                []
            );
            await db.saved.add(user.id, 'caption', newResult, `${item.topic} (Remix)`, item.platform);
            toast.success('New variations generated!');
            loadItems();
        } catch (e) {
            toast.error('Failed to generate variations');
        } finally {
            setRemixingId(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 pb-12">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Viral Vault</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Loading your content...</p>
                </div>
                <HistorySkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Viral Vault</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Access your past wins and remix them for new success.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'all'
                            ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                    All ({items.length})
                </button>
                <button
                    onClick={() => setActiveTab('favorites')}
                    className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                        activeTab === 'favorites'
                            ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                    <Star className="w-4 h-4" />
                    Favorites ({items.filter(i => i.isFavorite).length})
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                        activeTab === 'templates'
                            ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                    <Bookmark className="w-4 h-4" />
                    Templates ({items.filter(i => i.isTemplate).length})
                </button>
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full">
                        {activeTab === 'all' ? (
                            <Sparkles className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                        ) : activeTab === 'favorites' ? (
                            <Star className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                        ) : (
                            <Bookmark className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                        )}
                    </div>
                    <h3 className="text-xl font-medium text-slate-900 dark:text-slate-300">
                        {activeTab === 'all' ? 'History is empty' : activeTab === 'favorites' ? 'No favorites yet' : 'No templates yet'}
                    </h3>
                    <p className="text-slate-500 max-w-xs">
                        {activeTab === 'all'
                            ? 'Your generated content will be saved here automatically.'
                            : activeTab === 'favorites'
                            ? 'Star your best content to find it quickly later.'
                            : 'Save content as templates to reuse successful formats.'}
                    </p>
                </div>
            )}

            {/* Items Grid */}
            <div className="grid gap-6">
                {filteredItems.map((item) => (
                    <Card key={item.id} className="relative group">
                        {/* Actions */}
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <button
                                onClick={() => handleToggleFavorite(item.id)}
                                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                                    item.isFavorite
                                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                        : 'bg-white/50 dark:bg-black/20 text-slate-400 hover:text-orange-500 dark:text-slate-600 dark:hover:text-orange-400'
                                }`}
                                title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                <Star className="w-5 h-5" fill={item.isFavorite ? 'currentColor' : 'none'} />
                            </button>
                            {!item.isTemplate && (
                                <button
                                    onClick={() => {
                                        setSelectedItemId(item.id);
                                        setShowTemplateModal(true);
                                    }}
                                    className="p-2 bg-white/50 dark:bg-black/20 rounded-full backdrop-blur-sm text-slate-400 hover:text-teal-500 dark:text-slate-600 dark:hover:text-teal-400 transition-colors"
                                    title="Save as template"
                                >
                                    <Bookmark className="w-5 h-5" />
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 bg-white/50 dark:bg-black/20 rounded-full backdrop-blur-sm text-slate-400 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item.type === 'idea' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' : 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400'}`}>
                                {item.type}
                            </span>
                            {item.isTemplate && (
                                <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 flex items-center gap-1">
                                    <Bookmark className="w-3 h-3" />
                                    Template
                                </span>
                            )}
                            <span className="text-xs text-slate-500">
                                {new Date(item.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                            {item.isTemplate && item.templateName ? item.templateName : item.topic}
                        </h3>

                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                            {item.type === 'idea' ? (
                                <div className="space-y-3">
                                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/50">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Hook</p>
                                        <p className="italic text-slate-900 dark:text-white">"{(item.content as IdeaResult).hook}"</p>
                                    </div>
                                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 pl-1">
                                        {(item.content as IdeaResult).ideas.slice(0, 3).map((i, idx) => (
                                            <li key={idx}>{i}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div>
                                        <TextExpander text={(item.content as CaptionResult).captions[0]} limit={100} />
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {(item.content as CaptionResult).hashtags.slice(0, 5).map((t, i) => (
                                            <span key={i} className="text-xs text-teal-500 dark:text-teal-400">{t.startsWith('#') ? t : `#${t}`}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mini Strategy display */}
                        {(item.content as any).strategy && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Best time: {(item.content as any).strategy.bestTime}</span>
                            </div>
                        )}

                        {/* Action buttons for captions */}
                        {item.type === 'caption' && (
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => handleRemix(item)}
                                    disabled={remixingId === item.id}
                                    className="flex items-center gap-2 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 disabled:opacity-50 transition-colors"
                                >
                                    {remixingId === item.id ? (
                                        <>
                                            <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <RotateCw className="w-3 h-3" />
                                            Remix (Generate New Variations)
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {/* Template Name Modal */}
            <Modal isOpen={showTemplateModal} onClose={() => setShowTemplateModal(false)} title="Save as Template">
                <div className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Give this template a memorable name so you can find it easily later.
                    </p>
                    <Input
                        label="Template Name"
                        placeholder="e.g. Product Launch Formula"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        autoFocus
                    />
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => setShowTemplateModal(false)}>
                            Cancel
                        </Button>
                        <Button fullWidth onClick={handleSaveAsTemplate} disabled={!templateName.trim()}>
                            Save Template
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
