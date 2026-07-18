import { useRef, useState } from 'react';
import Button from './Button';
import BrandedLoadingScreen from '@/components/feedback/BrandedLoadingScreen';
import { toast } from '../../utils/toast';

export default function ImageUpload({
  label,
  currentUrl,
  onUpload,
  hint = 'JPG, PNG o WebP · máx. 5 MB',
  aspect = 'square',
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const displayUrl = preview || currentUrl;

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await onUpload(file);
      setPreview(url);
    } catch (err) {
      setPreview(null);
      toast(err.message || 'Error al subir imagen', 'error');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const aspectClass = aspect === 'banner' ? 'aspect-[2/1]' : 'aspect-square';

  return (
    <div>
      {label && <p className="mb-2 text-sm font-semibold text-secondary">{label}</p>}
      <div className={`relative overflow-hidden rounded-2xl bg-background ring-1 ring-border ${aspectClass} max-h-48`}>
        {displayUrl ? (
          <img src={displayUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full min-h-[120px] items-center justify-center text-4xl text-muted">📷</div>
        )}
        {uploading && (
          <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
            <BrandedLoadingScreen variant="overlay" message="Subiendo…" className="h-full min-h-0" hideMessage />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="mt-2 w-full"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {displayUrl ? 'Cambiar imagen' : 'Subir imagen'}
      </Button>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}
