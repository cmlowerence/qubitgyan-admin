'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User, getCurrentUser } from '@/services/users';
import { useToast } from '@/components/ui/toast';

type CurrentUserContextValue = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<User | null>;
  setUser: (u: User | null) => void;
};

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export const useCurrentUser = () => {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) throw new Error('useCurrentUser must be used inside CurrentUserProvider');
  return ctx;
};

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const refreshUser = async (): Promise<User | null> => {
    try {
      setLoading(true);
      const me = await getCurrentUser();
      const prev = user;
      setUser(me);

      // If this update affects the currently logged in user, show a toast with changed flags
      if (prev && me && prev.id === me.id) {
        const diffs: string[] = [];
        const flags: Array<keyof Pick<User, 'can_manage_users' | 'can_manage_content' | 'can_approve_admissions'>> = [
          'can_manage_users', 'can_manage_content', 'can_approve_admissions'
        ];
        flags.forEach((f) => {
          const prevV = Boolean((prev as any)[f]);
          const nextV = Boolean((me as any)[f]);
          if (prevV !== nextV) {
            diffs.push(`${f.replace(/can_/,'').replace(/_/g,' ')} ${nextV ? 'granted' : 'revoked'}`);
          }
        });
        if (diffs.length > 0) {
          toast.push({
            title: 'Permissions updated',
            description: diffs.join(' · '),
            variant: 'info',
            duration: 7000
          });
        }
      }

      return me;
    } catch (err) {
      // swallow — caller can handle
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial fetch
    refreshUser();

    // listen for cross-tab or in-app broadcasts
    const handler = async (ev?: any) => {
      // If user:updated provides a payload we could use it, but prefer fresh fetch
      await refreshUser();
    };

    const storageHandler = (ev: StorageEvent) => {
      if (ev.key === 'qubitgyan_user_updated_at') handler();
    };

    window.addEventListener('user:updated', handler as EventListener);
    window.addEventListener('storage', storageHandler);

    return () => {
      window.removeEventListener('user:updated', handler as EventListener);
      window.removeEventListener('storage', storageHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ user, loading, refreshUser, setUser }), [user, loading]);
  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}
