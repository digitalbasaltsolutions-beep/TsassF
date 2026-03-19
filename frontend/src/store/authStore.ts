import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  user: any | null; // Detailed user info
  organizationId: string | null;
  setCredentials: (accessToken: string, user: any, organizationId: string) => void;
  setOrganization: (organizationId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      organizationId: null,

      setCredentials: (accessToken, user, organizationId) =>
        set({ accessToken, user, organizationId }),

      setOrganization: (organizationId) => set({ organizationId }),

      logout: () => set({ accessToken: null, user: null, organizationId: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
