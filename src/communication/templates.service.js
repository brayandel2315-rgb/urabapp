import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';
import { resolveEventMessage as resolveLibraryMessage } from './event-library';

const templateCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

/** Reemplaza {{clave}} con valores del payload (snake_case y camelCase). */
export function applyTemplateString(template, payload = {}) {
  if (!template) return '';
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const snake = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
    const val = payload[key] ?? payload[snake];
    return val != null ? String(val) : '';
  });
}

export async function resolveCommunicationTemplate(eventKey, recipientId = null) {
  if (!eventKey || !isSupabaseConfigured) return null;
  const cacheKey = `${eventKey}:${recipientId || 'anon'}`;
  const cached = templateCache.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.data;

  const data = await sbFetch(
    supabase.rpc('resolve_communication_template', {
      p_event_key: eventKey,
      p_recipient_id: recipientId,
    }),
    'template resolve',
  ).catch(() => null);

  templateCache.set(cacheKey, { data, at: Date.now() });
  return data;
}

export function clearTemplateCache(eventKey) {
  if (eventKey) {
    for (const key of templateCache.keys()) {
      if (key.startsWith(`${eventKey}:`)) templateCache.delete(key);
    }
  } else {
    templateCache.clear();
  }
}

/** Resuelve título/cuerpo: variante A/B > plantilla DB > biblioteca > payload. */
export async function resolveCommunicationMessage(eventKey, payload = {}, recipientId = null) {
  const tpl = await resolveCommunicationTemplate(eventKey, recipientId);
  if (tpl?.title_template) {
    return {
      title: applyTemplateString(tpl.title_template, payload),
      body: applyTemplateString(tpl.body_template || '', payload),
      channelsOverride: tpl.channels_override,
      variantKey: tpl.variant_key || null,
    };
  }
  const lib = resolveLibraryMessage(eventKey, payload);
  return {
    title: lib.title || payload.title,
    body: lib.body || payload.body,
    channelsOverride: null,
    variantKey: null,
  };
}
