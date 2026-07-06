/**
 * Proveedor de mapas — MapLibre + OpenFreeMap (vector, gratis) con fallback en cadena.
 */
import {
  loadMapLibre,
  getPreferredMapStyle,
  getStyleFallbackChain,
  isWebGLSupported,
} from '@/lib/maplibre';
import { getDefaultCenter } from '@/services/map.service';

function toPoint(p) {
  if (!p) return null;
  const lat = Number(p.lat ?? p.latitude);
  const lng = Number(p.lng ?? p.longitude);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

function toLngLat(p) {
  const pt = toPoint(p);
  return pt ? [pt.lng, pt.lat] : null;
}

function normalizeLineGeometry(geometry) {
  if (!geometry) return null;
  if (geometry.type === 'LineString' && geometry.coordinates?.length) return geometry;
  if (Array.isArray(geometry.coordinates)) {
    return { type: 'LineString', coordinates: geometry.coordinates };
  }
  return null;
}

async function createMapLibreProvider(container, { center, zoom, interactive = true }) {
  if (!isWebGLSupported()) {
    throw new Error('WEBGL_UNAVAILABLE');
  }

  const maplibregl = await loadMapLibre();
  const defaultCenter = getDefaultCenter();
  const initial = toLngLat(center) || defaultCenter;
  const fallbackChain = getStyleFallbackChain();
  let styleIndex = 0;

  const map = new maplibregl.Map({
    container,
    style: getPreferredMapStyle(),
    center: initial,
    zoom,
    attributionControl: false,
    interactive,
    antialias: true,
    fadeDuration: 0,
  });

  const applyNextStyle = () => {
    styleIndex += 1;
    if (styleIndex >= fallbackChain.length) return;
    const next = fallbackChain[styleIndex];
    try {
      map.setStyle(next);
    } catch {
      applyNextStyle();
    }
  };

  map.on('error', (e) => {
    const msg = String(e?.error?.message || e?.message || '').toLowerCase();
    const isRecoverable = msg.includes('style')
      || msg.includes('sprite')
      || msg.includes('glyph')
      || msg.includes('source')
      || msg.includes('tile');
    if (isRecoverable && styleIndex < fallbackChain.length - 1) {
      applyNextStyle();
    }
  });

  map.addControl(
    new maplibregl.AttributionControl({ compact: true }),
    'bottom-left',
  );
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

  const markers = [];
  const cleanups = [];
  let routeCleanup = null;
  let loaded = false;

  const resize = () => {
    try {
      map.resize();
    } catch {
      /* destroyed */
    }
  };

  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => resize());
    ro.observe(container);
    cleanups.push(() => ro.disconnect());
  } else {
    const onWinResize = () => resize();
    window.addEventListener('resize', onWinResize);
    cleanups.push(() => window.removeEventListener('resize', onWinResize));
  }

  const whenLoaded = () => new Promise((resolve) => {
    if (loaded) {
      resolve();
      return;
    }
    const finish = () => {
      loaded = true;
      resize();
      resolve();
    };
    if (map.isStyleLoaded()) {
      finish();
      return;
    }
    map.once('load', finish);
    map.once('styledata', () => {
      if (map.isStyleLoaded()) finish();
    });
  });

  const addGeoJsonLine = async (geometry, { color = '#28B463', weight = 4, opacity = 0.85, dashed = false } = {}) => {
    await whenLoaded();
    const geo = normalizeLineGeometry(geometry);
    if (!geo) return;
    const sourceId = `line-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    map.addSource(sourceId, {
      type: 'geojson',
      data: { type: 'Feature', properties: {}, geometry: geo },
    });
    map.addLayer({
      id: `${sourceId}-line`,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': color,
        'line-width': weight,
        'line-opacity': opacity,
        ...(dashed ? { 'line-dasharray': [2, 2] } : {}),
      },
    });
    cleanups.push(() => {
      if (map.getLayer(`${sourceId}-line`)) map.removeLayer(`${sourceId}-line`);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    });
  };

  const api = {
    type: 'openfreemap',
    instance: map,
    resize,
    async addMarker(point, { color = '#28B463', draggable = false, title = '', onDragEnd } = {}) {
      await whenLoaded();
      const lngLat = toLngLat(point);
      if (!lngLat) return null;
      const marker = new maplibregl.Marker({ draggable, color })
        .setLngLat(lngLat)
        .addTo(map);
      if (title) marker.setPopup(new maplibregl.Popup({ closeButton: false, offset: 12 }).setText(title));
      if (onDragEnd) {
        marker.on('dragend', () => {
          const { lng, lat } = marker.getLngLat();
          onDragEnd({ latitude: lat, longitude: lng });
        });
      }
      markers.push(marker);
      return marker;
    },
    setMarkerPosition(marker, point) {
      const lngLat = toLngLat(point);
      if (marker && lngLat) marker.setLngLat(lngLat);
    },
    fitToPoints(points, { padding = 48, maxZoom = 15 } = {}) {
      const bounds = new maplibregl.LngLatBounds();
      points.map(toLngLat).filter(Boolean).forEach((p) => bounds.extend(p));
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding, maxZoom, duration: 600 });
        map.once('moveend', resize);
      }
    },
    setCenter(point, zoomLevel) {
      const lngLat = toLngLat(point);
      if (!lngLat) return;
      map.setCenter(lngLat);
      if (zoomLevel) map.setZoom(zoomLevel);
      resize();
    },
    flyTo(point, zoomLevel = 15) {
      const lngLat = toLngLat(point);
      if (!lngLat) return;
      map.flyTo({ center: lngLat, zoom: zoomLevel, essential: true });
      map.once('moveend', resize);
    },
    onClick(handler) {
      map.on('click', (e) => {
        handler({ latitude: e.lngLat.lat, longitude: e.lngLat.lng });
      });
    },
    async drawRoute(from, to, options) {
      await addGeoJsonLine({
        type: 'LineString',
        coordinates: [toLngLat(from), toLngLat(to)].filter(Boolean),
      }, options);
    },
    drawLine(points, options) {
      return addGeoJsonLine({
        type: 'LineString',
        coordinates: points.map(toLngLat).filter(Boolean),
      }, options);
    },
    async drawGeometry(geometry, options) {
      return addGeoJsonLine(geometry, options);
    },
    async setRouteGeometry(geometry, options) {
      routeCleanup?.();
      routeCleanup = null;
      await whenLoaded();
      const geo = normalizeLineGeometry(geometry);
      if (!geo) return;
      const sourceId = `route-active-${Date.now()}`;
      map.addSource(sourceId, {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: geo },
      });
      map.addLayer({
        id: `${sourceId}-line`,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': options?.color || '#28B463',
          'line-width': options?.weight || 5,
          'line-opacity': options?.opacity ?? 0.88,
          ...(options?.dashed ? { 'line-dasharray': [2, 2] } : {}),
        },
      });
      routeCleanup = () => {
        if (map.getLayer(`${sourceId}-line`)) map.removeLayer(`${sourceId}-line`);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      };
    },
    clearRoute() {
      routeCleanup?.();
      routeCleanup = null;
    },
    destroy() {
      routeCleanup?.();
      routeCleanup = null;
      cleanups.forEach((fn) => fn());
      cleanups.length = 0;
      markers.forEach((m) => m.remove());
      markers.length = 0;
      map.remove();
    },
  };

  return api;
}

export async function createMapProvider(container, options = {}) {
  const { center, zoom = 14, interactive = true } = options;
  return createMapLibreProvider(container, { center, zoom, interactive });
}

export function getMapProviderName() {
  return 'openfreemap';
}

export { isWebGLSupported };
