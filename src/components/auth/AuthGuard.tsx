'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/ui/loading-screen';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check for token immediately on mount
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      // No token? Go to login
      router.replace('/login');
    } else {
      // Token exists? Let them in
      setAuthorized(true);
    }
  }, [router]);

  // Show loader while checking
  if (!authorized) {
    return <LoadingScreen message="Verifying Access..." />;
  }

  return <>{children}</>;
}
