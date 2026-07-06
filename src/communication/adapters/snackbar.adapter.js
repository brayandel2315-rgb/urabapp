import { toast } from '@/utils/toast';

export async function deliverSnackbar({ title, body, priority }) {
  const message = body || title;
  if (!message) return false;
  toast(message, priority === 'critical' || priority === 'high' ? 'error' : 'info');
  return true;
}
