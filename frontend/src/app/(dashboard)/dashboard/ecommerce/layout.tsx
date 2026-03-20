'use client';
import { useAuthStore } from '@/store/authStore';
import { ShoppingCart } from 'lucide-react';

export default function EcommerceLayout({ children }: { children: React.ReactNode }) {
  const subscriptions = useAuthStore(state => state.subscriptions || []);

  if (!subscriptions.includes('ecommerce')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center p-8">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-200">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Access Required</h2>
        <p className="text-gray-500 max-w-md mt-4 leading-relaxed mb-8">
          The E-commerce module is not included in your current subscription. Upgrade your plan to manage your store, inventory, and online sales.
        </p>
        <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
          Upgrade Subscription
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
