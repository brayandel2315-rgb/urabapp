/** Estado compartido entre registerSW, polling de versión y la UI de actualización. */

import {
  broadcastUpdateAvailable,
  CLIENT_BUILD_ID,
  listenUpdateBroadcast,
} from './appVersion';

let needsRefresh = false;
let remoteBuildId = null;
/** @type {((reloadPage?: boolean) => Promise<void>) | null} */
let applyUpdate = null;
/** @type {Set<(state: SwUpdateState) => void>} */
const listeners = new Set();

/** @typedef {{ needsRefresh: boolean, remoteBuildId: string | null, clientBuildId: string }} SwUpdateState */

function emit() {
  const state = getSwUpdateState();
  listeners.forEach((cb) => cb(state));
}

export function getSwUpdateState() {
  return { needsRefresh, remoteBuildId, clientBuildId: CLIENT_BUILD_ID };
}

/** @param {(state: SwUpdateState) => void} listener */
export function subscribeSwUpdate(listener) {
  listeners.add(listener);
  listener(getSwUpdateState());
  return () => listeners.delete(listener);
}

/** @param {(reloadPage?: boolean) => Promise<void>} reloadFn */
export function setSwUpdateHandler(reloadFn) {
  applyUpdate = reloadFn;
}

export function notifyUpdateAvailable({ remoteBuildId: nextRemoteId, broadcast = true } = {}) {
  if (remoteBuildId && nextRemoteId) remoteBuildId = nextRemoteId;
  else if (nextRemoteId) remoteBuildId = nextRemoteId;

  const wasVisible = needsRefresh;
  needsRefresh = true;
  emit();

  import('@/communication').then(({ emitCommEvent }) => {
    emitCommEvent('app_update_available', {
      payload: { remoteBuildId: remoteBuildId || nextRemoteId },
    }).catch(() => {});
  }).catch(() => {});

  if (!wasVisible && broadcast) {
    broadcastUpdateAvailable({ remoteBuildId: remoteBuildId || nextRemoteId });
  }
}

export async function reloadForUpdate() {
  if ('caches' in window) {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    } catch {
      /* ignore */
    }
  }

  if (applyUpdate) {
    await applyUpdate(true);
    return;
  }

  window.location.reload();
}

const STALE_CHUNK_RE = /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i;

export function isStaleChunkError(message) {
  return STALE_CHUNK_RE.test(String(message || ''));
}

export function watchStaleAssetErrors() {
  if (typeof window === 'undefined') return;

  let recovering = false;

  const handle = async (message) => {
    if (!isStaleChunkError(message) || recovering) return;
    recovering = true;
    notifyUpdateAvailable({ broadcast: true });
    try {
      await reloadForUpdate();
    } catch {
      window.__urabappRecover?.();
    }
  };

  window.addEventListener('error', (event) => {
    handle(event.message || event.error?.message);
  });

  window.addEventListener('unhandledrejection', (event) => {
    handle(event.reason?.message || event.reason);
  });
}

export function listenCrossTabUpdates() {
  return listenUpdateBroadcast(() => {
    notifyUpdateAvailable({ broadcast: false });
  });
}
