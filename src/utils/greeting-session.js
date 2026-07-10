const DAY_KEY_PREFIX = 'urabapp-greeting-day';
const SESSION_FLAG_PREFIX = 'urabapp-auth-active';

export const GREETING_UPDATED_EVENT = 'urabapp:greeting-updated';

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function dayStorageKey(userId) {
  return `${DAY_KEY_PREFIX}:${userId}`;
}

function sessionFlagKey(userId) {
  return `${SESSION_FLAG_PREFIX}:${userId}`;
}

function readDayLogins(userId) {
  try {
    const raw = localStorage.getItem(dayStorageKey(userId));
    if (!raw) return { date: todayStr(), logins: 0 };
    const data = JSON.parse(raw);
    if (!data?.date) return { date: todayStr(), logins: 0 };
    return { date: data.date, logins: Number(data.logins) || 0 };
  } catch {
    return { date: todayStr(), logins: 0 };
  }
}

function writeDayLogins(userId, data) {
  try {
    localStorage.setItem(dayStorageKey(userId), JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(GREETING_UPDATED_EVENT, { detail: { userId } }));
  } catch {
    /* storage full / private mode */
  }
}

/** Marca sesión activa sin contar como nuevo login (recarga con sesión existente). */
export function markAuthSessionActive(userId) {
  if (!userId) return;
  try {
    sessionStorage.setItem(sessionFlagKey(userId), '1');
  } catch {
    /* ignore */
  }
}

export function clearAuthSessionFlag(userId) {
  if (!userId) return;
  try {
    sessionStorage.removeItem(sessionFlagKey(userId));
  } catch {
    /* ignore */
  }
}

/**
 * Incrementa el contador de logins del día solo si es una sesión nueva
 * (logout + login o pestaña nueva), no en recargas de la misma sesión.
 */
export function recordLoginIfNewSession(userId) {
  if (!userId) return;

  try {
    if (sessionStorage.getItem(sessionFlagKey(userId))) return;

    markAuthSessionActive(userId);

    const today = todayStr();
    const current = readDayLogins(userId);

    if (current.date !== today) {
      writeDayLogins(userId, { date: today, logins: 1 });
      return;
    }

    writeDayLogins(userId, { date: today, logins: current.logins + 1 });
  } catch {
    /* ignore */
  }
}

/** 'hello' = primera conexión del día; 'welcome-back' = re-login el mismo día. */
export function getGreetingVariant(userId) {
  if (!userId) return 'hello';

  const today = todayStr();
  const { date, logins } = readDayLogins(userId);

  if (date !== today || logins <= 1) return 'hello';
  return 'welcome-back';
}
