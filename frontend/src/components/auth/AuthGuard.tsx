'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
    const isPublicRoute = pathname === '/' || pathname.startsWith('/home');

    if (!isMounted) return;

    if (!accessToken && !isAuthRoute && !isPublicRoute) {
      router.replace('/login');
    } else if (accessToken && (isAuthRoute || isPublicRoute)) {
      // Redirect to dashboard if logged in and trying to access login/register OR home/root
      router.replace('/dashboard');
    }
  }, [accessToken, pathname, router, isMounted]);

  if (!isMounted) return null; // Prevent hydration errors

  return <>{children}</>;
}
