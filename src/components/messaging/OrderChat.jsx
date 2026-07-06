import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import ChatThread from './ChatThread';
import {
  getOrderMessages,
  sendOrderMessage,
  markOrderChatRead,
} from '../../services/messaging.service';
import { useOrderMessagesRealtime } from '../../hooks/useMessagesRealtime';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../utils/toast';
import AppIcon from '@/design-system/icons/AppIcon';

export default function OrderChat({ order, compact = false }) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ['order-messages', order?.id],
    queryFn: () => getOrderMessages(order.id),
    enabled: !!order?.id && !!user?.id,
  });

  useOrderMessagesRealtime(order?.id);

  useEffect(() => {
    if (order?.id && user?.id) {
      markOrderChatRead(order.id).catch(() => {});
    }
  }, [order?.id, user?.id]);

  const sendMutation = useMutation({
    mutationFn: (body) => sendOrderMessage({
      orderId: order.id,
      senderId: user.id,
      body,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-messages', order.id] });
    },
    onError: (err) => toast(err.message, 'error'),
  });

  if (!user) {
    return (
      <SurfaceCard className="text-center text-sm text-muted">
        <Link to="/login" className="font-semibold text-primary">Inicia sesión</Link> para chatear sobre este pedido.
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className={compact ? 'space-y-2' : 'space-y-3'}>
      <div className="flex items-start gap-2">
        <AppIcon name="chat" size="sm" className="mt-0.5 text-primary" />
        <div>
          <p className="font-semibold text-foreground">Chat del pedido</p>
          <p className="text-xs text-muted">
            Habla con la tienda y el equipo Urabapp aquí. No uses WhatsApp — todo queda registrado.
          </p>
        </div>
      </div>
      <ChatThread
        messages={messages}
        currentUserId={user.id}
        onSend={(body) => sendMutation.mutate(body)}
        sending={sendMutation.isPending}
        showRole
        placeholder="Mensaje sobre tu pedido…"
      />
      <p className="text-center text-[11px] text-muted">
        ¿Problema técnico?{' '}
        <Link to="/soporte" className="font-semibold text-primary">Centro de soporte</Link>
      </p>
    </SurfaceCard>
  );
}
