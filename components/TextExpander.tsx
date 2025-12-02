import React, { useState } from 'react';

interface TextExpanderProps {
  text: string;
  limit?: number;
  className?: string;
}

export const TextExpander: React.FC<TextExpanderProps> = ({ text, limit = 150, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= limit) {
    return <p className={`whitespace-pre-wrap ${className}`}>{text}</p>;
  }

  return (
    <div className={className}>
      <p className="whitespace-pre-wrap">
        {isExpanded ? text : `${text.slice(0, limit)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
      >
        {isExpanded ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
};
