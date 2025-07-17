'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isHomePage = pathname === '/';

  useEffect(() => {
    if (!loading && !user && !isAuthPage && !isHomePage) {
      router.replace('/login');
    }
  }, [user, loading, isAuthPage, isHomePage, router]);

  if (loading) return null;
  if (!user && !isAuthPage && !isHomePage) return null;
  return <>{children}</>;
} 