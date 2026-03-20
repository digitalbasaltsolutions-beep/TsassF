'use client';
import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AnalyticsPage() {
  const stats = [
    { name: 'Total Revenue', value: '$12,450', change: '+12.5%', icon: DollarSign, color: 'text-emerald-600', trend: 'up' },
    { name: 'Active Users', value: '1,240', change: '+5.2%', icon: Users, color: 'text-blue-600', trend: 'up' },
    { name: 'Conversion Rate', value: '3.2%', change: '-0.8%', icon: TrendingUp, color: 'text-amber-600', trend: 'down' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-none">Platform Analytics</h1>
        <p className="text-gray-500 mt-3 font-medium text-sm">Real-time performance metrics across all your subscribed products.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-gray-50 border border-gray-100 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-black uppercase tracking-widest ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">{stat.name}</p>
            <p className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-[2.5rem] p-12 text-center shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/30 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-3">Deeper Insights Coming Soon</h2>
          <p className="text-gray-500 max-w-md mx-auto font-medium text-sm leading-relaxed mb-8">
            We are building a unified intelligence engine to help you correlate CRM data with Ecommerce sales and Marketing reach.
          </p>
          <button className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-xl transition-all">
            Join Beta Waitlist
          </button>
        </div>
      </div>
    </div>
  );
}
