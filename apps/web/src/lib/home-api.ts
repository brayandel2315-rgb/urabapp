const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function fetchSearch(q: string, municipio: string) {
  const res = await fetch(`${API}/search?q=${encodeURIComponent(q)}&municipio=${encodeURIComponent(municipio)}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error('search failed');
  return res.json();
}

export async function fetchOffers(municipio: string, barrio?: string) {
  const params = new URLSearchParams({ municipio });
  if (barrio) params.set('barrio', barrio);
  const res = await fetch(`${API}/offers?${params}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('offers failed');
  return res.json();
}

export async function fetchNearby(municipio: string, barrio?: string) {
  const params = new URLSearchParams({ municipio });
  if (barrio) params.set('barrio', barrio);
  const res = await fetch(`${API}/businesses/near?${params}`, { next: { revalidate: 45 } });
  if (!res.ok) throw new Error('near failed');
  return res.json();
}
