import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/** Complementan "Pide ya tu…" — 3 palancas: comida, tiendas, velocidad. */
export const URABAPP_SERVICE_PHRASES = [
  'comida a domicilio',
  'pedido de tienda',
  'domicilio en minutos',
];

/** Frase más larga: reserva ancho estable para la línea dinámica. */
const LONGEST_PHRASE = 'domicilio en minutos';

const TYPE_MS = 72;
const ERASE_MS = 38;
const HOLD_MS = 2800;
const BETWEEN_MS = 420;

/**
 * Efecto máquina de escribir: escribe y borra servicios de Urabapp en bucle.
 * Línea 1 fija (CTA) + línea 2 dinámica con ancho reservado (sin saltos).
 */
export default function HomeTypewriterServices({
  prefix = 'Pide ya tu',
  className,
  highlightClassName = 'home-typewriter__dynamic-highlight',
}) {
  const [text, setText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setText(URABAPP_SERVICE_PHRASES[0]);
      setDeleting(false);
      setPhraseIdx(0);
      return undefined;
    }

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
  }, [text, deleting, phraseIdx, reduceMotion]);

  const liveLabel = text
    ? `${prefix} ${text}`
    : `${prefix} ${URABAPP_SERVICE_PHRASES[phraseIdx]}`;

  return (
    <h1
      className={cn('home-typewriter', className)}
      aria-label={liveLabel}
    >
      <span className="home-typewriter__prefix" aria-hidden>
        {prefix}
      </span>
      <span className="home-typewriter__dynamic-row" aria-hidden>
        <span className={cn('home-typewriter__sizer', highlightClassName)}>
          {LONGEST_PHRASE}
        </span>
        <span className={cn('home-typewriter__dynamic', highlightClassName)}>
          {text}
          {!reduceMotion ? (
            <span className="home-typewriter__cursor">|</span>
          ) : null}
        </span>
      </span>
    </h1>
  );
}
