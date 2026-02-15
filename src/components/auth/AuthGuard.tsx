// src/components/auth/AuthGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/ui/loading-screen';
import { logoutAdmin } from '@/services/auth';
import { useCurrentUser } from '@/context/current-user-context';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const { user, loading } = useCurrentUser();

  useEffect(() => {
    const verifyAccess = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.replace('/login');
        return;
      }

      if (loading) return; // wait for context to resolve

      if (!user) {
        logoutAdmin();
        router.replace('/login');
        return;
      }

      if (!user.is_staff && !user.is_superuser) {
        logoutAdmin();
        router.replace('/login');
        return;
      }

      setAuthorized(true);
    };

    verifyAccess();
  }, [router, user, loading]);

  if (!authorized) {
    return <LoadingScreen message="Verifying Security Clearance..." />;
  }

  return <>{children}</>;
}