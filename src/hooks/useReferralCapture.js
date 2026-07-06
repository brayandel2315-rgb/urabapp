import { useEffect } from 'react';
import { captureReferralFromUrl, getReferralSource } from '../utils/referral';
import { emitCommEvent } from '@/communication';
import { useAuthStore } from '@/store/authStore';

export function useReferralCapture() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const prev = getReferralSource();
    captureReferralFromUrl();
    const source = getReferralSource();
    if (source && source !== prev && source !== 'pwa') {
      emitCommEvent('referral_captured', {
        recipientId: user?.id,
        payload: { source, path: window.location.pathname },
      }).catch(() => {});
    }
  }, [user?.id]);
}
