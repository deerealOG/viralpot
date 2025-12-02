import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { db } from '../services/db';
import { SavedItem, User, IdeaResult, CaptionResult } from '../types';

interface SavedVaultProps {
    user: User;
}

export const SavedVault: React.FC<SavedVaultProps> = ({ user }) => {
    const [items, setItems] = useState<SavedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadItems();
    }, [user.id]);

    const loadItems = async () => {
        const data = await db.saved.list(user.id);
        setItems(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if(confirm("Delete this saved item?")) {
            await db.saved.delete(id);
            await loadItems();
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full">
                    <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 1 1 0-4h14a2 2 0 1 1 0 4M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8m-9 4h4"></path></svg>
                </div>
                <h3 className="text-xl font-medium text-slate-900 dark:text-slate-300">Your vault is empty</h3>
                <p className="text-slate-500 max-w-xs">Generated ideas and captions will appear here when you save them.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Saved Vault</h2>
            <div className="grid gap-6">
                {items.map((item) => (
                    <Card key={item.id} className="relative group">
                         <div className="absolute top-4 right-4">
                             <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors p-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"></path></svg>
                             </button>
                         </div>

                         <div className="flex items-center gap-3 mb-4">
                             <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${item.type === 'idea' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' : 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400'}`}>
                                {item.type}
                             </span>
                             <span className="text-xs text-slate-500">
                                {new Date(item.created_at).toLocaleDateString()}
                             </span>
                         </div>
                         
                         <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{item.topic}</h3>
                         
                         <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 text-sm text-slate-600 dark:text-slate-300 max-h-40 overflow-y-auto no-scrollbar border border-slate-200 dark:border-slate-800">
                            {item.type === 'idea' ? (
                                <div className="space-y-2">
                                    <p className="italic text-blue-600 dark:text-blue-300 mb-2">Hook: "{(item.content as IdeaResult).hook}"</p>
                                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                                        {(item.content as IdeaResult).ideas.slice(0, 2).map((i, idx) => (
                                            <li key={idx}>{i}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                     <p>
                                        {(item.content as CaptionResult).captions[0]}
                                     </p>
                                     <div className="text-blue-500 dark:text-blue-400 text-xs mt-2">
                                        {(item.content as CaptionResult).hashtags.slice(0,5).join(' ')}
                                     </div>
                                </div>
                            )}
                         </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};