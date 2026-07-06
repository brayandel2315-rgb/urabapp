import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllSupportTickets,
  getSupportMessages,
  sendSupportMessage,
} from '../../../services/messaging.service';
import { updateTicketStatus } from '../../../services/crm.service';
import SupportTicketChatPanel from '@/modules/support/SupportTicketChatPanel';
import {
  SUPPORT_TICKET_STATUS_OPTIONS,
  supportTicketStatusLabel,
} from '@/modules/support/support-ticket-status';
import Button from '../../../components/ui/Button';
import Loader from '../../../components/ui/Loader';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { useSupportMessagesRealtime } from '../../../hooks/useMessagesRealtime';
import { useAuthStore } from '../../../store/authStore';
import { toast } from '../../../utils/toast';

const FILTER_OPTIONS = ['open', 'in_progress', 'resolved', 'all'];

const FILTER_LABELS = {
  open: supportTicketStatusLabel('open'),
  in_progress: supportTicketStatusLabel('in_progress'),
  resolved: supportTicketStatusLabel('resolved'),
  all: 'Todos',
};

export default function AdminSupportPanel() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState(null);
  const [filter, setFilter] = useState('open');

  const { data: tickets = [], isLoading, isError } = useQuery({
    queryKey: ['admin-support-tickets', filter],
    queryFn: () => getAllSupportTickets({ status: filter }),
    refetchInterval: 20000,
  });

  const active = tickets.find((t) => t.id === activeId) || tickets[0];

  const { data: messages = [] } = useQuery({
    queryKey: ['support-messages', active?.id],
    queryFn: () => getSupportMessages(active.id),
    enabled: !!active?.id,
  });

  useSupportMessagesRealtime(active?.id);

  const sendMutation = useMutation({
    mutationFn: (body) => sendSupportMessage({
      ticketId: active.id,
      senderId: user.id,
      body,
      isStaff: true,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-messages', active.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] });
      toast('Respuesta enviada');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ ticketId, status }) => updateTicketStatus(ticketId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] });
      toast('Estado actualizado');
    },
  });

  if (isLoading) return <div className="flex justify-center py-8"><Loader /></div>;
  if (isError) {
    return (
      <SurfaceCard className="text-center">
        <p className="text-muted">No pudimos cargar las consultas de soporte.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] })}>
          Reintentar
        </Button>
      </SurfaceCard>
    );
  }

  return (
    <div className="space-y-4">
      <SurfaceCard>
        <SectionTitle>Soporte en la app</SectionTitle>
        <p className="mt-1 text-sm text-muted">
          Responde consultas técnicas aquí. Los clientes y las tiendas no deben usar WhatsApp para operación.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={filter === s ? 'primary' : 'outline'}
              onClick={() => setFilter(s)}
            >
              {FILTER_LABELS[s]}
            </Button>
          ))}
        </div>
      </SurfaceCard>

      {tickets.length === 0 ? (
        <SurfaceCard className="text-center text-sm text-muted">Sin tickets en este filtro.</SurfaceCard>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          <div className="space-y-2">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                onClick={() => setActiveId(ticket.id)}
                className={`w-full rounded-xl border p-3 text-left text-sm ${
                  active?.id === ticket.id ? 'border-primary bg-primary-light' : 'border-border'
                }`}
              >
                <p className="font-semibold">{ticket.subject}</p>
                <p className="text-xs text-muted">{ticket.users?.full_name || 'Usuario'}</p>
                <p className="text-[10px] uppercase text-muted">{supportTicketStatusLabel(ticket.status)}</p>
              </button>
            ))}
          </div>

          {active && (
            <SupportTicketChatPanel
              ticket={active}
              messages={messages}
              currentUserId={user.id}
              onSend={(body) => sendMutation.mutate(body)}
              sending={sendMutation.isPending}
              placeholder="Respuesta de soporte Urabapp…"
              initialBody={active.body}
              headerExtra={(
                <select
                  value={active.status}
                  onChange={(e) => statusMutation.mutate({ ticketId: active.id, status: e.target.value })}
                  className="h-9 rounded-xl border border-input bg-background px-2 text-xs"
                >
                  {SUPPORT_TICKET_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{supportTicketStatusLabel(s)}</option>
                  ))}
                </select>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
}
