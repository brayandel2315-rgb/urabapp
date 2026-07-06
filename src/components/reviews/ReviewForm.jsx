import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../ui/Button';
import StarRating from './StarRating';
import { createReview } from '../../services/review.service';
import { toast } from '../../utils/toast';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';

export default function ReviewForm({ order, userId, onSuccess }) {
  const queryClient = useQueryClient();
  const [businessRating, setBusinessRating] = useState(5);
  const [driverRating, setDriverRating] = useState(5);

  const mutation = useMutation({
    mutationFn: () => createReview({
      orderId: order.id,
      userId,
      businessId: order.business_id,
      driverId: order.driver_id,
      businessRating,
      driverRating: order.driver_id ? driverRating : null,
      comment: null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', order.id] });
      queryClient.invalidateQueries({ queryKey: ['review', order.id] });
      queryClient.invalidateQueries({ queryKey: ['business-rating'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-pulse'] });
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast('¡Gracias por tu calificación!');
      onSuccess?.();
    },
    onError: (err) => toast(err.message, 'error'),
  });

  return (
    <SurfaceCard className="space-y-4">
      <div>
        <p className="text-tagline text-muted">Tu calificación</p>
        <SectionTitle>¿Cómo estuvo tu pedido?</SectionTitle>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-secondary">Tienda</p>
        <StarRating value={businessRating} onChange={setBusinessRating} />
      </div>

      {order.driver_id && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-secondary">Mensajero</p>
          <StarRating value={driverRating} onChange={setDriverRating} />
        </div>
      )}

      <Button
        className="w-full"
        disabled={mutation.isPending}
        onClick={() => mutation.mutate()}
      >
        {mutation.isPending ? 'Enviando...' : 'Enviar calificación'}
      </Button>
    </SurfaceCard>
  );
}
