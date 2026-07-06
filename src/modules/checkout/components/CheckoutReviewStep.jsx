import { Link } from 'react-router-dom';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import PriceSummary from '@/design-system/patterns/PriceSummary';
import AppIcon from '@/design-system/icons/AppIcon';
import { formatCOP } from '@/utils/currency';
import { formatPhoneDisplay } from '@/utils/validate';
import { WELCOME_BENEFIT } from '@/utils/constants';
import { isDigitalPayment } from '@/services/wompi.service';
import { getBusinessEtaMinutes } from '@/utils/schedule';
import { STORE } from '@/utils/marketplace-copy';

export default function CheckoutReviewStep({
  items,
  businessName,
  cartBusiness,
  fullName,
  phone,
  address,
  reference,
  barrio,
  municipio,
  paymentMethod,
  cashChange,
  tipAmount,
  subtotal,
  total,
  nominalDeliveryFee,
  customerDeliveryFee,
  businessDiscount,
  couponDiscount,
  welcomeDeliveryApplied,
  deliverySubsidy,
  proActive,
  proDeliveryDiscount,
  businessPromoText,
  profile,
  user,
  coordsOk,
}) {
  const paymentLabels = {
    cash: 'Efectivo contra entrega',
    nequi: 'Nequi',
    daviplata: 'Daviplata',
    wompi: 'Tarjeta / PSE (Wompi)',
  };

  return (
    <div className="space-y-4">
      <SurfaceCard className="border-primary/20 bg-primary/5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <AppIcon name="check" />
          </span>
          <div>
            <p className="font-display text-lg font-bold text-foreground">Revisa antes de confirmar</p>
            <p className="text-sm text-muted-foreground">
              Tu pedido quedará registrado con seguimiento en la app. Los datos falsos pueden cancelar el pedido.
            </p>
          </div>
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-3">
        <SectionTitle>Entrega</SectionTitle>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Contacto</dt>
            <dd className="text-right font-medium">{fullName} · {formatPhoneDisplay(phone)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Dirección</dt>
            <dd className="max-w-[60%] text-right font-medium">{address}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Referencia</dt>
            <dd className="max-w-[60%] text-right">{reference}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Zona</dt>
            <dd className="text-right">{barrio ? `${barrio}, ` : ''}{municipio}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">GPS</dt>
            <dd className={coordsOk ? 'font-medium text-primary' : 'text-destructive'}>
              {coordsOk ? 'Ubicación confirmada' : 'Falta marcar en el mapa'}
            </dd>
          </div>
        </dl>
      </SurfaceCard>

      <SurfaceCard className="space-y-3">
        <SectionTitle>Pago</SectionTitle>
        <p className="text-sm font-medium">
          {paymentLabels[isDigitalPayment(paymentMethod) ? 'wompi' : paymentMethod] || paymentMethod}
        </p>
        {paymentMethod === 'cash' && cashChange && (
          <p className="text-sm text-muted-foreground">Cambio de {formatCOP(Number(String(cashChange).replace(/\D/g, '')) || 0)}</p>
        )}
      </SurfaceCard>

      <SurfaceCard className="space-y-3">
        <SectionTitle>{businessName || cartBusiness?.name || 'Tu pedido'}</SectionTitle>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.lineId || item.productId} className="flex justify-between gap-2 text-sm">
              <span className="min-w-0">{item.quantity}× {item.name}</span>
              <span className="shrink-0 font-semibold">{formatCOP(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        {businessPromoText && businessDiscount > 0 && (
          <p className="text-sm text-primary">{businessPromoText} (-{formatCOP(businessDiscount)})</p>
        )}
        {proActive && proDeliveryDiscount > 0 && (
          <p className="text-sm text-muted-foreground">UrabApp Pro: -{formatCOP(proDeliveryDiscount)} domicilio</p>
        )}
        {welcomeDeliveryApplied && (
          <p className="text-sm text-primary">Primera entrega gratis (bono {formatCOP(deliverySubsidy)})</p>
        )}
        {!welcomeDeliveryApplied && !profile?.welcome_delivery_used_at && user && (
          <p className="text-xs text-muted-foreground">
            <Link to="/cuenta/perfil" className="text-primary">Registra tu cédula</Link>
            {' '}para entrega gratis desde {formatCOP(WELCOME_BENEFIT.minOrder)}.
          </p>
        )}
        <PriceSummary
          rows={[
            { label: 'Subtotal', value: formatCOP(subtotal) },
            {
              label: welcomeDeliveryApplied ? 'Domicilio (gratis)' : 'Domicilio',
              value: welcomeDeliveryApplied ? `${formatCOP(nominalDeliveryFee)} → $0` : formatCOP(customerDeliveryFee),
            },
            ...(cartBusiness ? [{ label: 'Tiempo estimado', value: `~${getBusinessEtaMinutes(cartBusiness)} min` }] : []),
            ...(proDeliveryDiscount > 0 ? [{ label: 'Pro', value: `-${formatCOP(proDeliveryDiscount)}` }] : []),
            ...(businessDiscount > 0 ? [{ label: STORE.promo, value: `-${formatCOP(businessDiscount)}` }] : []),
            ...(couponDiscount > 0 ? [{ label: 'Cupón', value: `-${formatCOP(couponDiscount)}` }] : []),
            ...(tipAmount > 0 ? [{ label: 'Propina', value: formatCOP(tipAmount) }] : []),
          ]}
          totalLabel="Total"
          totalValue={formatCOP(total)}
        />
      </SurfaceCard>
    </div>
  );
}
