'use client';
import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, accessToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If no user or not SuperAdmin, redirect to dashboard
    if (!accessToken) {
      router.push('/login');
      return;
    }
    
    if (user?.role !== 'SuperAdmin') {
      router.push('/dashboard');
    }
  }, [user, accessToken, router]);

  if (!accessToken || user?.role !== 'SuperAdmin') {
    return <div className="h-screen flex items-center justify-center font-bold text-gray-500">Redirecting to standard dashboard...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm relative z-50">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-black tracking-tighter text-purple-700">PLATFORM CONTROL</h1>
          <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">SUPERUSER MODE</span>
        </div>
        <div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Exit to Dashboard
          </button>
        </div>
      </header>
      <main className="p-8">
        {children}
      </main>
    </div>
  );
}
