import { Link } from 'react-router-dom';
import ChatThread from '@/components/messaging/ChatThread';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { Badge } from '@/design-system/ui/badge';
import { supportTicketStatusLabel } from '@/modules/support/support-ticket-status';
import { emitCommEvent } from '@/communication';

/** Panel de chat de ticket activo — cliente y admin. */
export default function SupportTicketChatPanel({
  ticket,
  messages,
  currentUserId,
  onSend,
  sending,
  placeholder = 'Escribir mensaje…',
  showOrderLink = true,
  showStatusBadge = true,
  headerExtra = null,
  initialBody = null,
}) {
  if (!ticket) return null;

  const handleSend = (body) => {
    onSend?.(body);
    if (currentUserId && ticket?.id) {
      emitCommEvent('support_ticket_reply', {
        recipientId: currentUserId,
        actorId: currentUserId,
        payload: { ticket_id: ticket.id, preview: String(body).slice(0, 80) },
        push: false,
      }).catch(() => {});
    }
  };

  return (
    <SurfaceCard className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <SectionTitle>{ticket.subject}</SectionTitle>
          {ticket.users && (
            <p className="text-xs text-muted">
              {ticket.users.full_name}
              {ticket.users.phone || ticket.users.email
                ? ` · ${ticket.users.phone || ticket.users.email}`
                : ''}
            </p>
          )}
          {showOrderLink && ticket.order_id && (
            <Link to={`/pedidos/${ticket.order_id}`} className="text-xs font-semibold text-primary">
              Ver pedido relacionado →
            </Link>
          )}
          {showStatusBadge && (
            <Badge variant="muted" className="mt-1 text-[10px]">
              {supportTicketStatusLabel(ticket.status)}
            </Badge>
          )}
        </div>
        {headerExtra}
      </div>
      {initialBody && (
        <p className="rounded-xl bg-background p-2 text-sm text-muted">{initialBody}</p>
      )}
      <ChatThread
        messages={messages}
        currentUserId={currentUserId}
        onSend={handleSend}
        sending={sending}
        placeholder={placeholder}
      />
    </SurfaceCard>
  );
}
