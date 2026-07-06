import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireAuthOrProjectKey } from '../_shared/auth.ts';
import { normalizeProfile, validateRouteRequest } from '../_shared/routing.ts';

const ORS_TIMEOUT_MS = 9000;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Método no permitido' }, 405);
  }

  try {
    const authResult = await requireAuthOrProjectKey(req);
    if (authResult instanceof Response) return authResult;

    const apiKey = Deno.env.get('ORS_API_KEY');
    if (!apiKey) {
      return jsonResponse({ error: 'ORS_API_KEY no configurado', provider: 'unavailable' }, 503);
    }

    const body = await req.json();
    const { start, end } = body;
    const profile = normalizeProfile(body.profile);

    const validation = validateRouteRequest(start, end);
    if (!validation.ok) {
      return jsonResponse({ error: validation.error, provider: 'invalid' }, validation.status);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ORS_TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(`https://api.openrouteservice.org/v2/directions/${profile}/geojson`, {
        method: 'POST',
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/geo+json',
        },
        body: JSON.stringify({
          coordinates: [start, end],
          instructions: false,
          elevation: false,
          preference: 'fastest',
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    const data = await res.json();
    if (!res.ok) {
      const message = data?.error?.message || data?.message || 'Error OpenRouteService';
      const status = res.status === 429 ? 429 : res.status >= 500 ? 502 : res.status;
      return jsonResponse({ error: message, provider: 'ors', code: res.status }, status);
    }

    const feature = data.features?.[0];
    const geometry = feature?.geometry;
    const summary = feature?.properties?.summary;
    if (!geometry || !summary) {
      return jsonResponse({ error: 'Sin ruta disponible', provider: 'ors' }, 404);
    }

    const durationSec = Math.round(Number(summary.duration) || 0);
    const distanceM = Math.round(Number(summary.distance) || 0);
    const minutes = Math.max(1, Math.round(durationSec / 60));
    const buffer = Math.max(2, Math.round(minutes * 0.12));
    const minutesMin = Math.max(1, minutes - buffer);
    const minutesMax = minutes + buffer;
    const km = Number((distanceM / 1000).toFixed(1));
    const arrivalAt = new Date(Date.now() + durationSec * 1000).toISOString();

    return jsonResponse({
      geometry,
      durationSec,
      minutes,
      minutesMin,
      minutesMax,
      km,
      distanceM,
      arrivalAt,
      provider: 'ors',
      profile,
    });
  } catch (err) {
    const message = err instanceof Error && err.name === 'AbortError'
      ? 'Tiempo de espera agotado al calcular ruta'
      : String(err);
    return jsonResponse({ error: message, provider: 'ors' }, 504);
  }
});
