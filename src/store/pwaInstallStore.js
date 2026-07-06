import { create } from 'zustand';
import {
  canShowInstallUi,
  detectInstallPlatform,
  isStandaloneMode,
} from '@/pwa/install-detect';
import { toast } from '@/utils/toast';
import { BRAND } from '@/utils/constants';

const DISMISS_KEY = 'urabapp-pwa-dismiss-until';
const VISIT_KEY = 'urabapp-pwa-visits';
const INSTALLED_KEY = 'urabapp-pwa-installed';

function readDismissUntil() {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return 0;
  const ts = Number(raw);
  return Number.isFinite(ts) ? ts : 0;
}

function bumpVisits() {
  const n = Number(localStorage.getItem(VISIT_KEY) || 0) + 1;
  localStorage.setItem(VISIT_KEY, String(n));
  return n;
}

export const usePwaInstallStore = create((set, get) => ({
  deferredPrompt: null,
  platform: 'other',
  isStandalone: false,
  visitCount: 0,
  sheetOpen: false,
  bannerVisible: false,
  fabVisible: false,
  installing: false,
  justInstalled: false,
  dismissUntil: 0,
  iosStep: 0,

  init() {
    const platform = detectInstallPlatform();
    const isStandalone = isStandaloneMode();
    const visitCount = bumpVisits();
    const dismissUntil = readDismissUntil();
    const dismissed = Date.now() < dismissUntil;

    set({
      platform: isStandalone ? 'installed' : platform,
      isStandalone,
      visitCount,
      dismissUntil,
      fabVisible: false,
      bannerVisible: !isStandalone && !dismissed && visitCount >= 3 && visitCount <= 8,
    });
  },

  setDeferredPrompt(event) {
    const platform = get().platform;
    set({
      deferredPrompt: event,
      fabVisible: false,
      bannerVisible: get().visitCount >= 2 && canShowInstallUi(platform, true),
    });
  },

  clearDeferredPrompt() {
    set({ deferredPrompt: null });
  },

  openSheet() {
    const platform = get().platform;
    set({
      sheetOpen: true,
      bannerVisible: false,
      iosStep: platform === 'ios' || platform === 'ios-other' ? 0 : get().iosStep,
    });
  },

  closeSheet() {
    set({ sheetOpen: false });
  },

  setIosStep(step) {
    set({ iosStep: step });
  },

  resetIosWizard() {
    set({ iosStep: 0 });
  },

  refreshStandalone() {
    const standalone = isStandaloneMode();
    if (standalone && !get().isStandalone) {
      get().markInstalled();
      toast(`${BRAND.name} instalada — ábrela desde el icono en tu inicio`, 'success');
    }
    return standalone;
  },

  dismissPrompt(days = 7) {
    const until = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, String(until));
    set({ dismissUntil: until, bannerVisible: false, fabVisible: false });
  },

  markInstalled() {
    localStorage.setItem(INSTALLED_KEY, '1');
    set({
      platform: 'installed',
      isStandalone: true,
      justInstalled: true,
      sheetOpen: false,
      bannerVisible: false,
      fabVisible: false,
      deferredPrompt: null,
    });
    window.setTimeout(() => set({ justInstalled: false }), 8000);
  },

  setInstalling(v) {
    set({ installing: v });
  },

  showFab() {
    /* FAB deshabilitado: instalar desde menú de servicios o preferencias */
  },

  /** Instalación nativa en un toque (Chrome / Edge / Android). iOS → guía paso a paso. */
  async triggerInstall() {
    const { deferredPrompt, isStandalone, platform } = get();
    if (isStandalone) return { outcome: 'already' };
    if (platform === 'ios' || platform === 'ios-other') {
      get().openSheet();
      return { outcome: 'sheet' };
    }
    if (!deferredPrompt) {
      get().openSheet();
      return { outcome: 'sheet' };
    }

    set({ installing: true, sheetOpen: false, bannerVisible: false });
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      set({ deferredPrompt: null });
      if (outcome === 'accepted') {
        get().markInstalled();
        return { outcome: 'accepted' };
      }
      return { outcome: 'dismissed' };
    } catch {
      get().openSheet();
      return { outcome: 'error' };
    } finally {
      set({ installing: false });
    }
  },
}));
