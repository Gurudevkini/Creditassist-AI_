import React from 'react';

const colorMap = {
  emerald: {
    icon: 'text-emerald-400',
    value: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    glow: '0 0 20px rgba(16,185,129,0.15)',
  },
  blue: {
    icon: 'text-blue-400',
    value: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    glow: '0 0 20px rgba(59,130,246,0.15)',
  },
  crimson: {
    icon: 'text-red-400',
    value: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    glow: '0 0 20px rgba(239,68,68,0.15)',
  },
  purple: {
    icon: 'text-purple-400',
    value: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    glow: '0 0 20px rgba(168,85,247,0.15)',
  },
};

export default function MetricCard({ label, value, unit, trend, icon: Icon, color }) {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div
      className="glass-card rounded-2xl p-6 flex flex-col h-full min-w-0"
      style={{ boxShadow: colors.glow }}
    >
      <div className="flex items-start justify-between mb-4 gap-3">
        <span className="text-xs font-mono tracking-wider uppercase whitespace-normal break-words leading-snug" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </span>
        <div className={`p-2.5 rounded-xl ${colors.bg} border ${colors.border} flex-shrink-0`}>
          <Icon size={16} className={colors.icon} />
        </div>
      </div>
      <div className="flex items-baseline gap-1 mb-2 mt-auto">
        <span className={`font-display text-3xl font-bold ${colors.value}`} style={{ fontFamily: 'Syne, sans-serif' }}>
          {value}
        </span>
        {unit && (
          <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
            {unit}
          </span>
        )}
      </div>
      <div className="text-xs font-mono text-slate-400 font-medium">
        {trend}
      </div>
    </div>
  );
}
