import { useEffect, useRef, useState } from 'react';
import { getDefaultCenter, reverseGeocode } from '@/services/map.service';
import { createMapProvider } from '@/lib/map-provider';
import { useMapResize } from '@/hooks/useMapResize';
import { cn } from '@/lib/utils';

const PICKUP_COLOR = '#1C8238';
const DROPOFF_COLOR = '#E85D04';

export default function CourierRouteMap({
  pickup,
  dropoff,
  onPickupChange,
  onDropoffChange,
  activePoint = 'pickup',
  className = 'h-[42vh] min-h-[240px] w-full',
}) {
  const containerRef = useRef(null);
  const mapApiRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const dropoffMarkerRef = useRef(null);
  const activeRef = useRef(activePoint);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    activeRef.current = activePoint;
  }, [activePoint]);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    let cancelled = false;

    (async () => {
      const center = pickup?.latitude
        ? pickup
        : { latitude: getDefaultCenter()[1], longitude: getDefaultCenter()[0] };

      const api = await createMapProvider(containerRef.current, { center, zoom: 14 });
      if (cancelled) {
        api.destroy();
        return;
      }
      mapApiRef.current = api;

      const handleDrag = async (type, { latitude, longitude }) => {
        const label = await reverseGeocode(latitude, longitude);
        const payload = { latitude, longitude, label: label || '' };
        if (type === 'pickup') onPickupChange?.(payload);
        else onDropoffChange?.(payload);
      };

      if (pickup?.latitude) {
        pickupMarkerRef.current = await api.addMarker(pickup, {
          color: PICKUP_COLOR,
          draggable: true,
          title: 'Recoger',
          onDragEnd: (pos) => handleDrag('pickup', pos),
        });
      }

      if (dropoff?.latitude) {
        dropoffMarkerRef.current = await api.addMarker(dropoff, {
          color: DROPOFF_COLOR,
          draggable: true,
          title: 'Entregar',
          onDragEnd: (pos) => handleDrag('dropoff', pos),
        });
      }

      api.onClick(async ({ latitude, longitude }) => {
        const label = await reverseGeocode(latitude, longitude);
        const payload = { latitude, longitude, label: label || '' };
        const type = activeRef.current;

        if (type === 'pickup') {
          if (pickupMarkerRef.current) {
            api.setMarkerPosition(pickupMarkerRef.current, payload);
          } else {
            pickupMarkerRef.current = await api.addMarker(payload, {
              color: PICKUP_COLOR,
              draggable: true,
              title: 'Recoger',
              onDragEnd: (pos) => handleDrag('pickup', pos),
            });
          }
          onPickupChange?.(payload);
        } else {
          if (dropoffMarkerRef.current) {
            api.setMarkerPosition(dropoffMarkerRef.current, payload);
          } else {
            dropoffMarkerRef.current = await api.addMarker(payload, {
              color: DROPOFF_COLOR,
              draggable: true,
              title: 'Entregar',
              onDragEnd: (pos) => handleDrag('dropoff', pos),
            });
          }
          onDropoffChange?.(payload);
        }
      });
      setMapReady(true);
    })();

    return () => {
      cancelled = true;
      mapApiRef.current?.destroy();
      mapApiRef.current = null;
      setMapReady(false);
    };
  }, []);

  useMapResize(containerRef, mapApiRef, mapReady);

  useEffect(() => {
    if (!pickup?.latitude || !pickupMarkerRef.current) return;
    mapApiRef.current?.setMarkerPosition(pickupMarkerRef.current, pickup);
  }, [pickup?.latitude, pickup?.longitude]);

  useEffect(() => {
    if (!dropoff?.latitude || !dropoffMarkerRef.current) return;
    mapApiRef.current?.setMarkerPosition(dropoffMarkerRef.current, dropoff);
  }, [dropoff?.latitude, dropoff?.longitude]);

  useEffect(() => {
    if (!pickup?.latitude || !dropoff?.latitude) return;
    mapApiRef.current?.fitToPoints([pickup, dropoff], { padding: 56, maxZoom: 15 });
  }, [pickup?.latitude, dropoff?.latitude]);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div ref={containerRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/25 to-transparent" />
      <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 text-[10px] font-bold text-white drop-shadow-md">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: PICKUP_COLOR }} />
          Recoger
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: DROPOFF_COLOR }} />
          Entregar
        </span>
      </div>
    </div>
  );
}
