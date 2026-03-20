'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { 
  Plus, 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar, 
  User, 
  Clock, 
  FileText,
  CheckCircle2,
  Trash2,
  MoreVertical,
  Filter,
  Activity,
  Smartphone,
  Zap,
  LayoutGrid
} from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/shared/Skeleton';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient.get('/analytics/recent', { params: { limit: 50 } });
      setActivities(res.data || []);
    } catch (e: any) {
      console.error(e);
      toast.error('Failed to load activity feed');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'CONTACT_CREATED': return { icon: User, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
      case 'DEAL_CREATED': return { icon: Briefcase, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 'DEAL_MOVED_STAGE': return { icon: Zap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      case 'CONTACT_DELETED': return { icon: Trash2, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
      case 'PIPELINE_CREATED': return { icon: LayoutGrid, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
      default: return { icon: Clock, color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20' };
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'CONTACT_CREATED': return 'New contact established';
      case 'DEAL_CREATED': return 'Market opportunity created';
      case 'DEAL_MOVED_STAGE': return 'Pipeline milestone reached';
      case 'CONTACT_DELETED': return 'Contact relationship archived';
      case 'PIPELINE_CREATED': return 'Sales infrastructure updated';
      default: return activity.type.replace(/_/g, ' ').toLowerCase();
    }
  };

  const Briefcase = LayoutGrid; // Shorthand if missing

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Audit Timeline</h1>
          <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-1.5 shadow-inner">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
             <span className="text-xs font-bold text-zinc-300">Organization Audit</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide pb-12">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-4 items-center pl-4">
                 <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                 <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-2 w-1/4 rounded-sm opacity-50" />
                 </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-zinc-900/50 flex items-center justify-center text-zinc-700 mb-6 border border-zinc-800">
              <Activity className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No activity logged yet</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              Your audit logs will populate automatically as your team manages contacts and deals.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((activity) => {
              const { icon: Icon, color: statusColor } = getActivityIcon(activity.type);
              const actor = activity.userId;

              return (
                <div key={activity._id} className="relative group">
                  <div className="bg-zinc-950/30 border border-zinc-800/80 rounded-3xl p-6 hover:border-blue-500/30 transition-all shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className={cn("p-2.5 rounded-xl border flex items-center justify-center", statusColor)}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-white capitalize tracking-tight">{getActivityText(activity)}</h4>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                            {new Date(activity.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                      <div className="flex items-center gap-4">
                         <div className="flex items-center gap-2 group/user cursor-default">
                            <User className="w-3.5 h-3.5 text-zinc-600 group-hover:text-blue-400 transition-all" />
                            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight group-hover:text-zinc-300 transition-all leading-none">
                               {actor ? `${actor.firstName} ${actor.lastName}` : 'System Action'}
                            </span>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 shadow-inner">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[9px] font-black text-emerald-500/80 tracking-widest uppercase leading-none">VERIFIED</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Communication Shortcuts */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-2 bg-zinc-950/50 backdrop-blur-md border-l border-y border-zinc-800/50 rounded-l-2xl z-20 shadow-2xl">
         {[
           { icon: MessageSquare, color: 'text-emerald-400', label: 'WhatsApp' },
           { icon: Phone, color: 'text-blue-400', label: 'Call' },
           { icon: Mail, color: 'text-purple-400', label: 'Email' },
         ].map(tool => (
           <button key={tool.label} title={tool.label} className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all group/tool relative">
              <tool.icon className={cn("w-5 h-5", tool.color)} />
              <span className="absolute right-full mr-4 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-white opacity-0 group-hover/tool:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {tool.label}
              </span>
           </button>
         ))}
      </div>
    </div>
  );
}
