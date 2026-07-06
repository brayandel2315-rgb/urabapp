import { useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { toast } from '@/utils/toast';
import AppIcon from '@/design-system/icons/AppIcon';

export default function BusinessDocumentUpload({
  label,
  description,
  currentUrl,
  onUpload,
  hint = 'JPG, PNG, WebP o PDF · máx. 8 MB',
  accept = 'image/jpeg,image/png,image/webp,application/pdf',
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const isPdf = currentUrl?.toLowerCase().includes('.pdf');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onUpload(file);
      toast('Documento subido');
    } catch (err) {
      toast(err.message || 'Error al subir', 'error');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="rounded-xl border border-border p-3">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      {description && (
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      )}
      {currentUrl ? (
        <div className="mt-2 flex items-center justify-between gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <AppIcon name={isPdf ? 'card' : 'check'} size="xs" className="text-primary" />
            {isPdf ? 'PDF cargado' : 'Imagen cargada'}
          </span>
          <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary">
            Ver
          </a>
        </div>
      ) : (
        <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">Pendiente de subir</p>
      )}
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFile} />
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="mt-2 w-full"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? <Loader size="sm" /> : (currentUrl ? 'Reemplazar' : 'Subir documento')}
      </Button>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
