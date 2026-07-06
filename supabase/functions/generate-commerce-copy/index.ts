import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getAuthUser, isAdminUser } from '../_shared/auth.ts';
import { getServiceClient } from '../_shared/supabase.ts';

type Action = 'product_description' | 'store_description' | 'promo_copy' | 'winback_message';

async function assertBusinessAccess(userId: string, businessId: string) {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('businesses')
    .select('id, owner_id, name, category, municipio, description')
    .eq('id', businessId)
    .single();
  if (error || !data) throw new Error('Comercio no encontrado');
  if (data.owner_id !== userId && !(await isAdminUser(userId))) {
    throw new Error('No autorizado');
  }
  return data;
}

function templateProductDescription(params: Record<string, unknown>) {
  const name = String(params.productName || 'Producto');
  const businessName = String(params.businessName || 'tu tienda');
  const municipio = String(params.municipio || 'Urabá');
  return `${name} preparado en ${businessName}, ${municipio}. Ideal para pedir en UrabApp con entrega rápida y seguimiento del pedido.`;
}

function templateStoreDescription(params: Record<string, unknown>) {
  const businessName = String(params.businessName || 'Tu comercio');
  const municipio = String(params.municipio || 'Urabá');
  const category = String(params.category || 'comida');
  return `${businessName} en ${municipio}: especialistas en ${category}. Pide por UrabApp con promos, chat del pedido y entrega local.`;
}

function templateWinbackMessage(params: Record<string, unknown>) {
  const businessName = String(params.businessName || 'tu tienda');
  const municipio = String(params.municipio || 'Urabá');
  return `Hola, te extrañamos en ${businessName}. Vuelve a pedir por UrabApp en ${municipio} — tu pedido favorito te está esperando.`;
}

function templatePromoCopy(params: Record<string, unknown>) {
  const businessName = String(params.businessName || 'tu tienda');
  const municipio = String(params.municipio || 'Urabá');
  const discountType = String(params.discountType || 'percent');
  const discountValue = Number(params.discountValue) || 10;
  const discount = discountType === 'percent'
    ? `${discountValue}% OFF`
    : `$${discountValue.toLocaleString('es-CO')} de descuento`;
  return {
    title: `${discount} · ${businessName}`,
    subtitle: `Promo exclusiva UrabApp en ${municipio}`,
  };
}

async function callOpenAI(system: string, user: string): Promise<string | null> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) return null;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: Deno.env.get('OPENAI_MODEL') || 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 180,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json?.choices?.[0]?.message?.content?.trim() || null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const user = await getAuthUser(req);
    if (!user) return jsonResponse({ error: 'No autorizado' }, 401);

    const body = await req.json();
    const action = body.action as Action;
    const businessId = body.businessId as string;
    if (!action || !businessId) {
      return jsonResponse({ error: 'action y businessId requeridos' }, 400);
    }

    const business = await assertBusinessAccess(user.id, businessId);
    const ctx = { ...body, businessName: body.businessName || business.name, municipio: body.municipio || business.municipio, category: body.category || business.category };

    if (action === 'product_description') {
      const system = 'Eres copywriter para UrabApp, marketplace regional en Urabá Colombia. Escribe en español colombiano, máximo 2 oraciones, sin emojis, tono cercano y vendedor.';
      const userPrompt = `Producto: ${ctx.productName}. Comercio: ${ctx.businessName}. Categoría: ${ctx.category}. Municipio: ${ctx.municipio}. Precio COP: ${ctx.price || 'no indicado'}.`;
      const ai = await callOpenAI(system, userPrompt);
      const text = ai || templateProductDescription(ctx);
      return jsonResponse({ text, source: ai ? 'ai' : 'template' });
    }

    if (action === 'store_description') {
      const system = 'Eres copywriter para UrabApp. Describe la tienda en español colombiano, máximo 3 oraciones, sin emojis, enfocado en confianza y pedidos por app.';
      const userPrompt = `Tienda: ${ctx.businessName}. Categoría: ${ctx.category}. Municipio: ${ctx.municipio}.`;
      const ai = await callOpenAI(system, userPrompt);
      const text = ai || templateStoreDescription(ctx);
      return jsonResponse({ text, source: ai ? 'ai' : 'template' });
    }

    if (action === 'promo_copy') {
      const system = 'Genera título y subtítulo cortos para promo en app de delivery. Responde SOLO JSON: {"title":"...","subtitle":"..."} sin emojis, español Colombia.';
      const userPrompt = `Comercio: ${ctx.businessName}. Descuento: ${ctx.discountType} ${ctx.discountValue}. Municipio: ${ctx.municipio}.`;
      const ai = await callOpenAI(system, userPrompt);
      if (ai) {
        try {
          const parsed = JSON.parse(ai.replace(/```json|```/g, '').trim());
          if (parsed.title) {
            return jsonResponse({ title: parsed.title, subtitle: parsed.subtitle || '', source: 'ai' });
          }
        } catch { /* fallback below */ }
      }
      const tpl = templatePromoCopy(ctx);
      return jsonResponse({ ...tpl, source: 'template' });
    }

    if (action === 'winback_message') {
      const system = 'Eres copywriter para UrabApp. Escribe un mensaje corto de regreso (máx 2 oraciones) para un cliente que no pide hace tiempo. Español colombiano, sin emojis, tono amable.';
      const userPrompt = `Comercio: ${ctx.businessName}. Municipio: ${ctx.municipio}. Categoría: ${ctx.category}.`;
      const ai = await callOpenAI(system, userPrompt);
      const text = ai || templateWinbackMessage(ctx);
      return jsonResponse({ text, source: ai ? 'ai' : 'template' });
    }

    return jsonResponse({ error: 'action inválida' }, 400);
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
