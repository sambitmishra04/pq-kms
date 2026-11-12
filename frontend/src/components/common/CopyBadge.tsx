import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import clsx from 'clsx';

interface CopyBadgeProps {
  text: string;
  displayText?: string;
  truncateLength?: number;
  label?: string;
  className?: string;
}

export const CopyBadge: React.FC<CopyBadgeProps> = ({
  text,
  displayText,
  truncateLength = 12,
  label,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedText =
    displayText ||
    (text.length > truncateLength * 2
      ? `${text.slice(0, truncateLength)}...${text.slice(-truncateLength)}`
      : text);

  return (
    <button
      onClick={handleCopy}
      type="button"
      title="Click to copy full value"
      className={clsx(
        'group inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 dark:border-slate-700/80 text-xs font-mono text-slate-700 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300 transition-colors shadow-2xs',
        className
      )}
    >
      {label && <span className="text-slate-400 dark:text-slate-500 font-sans mr-0.5">{label}:</span>}
      <span className="truncate">{formattedText}</span>
      {copied ? (
        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
      ) : (
        <Copy className="w-3 h-3 text-slate-400 group-hover:text-teal-600 dark:text-slate-500 dark:group-hover:text-teal-400 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
};
