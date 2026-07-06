import { useCallback } from 'react';
import { homeTrack } from '../services/home-api.service';

export function useHomeAnalytics(userId, municipio) {
  const track = useCallback(
    (eventName, props = {}) => {
      homeTrack(eventName, { municipio, ...props }, userId);
    },
    [userId, municipio]
  );

  const trackCategory = useCallback(
    (categoryId) => track('category_click', { categoryId }),
    [track]
  );

  const trackBusiness = useCallback(
    (businessId, action = 'click') => track('business_click', { businessId, action }),
    [track]
  );

  const trackConversion = useCallback(
    (step, meta = {}) => track('conversion', { step, ...meta }),
    [track]
  );

  return { track, trackCategory, trackBusiness, trackConversion };
}
