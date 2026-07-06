import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/utils/toast';
import FormSelect from '@/design-system/patterns/FormSelect';
import { SHIPMENT_MUNICIPALITIES, detectLogisticsType, normalizeMunicipioName } from '@/data/shipment-catalog';
import { cn } from '@/lib/utils';

export default function ShipmentMunicipioPairPicker({
  origin,
  dest,
  onOriginChange,
  onDestChange,
  className,
  autoRedirect = true,
}) {
  const navigate = useNavigate();
  const logisticsType = useMemo(
    () => detectLogisticsType(origin, dest),
    [origin, dest]
  );

  const handleOrigin = (value) => {
    const v = normalizeMunicipioName(value);
    onOriginChange(v);
    if (autoRedirect && dest && detectLogisticsType(v, dest) === 'mandado') {
      toast('Mismo municipio — te llevamos al mandado local');
      navigate('/mandado', { state: { municipio: v, pickup: '', dropoff: '' } });
    }
  };

  const handleDest = (value) => {
    const v = normalizeMunicipioName(value);
    onDestChange(v);
    if (autoRedirect && origin && detectLogisticsType(origin, v) === 'mandado') {
      toast('Mismo municipio — te llevamos al mandado local');
      navigate('/mandado', { state: { municipio: v } });
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormSelect label="Origen" value={origin} onChange={(e) => handleOrigin(e.target.value)} required>
          <option value="">Selecciona municipio</option>
          {SHIPMENT_MUNICIPALITIES.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </FormSelect>
        <FormSelect label="Destino" value={dest} onChange={(e) => handleDest(e.target.value)} required>
          <option value="">Selecciona municipio</option>
          {SHIPMENT_MUNICIPALITIES.filter((m) => m !== origin).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </FormSelect>
      </div>
      {logisticsType === 'intermunicipal' && origin && dest && (
        <p className="rounded-xl bg-teal-500/10 px-3 py-2 text-xs font-semibold text-teal-800 dark:text-teal-200">
          Envío intermunicipal · {origin} → {dest}
        </p>
      )}
    </div>
  );
}
