import { ROLES } from './constants';

/** Campos que solo un administrador puede modificar en public.users */
export const PRIVILEGED_PROFILE_FIELDS = [
  'role',
  'account_status',
  'email',
  'id',
  'created_at',
  'welcome_delivery_used_at',
];

/** Campos que el usuario puede editar en su propio perfil */
export const SELF_PROFILE_FIELDS = [
  'full_name',
  'phone',
  'avatar_url',
  'municipio',
  'document_number',
  'updated_at',
];

export function isAdminRole(role) {
  return role === ROLES.ADMIN;
}

export function isSuperUser(profile) {
  return isAdminRole(profile?.role);
}

export function canAccessRoles(profileRole, allowedRoles) {
  if (!allowedRoles?.length) return true;
  if (isAdminRole(profileRole)) return true;
  return allowedRoles.includes(profileRole);
}

export function getAccessibleOperationalRoles(profileRole) {
  if (isAdminRole(profileRole)) {
    return [ROLES.CLIENT, ROLES.BUSINESS, ROLES.RIDER, ROLES.ADMIN];
  }
  const roles = [ROLES.CLIENT];
  if (profileRole === ROLES.BUSINESS) roles.push(ROLES.BUSINESS);
  if (profileRole === ROLES.RIDER) roles.push(ROLES.RIDER);
  return roles;
}

export function sanitizeProfileUpdates(updates, { isAdmin = false } = {}) {
  const safe = { ...updates };
  if (isAdmin) return safe;

  for (const field of PRIVILEGED_PROFILE_FIELDS) {
    delete safe[field];
  }
  return safe;
}

export function assertOwnUserId(sessionUserId, targetUserId) {
  if (!sessionUserId || !targetUserId || sessionUserId !== targetUserId) {
    throw new Error('No tienes permiso para acceder a este perfil');
  }
}
