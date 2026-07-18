import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/design-system/layouts/PageLayout';
import ClientScreenHeader from '@/design-system/patterns/ClientScreenHeader';
import PageExperienceGuard from '@/design-system/patterns/PageExperienceGuard';
import MobileStickyCheckoutBar from '@/design-system/patterns/MobileStickyCheckoutBar';
import ClientAuthGateCard from '@/components/client/ClientAuthGateCard';
import { isRealAuthenticatedUser } from '@/utils/auth-session';
import { STORE } from '@/utils/marketplace-copy';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { getBusinessById } from '@/services/business.service';
import { getUserAddresses } from '@/services/address.service';
import { getUserSubscription } from '@/services/membership.service';
import { validateCoupon } from '@/services/coupon.service';
import { geocodeAddress, isMapsEnabled } from '@/services/map.service';
import { isDigitalPayment } from '@/services/wompi.service';
import { emitCommEvent } from '@/communication';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useCatalogLocation } from '@/hooks/useCatalogLocation';
import { isValidAddress } from '@/utils/validate';
import { ECONOMICS, WELCOME_BENEFIT } from '@/utils/constants';
import { formatBusinessPromoText } from '@/utils/promo';
import { resolveCheckoutPromos } from '@/services/promo.service';
import { getBusinessEtaMinutes } from '@/utils/schedule';
import { toast } from '@/utils/toast';
import { isSupabaseConfigured } from '@/lib/supabase';
import { isValidDeliveryCoordinates } from '../utils/checkout-validation';
import { useCheckoutForm } from '../hooks/useCheckoutForm';
import { useCheckoutSubmit } from '../hooks/useCheckoutSubmit';
import CheckoutStepper from '../components/CheckoutStepper';
import CheckoutDeliveryStep from '../components/CheckoutDeliveryStep';
import CheckoutPaymentStep from '../components/CheckoutPaymentStep';
import CheckoutReviewStep from '../components/CheckoutReviewStep';
import CheckoutOrderSummary from '../components/CheckoutOrderSummary';
import { Button } from '@/design-system/ui/button';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const { catalog } = useCatalogLocation();
  const {
    items,
    businessId,
    businessName,
    minOrder,
    deliveryFee: cartDeliveryFee,
    getSubtotal,
    clearCart,
    getSavings,
  } = useCartStore();
  const online = useOnlineStatus();

  const [currentStep, setCurrentStep] = useState('delivery');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  const { data: cartBusiness } = useQuery({
    queryKey: ['checkout-business', businessId],
    queryFn: () => getBusinessById(businessId),
    enabled: !!businessId && UUID_RE.test(businessId),
  });

  const { data: subscription } = useQuery({
    queryKey: ['membership', user?.id],
    queryFn: () => getUserSubscription(user.id),
    enabled: !!user?.id,
  });

  const { data: savedAddresses = [] } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: () => getUserAddresses(user.id),
    enabled: !!user?.id,
  });

  const form = useCheckoutForm({ savedAddresses });

  const subtotal = getSubtotal();
  const itemSavings = getSavings();
  const nominalDeliveryFee = cartBusiness?.delivery_fee ?? cartDeliveryFee ?? ECONOMICS.defaultDeliveryFee;

  const checkoutPromos = useMemo(
    () => resolveCheckoutPromos({
      business: cartBusiness,
      profile,
      subscription,
      subtotal,
      deliveryFee: nominalDeliveryFee,
      minWelcomeOrder: WELCOME_BENEFIT.minOrder,
      couponDiscount: form.appliedCoupon?.discount ?? 0,
      tipAmount: form.tipAmount,
    }),
    [cartBusiness, profile, subscription, subtotal, nominalDeliveryFee, form.appliedCoupon, form.tipAmount]
  );

  const { total, businessDiscount, couponDiscount, welcomeDeliveryApplied, deliverySubsidy, proActive, proDeliveryDiscount, customerDeliveryFee } = checkoutPromos;
  const businessPromoText = cartBusiness ? formatBusinessPromoText(cartBusiness) : null;
  const etaMinutes = cartBusiness ? getBusinessEtaMinutes(cartBusiness) : null;
  const coordsOk = isValidDeliveryCoordinates(form.deliveryCoords.latitude, form.deliveryCoords.longitude);

  const { submit } = useCheckoutSubmit({
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
  });

  useEffect(() => {
    if (items.length === 0) navigate('/carrito', { replace: true });
  }, [items.length, navigate]);

  useEffect(() => {
    emitCommEvent('checkout_started', {
      recipientId: user?.id,
      actorId: user?.id,
      payload: { business_id: businessId, items: items.length },
    }).catch(() => {});
  }, [businessId, items.length, user?.id]);

  useEffect(() => {
    if (!isMapsEnabled() || !isValidAddress(form.address)) return undefined;
    const timer = setTimeout(() => {
      geocodeAddress(form.address, { municipio: form.municipio })
        .then((result) => {
          if (result && form.mapLat == null) {
            form.onMapChange({ latitude: result.latitude, longitude: result.longitude, label: form.address });
          }
        })
        .catch(() => {});
    }, 800);
    return () => clearTimeout(timer);
  }, [form.address, form.municipio, form.mapLat, form.onMapChange]);

  const handleApplyCoupon = async () => {
    const code = form.couponInput.trim();
    if (!code) return;
    if (!isSupabaseConfigured) {
      toast('Cupones disponibles al conectar con el servidor', 'error');
      return;
    }
    setCouponLoading(true);
    try {
      const { discount, coupon } = await validateCoupon(code, subtotal, user?.id);
      form.setAppliedCoupon({ code: coupon.code, discount });
      toast(`Cupón ${coupon.code} aplicado`);
    } catch (err) {
      form.setAppliedCoupon(null);
      toast(err.message || 'Cupón inválido', 'error');
    } finally {
      setCouponLoading(false);
    }
  };

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleContinue = () => {
    if (currentStep === 'delivery') {
      const result = form.validateStep('delivery', total);
      if (!result.valid) {
        toast(Object.values(result.errors)[0] || 'Completa la entrega', 'error');
        return;
      }
      setCompletedSteps((s) => [...new Set([...s, 'delivery'])]);
      goToStep('payment');
      return;
    }
    if (currentStep === 'payment') {
      const result = form.validateStep('payment', total);
      if (!result.valid) {
        toast(Object.values(result.errors)[0] || 'Revisa el pago', 'error');
        return;
      }
      setCompletedSteps((s) => [...new Set([...s, 'payment'])]);
      goToStep('review');
    }
  };

  const handleStepClick = (stepId) => {
    if (stepId === 'delivery') goToStep('delivery');
    if (stepId === 'payment' && completedSteps.includes('delivery')) goToStep('payment');
    if (stepId === 'review' && completedSteps.includes('payment')) goToStep('review');
  };

  const handleConfirm = async (e) => {
    e?.preventDefault();
    if (businessId && !UUID_RE.test(businessId)) {
      clearCart();
      toast('Carrito desactualizado. Vuelve a elegir productos.', 'error');
      navigate('/');
      return;
    }

    setLoading(true);
    try {
      await submit({
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        reference: form.reference,
        barrio: form.barrio,
        municipio: form.municipio,
        paymentMethod: form.paymentMethod,
        cashChange: form.cashChange,
        tipAmount: form.tipAmount,
        saveAddress: form.saveAddress,
        selectedAddressId: form.selectedAddressId,
        deliveryCoords: form.deliveryCoords,
      }, form.appliedCoupon);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  const isAuthed = user && isRealAuthenticatedUser(user);

  const stickyLabel = loading
    ? 'Procesando…'
    : !online
      ? 'Sin conexión'
      : currentStep === 'review'
        ? (isDigitalPayment(form.paymentMethod) ? 'Pagar ahora' : 'Confirmar pedido')
        : 'Continuar';

  const stickyAction = currentStep === 'review' ? handleConfirm : handleContinue;

  return (
    <PageLayout title={false} backTo="/carrito" maxWidth="lg" bottomPad stickyCheckout>
      <PageExperienceGuard
        online={online}
        offlineDescription="Conéctate para confirmar tu pedido y pagar con seguridad."
      >
      <div className="client-page-split client-page-split--checkout">
      <div className="min-w-0 space-y-4">
        <ClientScreenHeader
          tag="Checkout"
          title="Confirma tu pedido"
          subtitle={businessName || cartBusiness?.name || `Tu ${STORE.oneLower}`}
        />

        {!isAuthed && (
          <ClientAuthGateCard
            redirectPath="/checkout"
            title="Entra para finalizar"
            description="Guardamos tu carrito. Inicia sesión o verifica tu celular para confirmar el pedido con trazabilidad y protección anti-fraude."
          />
        )}

        {isAuthed && (
        <>
        <CheckoutStepper
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />

        <p className="text-center text-xs text-muted-foreground">
          {currentStep === 'delivery' && 'Paso 1 de 3 · Dónde entregamos'}
          {currentStep === 'payment' && 'Paso 2 de 3 · Cómo pagas'}
          {currentStep === 'review' && 'Paso 3 de 3 · Revisa y confirma'}
        </p>

        <form
          id="checkout-form"
          onSubmit={currentStep === 'review' ? handleConfirm : (e) => { e.preventDefault(); handleContinue(); }}
          className="min-w-0 space-y-4"
        >
            {currentStep === 'delivery' && (
              <CheckoutDeliveryStep
                user={user}
                profile={profile}
                municipio={form.municipio}
                barrio={form.barrio}
                setBarrio={form.setBarrio}
                fullName={form.fullName}
                setFullName={form.setFullName}
                phone={form.phone}
                setPhone={form.setPhone}
                address={form.address}
                setAddress={form.setAddress}
                reference={form.reference}
                setReference={form.setReference}
                savedAddresses={savedAddresses}
                selectedAddressId={form.selectedAddressId}
                selectSavedAddress={form.selectSavedAddress}
                useNewAddress={form.useNewAddress}
                mapLat={form.mapLat}
                mapLng={form.mapLng}
                latitude={form.latitude}
                longitude={form.longitude}
                hasCoords={form.hasCoords}
                gpsLoading={form.gpsLoading}
                locationHint={form.locationHint}
                detect={form.detect}
                onMapChange={form.onMapChange}
                onPlaceSelect={form.onPlaceSelect}
                saveAddress={form.saveAddress}
                setSaveAddress={form.setSaveAddress}
                fieldErrors={form.fieldErrors}
                setFieldErrors={form.setFieldErrors}
              />
            )}

            {currentStep === 'payment' && (
              <CheckoutPaymentStep
                paymentMethod={form.paymentMethod}
                setPaymentMethod={form.setPaymentMethod}
                cashChange={form.cashChange}
                setCashChange={form.setCashChange}
                tipAmount={form.tipAmount}
                setTipAmount={form.setTipAmount}
                couponInput={form.couponInput}
                setCouponInput={form.setCouponInput}
                appliedCoupon={form.appliedCoupon}
                couponLoading={couponLoading}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={() => { form.setAppliedCoupon(null); form.setCouponInput(''); }}
                total={total}
                fieldErrors={form.fieldErrors}
                setFieldErrors={form.setFieldErrors}
              />
            )}

            {currentStep === 'review' && (
              <CheckoutReviewStep
                items={items}
                businessName={businessName}
                cartBusiness={cartBusiness}
                fullName={form.fullName}
                phone={form.phone}
                address={form.address}
                reference={form.reference}
                barrio={form.barrio}
                municipio={form.municipio}
                paymentMethod={form.paymentMethod}
                cashChange={form.cashChange}
                tipAmount={form.tipAmount}
                subtotal={subtotal}
                total={total}
                nominalDeliveryFee={nominalDeliveryFee}
                customerDeliveryFee={customerDeliveryFee}
                businessDiscount={businessDiscount}
                couponDiscount={couponDiscount}
                welcomeDeliveryApplied={welcomeDeliveryApplied}
                deliverySubsidy={deliverySubsidy}
                proActive={proActive}
                proDeliveryDiscount={proDeliveryDiscount}
                businessPromoText={businessPromoText}
                profile={profile}
                user={user}
                coordsOk={coordsOk}
              />
            )}

          </form>
        </>
        )}
      </div>

      {isAuthed && (
        <aside className="client-sticky-panel hidden space-y-4 lg:block">
          <CheckoutOrderSummary
            businessName={businessName || cartBusiness?.name}
            items={items}
            itemSavings={itemSavings}
            total={total}
            etaMinutes={etaMinutes}
            subtotal={subtotal}
            deliveryFee={customerDeliveryFee}
            deliveryFeeNote={welcomeDeliveryApplied ? 'gratis' : undefined}
          />
          <Button
            type="button"
            className="h-12 w-full rounded-[var(--radius-component)] text-base font-bold"
            disabled={loading || !online}
            onClick={stickyAction}
          >
            {loading ? 'Procesando…' : stickyLabel}
          </Button>
        </aside>
      )}
      </div>

      {isAuthed && (
      <MobileStickyCheckoutBar
        total={total}
        actionLabel={stickyLabel}
        type="button"
        onAction={stickyAction}
        disabled={loading || !online}
        loading={loading}
        hint={etaMinutes != null ? `~${etaMinutes} min` : undefined}
      />
      )}
      </PageExperienceGuard>
    </PageLayout>
  );
}
