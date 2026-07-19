import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { updateProfile } from '@/services/auth.service';
import { createOrder, notifyOperatorNewOrder, fallbackOrderToCashPayment } from '@/services/order.service';
import { startWompiCheckout, isDigitalPayment } from '@/services/wompi.service';
import { createAddress } from '@/services/address.service';
import { getBusinessForCheckout } from '@/services/business.service';
import { resolveCheckoutPromos } from '@/services/promo.service';
import { emitCommEvent } from '@/communication';
import { isBusinessOrderableInCatalog } from '@/utils/business-coverage';
import { assertBusinessAcceptingOrders } from '@/utils/business-checkout';
import { sanitizeText } from '@/utils/validate';
import { WELCOME_BENEFIT } from '@/utils/constants';
import { toast } from '@/utils/toast';
import { STORE } from '@/utils/marketplace-copy';
import { buildLoginRedirect } from '@/utils/auth-routes';
import {
  buildCheckoutAuditNotes,
  normalizeCheckoutContact,
  validateCheckoutStep,
} from '../utils/checkout-validation';

export function useCheckoutSubmit({
  catalog,
  cartBusiness,
  businessId,
  businessName,
  items,
  minOrder,
  subtotal,
  nominalDeliveryFee,
  subscription,
  savedAddresses,
  clearCart,
  online,
}) {
  const navigate = useNavigate();
  const { user, profile, setProfile } = useAuthStore();

  const submit = useCallback(async (form, appliedCoupon) => {
    if (!online) {
      toast('Sin conexión. Espera a volver en línea.', 'error');
      return false;
    }
    if (!user?.id) {
      toast('Inicia sesión para confirmar tu pedido', 'error');
      navigate(buildLoginRedirect('/checkout'));
      return false;
    }

    const promosPreview = resolveCheckoutPromos({
      business: cartBusiness,
      profile,
      subscription,
      subtotal,
      deliveryFee: nominalDeliveryFee,
      minWelcomeOrder: WELCOME_BENEFIT.minOrder,
      couponDiscount: appliedCoupon?.discount ?? 0,
      tipAmount: form.tipAmount,
    });

    const validation = validateCheckoutStep('review', {
      ...form,
      barrio: form.barrio,
      mapLat: form.deliveryCoords.latitude,
      mapLng: form.deliveryCoords.longitude,
      total: promosPreview.total,
    });
    if (!validation.valid) {
      const first = Object.values(validation.errors)[0];
      toast(first || 'Completa todos los campos', 'error');
      return false;
    }

    if (minOrder && subtotal < minOrder) {
      toast(`Pedido mínimo ${minOrder.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}`, 'error');
      return false;
    }

    const contact = normalizeCheckoutContact({
      fullName: form.fullName,
      phone: form.phone,
    });

    try {
      const updatedProfile = await updateProfile(user.id, {
        full_name: contact.fullName,
        phone: contact.phone,
      });
      if (updatedProfile) setProfile(updatedProfile);

      const business = cartBusiness ?? (businessId ? await getBusinessForCheckout(businessId) : null);
      if (business && !isBusinessOrderableInCatalog(business, catalog)) {
        toast(STORE.unavailable, 'error');
        return false;
      }
      if (business) {
        assertBusinessAcceptingOrders(business);
      }

      const promos = resolveCheckoutPromos({
        business,
        profile: useAuthStore.getState().profile,
        subscription,
        subtotal,
        deliveryFee: business?.delivery_fee ?? nominalDeliveryFee,
        minWelcomeOrder: WELCOME_BENEFIT.minOrder,
        couponDiscount: appliedCoupon?.discount ?? 0,
        tipAmount: form.tipAmount,
      });

      const notes = buildCheckoutAuditNotes({
        reference: form.reference,
        cashChange: form.cashChange,
        barrio: form.barrio,
        fullName: contact.fullName,
        phone: contact.phone,
      });

      const order = await createOrder({
        customerId: user.id,
        businessId,
        items,
        address: sanitizeText(form.address, 300),
        destReference: sanitizeText(form.reference, 200),
        municipio: form.municipio,
        paymentMethod: isDigitalPayment(form.paymentMethod) ? 'wompi' : form.paymentMethod,
        deliveryFee: business?.delivery_fee ?? nominalDeliveryFee,
        notes,
        barrio: form.barrio || null,
        businessDiscount: promos.businessDiscount,
        discount: promos.businessDiscount,
        couponDiscount: promos.couponDiscount,
        welcomeDeliveryApplied: promos.welcomeDeliveryApplied,
        deliverySubsidy: promos.deliverySubsidy,
        latitude: form.deliveryCoords.latitude,
        longitude: form.deliveryCoords.longitude,
        couponCode: appliedCoupon?.code,
        tipAmount: promos.tipAmount,
        contactName: contact.fullName,
        contactPhone: contact.phone,
      });

      emitCommEvent('checkout_confirmed', {
        recipientId: user.id,
        actorId: user.id,
        payload: {
          orderId: order.id,
          payment_method: form.paymentMethod,
          total: promos.total,
          has_gps: true,
        },
      }).catch(() => {});

      if (isDigitalPayment(form.paymentMethod)) {
        try {
          const checkout = await startWompiCheckout(order.id);
          emitCommEvent('payment_approved', {
            recipientId: user.id,
            payload: { orderId: order.id, total: promos.total, stage: 'wompi_started' },
          }).catch(() => {});
          clearCart();
          window.location.href = checkout.url;
          return true;
        } catch (wompiErr) {
          emitCommEvent('payment_failed', {
            recipientId: user.id,
            actorId: user.id,
            payload: { orderId: order.id, total: promos.total, error: wompiErr.message },
          }).catch(() => {});
          await fallbackOrderToCashPayment(order.id).catch(() => {});
          toast(wompiErr.message || 'Pago digital no disponible. Pedido en efectivo contra entrega.', 'error');
          clearCart();
          navigate(`/pedidos/${order.id}`);
          return true;
        }
      }

      notifyOperatorNewOrder(order, business?.name || businessName);
      if (form.saveAddress && form.address && (!form.selectedAddressId || form.selectedAddressId === 'new')) {
        try {
          await createAddress(user.id, {
            municipio: form.municipio,
            barrio: form.barrio || null,
            address: sanitizeText(form.address, 200),
            reference: sanitizeText(form.reference, 100),
            isDefault: savedAddresses.length === 0,
            latitude: form.deliveryCoords.latitude,
            longitude: form.deliveryCoords.longitude,
          });
        } catch {
          /* opcional */
        }
      }

      clearCart();
      toast.order('¡Pedido confirmado!', {
        description: STORE.waitingConfirm,
      });
      navigate(`/pedidos/${order.id}`);
      return true;
    } catch (err) {
      toast(err.message || 'No se pudo confirmar el pedido', 'error');
      return false;
    }
  }, [
    online,
    user,
    profile,
    setProfile,
    cartBusiness,
    businessId,
    businessName,
    items,
    minOrder,
    subtotal,
    nominalDeliveryFee,
    subscription,
    savedAddresses,
    clearCart,
    catalog,
    navigate,
  ]);

  return { submit };
}
