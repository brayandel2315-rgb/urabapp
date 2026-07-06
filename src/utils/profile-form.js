/** Prefill nombre/teléfono desde perfil o metadata de auth (mandados, envíos, checkout). */
export function prefillContactFields(user, profile, fields = {}) {
  const fullName =
    fields.fullName
    || profile?.full_name
    || user?.user_metadata?.full_name
    || '';
  const rawPhone = fields.phone || profile?.phone || user?.phone || '';
  const phone = rawPhone ? String(rawPhone).replace(/^\+57/, '') : '';
  return { fullName, phone };
}

/** Aplica prefill solo en campos vacíos del formulario. */
export function mergeContactPrefill(form, user, profile, { nameKey = 'fullName', phoneKey = 'phone' } = {}) {
  const { fullName, phone } = prefillContactFields(user, profile, {
    fullName: form[nameKey],
    phone: form[phoneKey],
  });
  const next = { ...form };
  if (!form[nameKey] && fullName) next[nameKey] = fullName;
  if (!form[phoneKey] && phone) next[phoneKey] = phone;
  return next;
}
