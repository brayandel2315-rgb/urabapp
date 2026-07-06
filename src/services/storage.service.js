import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const STORAGE_BUCKET = 'urabapp-public';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_BYTES = 5 * 1024 * 1024;

function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Solo JPG, PNG o WebP (máx. 5 MB)');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('La imagen no puede superar 5 MB');
  }
}

function publicUrl(path) {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadBusinessLogo(businessId, file) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  validateFile(file);
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `businesses/${businessId}/logo.${ext}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  return publicUrl(path);
}

export async function uploadBusinessCover(businessId, file) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  validateFile(file);
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `businesses/${businessId}/cover.${ext}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  return publicUrl(path);
}

export async function uploadProductImage(businessId, productId, file) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  validateFile(file);
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `businesses/${businessId}/products/${productId}.${ext}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  return publicUrl(path);
}

export async function uploadBannerImage(file) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  validateFile(file);
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `marketing/banners/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return publicUrl(path);
}

export async function uploadShipmentPhoto(shipmentId, file) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  validateFile(file);
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `shipments/${shipmentId || 'draft'}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return publicUrl(path);
}

export async function uploadDeliveryProof(orderId, file) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  validateFile(file);
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `deliveries/${orderId || 'draft'}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return publicUrl(path);
}

export async function uploadDeliverySignature(orderId, file) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  validateFile(file);
  const path = `deliveries/${orderId || 'draft'}/signature-${Date.now()}.png`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: false, contentType: 'image/png' });
  if (error) throw error;
  return publicUrl(path);
}

export async function uploadCourierDocument(driverId, docType, file) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  validateFile(file);
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `couriers/${driverId}/${docType}.${ext}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  return publicUrl(path);
}

/** Selfie en vivo — nombre con timestamp para trazabilidad legal */
export async function uploadCourierLiveSelfie(driverId, file) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  validateFile(file);
  const ts = file.lastModified || Date.now();
  const path = `couriers/${driverId}/profile_photo_live_${ts}.jpg`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: false, contentType: 'image/jpeg' });
  if (error) throw error;
  return publicUrl(path);
}

const VERIFICATION_DOC_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const VERIFICATION_MAX_BYTES = 8 * 1024 * 1024;

function validateVerificationFile(file) {
  if (!VERIFICATION_DOC_TYPES.includes(file.type)) {
    throw new Error('Solo JPG, PNG, WebP o PDF (máx. 8 MB)');
  }
  if (file.size > VERIFICATION_MAX_BYTES) {
    throw new Error('El archivo no puede superar 8 MB');
  }
}

export async function uploadBusinessVerificationDoc(businessId, docType, file) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  validateVerificationFile(file);
  const ext = file.type === 'application/pdf'
    ? 'pdf'
    : (file.name.split('.').pop()?.toLowerCase() || 'jpg');
  const path = `businesses/${businessId}/verification/${docType}.${ext}`;
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  return publicUrl(path);
}
