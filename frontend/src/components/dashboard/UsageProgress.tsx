import React from 'react';
import { useUsage } from './hooks/useUsage';
import { AlertCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export const UsageProgress: React.FC = () => {
  const { usage, loading } = useUsage();

  if (loading || !usage) return <div className="p-4 animate-pulse bg-slate-50 rounded-xl h-32" />;

  const items = [
    { label: 'Contacts', current: usage.usage.contacts, limit: usage.limits.contacts },
    { label: 'Deals', current: usage.usage.deals, limit: usage.limits.deals },
    { label: 'Team', current: usage.usage.members, limit: usage.limits.members },
  ];

  const anyNearLimit = Object.values(usage.isNearLimit).some(v => v);

  return (
    <div className="p-4 bg-slate-50 rounded-xl space-y-4 border border-slate-100">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plan Usage</h4>
        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase">
          {usage.plan}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const percent = Math.min((item.current / item.limit) * 100, 100);
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium text-slate-600">
                <span>{item.label}</span>
                <span>{item.current} / {item.limit === Infinity ? '∞' : item.limit}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${percent > 90 ? 'bg-rose-500' : percent > 70 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {anyNearLimit && (
        <Link 
          href="/dashboard/billing"
          className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-100 group transition-all"
        >
          <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-[10px] font-bold text-amber-700 group-hover:underline">
            Approaching limits. Upgrade now →
          </span>
        </Link>
      )}
    </div>
  );
};
