import { toast as sonnerToast } from 'sonner';

export function toast(message, type = 'info') {
  if (type === 'error') {
    sonnerToast.error(message);
    return;
  }
  if (type === 'success') {
    sonnerToast.success(message);
    return;
  }
  sonnerToast(message);
}
