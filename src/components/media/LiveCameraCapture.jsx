import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';

/**
 * Captura en tiempo real vía cámara frontal — sin galería ni archivos locales.
 * Obligatorio para verificación de identidad de mensajeros.
 */
export default function LiveCameraCapture({
  label = 'Foto en vivo',
  hint = 'Debes usar la cámara ahora. No se permiten fotos de galería.',
  onCapture,
  disabled = false,
  className,
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [phase, setPhase] = useState('idle'); // idle | live | preview | uploading
  const [previewUrl, setPreviewUrl] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null);
  const [error, setError] = useState(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => () => stopStream(), [stopStream]);

  const startCamera = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Tu navegador no permite abrir la cámara. Usa Chrome o Safari actualizado.');
      return;
    }
    try {
      stopStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPhase('live');
    } catch (err) {
      const name = err?.name || '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setError('Permiso de cámara denegado. Actívala en ajustes del navegador para continuar.');
      } else if (name === 'NotFoundError') {
        setError('No encontramos cámara en este dispositivo.');
      } else {
        setError('No se pudo abrir la cámara. Intenta de nuevo.');
      }
      stopStream();
      setPhase('idle');
    }
  }, [stopStream]);

  const takePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);

    canvas.toBlob((blob) => {
      if (!blob) {
        setError('No se pudo capturar la foto. Intenta otra vez.');
        return;
      }
      stopStream();
      const ts = Date.now();
      const file = new File([blob], `live-selfie-${ts}.jpg`, {
        type: 'image/jpeg',
        lastModified: ts,
      });
      file.capturedAt = new Date(ts).toISOString();
      file.captureMethod = 'live_camera';
      setCapturedFile(file);
      setPreviewUrl(URL.createObjectURL(blob));
      setPhase('preview');
    }, 'image/jpeg', 0.88);
  }, [stopStream]);

  const retake = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCapturedFile(null);
    setPhase('idle');
    startCamera();
  }, [previewUrl, startCamera]);

  const confirm = useCallback(async () => {
    if (!capturedFile || !onCapture) return;
    setPhase('uploading');
    setError(null);
    try {
      await onCapture(capturedFile);
    } catch (err) {
      setError(err.message || 'Error al guardar la foto');
      setPhase('preview');
    }
  }, [capturedFile, onCapture]);

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        </div>
      )}

      <div className="relative overflow-hidden rounded-2xl bg-muted ring-2 ring-primary/20 aspect-[3/4] max-h-80">
        {phase === 'live' && (
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="h-full w-full scale-x-[-1] object-cover"
          />
        )}
        {(phase === 'preview' || phase === 'uploading') && previewUrl && (
          <img src={previewUrl} alt="" className="h-full w-full object-cover" />
        )}
        {phase === 'idle' && !error && (
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 p-6 text-center">
            <AppIcon name="profile" size="3xl" className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Abriremos tu cámara frontal para una foto en tiempo real
            </p>
          </div>
        )}
        {phase === 'uploading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50">
            <Loader />
            <span className="text-sm font-medium text-white">Guardando foto…</span>
          </div>
        )}
        {phase === 'live' && (
          <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
            <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
              En vivo — encuadra tu rostro
            </span>
          </div>
        )}
      </div>

      {error && (
        <p className="flex items-start gap-2 rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <AppIcon name="alert" size="xs" className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        {phase === 'idle' && (
          <Button type="button" className="w-full" disabled={disabled} onClick={startCamera}>
            <AppIcon name="profile" size="sm" className="mr-2" />
            Abrir cámara
          </Button>
        )}
        {phase === 'live' && (
          <>
            <Button type="button" className="w-full sm:flex-1" onClick={takePhoto}>
              Tomar foto
            </Button>
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => { stopStream(); setPhase('idle'); }}>
              Cancelar
            </Button>
          </>
        )}
        {phase === 'preview' && (
          <>
            <Button type="button" className="w-full sm:flex-1" onClick={confirm}>
              Usar esta foto
            </Button>
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={retake}>
              Repetir
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
