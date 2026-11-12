import React from 'react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  variant?: 'teal' | 'purple' | 'amber' | 'blue' | 'crimson';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'teal',
  className,
}) => {
  const borderStyles = {
    teal: 'border-slate-200 dark:border-teal-500/20 hover:border-teal-500/40',
    purple: 'border-slate-200 dark:border-purple-500/20 hover:border-purple-500/40',
    amber: 'border-slate-200 dark:border-amber-500/20 hover:border-amber-500/40',
    blue: 'border-slate-200 dark:border-blue-500/20 hover:border-blue-500/40',
    crimson: 'border-slate-200 dark:border-rose-500/20 hover:border-rose-500/40',
  }[variant];

  const iconBg = {
    teal: 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 border-teal-200 dark:border-teal-500/20',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    crimson: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20',
  }[variant];

  return (
    <div
      className={clsx(
        'bg-white dark:bg-[#101726] rounded-xl p-5 border shadow-sm dark:shadow-lg transition-all duration-200',
        borderStyles,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={clsx('p-2.5 rounded-lg border', iconBg)}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
            {trend}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};
