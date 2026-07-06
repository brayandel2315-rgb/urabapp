import { registerSW } from 'virtual:pwa-register';
import { fetchRemoteBuildInfo, isRemoteBuildNewer } from './appVersion';
import {
  setSwUpdateHandler,
  notifyUpdateAvailable,
  watchStaleAssetErrors,
  listenCrossTabUpdates,
} from './swUpdate';

/** Intervalo de chequeo en producción (~90 s). */
const UPDATE_INTERVAL_MS = 90 * 1000;

function watchServiceWorkerLifecycle(registration) {
  if (!registration) return;

  registration.addEventListener('updatefound', () => {
    const installing = registration.installing;
    if (!installing) return;

    installing.addEventListener('statechange', () => {
      if (installing.state !== 'installed') return;
      if (!navigator.serviceWorker.controller) return;
      notifyUpdateAvailable();
    });
  });

  if (registration.waiting && navigator.serviceWorker.controller) {
    notifyUpdateAvailable();
  }
}

async function checkRemoteVersion() {
  const remote = await fetchRemoteBuildInfo();
  if (!remote?.buildId) return;

  const newer = await isRemoteBuildNewer();
  if (newer) {
    notifyUpdateAvailable({ remoteBuildId: remote.buildId });
  }
}

function scheduleUpdateChecks(registration) {
  const runChecks = () => {
    registration?.update().catch(() => {});
    checkRemoteVersion().catch(() => {});
  };

  runChecks();

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') runChecks();
  });

  window.addEventListener('online', runChecks);
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) runChecks();
  });

  window.setInterval(runChecks, UPDATE_INTERVAL_MS);
}

/** Registra el SW y avisa cuando hay versión nueva (el usuario elige cuándo recargar). */
export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  watchStaleAssetErrors();
  listenCrossTabUpdates();

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      updateSW(true).catch(() => notifyUpdateAvailable());
    },
    onOfflineReady() {
      /* precache listo */
    },
    onRegisteredSW(_swUrl, registration) {
      watchServiceWorkerLifecycle(registration);
      scheduleUpdateChecks(registration);
    },
    onRegisterError(error) {
      if (import.meta.env.DEV) {
         
        console.error('SW registration failed:', error);
      }
      scheduleUpdateChecks(null);
    },
  });

  setSwUpdateHandler(updateSW);
}
