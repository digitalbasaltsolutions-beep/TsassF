'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore(state => state.accessToken);
  const user = useAuthStore(state => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const isAuthRoute = pathname === '/login' || pathname === '/register';
    const isPublicRoute = pathname === '/' || pathname === '/home';
    const isAuthenticated = !!accessToken && !!user;

    if (!isAuthenticated && !isAuthRoute && !isPublicRoute) {
      router.replace('/login');
    } else if (isAuthenticated && (isAuthRoute || isPublicRoute)) {
      router.replace('/dashboard');
    }
  }, [accessToken, user, pathname, isMounted, router]);

  if (!isMounted) return null; // Prevent hydration errors

  return <>{children}</>;
}
