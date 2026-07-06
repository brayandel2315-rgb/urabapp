import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/design-system/layouts/PageLayout';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { resetPassword } from '@/services/auth.service';
import { toast } from '@/utils/toast';

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
    <PageLayout title="Recuperar cuenta" backTo="/login" maxWidth="sm">
      <SurfaceCard className="space-y-4 border border-[#D5E3EF] bg-white p-6">
        {sent ? (
          <>
            <p className="text-sm text-[#0D2B45]">Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.</p>
            <Button as={Link} to="/login" variant="outline">Volver al login</Button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-[#4A6278]">Ingresa el correo de tu cuenta UrabApp.</p>
            <Input label="Correo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit" loading={loading} className="w-full">Enviar enlace</Button>
          </form>
        )}
      </SurfaceCard>
    </PageLayout>
  );
}
