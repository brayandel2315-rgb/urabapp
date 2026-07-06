import { create } from 'zustand';

export const useCommunicationBannerStore = create((set) => ({
  visible: false,
  title: '',
  body: '',
  deepLink: '/',
  priority: 'medium',
  show: ({ title, body, deepLink = '/', priority = 'medium' }) =>
    set({ visible: true, title, body, deepLink, priority }),
  dismiss: () => set({ visible: false, title: '', body: '', deepLink: '/' }),
}));
