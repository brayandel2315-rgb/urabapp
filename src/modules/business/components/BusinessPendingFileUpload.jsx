import { useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { toast } from '@/utils/toast';
import { cn } from '@/lib/utils';

function validateClientFile(file, { accept, maxMb }) {
  const allowed = accept.split(',').map((t) => t.trim());
  if (!allowed.includes(file.type)) {
    throw new Error('Formato no permitido. Revisa las especificaciones.');
  }
  if (file.size > maxMb * 1024 * 1024) {
    throw new Error(`El archivo supera ${maxMb} MB`);
  }
}

export default function BusinessPendingFileUpload({
  label,
  description,
  hint,
  accept,
  maxMb = 5,
  aspect = 'square',
  value,
  previewUrl,
  onChange,
  required = false,
  className,
}) {
  const inputRef = useRef(null);
  const [localPreview, setLocalPreview] = useState(null);

  const displayUrl = localPreview || previewUrl;
  const isPdf = value?.type === 'application/pdf';
  const aspectClass = aspect === 'banner' ? 'aspect-[2/1]' : 'aspect-square';

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      validateClientFile(file, { accept, maxMb });
      if (file.type.startsWith('image/')) {
        setLocalPreview(URL.createObjectURL(file));
      } else {
        setLocalPreview(null);
      }
      onChange(file);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div>
        <p className="text-sm font-semibold text-foreground">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </p>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      <div className={cn('relative overflow-hidden rounded-2xl bg-muted/40 ring-1 ring-border', aspectClass, !displayUrl && !isPdf && 'min-h-[120px]')}>
        {displayUrl ? (
          <img src={displayUrl} alt="" className="h-full w-full object-cover" />
        ) : isPdf && value ? (
          <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-1 p-4 text-center">
            <AppIcon name="card" size="md" className="text-primary" />
            <p className="text-sm font-medium text-foreground">PDF listo</p>
            <p className="truncate text-xs text-muted-foreground">{value.name}</p>
          </div>
        ) : (
          <div className="flex h-full min-h-[120px] items-center justify-center text-muted-foreground">
            <AppIcon name="package" size="md" />
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFile} />
      <Button type="button" size="sm" variant="outline" className="w-full" onClick={() => inputRef.current?.click()}>
        {value || displayUrl ? 'Cambiar archivo' : 'Seleccionar archivo'}
      </Button>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Variante compacta para documentos legales */
export function BusinessPendingDocUpload(props) {
  return (
    <BusinessPendingFileUpload
      aspect="square"
      {...props}
      className={cn('rounded-xl border border-border p-3', props.className)}
    />
  );
}
