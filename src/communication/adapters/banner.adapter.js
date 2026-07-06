import { useCommunicationBannerStore } from '@/store/communicationBannerStore';

export async function deliverBanner({ title, body, deepLink, priority }) {
  if (!title) return false;
  useCommunicationBannerStore.getState().show({ title, body, deepLink, priority });
  return true;
}
