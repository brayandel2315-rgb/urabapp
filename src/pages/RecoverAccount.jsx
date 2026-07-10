import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { resetPassword } from '@/services/auth.service';
import { toast } from '@/utils/toast';
import AuthShell from '@/components/auth/AuthShell';
import { buildAuthEntryUrl } from '@/utils/auth-routes';
import { AUTH_INTENT } from '@/auth/auth-intents';

export default function RecoverAccountPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast('Revisa tu correo');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell backTo={buildAuthEntryUrl({ basePath: '/login', intent: AUTH_INTENT.CLIENT })} backLabel="Volver a entrar">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="font-display text-xl font-bold text-[#0D2B45]">Recuperar contraseña</h2>
          <p className="mt-2 text-sm text-[#4A6278]">
            Te enviamos un enlace al correo de tu cuenta Urabapp.
          </p>
        </div>

        {sent ? (
          <>
            <p className="rounded-xl bg-[#E6F4FF] p-4 text-sm text-[#0D2B45]">
              Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.
            </p>
            <Button asChild className="w-full" variant="outline">
              <Link to={buildAuthEntryUrl({ basePath: '/login', intent: AUTH_INTENT.CLIENT })}>Volver a entrar</Link>
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Correo de tu cuenta" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit" loading={loading} className="w-full">Enviar enlace</Button>
          </form>
        )}

        <p className="text-center text-xs text-[#4A6278]">
          ¿No tienes cuenta?{' '}
          <Link to={buildAuthEntryUrl({ basePath: '/registro', intent: AUTH_INTENT.CLIENT, mode: 'signup' })} className="font-semibold text-primary">
            Crear cuenta
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
