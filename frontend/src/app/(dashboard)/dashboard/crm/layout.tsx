'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { 
  Users, 
  Layers, 
  Activity, 
  Settings, 
  ChevronRight, 
  PlusCircle, 
  Search,
  MessageSquare,
  Phone,
  Mail,
  MoreVertical
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const subscriptions = useAuthStore(state => state.subscriptions || []);

  if (!subscriptions.includes('crm')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center p-8">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-200">
          <Layers className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Access Required</h2>
        <p className="text-gray-500 max-w-md mt-4 leading-relaxed mb-8">
          The CRM module is not included in your current subscription. Upgrade your plan to manage pipelines, contacts, and close more deals.
        </p>
        <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
          Upgrade Subscription
        </button>
      </div>
    );
  }

  const crmNav = [
    { name: 'Contacts', href: '/dashboard/crm/contacts', icon: Users },
    { name: 'Sales Board', href: '/dashboard/crm/deals', icon: Layers },
    { name: 'Pipelines', href: '/dashboard/crm/pipelines', icon: Settings },
    { name: 'Activities', href: '/dashboard/crm/activities', icon: Activity },
  ];

  return (
    <div className="flex bg-[#030712] text-zinc-100 min-h-[calc(100vh-64px)] rounded-3xl overflow-hidden mr-4 mb-4 border border-zinc-800/50 shadow-2xl relative">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* CRM Sub-Sidebar */}
      <aside className="w-64 border-r border-zinc-800/50 flex flex-col bg-zinc-950/20 backdrop-blur-xl shrink-0">
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-white/90">CRM App</h2>
          <button className="p-1 px-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:bg-blue-600/30 transition-all">
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 mb-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-zinc-300"
            />
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {crmNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                <span>{item.name}</span>
                {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-blue-400 animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-4 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">PRO Features</p>
              <p className="text-[10px] text-zinc-400 leading-relaxed mb-3">Unlock AI lead scoring & predictive analytics.</p>
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg transition-all shadow-lg shadow-blue-900/20">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main CRM Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent">
        <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-zinc-950/10 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1 text-xs text-zinc-500 font-medium tracking-wide border border-zinc-800/50 p-1 px-2 rounded-md bg-zinc-900/50 hover:bg-zinc-800 transition-colors cursor-pointer group">
               <span>Main Board</span>
               <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:translate-x-0.5 transition-transform" />
               <span className="text-zinc-300">Quarterly Pipeline</span>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center -space-x-2 mr-4">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border border-[#030712] bg-zinc-800 flex items-center justify-center text-[8px] font-bold overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} alt="" />
                  </div>
                ))}
             </div>
             <div className="w-px h-6 bg-zinc-800" />
             <button className="p-2 text-zinc-400 hover:text-white transition-colors">
               <Settings className="w-4 h-4" />
             </button>
             <button className="p-2 text-zinc-400 hover:text-white transition-colors">
               <MoreVertical className="w-4 h-4" />
             </button>
          </div>
        </header>

        <section className="flex-1 overflow-auto p-8 relative">
          {children}
        </section>
      </main>
    </div>
  );
}
