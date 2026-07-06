import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { signInWithPassword, signUpWithPassword, getProfile } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/utils/toast';
import { isSupabaseConfigured } from '@/lib/supabase';

/**
 * Paso previo al registro de comercio o mensajero — cuenta con email + contraseña.
 */
export default function JoinAuthPanel({
  title = 'Crea tu cuenta Urabapp',
  subtitle = 'Con email y contraseña. Luego completas tu registro.',
  loginHint = '¿Ya tienes cuenta? Inicia sesión abajo.',
}) {
  const { user, setUser, setProfile } = useAuthStore();
  const [mode, setMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      toast('Supabase no configurado', 'error');
      return;
    }
    if (password.length < 8) {
      toast('La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { session, user: newUser } = await signUpWithPassword(email, password, { full_name: email.split('@')[0] });
        if (!session) {
          toast('Revisa tu correo para confirmar la cuenta, luego inicia sesión', 'info');
          setMode('login');
          return;
        }
        setUser(session.user ?? newUser);
      } else {
        const { session } = await signInWithPassword(email, password);
        setUser(session.user);
      }
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.id) {
        try {
          const profile = await getProfile(currentUser.id);
          if (profile) setProfile(profile);
        } catch {
          /* useAuth completará el perfil */
        }
      }
      toast(mode === 'signup' ? 'Cuenta creada' : 'Sesión iniciada');
    } catch (err) {
      toast(err.message || 'No se pudo entrar', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SurfaceCard className="space-y-4 border-primary/20 bg-primary/[0.03]">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex gap-2">
        {[
          { id: 'signup', label: 'Crear cuenta' },
          { id: 'login', label: 'Ya tengo cuenta' },
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
              mode === id ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          required
          autoComplete="email"
        />
        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
          required
          minLength={8}
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Procesando…' : mode === 'signup' ? 'Crear cuenta y continuar' : 'Entrar y continuar'}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        {loginHint}{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Otras formas de entrar
        </Link>
      </p>
    </SurfaceCard>
  );
}
