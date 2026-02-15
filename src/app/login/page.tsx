// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/services/auth';
import { api } from '@/lib/api';
import LoadingScreen from '@/components/ui/loading-screen';
import LoginForm from './_components/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await loginAdmin(email, password);

      const { data: user } = await api.get('/users/me/');

      if (!user.is_staff) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        throw new Error("Access Restricted: Students cannot access the Admin Portal.");
      }

      setTimeout(() => {
        router.push('/admin/tree');
      }, 800);

    } catch (err: any) {
      // console.error(err);
      // Changed fallback error message to reflect email
      setError(err.message || 'Invalid email or password');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Verifying Credentials..." />;
  }

  return (
    <LoginForm 
      email={email}
      password={password}
      error={error}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
    />
  );
}