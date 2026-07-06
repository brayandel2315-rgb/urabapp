/** Sesión real (email/contraseña, Google, teléfono) — no invitado anónimo */
export function isRealAuthenticatedUser(user) {
  if (!user?.id) return false;
  return !user.is_anonymous;
}
