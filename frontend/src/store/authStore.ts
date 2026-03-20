import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  organizationId: string | null;
  setCredentials: (accessToken: string, refreshToken: string, user: any) => void;
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

      setCredentials: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user, organizationId: user.organizationId }),

      setOrganization: (organizationId) => set({ organizationId }),

      logout: () => set({ accessToken: null, refreshToken: null, user: null, organizationId: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
