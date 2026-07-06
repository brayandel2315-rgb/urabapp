export const SUPPORT_TICKET_STATUS_LABELS = {
  open: 'Abierto',
  in_progress: 'En revisión',
  resolved: 'Resuelto',
  closed: 'Cerrado',
};

export const SUPPORT_TICKET_STATUS_OPTIONS = ['open', 'in_progress', 'resolved', 'closed'];

export function supportTicketStatusLabel(status) {
  return SUPPORT_TICKET_STATUS_LABELS[status] || status;
}
