import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  organizationId: string | null;
  subscriptions: string[];
  plan: string;
  setCredentials: (accessToken: string, refreshToken: string, user: any, subscriptions?: string[], plan?: string) => void;
  setOrganization: (organizationId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      organizationId: null,
      subscriptions: ['crm'],
      plan: 'Free',

      setCredentials: (accessToken, refreshToken, user, subscriptions = ['crm'], plan = 'Free') =>
        set({ 
          accessToken, 
          refreshToken, 
          user, 
          organizationId: user?.organizationId || null, 
          subscriptions, 
          plan 
        }),

      setOrganization: (organizationId) => set({ organizationId }),

      logout: () => set({ accessToken: null, refreshToken: null, user: null, organizationId: null, subscriptions: ['crm'], plan: 'Free' }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
