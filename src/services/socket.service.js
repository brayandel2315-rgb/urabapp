import { io } from 'socket.io-client';
import { supabase } from '../lib/supabase';

let socket = null;
let authListenerAttached = false;

function resolveSocketUrl() {
  const env = import.meta.env.VITE_SOCKET_URL;
  if (env) return env;
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    return window.location.origin;
  }
  return null;
}

export function isSocketEnabled() {
  return Boolean(resolveSocketUrl());
}

async function resolveAuthToken() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

function attachAuthRefresh(sock) {
  if (authListenerAttached || !supabase) return;
  authListenerAttached = true;
  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!sock) return;
    sock.auth = { token: session?.access_token ?? null };
    if (session?.access_token && !sock.connected) {
      sock.connect();
    }
    if (!session?.access_token && sock.connected) {
      sock.disconnect();
    }
  });
}

export async function getSocketAsync() {
  const url = resolveSocketUrl();
  if (!url) return null;

  const token = await resolveAuthToken();

  if (!socket) {
    socket = io(url, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: Boolean(token),
      reconnection: true,
      reconnectionAttempts: 12,
      auth: { token },
    });
    attachAuthRefresh(socket);
    if (token && !socket.connected) {
      socket.connect();
    }
  } else if (token) {
    socket.auth = { token };
    if (!socket.connected) socket.connect();
  }

  return socket;
}

/** @deprecated Prefer getSocketAsync — mantiene compat con llamadas síncronas */
export function getSocket() {
  if (!socket && isSocketEnabled()) {
    getSocketAsync().catch(() => {});
  }
  return socket;
}

export async function emitRiderLocation({ driverId, latitude, longitude, orderId }) {
  const s = await getSocketAsync();
  if (!s || !driverId) return;
  s.emit('rider:location', {
    driverId,
    latitude,
    longitude,
    orderId,
    updatedAt: new Date().toISOString(),
  });
}

export async function subscribeDriverLocation(driverId, onLocation, { orderId } = {}) {
  const s = await getSocketAsync();
  if (!s || !driverId) return () => {};

  s.emit('track:join', { driverId, orderId, role: 'client' });

  const handler = (payload) => {
    if (payload?.driverId === driverId) onLocation(payload);
  };
  s.on('driver:location', handler);

  return () => {
    s.off('driver:location', handler);
    s.emit('track:leave', { driverId, orderId });
  };
}

export async function registerRiderTracking(driverId, orderId) {
  const s = await getSocketAsync();
  if (!s || !driverId) return () => {};
  s.emit('track:join', { driverId, orderId, role: 'rider' });
  return () => s.emit('track:leave', { driverId, orderId });
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    authListenerAttached = false;
  }
}
