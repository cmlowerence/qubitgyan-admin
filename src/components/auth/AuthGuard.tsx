'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/ui/loading-screen';
import { getCurrentUser } from '@/services/users'; // Adjust import path if needed
import { logoutAdmin } from '@/services/auth';     // Adjust import path if needed

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        // No token at all? Kick them out immediately.
        router.replace('/login');
        return;
      }

      try {
        // Ping the backend to verify the token is real AND not expired
        const user = await getCurrentUser();
        
        // Ensure they actually have admin privileges
        if (!user.is_staff && !user.is_superuser) {
          console.error("Access Denied: User is not staff.");
          logoutAdmin(); // Clear the useless token
          router.replace('/login');
          return;
        }

        // If they pass both checks, let them in!
        setAuthorized(true);

      } catch (error) {
        // If the backend throws an error (e.g., 401 Unauthorized because the token expired)
        console.error("Token validation failed:", error);
        logoutAdmin(); // Clear the expired/fake token
        router.replace('/login');
      }
    };

    verifyAccess();
  }, [router]);

  // Show loader while the backend verifies the token
  if (!authorized) {
    return <LoadingScreen message="Verifying Security Clearance..." />;
  }

  return <>{children}</>;
}