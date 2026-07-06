import Button from '@/components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { openGoogleMapsNavigation, openWazeNavigation } from '@/utils/navigation-apps';

/**
 * Abrir ruta en Waze / Google Maps — patrón Rappi/Uber para cliente y mensajero.
 */
export default function NavigationLaunchBar({
  destination,
  label = 'Abrir navegación',
  className = '',
  compact = false,
}) {
  if (!destination?.latitude && !destination?.address) return null;

  const target = {
    latitude: destination.latitude,
    longitude: destination.longitude,
    address: destination.address || destination.label,
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {!compact && (
        <p className="w-full text-xs font-semibold text-muted-foreground">{label}</p>
      )}
      <Button
        type="button"
        size="sm"
        className="flex-1 gap-2 bg-[#33CCFF] text-slate-900 hover:bg-[#2bb8e8]"
        onClick={() => openWazeNavigation(target)}
      >
        <AppIcon name="delivery" size="sm" />
        Waze
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="flex-1 gap-2"
        onClick={() => openGoogleMapsNavigation(target)}
      >
        <AppIcon name="map" size="sm" />
        Maps
      </Button>
    </div>
  );
}
