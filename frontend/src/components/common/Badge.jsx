import React from 'react';

const VARIANTS = {
  default: 'bg-slate-100 text-slate-800 border-slate-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  danger: 'bg-rose-50 text-rose-800 border-rose-200',
  info: 'bg-sky-50 text-sky-800 border-sky-200',
  primary: 'bg-blue-50 text-blue-800 border-blue-200',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  const chosen = VARIANTS[variant] || VARIANTS.default;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded ${chosen} ${className}`}>
      {children}
    </span>
  );
}
