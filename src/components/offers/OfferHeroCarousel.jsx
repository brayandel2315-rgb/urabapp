import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { OfferCardHero } from './OfferCard';
import { motionPresets, tween } from '@/design-system/motion/presets';

export default function OfferHeroCarousel({ items, onOfferClick, onSave, isSaved, onShare }) {
  const slides = items ?? [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (!slides.length) return null;

  const current = slides[index];

  return (
    <section aria-label="Promociones destacadas">
      <AnimatePresence mode="wait">
        <motion.div key={current.id || index} {...motionPresets.slideUp} transition={tween}>
          <OfferCardHero
            offer={current}
            onClick={onOfferClick}
            onSave={onSave}
            saved={isSaved?.(current.id)}
            onShare={onShare}
          />
        </motion.div>
      </AnimatePresence>
      {slides.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id || i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-primary' : 'w-1.5 bg-border'}`}
              aria-label={`Promo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
