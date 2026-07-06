import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { useAuthStore } from '@/store/authStore';
import { mergeCustomerActivity, peekGuestUserId } from '@/services/guest-merge.service';
import { isRealAuthenticatedUser } from '@/utils/auth-session';
import { toast } from '@/utils/toast';

/**
 * Recupera pedidos de la sesión invitada actual (mismo dispositivo/navegador).
 * No permite reclamar pedidos de terceros solo con un número de teléfono.
 */
export default function GuestClaimBanner({ className }) {
  const { user, profile } = useAuthStore();
  const queryClient = useQueryClient();
  const [dismissed, setDismissed] = useState(false);
  const guestId = peekGuestUserId();
  const autoClaimed = useRef(false);

  const claimMutation = useMutation({
    mutationFn: () => mergeCustomerActivity({
      guestUserId: guestId,
      phone: profile?.phone,
    }),
    onSuccess: (result) => {
      if (!result || result.total === 0) {
        toast('No hay pedidos de invitado en esta sesión');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast(`Vinculamos ${result.orders} pedido(s) y ${result.shipments} envío(s) a tu cuenta`);
      setDismissed(true);
    },
    onError: (err) => {
      if (err.message?.includes('phone_mismatch')) {
        toast('El celular de tu cuenta no coincide con el pedido invitado', 'error');
        return;
      }
      toast(err.message, 'error');
    },
  });

  useEffect(() => {
    if (autoClaimed.current || dismissed || !user || !isRealAuthenticatedUser(user) || !guestId) return;
    autoClaimed.current = true;
    claimMutation.mutate();
  }, [user?.id, guestId, dismissed]);

  if (!user || !isRealAuthenticatedUser(user) || dismissed || !guestId) return null;

  return (
    <SurfaceCard className={`space-y-3 border border-[#28B463]/25 bg-[#E6F4FF]/60 p-4 ${className || ''}`}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <AppIcon name="lock" size="sm" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[#0D2B45]">Recuperando pedidos de esta sesión</p>
          <p className="mt-1 text-xs text-[#4A6278]">
            Por seguridad solo vinculamos actividad del mismo navegador. No se pueden reclamar pedidos ajenos con solo un celular.
          </p>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        loading={claimMutation.isPending}
        onClick={() => claimMutation.mutate()}
      >
        Reintentar vinculación
      </Button>
    </SurfaceCard>
  );
}
