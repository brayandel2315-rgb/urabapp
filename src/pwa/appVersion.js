/** Detección de deploy nuevo vía /app-version.json (independiente del service worker). */

export const APP_VERSION_URL = '/app-version.json';
export const UPDATE_BROADCAST = 'urabapp-app-update';

/** Build embebido en el bundle actual (generado en prebuild). */
export const CLIENT_BUILD_ID = import.meta.env.VITE_APP_BUILD_ID || 'dev';

export async function fetchRemoteBuildInfo() {
  try {
    const res = await fetch(`${APP_VERSION_URL}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** true si hay un deploy más reciente que el JS que está corriendo. */
export async function isRemoteBuildNewer() {
  const remote = await fetchRemoteBuildInfo();
  if (!remote?.buildId) return false;
  return remote.buildId !== CLIENT_BUILD_ID;
}

export function broadcastUpdateAvailable(detail = {}) {
  if (typeof BroadcastChannel === 'undefined') return;
  try {
    const channel = new BroadcastChannel(UPDATE_BROADCAST);
    channel.postMessage({ type: 'update-available', ...detail });
    channel.close();
  } catch {
    /* ignore */
  }
}

export function listenUpdateBroadcast(onUpdate) {
  if (typeof BroadcastChannel === 'undefined') return () => {};
  const channel = new BroadcastChannel(UPDATE_BROADCAST);
  channel.onmessage = (event) => {
    if (event.data?.type === 'update-available') onUpdate(event.data);
  };
  return () => channel.close();
}
