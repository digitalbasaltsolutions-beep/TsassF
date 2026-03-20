'use client';
import { ReactNode, useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import { OnboardingWizard } from '@/components/dashboard/OnboardingWizard';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const user = useAuthStore(state => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="p-8 lg:p-12 min-h-full">
          {children}
        </div>
        <OnboardingWizard />
      </main>
    </div>
  );
}
