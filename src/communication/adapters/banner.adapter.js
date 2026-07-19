import { useCommunicationBannerStore } from '@/store/communicationBannerStore';
import { resolveNotifImage, resolveNotifKind } from '@/communication/notification-visuals';

export async function deliverBanner({
  title,
  body,
  deepLink,
  priority,
  imageUrl,
  kind,
  stage,
  ctaLabel,
  eventKey,
  ...rest
}) {
  if (!title) return false;
  const resolvedKind = resolveNotifKind({
    kind,
    eventKey,
    stage,
    category: rest.category,
  });
  useCommunicationBannerStore.getState().show({
    title,
    body,
    deepLink,
    priority,
    imageUrl: imageUrl || resolveNotifImage(rest) || null,
    kind: resolvedKind,
    stage: stage || null,
    ctaLabel: ctaLabel || rest.ctaLabel || null,
  });
  return true;
}
