const QUEUE_KEY = 'urabapp:gps-ping-queue';

function readQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeQueue(items) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(items.slice(-200)));
  } catch {
    /* quota */
  }
}

export function enqueueGpsPing(ping) {
  const queue = readQueue();
  queue.push({ ...ping, queuedAt: new Date().toISOString() });
  writeQueue(queue);
}

export function peekGpsQueue() {
  return readQueue();
}

export async function flushGpsQueue(flushFn) {
  const queue = readQueue();
  if (!queue.length || typeof flushFn !== 'function') return 0;

  const remaining = [];
  let flushed = 0;

  for (const item of queue) {
    try {
      await flushFn(item);
      flushed += 1;
    } catch {
      remaining.push(item);
    }
  }

  writeQueue(remaining);
  return flushed;
}

export function getGpsQueueSize() {
  return readQueue().length;
}
