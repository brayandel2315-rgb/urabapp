import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ROLES } from '../utils/constants';
import {
  canAccessRoles,
  getAccessibleOperationalRoles,
  isAdminRole,
  isSuperUser as checkSuperUser,
} from '../utils/auth-rbac';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      loading: true,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (loading) => set({ loading }),
      logout: () => set({ user: null, profile: null }),
      isRole: (role) => get().profile?.role === role,
      isAdmin: () => isAdminRole(get().profile?.role),
      isSuperUser: () => checkSuperUser(get().profile),
      canAccessRoles: (roles) => canAccessRoles(get().profile?.role, roles),
      getAccessibleRoles: () => getAccessibleOperationalRoles(get().profile?.role),
      isClient: () => get().profile?.role === ROLES.CLIENT || !get().profile?.role,
    }),
    {
      name: 'urabapp-auth',
      partialize: (s) => ({
        profile: s.profile
          ? {
              id: s.profile.id,
              full_name: s.profile.full_name,
              avatar_url: s.profile.avatar_url,
              municipio: s.profile.municipio,
              role: s.profile.role,
              account_status: s.profile.account_status,
            }
          : null,
      }),
    }
  )
);
