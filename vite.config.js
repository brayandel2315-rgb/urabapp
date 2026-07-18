import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, existsSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadBuildMeta() {
  const versionPath = path.resolve(__dirname, 'public/app-version.json');
  if (!existsSync(versionPath)) {
    return { buildId: 'dev', builtAt: new Date().toISOString() };
  }
  try {
    return JSON.parse(readFileSync(versionPath, 'utf8'));
  } catch {
    return { buildId: 'dev', builtAt: new Date().toISOString() };
  }
}

const buildMeta = loadBuildMeta();

export default defineConfig({
  define: {
    'import.meta.env.VITE_APP_BUILD_ID': JSON.stringify(buildMeta.buildId),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    // Si 5173 está ocupado (otro `npm run dev`), usa 5174+ en lugar de fallar
    strictPort: false,
    hmr: { overlay: true },
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
  },
  build: {
    modulePreload: {
      resolveDependencies: (_filename, deps) => deps.filter(
        (dep) => !dep.includes('charts') && !dep.includes('maplibre'),
      ),
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) {
            return 'vendor';
          }
          if (id.includes('@tanstack/react-query')) return 'query';
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('motion')) return 'motion';
          if (id.includes('recharts')) return 'charts';
          if (id.includes('lucide-react') || id.includes('@iconify')) return 'icons';
          if (id.includes('maplibre-gl')) return 'maplibre';
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // SW nuevo toma control y recarga sin hard refresh manual
      injectRegister: null,
      // Sin service worker en dev — HMR instantáneo sin caché PWA
      devOptions: { enabled: false },
      includeAssets: ['app-icon.png', 'apple-touch-icon.png', 'urabapp-logo.png', 'urabapp-logo-transparent.png', 'favicon.svg', 'og-image.png', 'og-image.svg'],
      manifest: {
        id: '/?source=pwa',
        name: 'Urabapp',
        short_name: 'Urabapp',
        description: 'Conectamos lo que importa. Impulsamos lo local.',
        lang: 'es-CO',
        dir: 'ltr',
        theme_color: '#2E7D32',
        background_color: '#FAF9F6',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui', 'browser'],
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/?source=pwa',
        categories: ['food', 'shopping', 'business'],
        shortcuts: [
          {
            name: 'Explorar tiendas',
            short_name: 'Pedir',
            url: '/explorar?source=shortcut',
            icons: [{ src: '/app-icon.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Mis pedidos',
            short_name: 'Pedidos',
            url: '/pedidos?source=shortcut',
            icons: [{ src: '/app-icon.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Mandado',
            short_name: 'Mandado',
            url: '/mandado?source=shortcut',
            icons: [{ src: '/app-icon.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
        icons: [
          { src: '/app-icon.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/app-icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png', purpose: 'any' },
          { src: '/app-icon.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: '/urabapp-logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,ico,jpeg,png,svg,woff2,webmanifest}'],
        importScripts: ['/push-sw.js'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/assets\//],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'urabapp-pages',
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 },
            },
          },
          {
            urlPattern: ({ url }) => url.origin.includes('supabase.co') && url.pathname.includes('/auth/v1'),
            handler: 'NetworkOnly',
          },
          {
            urlPattern: ({ url }) => url.origin.includes('supabase.co') && (
              url.pathname.includes('/rest/v1/') || url.pathname.includes('/realtime/v1')
            ),
            handler: 'NetworkOnly',
          },
          {
            urlPattern: ({ url }) => url.origin.includes('supabase.co') && url.pathname.includes('/storage/v1'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'urabapp-storage',
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 32, maxAgeSeconds: 86400 },
            },
          },
        ],
      },
    }),
  ],
});
