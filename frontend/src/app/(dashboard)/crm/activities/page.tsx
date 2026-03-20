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
  AlertCircle,
  MoreVertical,
  Filter,
  Activity,
  Smartphone
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ACTIVITY_ICONS: Record<string, any> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: FileText,
  task: CheckCircle2,
};

const ACTIVITY_COLORS: Record<string, string> = {
  call: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  email: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  meeting: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  note: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
  task: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/crm/activities');
      setActivities(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Activity Feed</h1>
          <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-1.5 shadow-inner">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
             <span className="text-xs font-bold text-zinc-300">Live Updates</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02]">
            <Plus className="w-4 h-4" />
            Log Activity
          </button>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
        {loading ? (
          <div className="space-y-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-24 bg-zinc-900/50 rounded-2xl animate-pulse ml-12" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-zinc-900/50 flex items-center justify-center text-zinc-700 mb-6 border border-zinc-800">
              <Activity className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No activity logged yet</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              Start logging your calls, emails, and meetings to keep track of your client interactions.
            </p>
          </div>
        ) : (
          <div className="relative ml-6">
            {/* Timeline Line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-zinc-800 to-transparent translate-x-[-24px]" />

            <div className="space-y-8">
              {activities.map((activity, idx) => {
                const Icon = ACTIVITY_ICONS[activity.type] || Activity;
                const statusColor = ACTIVITY_COLORS[activity.type] || 'text-zinc-400';

                return (
                  <div key={activity._id} className="relative group">
                    {/* Timeline Dot */}
                    <div className={cn(
                      "absolute left-0 translate-x-[-32px] top-4 w-4 h-4 rounded-full border-2 border-[#030712] transition-transform group-hover:scale-125 z-10",
                      statusColor.split(' ')[1] // Get background color
                    )} />

                    <div className="bg-[#111827] border border-zinc-800/80 rounded-2xl p-5 shadow-lg shadow-black/20 hover:border-blue-500/30 transition-all ml-4 group-hover:translate-x-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-xl border flex items-center justify-center", statusColor)}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-white capitalize">{activity.type} Interaction</h4>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                              {new Date(activity.date || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <button className="text-zinc-600 hover:text-zinc-400 p-1 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                        {activity.notes || 'No notes provided for this activity.'}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-2 group/user cursor-pointer">
                              <User className="w-3 h-3 text-zinc-500 group-hover/user:text-blue-400 transition-colors" />
                              <span className="text-[10px] font-bold text-zinc-400 group-hover/user:text-zinc-200 transition-colors">
                                {activity.contactId?.name || 'Unknown Contact'}
                              </span>
                           </div>
                           <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-zinc-500" />
                              <span className="text-[10px] font-bold text-zinc-400">
                                2:30 PM
                              </span>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
                           <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                           <span className="text-[10px] font-extrabold text-zinc-400 tracking-wider">COMPLETED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Right Feature Panel Mock (Communication Shortcuts) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-2 bg-zinc-950/50 backdrop-blur-md border-l border-y border-zinc-800/50 rounded-l-2xl z-20 shadow-2xl">
         {[
           { icon: MessageSquare, color: 'text-emerald-400', label: 'WhatsApp' },
           { icon: Phone, color: 'text-blue-400', label: 'Call' },
           { icon: Mail, color: 'text-purple-400', label: 'Email' },
           { icon: Smartphone, color: 'text-zinc-400', label: 'Viber' },
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
