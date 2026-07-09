import { useEffect, useRef, useState, useCallback } from 'react';
import { updateDriverLocation } from '../services/rider.service';
import { recordOrderLocationPing } from '../services/order-tracking.service';
import { emitRiderLocation, isSocketEnabled } from '../services/socket.service';
import { enqueueGpsPing, flushGpsQueue } from '../utils/gps-offline-queue';
import { startAdaptiveWatch } from '@/utils/geolocation-engine';

const DB_PERSIST_MS = 12_000;
const MIN_DISTANCE_M = 10;
const HIGH_ACCURACY_MS = 3000;
const BATTERY_SAVE_MS = 8000;

function distanceMeters(a, b) {
  if (!a || !b) return Infinity;
  const R = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function resolveIntervalMs({ batteryLevel, speedMps }) {
  if (batteryLevel != null && batteryLevel < 20) return BATTERY_SAVE_MS;
  if (speedMps != null && speedMps < 0.5) return BATTERY_SAVE_MS;
  return HIGH_ACCURACY_MS;
}

/**
 * GPS del repartidor — 3s o cada 10m, cola offline, pings auditables.
 */
export function useRiderLocationShare({
  driverId,
  orderId,
  enabled,
  intervalMs: intervalOverride,
  onPosition,
}) {
  const lastDbWrite = useRef(0);
  const lastPingWrite = useRef(0);
  const lastCoords = useRef(null);
  const stopWatchRef = useRef(null);
  const [lastPosition, setLastPosition] = useState(null);
  const [connectionState, setConnectionState] = useState(
    typeof navigator !== 'undefined' && navigator.onLine ? 'online' : 'offline',
  );

  const pushPing = useCallback(async (payload) => {
    if (!orderId) return;
    try {
      await recordOrderLocationPing(orderId, payload);
    } catch {
      enqueueGpsPing({ orderId, ...payload });
    }
  }, [orderId]);

  useEffect(() => {
    const onOnline = () => {
      setConnectionState('online');
      flushGpsQueue(async (item) => {
        if (item.orderId) await recordOrderLocationPing(item.orderId, item);
      });
    };
    const onOffline = () => setConnectionState('offline');
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !driverId || typeof navigator === 'undefined' || !navigator.geolocation) {
      return undefined;
    }

    const push = (position) => {
      const { latitude, longitude, accuracy, speed, heading, altitude } = position.coords;
      const batteryLevel = navigator.getBattery
        ? undefined
        : undefined;

      const updatedAt = new Date().toISOString();
      const payload = {
        latitude,
        longitude,
        accuracy,
        speed: speed ?? undefined,
        heading: heading ?? undefined,
        altitude: altitude ?? undefined,
        updatedAt,
        connectionState,
        gpsState: accuracy != null && accuracy < 50 ? 'high' : 'normal',
      };

      const movedEnough = !lastCoords.current
        || distanceMeters(lastCoords.current, payload) >= MIN_DISTANCE_M;

      if (!movedEnough) return;

      lastCoords.current = { latitude, longitude };
      setLastPosition(payload);
      onPosition?.(payload);
      emitRiderLocation({ driverId, latitude, longitude, updatedAt, orderId });

      const now = Date.now();

      // Con pedido activo: solo RPC auditada (actualiza drivers + proximidad)
      if (orderId) {
        if (now - lastPingWrite.current >= HIGH_ACCURACY_MS) {
          lastPingWrite.current = now;
          pushPing({
            latitude,
            longitude,
            accuracy,
            speed: speed ?? undefined,
            heading: heading ?? undefined,
            altitude: altitude ?? undefined,
            connectionState,
            gpsState: payload.gpsState,
          });
        }
        return;
      }

      // Sin pedido activo (disponible): persistencia directa en drivers para mapa admin
      const shouldPersist = !isSocketEnabled() || now - lastDbWrite.current >= DB_PERSIST_MS;
      if (shouldPersist) {
        lastDbWrite.current = now;
        updateDriverLocation(driverId, { latitude, longitude }).catch(() => {});
      }
    };

    stopWatchRef.current = startAdaptiveWatch(push, () => {}, { highAccuracyAfterFix: true });

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(push, () => {}, {
        enableHighAccuracy: Boolean(lastCoords.current),
        maximumAge: 15_000,
        timeout: 12_000,
      });
    }, resolveIntervalMs({ speedMps: lastCoords.current?.speed }));

    return () => {
      stopWatchRef.current?.();
      clearInterval(interval);
    };
  }, [driverId, orderId, enabled, intervalOverride, onPosition, connectionState, pushPing]);

  return lastPosition
    ? { ...lastPosition, connectionState }
    : { connectionState };
}
