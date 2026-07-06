/**
 * Socket.IO — tracking en tiempo real del mensajero (JWT Supabase obligatorio en prod)
 * Local: npm run dev:socket (puerto 3001)
 * Producción: Railway/Fly/Render + VITE_SOCKET_URL
 */
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { createClient } from '@supabase/supabase-js';

const PORT = Number(process.env.PORT || process.env.SOCKET_PORT || 3001);
const ORIGINS = (process.env.SOCKET_CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://localhost:5175,https://urabapp.vercel.app')
  .split(',')
  .map((s) => s.trim());

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const REQUIRE_AUTH = process.env.SOCKET_REQUIRE_AUTH !== 'false';

const supabaseAuth = SUPABASE_URL && SUPABASE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })
  : null;

const httpServer = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, service: 'urabapp-socket', auth: Boolean(supabaseAuth) }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Urabapp Socket.IO');
});

const io = new Server(httpServer, {
  cors: { origin: ORIGINS, methods: ['GET', 'POST'] },
  path: '/socket.io',
  pingInterval: 20_000,
  pingTimeout: 25_000,
});

io.use(async (socket, next) => {
  if (!REQUIRE_AUTH || !supabaseAuth) {
    if (REQUIRE_AUTH && !supabaseAuth) {
      console.warn('[socket] Sin SUPABASE_URL/ANON_KEY — solo desarrollo local');
    }
    return next();
  }

  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('auth_required'));

  const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
  if (error || !user) return next(new Error('invalid_token'));

  socket.data.userId = user.id;
  next();
});

async function verifyRiderOwnsDriver(userId, driverId) {
  if (!supabaseAuth || !userId || !driverId) return false;
  const { data } = await supabaseAuth
    .from('drivers')
    .select('id')
    .eq('id', driverId)
    .eq('user_id', userId)
    .maybeSingle();
  return Boolean(data?.id);
}

io.on('connection', (socket) => {
  socket.on('track:join', async ({ driverId, orderId, role }) => {
    if (!driverId) return;

    if (role === 'rider') {
      if (supabaseAuth && socket.data.userId) {
        const ok = await verifyRiderOwnsDriver(socket.data.userId, driverId);
        if (!ok) return;
      }
      socket.data.riderDriverId = driverId;
    }

    socket.join(`driver:${driverId}`);
    if (orderId) socket.join(`order:${orderId}`);
  });

  socket.on('track:leave', ({ driverId, orderId }) => {
    if (driverId) socket.leave(`driver:${driverId}`);
    if (orderId) socket.leave(`order:${orderId}`);
    if (socket.data.riderDriverId === driverId) {
      socket.data.riderDriverId = null;
    }
  });

  socket.on('rider:location', (payload) => {
    const { driverId, latitude, longitude, updatedAt, orderId } = payload || {};
    if (!driverId || latitude == null || longitude == null) return;

    if (socket.data.riderDriverId && socket.data.riderDriverId !== driverId) return;
    if (supabaseAuth && socket.data.userId && !socket.data.riderDriverId) return;

    const body = {
      driverId,
      latitude,
      longitude,
      updatedAt: updatedAt || new Date().toISOString(),
    };

    io.to(`driver:${driverId}`).emit('driver:location', body);
    if (orderId) io.to(`order:${orderId}`).emit('driver:location', body);
  });
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Socket.IO Urabapp → port ${PORT} (auth: ${Boolean(supabaseAuth)})`);
});
