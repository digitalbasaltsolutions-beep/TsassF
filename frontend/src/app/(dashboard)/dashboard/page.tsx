'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';
import UsageOverview from '@/components/dashboard/UsageOverview';
import { 
  Building2,
  CheckCircle2,
  XCircle,
  CreditCard,
  Rocket
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Plus, Users, LayoutGrid, Clock, ArrowRight } from 'lucide-react';

import RecentActivity from '@/components/dashboard/RecentActivity';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardPage() {
  const user = useAuthStore(state => state.user);
  const subscriptions = useAuthStore(state => state.subscriptions || []);
  const plan = useAuthStore(state => state.plan || 'Free');

  const allProducts = [
    { id: 'crm', name: 'CRM', description: 'Manage contacts, pipelines, and deals.' },
    { id: 'ecommerce', name: 'E-commerce', description: 'Manage products, orders, and sales.' },
    { id: 'marketing', name: 'Marketing', description: 'Email campaigns and marketing automation.' },
    { id: 'whatsapp', name: 'WhatsApp', description: 'Direct WhatsApp integration and messaging.' },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 leading-tight">Welcome to your Workspace</h1>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed max-w-2xl font-medium">
            This is your organization dashboard. Here you can see your current plan, usage, and manage access to your subscribed products.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Organization Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 mb-4">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Organization Info</h2>
          <p className="text-sm text-gray-500 mb-4 font-medium">View and manage your organization details.</p>
          <div className="mt-auto bg-gray-50 rounded-lg p-3 w-full border border-gray-100 text-left">
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-gray-500 font-bold uppercase tracking-wider">Role:</span>
              <span className="font-extrabold text-blue-600 uppercase">{user?.role || 'Member'}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 font-bold uppercase tracking-wider">Org ID:</span>
              <span className="font-mono text-xs text-gray-700 bg-gray-200 px-2 py-0.5 rounded truncate max-w-[120px]" title={user?.organizationId}>{user?.organizationId}</span>
            </div>
          </div>
        </div>

        {/* Current Plan */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-xl pointer-events-none"></div>
          <div className="h-14 w-14 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 mb-4 relative z-10">
            <CreditCard className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1 relative z-10">Current Plan</h2>
          <p className="text-sm text-gray-500 mb-4 relative z-10 font-medium">You are currently on the {plan} tier.</p>
          
          <div className="mt-auto w-full relative z-10">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-bold text-xs border border-indigo-100 tracking-wider">
              <Rocket className="w-4 h-4" />
              <span>{plan.toUpperCase()} PLAN</span>
            </div>
          </div>
        </div>

        {/* Usage Stats Component Wrapper */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full items-center text-center relative overflow-hidden">
           <UsageOverview />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mt-4">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold tracking-tight text-gray-900">Your Products</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Products and modules you have access to based on your current subscription.</p>
        </div>
        
        <div className="divide-y divide-gray-100">
          {allProducts.map(product => {
            const hasAccess = subscriptions.includes(product.id);
            return (
              <div key={product.id} className={cn("p-6 flex items-center justify-between transition-colors", hasAccess ? 'hover:bg-gray-50' : 'bg-gray-50 opacity-80')}>
                <div className="flex items-center space-x-4">
                  <div className={cn("p-3 rounded-xl flex-shrink-0 drop-shadow-sm", hasAccess ? 'bg-blue-100 text-blue-600 border border-blue-200' : 'bg-gray-200 text-gray-500 border border-gray-300')}>
                    {hasAccess ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className={cn("text-base font-bold tracking-tight", hasAccess ? 'text-gray-900' : 'text-gray-500')}>{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5 font-medium">{product.description}</p>
                  </div>
                </div>
                <div>
                  {hasAccess ? (
                     // Using window.location.href or Link for routing.
                    <a href={`/dashboard/${product.id === 'crm' ? 'crm/contacts' : product.id}`} className="px-5 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm inline-flex items-center">
                      Open App
                    </a>
                  ) : (
                    <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shadow-sm shadow-blue-500/30">
                      Upgrade to unlock
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/dashboard/crm/contacts" className="flex flex-col p-4 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-bold text-blue-900 text-sm">Add Contact</span>
              <span className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-widest leading-none">Create a new lead</span>
            </a>
            <a href="/dashboard/crm/deals" className="flex flex-col p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <span className="font-bold text-emerald-900 text-sm">Create Deal</span>
              <span className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-widest leading-none">Start a new pipeline</span>
            </a>
            <button className="flex flex-col p-4 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-100 transition-colors group text-left">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-purple-900 text-sm">Invite Team</span>
              <span className="text-[10px] font-bold text-purple-600 mt-1 uppercase tracking-widest leading-none">Add org members</span>
            </button>
            <a href="/billing" className="flex flex-col p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="font-bold text-indigo-900 text-sm">Upgrade Plan</span>
              <span className="text-[10px] font-bold text-indigo-600 mt-1 uppercase tracking-widest leading-none">View billing</span>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">Recent Activity</h2>
          </div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

