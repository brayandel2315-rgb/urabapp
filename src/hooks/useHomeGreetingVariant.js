import { useEffect, useMemo, useState } from 'react';
import { getGreetingVariant, GREETING_UPDATED_EVENT } from '@/utils/greeting-session';

export function useHomeGreetingVariant(userId) {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const onUpdated = (event) => {
      if (event.detail?.userId === userId) {
        setRevision((value) => value + 1);
      }
    };

    window.addEventListener(GREETING_UPDATED_EVENT, onUpdated);
    return () => window.removeEventListener(GREETING_UPDATED_EVENT, onUpdated);
  }, [userId]);

  return useMemo(() => getGreetingVariant(userId), [userId, revision]);
}
