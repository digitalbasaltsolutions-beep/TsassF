'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import ActivationChecklist from '@/components/dashboard/ActivationChecklist';
import UsageOverview from '@/components/dashboard/UsageOverview';
import Timeline from '@/components/dashboard/Timeline';
import { 
  Users, 
  LayoutGrid, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight,
  ChevronRight,
  Activity
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ contacts: 0, deals: 0, revenue: 0, growth: '+12.5%' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const [contactsRes, dealsRes] = await Promise.all([
          apiClient.get('/crm/contacts'),
          apiClient.get('/crm/deals')
        ]);
        
        const contacts = contactsRes.data.meta.total;
        const deals = dealsRes.data.meta.total;
        const revenue = dealsRes.data.data
          .filter((d: any) => d.status === 'Won')
          .reduce((sum: number, d: any) => sum + (d.value || 0), 0);

        setStats(prev => ({ ...prev, contacts, deals, revenue }));
      } catch (e) {
        console.error('Failed to fetch stats', e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
    <div className="bg-zinc-950/40 border border-zinc-800/50 p-6 rounded-3xl shadow-xl backdrop-blur-sm group hover:border-blue-500/30 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-2xl border", color)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-black bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</h3>
        <p className="text-2xl font-black text-white tracking-tighter">
          {typeof value === 'number' && label.includes('REV') ? `$${value.toLocaleString()}` : value.toLocaleString()}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Sales Performance</h1>
          <p className="text-zinc-500 mt-1 font-bold uppercase tracking-widest text-[10px]">Real-time intelligence across your organization</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold hover:text-white transition-all shadow-lg">
            Download Report
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-black shadow-xl shadow-blue-900/20 hover:bg-blue-500 transition-all active:scale-[0.98]">
            Configure Pipeline
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          label="Total Contacts" 
          value={stats.contacts} 
          icon={Users} 
          color="text-blue-400 bg-blue-500/10 border-blue-500/20"
          trend="+8%"
        />
        <StatCard 
          label="Active Deals" 
          value={stats.deals} 
          icon={LayoutGrid} 
          color="text-purple-400 bg-purple-500/10 border-purple-500/20"
          trend="+14%"
        />
        <StatCard 
          label="Wins Revenue" 
          value={stats.revenue} 
          icon={DollarSign} 
          color="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
          trend={stats.growth}
        />
        <StatCard 
          label="Conversion Rate" 
          value="24.8%" 
          icon={TrendingUp} 
          color="text-amber-400 bg-amber-500/10 border-amber-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-950/20 rounded-[2.5rem] border border-zinc-800/40 p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Activity className="w-5 h-5 text-blue-400" />
                 </div>
                 <h2 className="text-xl font-black text-white tracking-tight uppercase">Recent Activity</h2>
              </div>
              <button className="text-[10px] font-black text-zinc-500 hover:text-blue-400 transition-colors uppercase tracking-[0.2em] flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <Timeline />
          </div>
        </div>

        <div className="space-y-8">
          <UsageOverview />
          <ActivationChecklist />
          
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <h3 className="text-lg font-black tracking-tight mb-2 uppercase">Unlock Pro Insights</h3>
            <p className="text-blue-100 text-xs font-medium leading-relaxed mb-6 opacity-80">Get advanced reporting, automated sequences, and custom deal fields with our Pro plan.</p>
            <button className="w-full py-3 bg-white text-blue-600 font-black text-[11px] rounded-2xl shadow-xl hover:bg-blue-50 transition-all uppercase tracking-widest">
              Upgrade Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
