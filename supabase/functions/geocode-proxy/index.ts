import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireAuthOrProjectKey } from '../_shared/auth.ts';

const NOMINATIM = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'Urabapp/1.0 (https://urabapp.vercel.app)';

async function nominatim(path: string, params: Record<string, string>) {
  const url = new URL(path, NOMINATIM);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'es' },
  });
  if (!res.ok) return null;
  return res.json();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const auth = await requireAuthOrProjectKey(req);
    if (auth instanceof Response) return auth;

    const body = await req.json();
    const { action } = body;

    if (action === 'reverse') {
      const { lat, lon } = body;
      if (lat == null || lon == null) {
        return jsonResponse({ error: 'lat y lon requeridos' }, 400);
      }
      const data = await nominatim('/reverse', {
        lat: String(lat),
        lon: String(lon),
        format: 'json',
        addressdetails: '1',
      });
      return jsonResponse({
        label: data?.display_name ?? null,
        address: data?.address ?? null,
      });
    }

    if (action === 'search') {
      const { query, municipio } = body;
      if (!query?.trim()) {
        return jsonResponse({ error: 'query requerido' }, 400);
      }
      const q = municipio
        ? `${String(query).trim()}, ${municipio}, Antioquia, Colombia`
        : `${String(query).trim()}, Colombia`;
      const data = await nominatim('/search', {
        q,
        format: 'json',
        limit: '1',
        countrycodes: 'co',
      });
      const hit = Array.isArray(data) ? data[0] : null;
      if (!hit) {
        return jsonResponse({ label: null, latitude: null, longitude: null });
      }
      return jsonResponse({
        label: hit.display_name,
        latitude: Number(hit.lat),
        longitude: Number(hit.lon),
      });
    }

    return jsonResponse({ error: 'action inválida (reverse | search)' }, 400);
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
