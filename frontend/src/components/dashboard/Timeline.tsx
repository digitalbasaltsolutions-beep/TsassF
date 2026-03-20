'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { 
  Activity, 
  MessageSquare, 
  Phone, 
  Mail, 
  UserPlus, 
  CheckCircle2, 
  Clock,
  TrendingUp
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Timeline() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const res = await apiClient.get('/crm/timeline');
      setItems(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string, activityType?: string) => {
    if (type === 'note') return <MessageSquare className="w-3.5 h-3.5" />;
    switch (activityType) {
      case 'CALL': return <Phone className="w-3.5 h-3.5" />;
      case 'EMAIL': return <Mail className="w-3.5 h-3.5" />;
      case 'MEETING': return <Activity className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const getColor = (type: string, activityType?: string) => {
    if (type === 'note') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    switch (activityType) {
      case 'CALL': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'EMAIL': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'MEETING': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-zinc-900 rounded w-1/4" />
              <div className="h-3 bg-zinc-900 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-950/20 rounded-3xl border border-dashed border-zinc-800">
        <Clock className="w-10 h-10 text-zinc-700 mb-4" />
        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No Recent Activity</h4>
        <p className="text-[10px] text-zinc-500 mt-1 uppercase font-black leading-relaxed">Activities and notes will appear here as you engage with leads.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-zinc-800/50">
      {items.map((item, idx) => (
        <div key={item._id} className="relative flex gap-6 group">
          <div className={cn(
            "relative z-10 w-9 h-9 rounded-xl border flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
            getColor(item.timelineType, item.type)
          )}>
            {getIcon(item.timelineType, item.type)}
          </div>
          
          <div className="flex-1 pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-[11px] font-black text-white uppercase tracking-wider">
                {item.timelineType === 'note' ? 'Note Added' : `${item.type} LOGGED`}
              </h4>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-[13px] text-zinc-400 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">
              {item.content || item.description || item.subject}
            </p>
            {item.timelineType === 'activity' && (
              <div className="mt-2.5 flex items-center gap-2">
                 <div className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                   Completed
                 </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
