self.addEventListener('push', (event) => {
  let payload = { title: 'Urabapp', body: 'Tienes una actualización', url: '/pedidos' };
  try {
    if (event.data) {
      const parsed = event.data.json();
      payload = {
        title: parsed.title || payload.title,
        body: parsed.body || payload.body,
        url: parsed.url || parsed.data?.url || (parsed.data?.order_id ? `/pedidos/${parsed.data.order_id}` : '/pedidos'),
        tag: parsed.data?.order_id || parsed.tag,
      };
    }
  } catch {
    if (event.data) payload.body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/app-icon.svg',
      badge: '/app-icon.svg',
      data: { url: payload.url || '/pedidos' },
      tag: payload.tag || 'urabapp',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/pedidos';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.includes(self.location.origin));
      if (existing) {
        existing.focus();
        existing.navigate(url);
        return;
      }
      return clients.openWindow(url);
    })
  );
});
