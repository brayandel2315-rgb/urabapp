import { useState } from 'react';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { requestPhoneOtp, confirmPhoneOtp } from '@/services/auth.service';
import { isSupabaseConfigured } from '@/lib/supabase';
import { toast } from '@/utils/toast';

/**
 * Verificación SMS reutilizable (recuperar pedidos, vincular celular).
 */
export default function PhoneOtpVerificationCard({
  title = 'Verifica tu celular',
  description = 'Te enviamos un código de 6 dígitos por SMS. Solo vinculamos pedidos de invitado con ese mismo número.',
  defaultPhone = '',
  onVerified,
  className,
}) {
  const [phone, setPhone] = useState(defaultPhone);
  const [otp, setOtp] = useState('');
  const [normalizedPhone, setNormalizedPhone] = useState('');
  const [otpMode, setOtpMode] = useState('signin');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!isSupabaseConfigured) {
      toast('Servidor no configurado', 'error');
      return;
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      toast('Ingresa un celular colombiano válido', 'error');
      return;
    }
    setLoading(true);
    try {
      const result = await requestPhoneOtp(phone);
      setNormalizedPhone(result.normalized);
      setOtpMode(result.mode);
      setOtpSent(true);
      toast('Código enviado por SMS');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (!otp.trim()) {
      toast('Ingresa el código', 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await confirmPhoneOtp(normalizedPhone || phone, otp, otpMode);
      await onVerified?.(data);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SurfaceCard className={`space-y-4 border border-primary/20 bg-primary/[0.03] p-4 ${className || ''}`}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <AppIcon name="phone" size="sm" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>

      <form onSubmit={otpSent ? handleVerify : handleSend} className="space-y-3">
        {!otpSent ? (
          <Input
            label="Celular"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="300 123 4567"
            autoComplete="tel"
            required
          />
        ) : (
          <Input
            label="Código SMS"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
          />
        )}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="sm" loading={loading}>
            {otpSent ? 'Confirmar código' : 'Enviar código'}
          </Button>
          {otpSent && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={loading}
              onClick={() => { setOtpSent(false); setOtp(''); }}
            >
              Cambiar número
            </Button>
          )}
        </div>
      </form>
    </SurfaceCard>
  );
}
