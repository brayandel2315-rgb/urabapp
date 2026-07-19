import { toast } from '@/utils/toast';
import { resolveNotifImage, resolveNotifKind, resolveNotifHref } from '@/communication/notification-visuals';

export async function deliverSnackbar({
  title,
  body,
  priority,
  imageUrl,
  kind,
  stage,
  deepLink,
  eventKey,
  category,
  ...rest
}) {
  if (!title && !body) return false;
  const resolvedKind = resolveNotifKind({
    kind,
    eventKey,
    stage,
    category,
  });
  const type = priority === 'critical' || priority === 'high'
    ? (resolvedKind === 'cart' ? 'info' : 'warning')
    : resolvedKind === 'order' || resolvedKind === 'tracking'
      ? 'trust'
      : 'info';

  toast.show({
    title: title || 'Urabapp',
    description: body || null,
    type,
    kind: resolvedKind,
    stage,
    category,
    eventKey,
    image: imageUrl || resolveNotifImage(rest),
    href: deepLink || resolveNotifHref(rest),
  });
  return true;
}
