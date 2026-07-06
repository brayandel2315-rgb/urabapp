import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.jsx';
import ThemeProvider from './design-system/providers/ThemeProvider';
import { mapApiError } from './utils/errors';
import { registerServiceWorker } from './pwa/registerServiceWorker';
import { isRemoteBuildNewer } from './pwa/appVersion';
import { reloadForUpdate } from './pwa/swUpdate';
import { emitCommEvent } from '@/communication';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: (count, error) => {
        if (error?.message?.includes('fetch') || error?.message?.includes('network')) {
          return count < 2;
        }
        return count < 1;
      },
      refetchOnWindowFocus: import.meta.env.PROD,
    },
    mutations: {
      onError: (error) => {
        emitCommEvent('system_error', {
          payload: { message: error?.message, source: 'mutation' },
        }).catch(() => {});
        if (import.meta.env.DEV) {
          console.error('Mutation error:', error);
        }
      },
    },
  },
});

queryClient.getQueryCache().config.onError = (error) => {
  emitCommEvent('system_error', {
    payload: { message: mapApiError(error), source: 'query' },
  }).catch(() => {});
  if (import.meta.env.DEV) {
    console.error('Query error:', mapApiError(error));
  }
};

registerServiceWorker();

// En desarrollo: quitar cualquier SW/caché que bloquee HMR o sirva assets viejos
if (import.meta.env.DEV) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }
  if ('caches' in window) {
    caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

window.__urabappBootOk?.();

if (import.meta.env.PROD) {
  isRemoteBuildNewer()
    .then((newer) => {
      if (newer) reloadForUpdate();
    })
    .catch(() => {});
}
