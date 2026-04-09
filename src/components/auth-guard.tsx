'use client';

import { Loader2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getUser } from '@/lib/auth';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const user = await getUser();
        if (!user) {
          router.replace('/admin/login');
        } else {
          setAuthenticated(true);
        }
      } catch {
        router.replace('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    if (pathname === '/admin/login') {
      setLoading(false);
      setAuthenticated(true);
    } else {
      check();
    }
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-stone-400" />
          <p className="text-xs tracking-[0.15em] text-stone-400 uppercase">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
};
