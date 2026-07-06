import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageLayout from '@/design-system/layouts/PageLayout';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import SupportTicketChatPanel from '@/modules/support/SupportTicketChatPanel';
import { supportTicketStatusLabel } from '@/modules/support/support-ticket-status';
import {
  createSupportTicket,
  getMySupportTickets,
  getSupportMessages,
  sendSupportMessage,
} from '../../../services/messaging.service';
import { useSupportMessagesRealtime } from '../../../hooks/useMessagesRealtime';
import { useAuthStore } from '../../../store/authStore';
import { toast } from '../../../utils/toast';
import { buildLoginRedirect } from '@/utils/auth-routes';
import ServiceIconTile from '@/design-system/patterns/ServiceIconTile';
import AppIcon from '@/design-system/icons/AppIcon';
import { Badge } from '@/design-system/ui/badge';

const STATUS_LABELS = {
  open: supportTicketStatusLabel('open'),
  in_progress: supportTicketStatusLabel('in_progress'),
  resolved: supportTicketStatusLabel('resolved'),
  closed: supportTicketStatusLabel('closed'),
};

export default function SupportPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['support-tickets', user?.id],
    queryFn: () => getMySupportTickets(user.id),
    enabled: !!user?.id,
  });

  const activeTicket = tickets.find((t) => t.id === activeTicketId) || tickets[0];

  const { data: messages = [] } = useQuery({
    queryKey: ['support-messages', activeTicket?.id],
    queryFn: () => getSupportMessages(activeTicket.id),
    enabled: !!activeTicket?.id,
  });

  useSupportMessagesRealtime(activeTicket?.id);

  const createMutation = useMutation({
    mutationFn: () => createSupportTicket(user.id, { subject, body: message }),
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      setActiveTicketId(ticket.id);
      setShowNew(false);
      setSubject('');
      setMessage('');
      toast('Consulta enviada — te respondemos aquí');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const sendMutation = useMutation({
    mutationFn: (body) => sendSupportMessage({
      ticketId: activeTicket.id,
      senderId: user.id,
      body,
      isStaff: false,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-messages', activeTicket.id] });
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
    },
    onError: (err) => toast(err.message, 'error'),
  });

  if (!user) {
    return (
      <PageLayout title="Soporte" backTo="/" maxWidth="lg">
        <SurfaceCard className="space-y-4 border border-[#D5E3EF] bg-white text-center">
          <ServiceIconTile serviceId="soporte" name="headset" size="lg" className="mx-auto" />
          <p className="text-sm text-[#4A6278]">
            El soporte de Urabapp es dentro de la app. Inicia sesión para escribirnos.
          </p>
          <Link to={buildLoginRedirect('/soporte')}>
            <Button>Iniciar sesión</Button>
          </Link>
        </SurfaceCard>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Soporte Urabapp" backTo="/cuenta/perfil" maxWidth="lg">
      <div className="space-y-4">
        <SurfaceCard variant="highlight" className="text-sm">
          <p className="font-semibold text-primary-dark">Todo por aquí, sin WhatsApp</p>
          <p className="mt-1 text-muted">
            Pedidos, novedades y soporte técnico se gestionan en Urabapp. Así queda registro y seguimiento para ti y para la tienda.
          </p>
        </SurfaceCard>

        {showNew ? (
          <SurfaceCard className="space-y-3">
            <SectionTitle>Nueva consulta</SectionTitle>
            <Input
              label="Asunto"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ej: Problema con un pedido"
            />
            <label className="block text-sm font-medium text-foreground">
              Mensaje
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Cuéntanos qué necesitas…"
              />
            </label>
            <div className="flex gap-2">
              <Button
                disabled={!subject.trim() || !message.trim() || createMutation.isPending}
                onClick={() => createMutation.mutate()}
              >
                Enviar consulta
              </Button>
              <Button variant="ghost" onClick={() => setShowNew(false)}>Cancelar</Button>
            </div>
          </SurfaceCard>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => setShowNew(true)}>
            <AppIcon name="chat" size="xs" className="mr-2" />
            Nueva consulta de soporte
          </Button>
        )}

        {isLoading ? (
          <p className="text-center text-sm text-muted">Cargando…</p>
        ) : tickets.length === 0 ? (
          <SurfaceCard className="text-center text-sm text-muted">
            No tienes consultas aún. Usa el botón de arriba para hablar con soporte.
          </SurfaceCard>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => setActiveTicketId(ticket.id)}
                  className={`shrink-0 rounded-xl border px-3 py-2 text-left text-sm transition-colors sm:max-w-[200px] ${
                    activeTicket?.id === ticket.id
                      ? 'border-primary bg-primary-light'
                      : 'border-border bg-background'
                  }`}
                >
                  <p className="max-w-[12rem] truncate font-semibold sm:max-w-none">{ticket.subject}</p>
                  <Badge variant="muted" className="mt-1 text-[10px]">
                    {STATUS_LABELS[ticket.status] || ticket.status}
                  </Badge>
                </button>
              ))}
            </div>

            {activeTicket && (
              <SupportTicketChatPanel
                ticket={activeTicket}
                messages={messages}
                currentUserId={user.id}
                onSend={(body) => sendMutation.mutate(body)}
                sending={sendMutation.isPending}
                placeholder="Responder a soporte…"
                showStatusBadge={false}
              />
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
