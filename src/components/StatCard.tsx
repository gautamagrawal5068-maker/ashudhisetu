'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';
}

const colorStyles = {
  blue: {
    border: 'border-l-blue-500',
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    valueColor: 'text-blue-700 dark:text-blue-400',
  },
  green: {
    border: 'border-l-emerald-500',
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
    valueColor: 'text-emerald-700 dark:text-emerald-400',
  },
  yellow: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
    valueColor: 'text-amber-700 dark:text-amber-400',
  },
  red: {
    border: 'border-l-red-500',
    bg: 'bg-red-50',
    iconBg: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
    valueColor: 'text-red-700 dark:text-red-400',
  },
  purple: {
    border: 'border-l-purple-500',
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
    valueColor: 'text-purple-700 dark:text-purple-400',
  },
  orange: {
    border: 'border-l-orange-500',
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
    valueColor: 'text-orange-700 dark:text-orange-400',
  },
};

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  trend,
  trendUp,
  icon, 
  color = 'blue' 
}: StatCardProps) {
  const styles = colorStyles[color] || colorStyles.blue;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 border-l-4 ${styles.border} p-5 hover:shadow-md transition-all duration-200 group`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 truncate">
            {title}
          </p>
          <p className={`text-3xl font-extrabold ${styles.valueColor} tracking-tight leading-tight`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-1 text-xs font-medium">
              {trendUp !== undefined && (
                trendUp ? (
                  <ArrowUpRight size={14} className="text-emerald-500" />
                ) : (
                  <ArrowDownRight size={14} className="text-orange-500" />
                )
              )}
              <span className={trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"}>
                {trend}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className={`${styles.iconBg} rounded-lg p-2.5 ml-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
