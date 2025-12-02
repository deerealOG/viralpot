import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, footer }) => {
  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface shadow-sm transition-colors duration-300 ${className}`}>
      {title && (
        <div className="border-b border-slate-200 dark:border-slate-700/50 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-200 dark:border-slate-700/50">
            {footer}
        </div>
      )}
    </div>
  );
};