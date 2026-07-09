import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePwaInstallStore } from '@/store/pwaInstallStore';
import { toast } from '@/utils/toast';
import { BRAND } from '@/utils/constants';

const SKIP_PREFIXES = ['/login', '/registro', '/checkout', '/negocio/onboarding', '/domiciliario/registro'];

export default function PwaInstallBootstrap() {
  const location = useLocation();
  const init = usePwaInstallStore((s) => s.init);
  const setDeferredPrompt = usePwaInstallStore((s) => s.setDeferredPrompt);
  const markInstalled = usePwaInstallStore((s) => s.markInstalled);
  const refreshStandalone = usePwaInstallStore((s) => s.refreshStandalone);
  const showFab = usePwaInstallStore((s) => s.showFab);
  const isStandalone = usePwaInstallStore((s) => s.isStandalone);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const onInstalled = () => {
      markInstalled();
      toast(`${BRAND.name} instalada — ábrela desde tu inicio o escritorio`, 'success');
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [setDeferredPrompt, markInstalled]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshStandalone();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refreshStandalone);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refreshStandalone);
    };
  }, [refreshStandalone]);

  useEffect(() => {
    if (isStandalone || SKIP_PREFIXES.some((p) => location.pathname.startsWith(p))) return;
    const t = window.setTimeout(showFab, 4000);
    return () => window.clearTimeout(t);
  }, [location.pathname, isStandalone, showFab]);

  return null;
}
