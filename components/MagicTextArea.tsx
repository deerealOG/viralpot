import React, { useState } from 'react';
import { enhanceText, generateSuggestion } from '../services/gemini';
import { User } from '../types';
import { Sparkles, Wand2 } from 'lucide-react';

interface MagicTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    context: 'idea' | 'caption' | 'business' | 'agency';
    onEnhanced?: (newText: string) => void;
    user?: User | null;
}

export const MagicTextArea: React.FC<MagicTextAreaProps> = ({ label, context, className = '', value, onChange, onEnhanced, user, ...props }) => {
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);

    const handleEnhance = async () => {
        if (!value || typeof value !== 'string') return;
        
        setIsEnhancing(true);
        try {
            const enhanced = await enhanceText(value, context);
            triggerChange(enhanced);
        } catch (e) {
            console.error(e);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleAutoFill = async () => {
        if (!user) return;
        setIsSuggesting(true);
        try {
            const suggestion = await generateSuggestion(context, user);
            triggerChange(suggestion);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSuggesting(false);
        }
    };

    const triggerChange = (newValue: string) => {
        if (onChange) {
            const event = {
                target: { value: newValue }
            } as React.ChangeEvent<HTMLTextAreaElement>;
            onChange(event);
        }
        if (onEnhanced) {
            onEnhanced(newValue);
        }
    };

    return (
        <div className="w-full space-y-2 group">
            <div className="flex justify-between items-center">
                {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
                <div className="flex gap-2">
                    {/* Auto-fill Button - Only show if user data is available and value is empty */}
                    {user && !value && (
                        <button
                            type="button"
                            onClick={handleAutoFill}
                            disabled={isSuggesting}
                            className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 disabled:opacity-50 transition-colors"
                        >
                            {isSuggesting ? <Sparkles className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            Auto-fill
                        </button>
                    )}
                    
                    {/* Enhance Button - Only show if there is value */}
                    {value && (
                        <button
                            type="button"
                            onClick={handleEnhance}
                            disabled={isEnhancing}
                            className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 disabled:opacity-50 transition-colors"
                        >
                            {isEnhancing ? <Wand2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                            AI Enhance
                        </button>
                    )}
                </div>
            </div>
            <div className="relative">
                <textarea
                    className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors resize-none ${className}`}
                    value={value}
                    onChange={onChange}
                    disabled={isEnhancing || isSuggesting}
                    {...props}
                />
                {(isEnhancing || isSuggesting) && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <span className="text-sm font-medium text-orange-600 dark:text-orange-400 animate-pulse">
                            {isSuggesting ? 'Generating suggestion...' : 'Refining your thought...'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
