import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import AppIcon from '@/design-system/icons/AppIcon';
import AuthLegalConsent from '@/components/legal/AuthLegalConsent';
import { signInWithPassword, signUpWithPassword, getProfile } from '@/services/auth.service';
import { recordRequiredSignupConsents } from '@/services/legal.service';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/utils/toast';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getAuthIntentMeta, AUTH_INTENT } from '@/auth/auth-intents';
import { buildAuthEntryUrl } from '@/utils/auth-routes';

/**
 * Registro / login para comercio o domiciliario — paso previo al onboarding.
 */
export default function JoinAuthPanel({
  intent = AUTH_INTENT.BUSINESS,
  title,
  subtitle,
  redirectPath,
  defaultMode = 'signup',
  onAuthenticated,
  embedded = true,
}) {
  const meta = getAuthIntentMeta(intent);
  const { user, setUser, setProfile } = useAuthStore();
  const [mode, setMode] = useState(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);

  if (user && embedded) return null;

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
    if (mode === 'signup' && !legalAccepted) {
      toast('Debes autorizar el tratamiento de datos (Ley 1581) para continuar', 'error');
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
        await recordRequiredSignupConsents((session.user ?? newUser)?.id).catch(() => {});
      } else {
        const { session } = await signInWithPassword(email, password);
        setUser(session.user);
      }
      let profile = null;
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.id) {
        try {
          profile = await getProfile(currentUser.id);
          if (profile) setProfile(profile);
        } catch {
          /* useAuth completará el perfil */
        }
      }
      toast(mode === 'signup' ? 'Cuenta creada — sigue con tu registro' : 'Sesión iniciada');
      onAuthenticated?.(profile);
    } catch (err) {
      toast(err.message || 'No se pudo entrar', 'error');
    } finally {
      setLoading(false);
    }
  };

  const panelTitle = title || (mode === 'signup' ? meta.signupTitle : meta.loginTitle);
  const panelSubtitle = subtitle || `Paso 1 de 2 · Luego completas tu registro de ${meta.label.toLowerCase()}.`;

  return (
    <div className="space-y-4 rounded-2xl border border-primary/20 bg-primary/[0.03] p-4">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Paso 1 · Tu cuenta Urabapp</p>
        <h3 className="font-display text-lg font-bold text-foreground">{panelTitle}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{panelSubtitle}</p>
      </div>

      <ol className="space-y-2 rounded-xl bg-muted/30 p-3 text-xs text-muted-foreground">
        <li className="flex gap-2">
          <span className="font-bold text-primary">1.</span>
          Crea o entra con email y contraseña (ahora)
        </li>
        <li className="flex gap-2">
          <span className="font-bold text-primary">2.</span>
          Completas el registro de {meta.label.toLowerCase()} en la siguiente pantalla
        </li>
      </ol>

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
        {mode === 'signup' && (
          <AuthLegalConsent
            id="join-auth-legal-consent"
            accepted={legalAccepted}
            onChange={setLegalAccepted}
          />
        )}
        <Button type="submit" className="w-full" disabled={loading || (mode === 'signup' && !legalAccepted)}>
          <AppIcon name="profile" size="sm" className="mr-2" />
          {loading
            ? 'Procesando…'
            : mode === 'signup'
              ? `Crear cuenta y continuar como ${meta.label.toLowerCase()}`
              : 'Entrar y continuar'}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        ¿Eres cliente y solo quieres pedir?{' '}
        <Link
          to={buildAuthEntryUrl({ basePath: '/registro', redirect: redirectPath, intent: AUTH_INTENT.CLIENT, mode: 'signup' })}
          className="font-semibold text-primary hover:underline"
        >
          Registro de cliente
        </Link>
      </p>
    </div>
  );
}
