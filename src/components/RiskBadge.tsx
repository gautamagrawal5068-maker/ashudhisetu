'use client';

import React from 'react';

interface RiskBadgeProps {
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  size?: 'sm' | 'md';
}

const config = {
  Critical: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    dot: 'bg-red-500',
    pulse: true,
  },
  High: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
    pulse: false,
  },
  Medium: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    pulse: false,
  },
  Low: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    pulse: false,
  },
};

export default function RiskBadge({ level, size = 'sm' }: RiskBadgeProps) {
  const c = config[level];
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${c.bg} ${c.text} ${c.border} ${sizeClasses}`}
    >
      <span className="relative flex h-2 w-2">
        {c.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.dot} opacity-75`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${c.dot}`} />
      </span>
      {level}
    </span>
  );
}
