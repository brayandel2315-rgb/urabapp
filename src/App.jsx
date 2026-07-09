import { useEffect, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import ConfigBanner from './components/ConfigBanner';
import LocalDevToolbar from './components/LocalDevToolbar';
import OfflineBanner from './components/OfflineBanner';
import AppUpdateBanner from './components/AppUpdateBanner';
import PwaInstallBootstrap from './components/pwa/PwaInstallBootstrap';
import PwaInstallSheet from './components/pwa/PwaInstallSheet';
import PwaInstallBanner from './components/pwa/PwaInstallBanner';
import PageMeta from '@/design-system/patterns/PageMeta';
import PageLoader from './components/PageLoader';
import AppRoutes from './app/routes';
import { useAuthInit } from './hooks/useAuth';
import { useReferralCapture } from './hooks/useReferralCapture';
import { initAnalytics } from './services/analytics.service';
import UrabappToaster from './components/feedback/UrabappToaster';

function App() {
  useAuthInit();
  useReferralCapture();

  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <ErrorBoundary>
      <ConfigBanner />
      <OfflineBanner />
      <AppUpdateBanner />
      <PwaInstallBootstrap />
      <PwaInstallSheet />
      <PwaInstallBanner />
      <PageMeta />
      <Suspense fallback={<PageLoader />}>
        <AppRoutes />
      </Suspense>
      <LocalDevToolbar />
      <UrabappToaster />
    </ErrorBoundary>
  );
}

export default App;
