import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  status?: string;
  variant?: 'teal' | 'emerald' | 'amber' | 'crimson' | 'indigo' | 'slate' | 'purple';
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant,
  children,
  dot = true,
  className,
}) => {
  let resolvedVariant = variant;

  if (status) {
    const s = status.toUpperCase();
    if (['AUTHORIZED', 'ACTIVE', 'ACCEPTED', 'OPERATIONAL', 'PROTECTED', 'STABLE'].includes(s)) {
      resolvedVariant = 'emerald';
    } else if (['PENDING', 'DEACTIVATED', 'ROTATING', 'NORMAL_FASTING', 'WARNING'].includes(s)) {
      resolvedVariant = 'amber';
    } else if (['REVOKED', 'REJECTED', 'DESTROYED', 'COMPROMISED', 'CRITICAL', 'VULNERABLE'].includes(s)) {
      resolvedVariant = 'crimson';
    } else if (['CREATED', 'INFO'].includes(s)) {
      resolvedVariant = 'indigo';
    } else {
      resolvedVariant = 'slate';
    }
  }

  const colorStyles = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
    teal: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/60',
    amber: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60',
    crimson: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/60',
  }[resolvedVariant || 'slate'];

  const dotColors = {
    emerald: 'bg-emerald-500 dark:bg-emerald-400',
    teal: 'bg-teal-500 dark:bg-teal-400',
    amber: 'bg-amber-500 dark:bg-amber-400',
    crimson: 'bg-rose-500 dark:bg-rose-400',
    indigo: 'bg-indigo-500 dark:bg-indigo-400',
    purple: 'bg-purple-500 dark:bg-purple-400',
    slate: 'bg-slate-500 dark:bg-slate-400',
  }[resolvedVariant || 'slate'];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border font-mono tracking-wide',
        colorStyles,
        className
      )}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full animate-pulse', dotColors)} />}
      {children}
    </span>
  );
};
