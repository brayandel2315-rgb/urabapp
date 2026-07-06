/**
 * Suscripción Realtime con logging de errores de canal.
 */
export function attachRealtimeStatus(channel, label = 'channel', { onSubscribed } = {}) {
  channel.subscribe((status, err) => {
    if (status === 'SUBSCRIBED') {
      onSubscribed?.();
    }
    if (status === 'CHANNEL_ERROR') {
      console.warn(`[realtime:${label}]`, err?.message || err || status);
    }
    if (status === 'TIMED_OUT') {
      console.warn(`[realtime:${label}] canal expirado — reintentando en próximo mount`);
    }
  });
  return channel;
}
