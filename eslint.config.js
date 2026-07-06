import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['public/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        clients: 'readonly',
      },
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Sincronizar estado al cambiar props (modales, mapas) — patrón válido en esta app
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: [
      'src/components/maps/**/*.{js,jsx}',
      'src/components/courier/CourierRouteMap.jsx',
      'src/components/geo/**/*.{js,jsx}',
      'src/components/shipment/ShipmentTrackingMap.jsx',
      'src/modules/rider/components/RiderDeliveryMapInner.jsx',
    ],
    rules: {
      'react-hooks/exhaustive-deps': 'off',
    },
  },
])
