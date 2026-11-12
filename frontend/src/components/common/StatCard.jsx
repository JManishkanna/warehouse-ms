import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, alert = false }) {
  return (
    <div className={`p-5 rounded-lg border bg-white shadow-sm ${alert ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
        {Icon && (
          <div className={`p-2 rounded ${alert ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline">
        <span className={`text-2xl font-bold tracking-tight ${alert ? 'text-rose-600' : 'text-slate-900'}`}>{value}</span>
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}
