self.addEventListener('push', (event) => {
  let payload = {
    title: 'Urabapp',
    body: 'Tienes una actualización',
    url: '/pedidos',
    icon: '/app-icon.png',
    image: null,
    tag: 'urabapp',
  };

  try {
    if (event.data) {
      const parsed = event.data.json();
      const orderId = parsed.data?.order_id || parsed.data?.orderId;
      payload = {
        title: parsed.title || payload.title,
        body: parsed.body || payload.body,
        url: parsed.url
          || parsed.data?.url
          || (orderId ? `/pedidos/${orderId}` : '/pedidos'),
        icon: parsed.icon || parsed.data?.icon || parsed.image || parsed.data?.image || '/app-icon.png',
        image: parsed.image || parsed.data?.image || parsed.data?.imageUrl || parsed.data?.image_url || null,
        tag: parsed.tag || (orderId ? `order-${orderId}` : (parsed.data?.event_key || 'urabapp')),
        actions: parsed.actions,
      };
    }
  } catch {
    if (event.data) payload.body = event.data.text();
  }

  const options = {
    body: payload.body,
    icon: payload.icon || '/app-icon.png',
    badge: '/app-icon.png',
    data: { url: payload.url || '/pedidos' },
    tag: payload.tag || 'urabapp',
    renotify: true,
    requireInteraction: false,
    vibrate: [120, 60, 120],
  };

  if (payload.image) {
    options.image = payload.image;
  }

  // Android muestra acciones; iOS las ignora con gracia.
  options.actions = Array.isArray(payload.actions) && payload.actions.length
    ? payload.actions
    : [
      { action: 'open', title: 'Ver' },
      { action: 'dismiss', title: 'Cerrar' },
    ];

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener('notificationclick', (event) => {
  const action = event.action;
  if (action === 'dismiss') {
    event.notification.close();
    return;
  }

  event.notification.close();
  let url = event.notification.data?.url || '/pedidos';
  if (url.startsWith('http')) {
    try {
      url = new URL(url).pathname + new URL(url).search;
    } catch {
      url = '/pedidos';
    }
  }
  if (url.startsWith('/comercio')) url = url.replace(/^\/comercio/, '/negocio');

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.includes(self.location.origin));
      if (existing) {
        existing.focus();
        existing.navigate(url);
        return undefined;
      }
      return clients.openWindow(url);
    }),
  );
});
