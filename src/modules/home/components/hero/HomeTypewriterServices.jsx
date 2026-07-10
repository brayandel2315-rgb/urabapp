import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export const URABAPP_SERVICE_PHRASES = [
  'comida a domicilio',
  'mercado del súper',
  'farmacia cerca',
  'mandado express',
  'envío seguro',
  'ruta intermunicipal',
  'restaurante abierto',
  'domicilio rápido',
  'tienda local',
  'oferta del día',
];

const TYPE_MS = 88;
const ERASE_MS = 52;
const HOLD_MS = 3200;
const BETWEEN_MS = 650;

/**
 * Efecto máquina de escribir: escribe y borra servicios de Urabapp en bucle.
 * Línea 1 fija (CTA) + línea 2 dinámica para evitar saltos horizontales.
 */
export default function HomeTypewriterServices({
  prefix = 'Pide ya tu',
  className,
  highlightClassName = 'text-[#2E7D32]',
}) {
  const [text, setText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = URABAPP_SERVICE_PHRASES[phraseIdx];
    let delay = TYPE_MS;

    if (!deleting && text.length < phrase.length) {
      delay = TYPE_MS;
    } else if (!deleting && text.length === phrase.length) {
      delay = HOLD_MS;
    } else if (deleting && text.length > 0) {
      delay = ERASE_MS;
    } else {
      delay = BETWEEN_MS;
    }

    const id = window.setTimeout(() => {
      if (!deleting && text.length < phrase.length) {
        setText(phrase.slice(0, text.length + 1));
        return;
      }

      if (!deleting && text.length === phrase.length) {
        setDeleting(true);
        return;
      }

      if (deleting && text.length > 0) {
        setText(phrase.slice(0, text.length - 1));
        return;
      }

      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % URABAPP_SERVICE_PHRASES.length);
    }, delay);

    return () => window.clearTimeout(id);
  }, [text, deleting, phraseIdx]);

  return (
    <h1 className={cn('home-typewriter', className)}>
      <span className="home-typewriter__prefix">{prefix}</span>
      <span className="home-typewriter__dynamic-row">
        <span className={cn('home-typewriter__dynamic', highlightClassName)}>{text}</span>
        <span className="home-typewriter__cursor" aria-hidden>
          |
        </span>
      </span>
    </h1>
  );
}
