import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { isServiceRoleRequest, requireAuthUser, isAdminUser } from '../_shared/auth.ts';

function isCronAuthorized(req: Request): boolean {
  if (isServiceRoleRequest(req)) return true;
  const secret = Deno.env.get('CRON_SECRET');
  const header = req.headers.get('X-Cron-Secret');
  return Boolean(secret && header && secret === header);
}

/** Cron, service role o administrador autenticado. */
export async function requireCronServiceOrAdmin(req: Request): Promise<Response | null> {
  if (isCronAuthorized(req)) return null;

  const authResult = await requireAuthUser(req);
  if (authResult instanceof Response) return authResult;

  if (authResult.id === 'service-role' || await isAdminUser(authResult.id)) {
    return null;
  }

  return jsonResponse({ error: 'No autorizado' }, 401);
}

export { corsHeaders, jsonResponse };
