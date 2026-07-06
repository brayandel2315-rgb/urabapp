export default function StaticMapFallback({ latitude, longitude, label = 'Ubicación', className = 'h-56 w-full rounded-xl' }) {
  if (latitude == null || longitude == null) {
    return (
      <div className={`flex items-center justify-center bg-muted/30 text-sm text-muted ${className}`}>
        Sin coordenadas de entrega
      </div>
    );
  }

  const lat = Number(latitude);
  const lng = Number(longitude);
  const pad = 0.012;
  const bbox = `${lng - pad},${lat - pad},${lng + pad},${lat + pad}`;
  const mapsUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

  return (
    <div className={`overflow-hidden rounded-xl border border-border ${className}`}>
      <iframe
        title={label}
        className="h-full w-full border-0"
        loading="lazy"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`}
      />
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-background px-3 py-2 text-center text-xs font-semibold text-primary hover:underline"
      >
        Abrir en OpenStreetMap
      </a>
    </div>
  );
}
