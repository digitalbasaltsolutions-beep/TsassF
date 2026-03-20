'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Layers, 
  ShoppingCart, 
  Mail, 
  MessageCircle, 
  ChevronDown, 
  Lock, 
  Sparkles,
  Settings,
  LogOut,
  Building2,
  ChevronRight,
  Zap,
  MoreVertical,
  ArrowRight,
  Bell
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavItem {
  id: string;
  name: string;
  href?: string;
  icon: any;
  items?: { name: string; href: string }[];
}

const GLOBAL_NAV = [
  { id: 'overview', name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { id: 'analytics', name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

const PRODUCTS_NAV = [
  {
    id: 'crm',
    name: 'CRM',
    icon: Layers,
    items: [
      { name: 'Contacts', href: '/dashboard/crm/contacts' },
      { name: 'Sales Board', href: '/dashboard/crm/deals' },
      { name: 'Architect', href: '/dashboard/crm/pipelines' },
      { name: 'Activities', href: '/dashboard/crm/activities' },
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    icon: ShoppingCart,
    items: [
      { name: 'Products', href: '/dashboard/ecommerce/products' },
      { name: 'Orders', href: '/dashboard/ecommerce/orders' },
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: Mail,
    items: [
      { name: 'Campaigns', href: '/dashboard/marketing' },
    ]
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    items: [
      { name: 'Channels', href: '/dashboard/whatsapp' },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const organizationId = useAuthStore(state => state.organizationId);
  const setCredentials = useAuthStore(state => state.setCredentials);
  const subscriptions = useAuthStore(state => state.subscriptions || []);
  const plan = useAuthStore(state => state.plan || 'Free');
  const logout = useAuthStore(state => state.logout);

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showOrgSwitch, setShowOrgSwitch] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrganizations();
      fetchNotifications();
    }
  }, [user]);

  // Determine active product context
  const activeProduct = PRODUCTS_NAV.find(p => pathname.startsWith(`/dashboard/${p.id}`));
  const isGlobal = !activeProduct || pathname === '/dashboard' || pathname === '/analytics';

  const fetchOrganizations = async () => {
    try {
      const res = await apiClient.get('/organizations/my');
      setOrganizations(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications');
      setNotifications(res.data);
    } catch (e) { console.error(e); }
  };

  const handleSwitchOrg = async (orgId: string) => {
    try {
      const res = await apiClient.post('/auth/switch-org', { organizationId: orgId });
      const { accessToken, refreshToken, user, subscriptions, plan } = res.data;
      setCredentials(accessToken, refreshToken, user, subscriptions, plan);
      setShowOrgSwitch(false);
      window.location.reload(); 
    } catch (e) { console.error(e); }
  };

  const activeOrg = organizations.find(o => o._id === organizationId) || { name: 'Workspace' };
  const hasUnreadNotif = notifications.some(n => !n.isRead);
  const isPro = plan.toLowerCase() === 'pro' || plan.toLowerCase() === 'enterprise';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 h-screen bg-[#09090B] border-r border-zinc-800 flex flex-col shrink-0 overflow-hidden text-zinc-400">
      
      {/* 1. Organization & Context Switcher */}
      <div className="p-4 border-b border-zinc-800/50 relative">
        {!isGlobal ? (
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center gap-3 p-2 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 transition-all group"
          >
             <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white border border-zinc-700">
               <ChevronRight className="w-4 h-4 rotate-180" />
             </div>
             <div className="text-left">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Back to</p>
               <p className="text-xs font-bold text-zinc-100">Workspace</p>
             </div>
          </button>
        ) : (
          <button 
            onClick={() => setShowOrgSwitch(!showOrgSwitch)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
               <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/20 shrink-0">
                 <Building2 className="w-4 h-4" />
               </div>
               <div className="text-left min-w-0">
                 <p className="text-xs font-bold text-zinc-100 truncate">{activeOrg.name}</p>
                 <p className="text-[10px] text-zinc-500 font-medium truncate uppercase tracking-tighter">Business Cloud</p>
               </div>
            </div>
            <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-600 transition-transform", showOrgSwitch && "rotate-180")} />
          </button>
        )}

        {showOrgSwitch && isGlobal && (
          <div className="absolute left-4 right-4 top-16 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-[100] py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <p className="px-4 py-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Switch Workspace</p>
            <div className="max-h-48 overflow-y-auto">
              {organizations.map(org => (
                <button
                  key={org._id}
                  onClick={() => handleSwitchOrg(org._id)}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-xs transition-colors hover:bg-zinc-800",
                    org._id === organizationId ? "text-blue-400 font-bold bg-blue-400/5" : "text-zinc-400"
                  )}
                >
                  {org.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-8 scrollbar-hide">
        
        {isGlobal ? (
          <>
            {/* GLOBAL VIEW */}
            <section className="space-y-1">
              <div className="flex items-center justify-between px-3 mb-3">
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Insights</p>
                 {hasUnreadNotif && <Bell className="w-3 h-3 text-blue-500 fill-blue-500/20 animate-pulse" />}
              </div>
              {GLOBAL_NAV.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href!}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                      isActive 
                        ? "bg-zinc-800 text-white shadow-sm border border-zinc-700/50" 
                        : "hover:bg-zinc-800/50 hover:text-zinc-200"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-400")} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </section>

            <section className="space-y-6">
              <p className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Products</p>
              <div className="space-y-1.5">
                {PRODUCTS_NAV.map((product) => {
                  const hasAccess = subscriptions.includes(product.id);
                  return (
                    <Link
                      key={product.id}
                      href={hasAccess ? (product.items?.[0].href || '#') : '#'}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                        hasAccess ? "text-zinc-400 hover:text-white hover:bg-zinc-800/50" : "text-zinc-700 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <product.icon className={cn("w-4 h-4 transition-colors", hasAccess ? "text-zinc-500 group-hover:text-blue-400" : "text-zinc-800")} />
                        <span>{product.name}</span>
                      </div>
                      {!hasAccess && <Lock className="w-3 h-3 text-zinc-800" />}
                    </Link>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* PRODUCT SPECIFIC VIEW */}
            <section className="space-y-1">
              <div className="px-3 mb-6">
                <div className="flex items-center gap-3 text-white mb-2">
                   <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/20">
                     <activeProduct.icon className="w-5 h-5 text-blue-400" />
                   </div>
                   <h2 className="text-lg font-bold tracking-tight">{activeProduct.name}</h2>
                </div>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Independent Module</p>
              </div>

              <div className="space-y-1">
                {activeProduct.items?.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                        isActive 
                          ? "bg-blue-600/10 text-blue-400 border border-blue-400/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
                      )}
                    >
                      <div className={cn("w-1.5 h-1.5 rounded-full transition-all", isActive ? "bg-blue-400 scale-100" : "bg-transparent scale-0")} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </>
        )}

      </div>

      {/* 4. Bottom Area (Plan & User) */}
      <div className="p-4 mt-auto border-t border-zinc-800/50 space-y-4 bg-zinc-950/20 backdrop-blur-md">
        
        {/* Upgrade Card */}
        {!isPro && (
          <div className="px-2">
            <div className="relative group cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-3 shadow-2xl transition-all hover:bg-zinc-800/80">
               <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/10 blur-xl pointer-events-none" />
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Current Plan</p>
                   <p className="text-xs font-bold text-white uppercase tracking-tight">{plan}</p>
                 </div>
                 <button className="p-2 rounded-lg bg-blue-600 hover:bg-blue-50 text-white hover:text-blue-600 transition-all group/upg">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-3 min-w-0">
             <div className="w-9 h-9 rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden shrink-0 shadow-lg">
               <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} alt="" className="w-full h-full object-cover" />
             </div>
             <div className="min-w-0">
               <p className="text-[13px] font-bold text-zinc-100 truncate tracking-tight">{user?.name || 'Workspace Admin'}</p>
               <p className="text-[10px] text-zinc-500 truncate font-medium">{user?.email || 'admin@workspace.com'}</p>
             </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-zinc-600 hover:text-zinc-300 transition-colors">
               <Settings className="w-4 h-4" />
            </button>
            <button onClick={handleLogout} className="p-1.5 text-zinc-600 hover:text-rose-500 transition-colors">
               <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </aside>
  );
}
