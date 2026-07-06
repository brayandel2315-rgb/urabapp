export function getAppBaseUrl() {
  return import.meta.env.VITE_APP_URL || window.location.origin;
}

export function buildBusinessPath(business) {
  const slug = business?.slug || business?.id;
  return `/tienda/${slug}`;
}

export function buildBusinessUrl(business) {
  return `${getAppBaseUrl()}${buildBusinessPath(business)}`;
}

export function buildOrderUrl(orderId) {
  return `${getAppBaseUrl()}/pedidos/${orderId}`;
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
