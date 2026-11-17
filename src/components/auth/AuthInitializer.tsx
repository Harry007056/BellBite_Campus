import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../../store/authStore';

export function AuthInitializer({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return children;
}
