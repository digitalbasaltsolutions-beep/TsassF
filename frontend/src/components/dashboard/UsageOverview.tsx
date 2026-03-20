'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Zap, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function UsageOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const res = await apiClient.get('/billing/usage');
      setData(res.data);
    } catch (e) {
      console.error('Failed to fetch usage', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return (
    <div className="p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800 animate-pulse h-48" />
  );

  const { usage, limits, plan, isNearLimit } = data;

  const Metric = ({ label, current, limit }: { label: string; current: number; limit: number }) => {
    const percentage = Math.min((current / (limit || 1)) * 100, 100);
    const isFull = percentage >= 100;
    const isWarning = percentage >= 80;

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          <span>{label}</span>
          <span className={cn(isFull ? 'text-rose-500' : isWarning ? 'text-amber-500' : 'text-zinc-400')}>
            {current} / {limit === Infinity || !limit ? '∞' : limit}
          </span>
        </div>
        <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-800">
          <div 
            className={cn(
              "h-full transition-all duration-700",
              isFull ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-blue-600'
            )}
            style={{ width: `${limit === Infinity || !limit ? 0 : percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-zinc-950/30 rounded-3xl border border-zinc-800/80 space-y-6 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
           <span className="text-[11px] font-black text-white uppercase tracking-widest">{plan} PLAN</span>
        </div>
        {Object.values(isNearLimit || {}).some(v => v) && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="w-3 h-3 text-amber-500 animate-pulse" />
            <span className="text-[8px] font-black text-amber-500 uppercase">LIMIT REACHED</span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        <Metric label="Contacts" current={usage?.contacts || 0} limit={limits?.contacts} />
        <Metric label="Deals" current={usage?.deals || 0} limit={limits?.deals} />
        <Metric label="Team" current={usage?.members || 0} limit={limits?.members} />
      </div>

      <button 
        onClick={() => window.location.href = '/dashboard/billing'}
        className="group relative w-full overflow-hidden py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-black rounded-2xl border border-zinc-800 transition-all flex items-center justify-center space-x-2 shadow-inner"
      >
        <div className="absolute inset-0 bg-blue-600/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <span className="relative z-10 uppercase tracking-[0.1em]">UPGRADE LIMITS</span>
      </button>
    </div>
  );
}
