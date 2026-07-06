/** MapLibre — OpenFreeMap (vector, gratis) con fallback OSM raster */

export const OPENFREEMAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

/** Estilo demo MapLibre — respaldo si OpenFreeMap no responde */
export const DEMO_VECTOR_STYLE = 'https://demotiles.maplibre.org/style.json';

export const OSM_RASTER_STYLE = {
  version: 8,
  name: 'osm-fallback',
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap',
      maxzoom: 19,
    },
  },
  layers: [{ id: 'osm-raster', type: 'raster', source: 'osm' }],
};

const STYLE_CHAIN = [OPENFREEMAP_STYLE, DEMO_VECTOR_STYLE, OSM_RASTER_STYLE];

export function isWebGLSupported() {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2')
      || canvas.getContext('webgl')
      || canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

let maplibreModule = null;

export async function loadMapLibre() {
  if (maplibreModule) return maplibreModule;
  const maplibregl = (await import('maplibre-gl')).default;
  await import('maplibre-gl/dist/maplibre-gl.css');
  maplibreModule = maplibregl;
  return maplibregl;
}

export function getPreferredMapStyle() {
  return OPENFREEMAP_STYLE;
}

export function getStyleFallbackChain() {
  return STYLE_CHAIN;
}
