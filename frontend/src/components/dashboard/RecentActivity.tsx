'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Clock, Plus, Trash2, ArrowRight, User, Briefcase, Zap } from 'lucide-react';

import { Skeleton } from '@/components/shared/Skeleton';

export default function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res: any = await apiClient.get('/analytics/recent?limit=8');
      setActivities(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'CONTACT_CREATED': return <User className="w-3.5 h-3.5 text-blue-500" />;
      case 'DEAL_CREATED': return <Briefcase className="w-3.5 h-3.5 text-emerald-500" />;
      case 'DEAL_MOVED_STAGE': return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'CONTACT_DELETED': return <Trash2 className="w-3.5 h-3.5 text-rose-500" />;
      default: return <Clock className="w-3.5 h-3.5 text-zinc-500" />;
    }
  };

  const getActivityText = (activity: any) => {
    const { type, metadata } = activity;
    switch (type) {
      case 'CONTACT_CREATED': return 'New contact added';
      case 'DEAL_CREATED': return 'New deal pipeline created';
      case 'DEAL_MOVED_STAGE': return `Deal moved to new stage`;
      case 'CONTACT_DELETED': return 'Contact removed';
      default: return type.replace(/_/g, ' ').toLowerCase();
    }
  };

  if (loading) return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex gap-4 items-center">
           <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
           <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-3/4 rounded-md" />
              <Skeleton className="h-2 w-1/4 rounded-sm opacity-50" />
           </div>
        </div>
      ))}
    </div>
  );

  if (activities.length === 0) return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-20 animate-pulse" />
        <div className="relative w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm">
          <Clock className="w-6 h-6 text-gray-400" />
        </div>
      </div>
      <h3 className="font-bold text-gray-900 mb-1">No Activity Yet</h3>
      <p className="text-xs text-gray-500 max-w-[180px] leading-relaxed mx-auto">
        Your activities will appear here in real-time as you manage your business.
      </p>
    </div>
  );

  return (
    <div className="space-y-5">
      {activities.map((activity) => (
        <div key={activity._id} className="flex gap-4 group/item cursor-default">
          <div className="shrink-0 w-8 h-8 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate capitalize">
              {getActivityText(activity)}
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
              {new Date(activity.createdAt).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      ))}
      <button className="w-full mt-2 py-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center gap-1">
        View Full Audit Log <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}
