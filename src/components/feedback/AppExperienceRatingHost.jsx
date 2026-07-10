import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useClientActivity } from '@/hooks/useClientActivity';
import { useAppExperienceRatingStore } from '@/store/appExperienceRatingStore';
import { useAppExperienceRatingTrigger } from '@/hooks/useAppExperienceRatingTrigger';
import AppExperienceRatingDialog from './AppExperienceRatingDialog';

const OPEN_DELAY_MS = 2800;

export default function AppExperienceRatingHost() {
  const user = useAuthStore((s) => s.user);
  const queue = useAppExperienceRatingStore((s) => s.queue);
  const clearQueue = useAppExperienceRatingStore((s) => s.clearQueue);
  const { activeCount } = useClientActivity({ enabled: !!user?.id });
  const [open, setOpen] = useState(false);

  useAppExperienceRatingTrigger();

  useEffect(() => {
    if (!queue || activeCount > 0) {
      setOpen(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      if (activeCount === 0) setOpen(true);
    }, OPEN_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [queue, activeCount]);

  const handleClose = () => {
    setOpen(false);
    clearQueue();
  };

  if (!user?.id) return null;

  return (
    <AppExperienceRatingDialog
      open={open}
      onClose={handleClose}
      context={queue}
    />
  );
}
