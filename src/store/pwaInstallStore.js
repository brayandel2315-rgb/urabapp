import { create } from 'zustand';
import {
  canShowInstallUi,
  detectInstallPlatform,
  isStandaloneMode,
} from '@/pwa/install-detect';
import {
  markMobilePromptShown,
  shouldAutoOpenMobileInstall,
  shouldShowMobileBanner,
  shouldShowMobileFab,
} from '@/pwa/install-loop';
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

function isMobilePlatform(platform) {
  return platform === 'ios' || platform === 'ios-other' || platform === 'android';
}

function syncMobileSurfaces(get, set, partial = {}) {
  const state = { ...get(), ...partial };
  const dismissed = Date.now() < state.dismissUntil;
  const mobile = isMobilePlatform(state.platform);

  set({
    ...partial,
    fabVisible: mobile && shouldShowMobileFab({
      isStandalone: state.isStandalone,
      dismissed,
      visitCount: state.visitCount,
      platform: state.platform,
    }),
    mobileBannerVisible: mobile && shouldShowMobileBanner({
      isStandalone: state.isStandalone,
      dismissed,
      visitCount: state.visitCount,
      platform: state.platform,
      sheetOpen: state.sheetOpen,
    }),
    bannerVisible: !mobile
      && !state.isStandalone
      && !dismissed
      && state.visitCount >= 3
      && state.visitCount <= 8,
  });
}

export const usePwaInstallStore = create((set, get) => ({
  deferredPrompt: null,
  platform: 'other',
  isStandalone: false,
  visitCount: 0,
  sheetOpen: false,
  bannerVisible: false,
  mobileBannerVisible: false,
  fabVisible: false,
  installing: false,
  justInstalled: false,
  dismissUntil: 0,
  iosStep: 0,
  androidStep: 0,

  init() {
    const platform = detectInstallPlatform();
    const isStandalone = isStandaloneMode();
    const visitCount = bumpVisits();
    const dismissUntil = readDismissUntil();

    syncMobileSurfaces(get, set, {
      platform: isStandalone ? 'installed' : platform,
      isStandalone,
      visitCount,
      dismissUntil,
    });

    const dismissed = Date.now() < dismissUntil;
    if (shouldAutoOpenMobileInstall({
      isStandalone,
      dismissed,
      visitCount,
      platform: isStandalone ? 'installed' : platform,
    })) {
      window.setTimeout(() => {
        const s = get();
        if (s.isStandalone || s.sheetOpen) return;
        markMobilePromptShown();
        get().openSheet();
      }, 2800);
    }
  },

  setDeferredPrompt(event) {
    const platform = get().platform;
    syncMobileSurfaces(get, set, {
      deferredPrompt: event,
      bannerVisible: get().visitCount >= 2 && canShowInstallUi(platform, true) && !isMobilePlatform(platform),
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
      mobileBannerVisible: false,
      iosStep: platform === 'ios' || platform === 'ios-other' ? 0 : get().iosStep,
      androidStep: platform === 'android' ? 0 : get().androidStep,
    });
  },

  closeSheet() {
    syncMobileSurfaces(get, set, { sheetOpen: false });
  },

  setIosStep(step) {
    set({ iosStep: step });
  },

  setAndroidStep(step) {
    set({ androidStep: step });
  },

  resetIosWizard() {
    set({ iosStep: 0 });
  },

  resetAndroidWizard() {
    set({ androidStep: 0 });
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
    syncMobileSurfaces(get, set, {
      dismissUntil: until,
      bannerVisible: false,
      fabVisible: false,
      mobileBannerVisible: false,
    });
  },

  markInstalled() {
    localStorage.setItem(INSTALLED_KEY, '1');
    set({
      platform: 'installed',
      isStandalone: true,
      justInstalled: true,
      sheetOpen: false,
      bannerVisible: false,
      mobileBannerVisible: false,
      fabVisible: false,
      deferredPrompt: null,
    });
    window.setTimeout(() => set({ justInstalled: false }), 8000);
  },

  setInstalling(v) {
    set({ installing: v });
  },

  showFab() {
    syncMobileSurfaces(get, set);
  },

  /** Instalación nativa en un toque (Chrome / Edge / Android con prompt). */
  async runNativeInstall() {
    const { deferredPrompt, isStandalone } = get();
    if (isStandalone || !deferredPrompt) return { outcome: 'unavailable' };

    set({ installing: true });
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
      return { outcome: 'error' };
    } finally {
      set({ installing: false });
    }
  },

  /** Abre guía visual o prompt nativo según plataforma. */
  async triggerInstall() {
    const { deferredPrompt, isStandalone, platform } = get();
    if (isStandalone) return { outcome: 'already' };
    if (platform === 'ios' || platform === 'ios-other') {
      get().openSheet();
      return { outcome: 'sheet' };
    }
    if (platform === 'android' && !deferredPrompt) {
      get().openSheet();
      return { outcome: 'sheet' };
    }
    if (!deferredPrompt) {
      get().openSheet();
      return { outcome: 'sheet' };
    }

    set({ sheetOpen: false, bannerVisible: false, mobileBannerVisible: false });
    return get().runNativeInstall();
  },
}));
