/** Loop de mejora continua — claridad del registro e inicio de sesión */

export const AUTH_ENTRY_LOOP_VERSION = 1;

const FEEDBACK_KEY = 'urabapp-auth-entry-feedback-v1';
const VARIANT_KEY = 'urabapp-auth-entry-variant-v1';

function readFeedback() {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    return raw ? JSON.parse(raw) : { clear: 0, unclear: 0, entries: [] };
  } catch {
    return { clear: 0, unclear: 0, entries: [] };
  }
}

function writeFeedback(data) {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(data));
}

export function getAuthEntryVariant() {
  const stored = localStorage.getItem(VARIANT_KEY);
  if (stored === 'guided' || stored === 'compact') return stored;
  const fb = readFeedback();
  if (fb.unclear > fb.clear && fb.unclear >= 2) return 'guided';
  return 'compact';
}

export function recordAuthEntryFeedback({ clear, intent, step, wizardVersion = AUTH_ENTRY_LOOP_VERSION }) {
  const fb = readFeedback();
  fb.entries = [...(fb.entries || []), { clear, intent, step, wizardVersion, at: new Date().toISOString() }].slice(-50);
  if (clear) fb.clear += 1;
  else fb.unclear += 1;
  writeFeedback(fb);
  if (!clear && fb.unclear >= 2) {
    localStorage.setItem(VARIANT_KEY, 'guided');
  }
}

export function getAuthEntryFeedbackStats() {
  return readFeedback();
}
