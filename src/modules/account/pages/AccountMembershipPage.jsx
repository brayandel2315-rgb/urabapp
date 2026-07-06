import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import {
  getMembershipPlans,
  getUserSubscription,
  subscribeToPlan,
  startMembershipCheckout,
  cancelSubscription,
  isProActive,
} from '@/services/membership.service';
import { isWompiEnabled } from '@/services/wompi.service';
import { formatCOP } from '@/utils/currency';
import { toast } from '@/utils/toast';
import AppIcon from '@/design-system/icons/AppIcon';

export default function AccountMembershipPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const paymentReturn = searchParams.get('payment') === 'return';

  const { data: plans = [] } = useQuery({
    queryKey: ['membership-plans'],
    queryFn: getMembershipPlans,
  });

  const { data: subscription, refetch } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: () => getUserSubscription(user.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (paymentReturn && user?.id) {
      refetch()
        .then(() => {
          toast('Verificando pago de membresía…');
          setSearchParams({}, { replace: true });
        })
        .catch(() => {
          toast('No pudimos verificar el pago. Intenta de nuevo.', 'error');
        });
    }
  }, [paymentReturn, user?.id, refetch, setSearchParams]);

  const subscribeMutation = useMutation({
    mutationFn: async (planId) => {
      const plan = plans.find((p) => p.id === planId);
      if (plan?.price_monthly > 0 && isWompiEnabled()) {
        const { url } = await startMembershipCheckout(planId);
        window.location.href = url;
        return null;
      }
      return subscribeToPlan(user.id, planId);
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast('¡Bienvenido a UrabApp Pro!');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelSubscription(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast('Membresía cancelada');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const proActive = isProActive(subscription);
  const proPlan = plans.find((p) => p.id === 'pro');
  const wompiReady = isWompiEnabled();

  if (!user) return <p className="text-sm text-muted-foreground">Inicia sesión para ver tu membresía.</p>;

  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-4 bg-gradient-to-br from-secondary/10 to-primary/5 p-6">
        <div className="flex items-center gap-2">
          <AppIcon name="star" className="text-secondary" />
          <h2 className="font-display text-xl font-bold">UrabApp Pro</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {proActive
            ? 'Tienes beneficios activos: envíos reducidos, prioridad y cashback.'
            : 'Mejora tu experiencia con envíos reducidos, prioridad en pedidos y ofertas exclusivas.'}
        </p>
        {proActive && subscription?.expires_at && (
          <p className="text-xs text-muted-foreground">
            Activo hasta el {new Date(subscription.expires_at).toLocaleDateString('es-CO')}
          </p>
        )}
      </SurfaceCard>

      {proPlan && (
        <SurfaceCard className="space-y-4 p-5">
          <SectionTitle>Plan {proPlan.name}</SectionTitle>
          <p className="font-display text-3xl font-bold">
            {formatCOP(proPlan.price_monthly)}
            <span className="text-base font-normal text-muted-foreground">/mes</span>
          </p>
          <ul className="space-y-2 text-sm">
            {(Array.isArray(proPlan.benefits) ? proPlan.benefits : []).map((b, i) => (
              <li key={i} className="flex items-center gap-2">
                <AppIcon name="check" size="xs" className="text-primary" />
                {typeof b === 'string' ? b.replace(/^"|"$/g, '') : String(b)}
              </li>
            ))}
          </ul>
          {!proActive ? (
            <>
              <Button onClick={() => subscribeMutation.mutate('pro')} loading={subscribeMutation.isPending}>
                {wompiReady && proPlan.price_monthly > 0 ? 'Pagar con Wompi' : 'Activar Pro'}
              </Button>
              {!wompiReady && proPlan.price_monthly > 0 && (
                <p className="text-xs text-amber-700">
                  Pagos digitales en configuración. Contacta soporte para activar Pro.
                </p>
              )}
            </>
          ) : (
            <Button variant="outline" onClick={() => cancelMutation.mutate()} loading={cancelMutation.isPending}>
              Cancelar renovación
            </Button>
          )}
        </SurfaceCard>
      )}
    </div>
  );
}
