import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sbFetch } from '@/lib/supabase-query';
import { uploadCourierLiveSelfie } from './storage.service';

function parseRpc(data) {
  if (typeof data === 'string') return JSON.parse(data);
  return data;
}

export async function registerCourierStep1(payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const data = await sbFetch(
    supabase.rpc('register_courier_step1', {
      p_first_name: payload.firstName,
      p_last_name: payload.lastName,
      p_document_type: payload.documentType || 'CC',
      p_document_number: payload.documentNumber,
      p_birth_date: payload.birthDate || null,
      p_phone: payload.phone,
      p_email: payload.email || '',
      p_city: payload.city || 'Urabá',
      p_municipio: payload.municipio,
      p_language: payload.language || 'es',
    }),
    'Tiempo agotado registrando mensajero (paso 1)',
  );
  const result = parseRpc(data);
  if (!result?.success) throw new Error('No se pudo guardar la información básica');
  return result.driver;
}

export async function registerCourierStep2(payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const data = await sbFetch(
    supabase.rpc('register_courier_step2', {
      p_vehicle_type: payload.vehicleType,
      p_plate: payload.plate || '',
      p_capacity: payload.capacity || '',
      p_intermunicipal: payload.intermunicipal ?? false,
      p_brand: payload.brand || null,
      p_model: payload.model || null,
      p_capacity_kg: payload.capacityKg ? Number(payload.capacityKg) : null,
    }),
    'Tiempo agotado registrando mensajero (paso 2)',
  );
  const result = parseRpc(data);
  if (!result?.success) throw new Error('No se pudo guardar la información operativa');
  return result;
}

export async function submitCourierForReview() {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const data = await sbFetch(
    supabase.rpc('submit_courier_for_review'),
    'Tiempo agotado enviando mensajero a revisión',
  );
  const result = parseRpc(data);
  if (!result?.success) {
    if (result?.reason === 'profile_photo_required') {
      throw new Error(result.message || 'Debes tomar tu foto en vivo con la cámara antes de continuar.');
    }
    throw new Error('No se pudo enviar a revisión');
  }
  return result;
}

export async function setCourierAvailability(mode) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const data = await sbFetch(
    supabase.rpc('set_courier_availability', { p_mode: mode }),
    'Tiempo agotado cambiando disponibilidad',
  );
  const result = parseRpc(data);
  if (!result?.success) {
    if (result?.reason === 'not_approved') {
      throw new Error('Tu cuenta aún no está aprobada. Espera la revisión de UrabApp.');
    }
    throw new Error('No se pudo cambiar el estado');
  }
  return result.driver;
}

export async function logOfferRejection(orderId, reason, offerType = 'courier') {
  if (!isSupabaseConfigured) return null;
  const data = await sbFetch(
    supabase.rpc('log_courier_offer_rejection', {
      p_order_id: orderId,
      p_reason: reason,
      p_offer_type: offerType,
    }),
    'Tiempo agotado registrando rechazo de oferta',
  );
  return parseRpc(data);
}

export async function getCourierWalletSummary() {
  if (!isSupabaseConfigured) {
    return { today: 0, week: 0, month: 0, pendingOrders: 0, wallet: null };
  }
  const data = await sbFetch(
    supabase.rpc('get_courier_wallet_summary'),
    'Tiempo agotado cargando billetera del mensajero',
  );
  const result = parseRpc(data);
  if (!result?.success) return { today: 0, week: 0, month: 0, pendingOrders: 0, wallet: null };
  return {
    today: Number(result.today ?? 0),
    week: Number(result.week ?? 0),
    month: Number(result.month ?? 0),
    pendingOrders: Number(result.pending_orders ?? 0),
    wallet: result.wallet,
  };
}

export async function getCourierReputation() {
  if (!isSupabaseConfigured) return null;
  const data = await sbFetch(
    supabase.rpc('get_courier_reputation'),
    'Tiempo agotado cargando reputación del mensajero',
  );
  const result = parseRpc(data);
  return result?.success ? result : null;
}

export async function logSecurityEvent(eventType, metadata = {}) {
  if (!isSupabaseConfigured) return null;
  const data = await sbFetch(
    supabase.rpc('log_courier_security_event', {
      p_event_type: eventType,
      p_metadata: metadata,
    }),
    'Tiempo agotado registrando evento de seguridad',
  );
  return parseRpc(data);
}

export async function adminReviewCourier(driverId, action, notes = null) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const data = await sbFetch(
    supabase.rpc('admin_review_courier', {
      p_driver_id: driverId,
      p_action: action,
      p_notes: notes,
    }),
    'Tiempo agotado revisando mensajero',
  );
  const result = parseRpc(data);
  if (!result?.success) throw new Error('Acción no permitida');
  return result;
}

export async function upsertCourierDocument(driverId, docType, fileUrl) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return sbFetch(
    supabase
      .from('courier_documents')
      .upsert({
        driver_id: driverId,
        doc_type: docType,
        file_url: fileUrl,
        status: 'pending',
        uploaded_at: new Date().toISOString(),
      }, { onConflict: 'driver_id,doc_type' })
      .select()
      .single(),
    'Tiempo agotado guardando documento del mensajero',
  );
}

export async function getCourierDocuments(driverId) {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('courier_documents')
      .select('*')
      .eq('driver_id', driverId)
      .order('uploaded_at', { ascending: false }),
    'Tiempo agotado cargando documentos del mensajero',
  );
  return data ?? [];
}

export async function getCourierPayouts(driverId, limit = 20) {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('courier_payout')
      .select('*')
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false })
      .limit(limit),
    'Tiempo agotado cargando retiros del mensajero',
  );
  return data ?? [];
}

export async function requestCourierPayout({ amount, bankName, accountNumber, accountType = 'ahorros', accountHolder }) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const data = await sbFetch(
    supabase.rpc('request_courier_payout', {
      p_amount: amount,
      p_bank_name: bankName,
      p_account_number: accountNumber,
      p_account_type: accountType,
      p_account_holder: accountHolder || null,
    }),
    'Tiempo agotado solicitando retiro',
  );
  const result = parseRpc(data);
  if (!result?.success) {
    if (result?.error === 'insufficient_balance') throw new Error('Saldo insuficiente para este retiro');
    if (result?.error === 'min_amount') throw new Error(`El retiro mínimo es ${result.min?.toLocaleString?.('es-CO') || '20.000'} COP`);
    if (result?.error === 'bank_required') throw new Error('Completa los datos bancarios');
    throw new Error('No se pudo solicitar el retiro');
  }
  return result;
}

export async function getCourierEvents(driverId, limit = 30) {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('courier_events')
      .select('*')
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false })
      .limit(limit),
    'Tiempo agotado cargando eventos del mensajero',
  );
  return data ?? [];
}

export async function getCourierRegions(driverId) {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('courier_regions')
      .select('*')
      .eq('driver_id', driverId)
      .eq('is_active', true),
    'Tiempo agotado cargando regiones del mensajero',
  );
  return data ?? [];
}

export async function upsertCourierRegion(driverId, { origin, dest, maxWeight, baseFee }) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return sbFetch(
    supabase
      .from('courier_regions')
      .upsert({
        driver_id: driverId,
        origin_municipio: origin,
        dest_municipio: dest,
        max_weight_kg: maxWeight ? Number(maxWeight) : null,
        base_fee_cop: baseFee ? Number(baseFee) : null,
        is_active: true,
      }, { onConflict: 'driver_id,origin_municipio,dest_municipio' })
      .select()
      .single(),
    'Tiempo agotado guardando región del mensajero',
  );
}

export async function saveCourierLiveSelfie(driverId, file) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const url = await uploadCourierLiveSelfie(driverId, file);
  await upsertCourierDocument(driverId, 'profile_photo', url);
  const capturedAt = file.capturedAt || new Date().toISOString();
  await updateCourierProfile(driverId, {
    profile_photo_url: url,
    profile_photo_captured_at: capturedAt,
  });
  await logSecurityEvent('profile_photo_live_capture', {
    method: file.captureMethod || 'live_camera',
    captured_at: capturedAt,
  });
  return url;
}

export async function updateCourierProfile(driverId, updates) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return sbFetch(
    supabase
      .from('drivers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', driverId)
      .select()
      .single(),
    'Tiempo agotado actualizando perfil del mensajero',
  );
}

export async function getCouriersPendingReview() {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('drivers')
      .select('*, courier_documents(*)')
      .in('verification_status', ['in_review', 'corrections', 'pending'])
      .order('updated_at', { ascending: false }),
    'Tiempo agotado cargando mensajeros pendientes',
  );
  return data ?? [];
}
