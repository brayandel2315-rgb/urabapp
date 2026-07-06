import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import ClientTrustStrip from '@/design-system/patterns/ClientTrustStrip';
import GuestOrderRecoveryCard from '@/modules/client/components/GuestOrderRecoveryCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AppIcon from '@/design-system/icons/AppIcon';
import { useAuthStore } from '@/store/authStore';
import { resetPassword, updatePassword } from '@/services/auth.service';
import { toast } from '@/utils/toast';

const SECURITY_PRINCIPLES = [
  {
    icon: 'lock',
    title: 'Perfil blindado',
    text: 'Rol, correo y estado de cuenta solo los modifica el equipo UrabApp. Tu sesión no puede escalar privilegios.',
  },
  {
    icon: 'tag',
    title: 'Beneficios únicos',
    text: 'Entrega gratis de bienvenida y cupones se validan en servidor. No se pueden reutilizar ni transferir desde el perfil.',
  },
  {
    icon: 'orders',
    title: 'Pedidos ajenos',
    text: 'No puedes reclamar pedidos de otra persona. En otro dispositivo solo recuperas actividad verificando tu celular por SMS.',
  },
];

export default function AccountSecurityPage() {
  const { user, profile } = useAuthStore();
  const [email, setEmail] = useState(profile?.email || user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) return toast('Ingresa tu correo', 'error');
    setLoading(true);
    try {
      await resetPassword(email);
      toast('Revisa tu correo para restablecer la contraseña');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 8) return toast('Mínimo 8 caracteres', 'error');
    if (!/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      return toast('Usa letras y números para mayor seguridad', 'error');
    }
    if (newPassword !== confirm) return toast('Las contraseñas no coinciden', 'error');
    setLoading(true);
    try {
      await updatePassword(newPassword);
      setNewPassword('');
      setConfirm('');
      toast('Contraseña actualizada');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ClientTrustStrip className="rounded-2xl" />

      <div className="grid gap-3 sm:grid-cols-3">
        {SECURITY_PRINCIPLES.map((item) => (
          <SurfaceCard key={item.title} className="space-y-2 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <AppIcon name={item.icon} size="sm" />
            </span>
            <p className="font-display text-sm font-bold text-foreground">{item.title}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{item.text}</p>
          </SurfaceCard>
        ))}
      </div>

      <GuestOrderRecoveryCard
        title="Vincular pedidos invitados"
        description="Verifica tu celular por SMS para traer pedidos y envíos de sesión invitada desde otro dispositivo. Requiere el mismo número usado al pedir."
      />

      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Recuperar cuenta</SectionTitle>
        <p className="text-sm text-muted-foreground">
          Te enviaremos un enlace seguro al correo registrado. Nadie de UrabApp te pedirá tu contraseña por WhatsApp.
        </p>
        <Input label="Correo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly className="opacity-80" />
        <Button onClick={handleReset} loading={loading} variant="outline">Enviar enlace</Button>
      </SurfaceCard>

      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Cambiar contraseña</SectionTitle>
        <p className="text-sm text-muted-foreground">Mínimo 8 caracteres, con letras y números.</p>
        <Input label="Nueva contraseña" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} autoComplete="new-password" />
        <Input label="Confirmar" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
        <Button onClick={handleUpdatePassword} loading={loading}>Actualizar contraseña</Button>
      </SurfaceCard>

      <SurfaceCard className="space-y-2 p-5 text-sm">
        <SectionTitle>Legal y privacidad</SectionTitle>
        <Link to="/legal/privacidad" className="block text-primary hover:underline">Política de privacidad</Link>
        <Link to="/legal/terminos" className="block text-primary hover:underline">Términos y condiciones</Link>
        <Link to="/legal/cookies" className="block text-primary hover:underline">Cookies</Link>
        <Link to="/soporte" className="mt-2 inline-block text-xs font-semibold text-muted-foreground hover:text-primary">
          Reportar actividad sospechosa →
        </Link>
      </SurfaceCard>
    </div>
  );
}
