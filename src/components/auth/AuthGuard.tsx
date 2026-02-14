// src/components/auth/AuthGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/ui/loading-screen';
import { getCurrentUser } from '@/services/users';
import { logoutAdmin } from '@/services/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        // Verify token validity and expiration with backend
        const user = await getCurrentUser();
        
        // Validate user has admin or superuser privileges
        if (!user.is_staff && !user.is_superuser) {
          console.error("Access Denied: User is not staff.");
          logoutAdmin();
          router.replace('/login');
          return;
        }

        setAuthorized(true);

      } catch (error) {
        console.error("Token validation failed:", error);
        logoutAdmin();
        router.replace('/login');
      }
    };

    verifyAccess();
  }, [router]);

  if (!authorized) {
    return <LoadingScreen message="Verifying Security Clearance..." />;
  }

  return <>{children}</>;
}