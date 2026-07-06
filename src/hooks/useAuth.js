import { useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { useLocationStore } from '../store/locationStore';
import { ensureUserProfile } from '../services/auth.service';
import { assignWelcomeCoupon } from '../services/wallet.service';
import { mergeCustomerActivity, mergeGuestActivityByVerifiedPhone } from '../services/guest-merge.service';
import { isRealAuthenticatedUser } from '../utils/auth-session';
import { identifyUser, resetAnalytics } from '../services/analytics.service';
import { emitCommEvent } from '@/communication';
import { syncLocalPrefsToServer } from '@/communication/preferences.service';
import { normalizeMunicipio } from '../utils/municipio';

function syncHomeFromProfile(profile) {
  if (profile?.municipio) {
    useLocationStore.getState().setHomeMunicipio(normalizeMunicipio(profile.municipio));
  }
}

/**
 * Supabase bloquea el cliente auth si haces await a otra llamada supabase
 * dentro de onAuthStateChange (deadlock con signInWithPassword).
 * @see https://github.com/supabase/supabase-js/issues/1420
 */
function deferAuthSideEffect(fn) {
  window.setTimeout(fn, 0);
}

function loadProfileForUser(user, { setProfile, onDone, onProfile } = {}) {
  if (!user?.id) {
    setProfile?.(null);
    onProfile?.(null);
    onDone?.();
    return;
  }

  ensureUserProfile(user)
    .then((profile) => {
      setProfile?.(profile);
      syncHomeFromProfile(profile);
      identifyUser({ id: user.id, email: user.email, role: profile?.role });
      assignWelcomeCoupon(user.id).catch(() => {});
      if (isRealAuthenticatedUser(user) && profile?.phone) {
        mergeCustomerActivity({ phone: profile.phone }).catch(() => {});
      }
      if (isRealAuthenticatedUser(user)) {
        mergeGuestActivityByVerifiedPhone().catch(() => {});
      }
      onProfile?.(profile);
    })
    .catch(() => {
      setProfile?.(null);
      onProfile?.(null);
    })
    .finally(() => {
      onDone?.();
    });
}

export function useAuthInit() {
  const { setUser, setProfile, setLoading } = useAuthStore();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }

    const sessionTimeout = new Promise((resolve) => {
      setTimeout(() => resolve({ data: { session: null }, timedOut: true }), 8_000);
    });

    Promise.race([supabase.auth.getSession(), sessionTimeout])
      .then((result) => {
        const session = result?.data?.session ?? null;
        setUser(session?.user ?? null);
        if (!session?.user) {
          setProfile(null);
          resetAnalytics();
          setLoading(false);
          return;
        }

        deferAuthSideEffect(() => {
          loadProfileForUser(session.user, {
            setProfile,
            onDone: () => setLoading(false),
          });
        });
      })
      .catch(() => {
        setUser(null);
        setProfile(null);
        resetAnalytics();
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        const prevId = useAuthStore.getState().user?.id;
        if (prevId) {
          emitCommEvent('auth_sign_out', {
            recipientId: prevId,
            actorId: prevId,
          }).catch(() => {});
        }
      }

      setUser(session?.user ?? null);

      if (!session?.user) {
        setProfile(null);
        resetAnalytics();
        setLoading(false);
        return;
      }

      deferAuthSideEffect(() => {
        loadProfileForUser(session.user, {
          setProfile,
          onDone: () => setLoading(false),
          onProfile: (profile) => {
            if (event === 'SIGNED_IN' && isRealAuthenticatedUser(session.user)) {
              mergeCustomerActivity({
                phone: profile?.phone,
              }).catch(() => {});
              mergeGuestActivityByVerifiedPhone().catch(() => {});
              emitCommEvent('auth_sign_in', {
                recipientId: session.user.id,
                actorId: session.user.id,
                payload: { provider: session.user.app_metadata?.provider || 'email' },
              }).catch(() => {});
              syncLocalPrefsToServer(session.user.id).catch(() => {});
            }
          },
        });
      });
    });

    return () => subscription.unsubscribe();
  }, [setUser, setProfile, setLoading]);
}
