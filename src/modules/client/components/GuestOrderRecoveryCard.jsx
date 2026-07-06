import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PhoneOtpVerificationCard from '@/components/client/PhoneOtpVerificationCard';
import { mergeGuestActivityByVerifiedPhone, peekGuestUserId } from '@/services/guest-merge.service';
import { useAuthStore } from '@/store/authStore';
import { isRealAuthenticatedUser } from '@/utils/auth-session';
import { toast } from '@/utils/toast';

/** Recuperación de pedidos invitado en otro dispositivo — requiere SMS verificado. */
export default function GuestOrderRecoveryCard({
  className,
  title = '¿Pediste como invitado en otro dispositivo?',
  description = 'Verifica el mismo celular que usaste al pedir. Solo vinculamos sesiones invitadas con ese número — nunca cuentas de otras personas.',
  requireNoGuestSession = true,
}) {
  const { user, profile } = useAuthStore();
  const queryClient = useQueryClient();
  const [dismissed, setDismissed] = useState(false);

  const mergeMutation = useMutation({
    mutationFn: mergeGuestActivityByVerifiedPhone,
    onSuccess: (result) => {
      if (!result || result.total === 0) {
        toast('No encontramos pedidos de invitado con ese celular');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast(`Recuperamos ${result.orders} pedido(s) y ${result.shipments} envío(s)`);
      setDismissed(true);
    },
    onError: (err) => toast(err.message, 'error'),
  });

  if (!user || !isRealAuthenticatedUser(user) || dismissed) return null;
  if (requireNoGuestSession && peekGuestUserId()) return null;

  return (
    <PhoneOtpVerificationCard
      className={className}
      defaultPhone={profile?.phone || ''}
      title={title}
      description={description}
      onVerified={async () => {
        await mergeMutation.mutateAsync();
      }}
    />
  );
}
