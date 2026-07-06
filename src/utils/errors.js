export function mapApiError(error) {
  if (!error) return 'Algo salió mal. Intenta de nuevo.';

  const msg = error.message || String(error);

  if (msg.includes('JWT') || msg.includes('session') || msg.includes('not authenticated')) {
    return 'Tu sesión expiró. Vuelve a entrar.';
  }
  if (msg.includes('Anonymous sign-ins are disabled')) {
    return 'Activa auth anónimo en Supabase para pedir sin cuenta.';
  }
  if (msg.includes('Phone signups are disabled')) {
    return 'Activa login por celular en Supabase.';
  }
  if (msg.includes('duplicate key') || msg.includes('unique')) {
    return 'Este registro ya existe.';
  }
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('Failed to fetch')) {
    return 'Sin conexión. Revisa tu internet.';
  }
  if (msg.includes('infinite recursion')) {
    return 'Error de permisos en el servidor. Intenta de nuevo en unos segundos.';
  }
  if (msg.includes('provider is not enabled') || msg.includes('Unsupported provider')) {
    return 'Google no está habilitado. Entra con email y contraseña en /login.';
  }
  if (msg.includes('legal_fields_locked')) {
    return 'Los datos legales ya están en revisión y no pueden modificarse.';
  }
  if (msg.includes('verification_fields_locked')) {
    return 'Solo Urabapp puede aprobar o publicar comercios.';
  }
  if (msg.includes('row-level security') || msg.includes('permission')) {
    return 'No tienes permiso para esta acción.';
  }

  return msg.length > 120 ? 'Error del servidor. Intenta más tarde.' : msg;
}
