import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import {
  signInWithEmail,
  signInWithGoogle,
  signInWithPhone,
  verifyPhoneOtp,
  signInWithPassword,
  signUpWithPassword,
  getProfile,
} from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { getPostLoginPath } from '../app/roleConfig';
import { safeRedirectPath } from '../utils/validate';
import { isSupabaseConfigured } from '../lib/supabase';
import { BRAND } from '../utils/constants';
import { STORE } from '../utils/marketplace-copy';
import { toast } from '../utils/toast';
import { isGoogleAuthEnabled, isGoogleDisabledMessage } from '../utils/auth-providers';
import { withTimeout } from '../utils/async';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import AppIcon from '@/design-system/icons/AppIcon';
import logo from '../assets/logo/logo-icon.svg';
import { DEMO_ACCOUNTS, getDemoPassword, isDemoAccessEnabled } from '../config/demo-accounts';
import { useClientLightTheme } from '@/hooks/useClientLightTheme';

function readOAuthError() {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const raw = search.get('error_description')
    || hash.get('error_description')
    || search.get('error')
    || hash.get('error');
  if (!raw) return null;
  const decoded = decodeURIComponent(raw.replace(/\+/g, ' '));
  try {
    const parsed = JSON.parse(decoded);
    return parsed.msg || parsed.error_description || decoded;
  } catch {
    return decoded;
  }
}

export default function Login() {
  const [mode, setMode] = useState('password');
  const [passwordMode, setPasswordMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [normalizedPhone, setNormalizedPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const redirectTo = safeRedirectPath(redirectParam, '/cuenta/perfil');
  const { setUser, setProfile } = useAuthStore();

  useClientLightTheme();

  useEffect(() => {
    const oauthError = readOAuthError();
    if (!oauthError) return;
    if (isGoogleDisabledMessage(oauthError)) {
      toast('Google no está habilitado en Supabase. Usa email y contraseña.', 'error');
    } else {
      toast(oauthError, 'error');
    }
    window.history.replaceState({}, '', window.location.pathname + window.location.search.replace(/[?&]error[^&]*/g, '').replace(/^&/, '?'));
  }, []);

  const finishLogin = async (session) => {
    if (!session?.user) throw new Error('No se pudo iniciar sesión');
    setUser(session.user);
    // Perfil en segundo plano (useAuth); lectura rápida tras liberar el lock de auth.
    let profile;
    try {
      profile = await withTimeout(getProfile(session.user.id), 6_000, 'Perfil no disponible aún');
    } catch {
      profile = useAuthStore.getState().profile;
    }
    if (profile) setProfile(profile);
    toast('¡Bienvenido!');
    navigate(getPostLoginPath(redirectParam, profile?.role));
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      toast('Configura .env.local con credenciales Supabase', 'error');
      return;
    }
    if (password.length < 8) {
      toast('La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }
    setLoading(true);
    try {
      if (passwordMode === 'signup') {
        const { session, user: newUser } = await signUpWithPassword(email, password, {
          full_name: email.split('@')[0],
        });
        if (!session) {
          toast('Cuenta creada. Revisa tu correo para confirmar y luego entra con contraseña.', 'info');
          setPasswordMode('login');
          return;
        }
        await finishLogin(session ?? { user: newUser });
        return;
      }
      const { session } = await signInWithPassword(email, password);
      await finishLogin(session);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (account) => {
    if (!isSupabaseConfigured) {
      toast('Supabase no configurado', 'error');
      return;
    }
    setLoading(true);
    try {
      const pwd = getDemoPassword();
    if (!pwd) throw new Error('Contraseña demo no configurada');
    const { session } = await signInWithPassword(account.email, pwd);
      if (!session?.user) throw new Error('No se pudo iniciar sesión');
      setUser(session.user);
      try {
        const demoProfile = await withTimeout(getProfile(session.user.id), 6_000, 'Perfil no disponible');
        if (demoProfile) setProfile(demoProfile);
      } catch {
        /* perfil opcional */
      }
      toast(`Sesión ${account.label}`);
      navigate(account.redirect);
    } catch (err) {
      toast(err.message || `No se pudo entrar como ${account.label}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      toast('Configura .env.local con credenciales Supabase', 'error');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmail(email, redirectTo);
      toast('Revisa tu correo para entrar');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSend = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      toast('Configura .env.local con credenciales Supabase', 'error');
      return;
    }
    setLoading(true);
    try {
      const normalized = await signInWithPhone(phone);
      setNormalizedPhone(normalized);
      setOtpSent(true);
      toast('Código enviado por SMS');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyPhoneOtp(normalizedPhone || phone, otp);
      toast('¡Bienvenido!');
      const nextProfile = useAuthStore.getState().profile;
      navigate(getPostLoginPath(redirectParam, nextProfile?.role));
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!isSupabaseConfigured) {
      toast('Configura .env.local con credenciales Supabase', 'error');
      return;
    }
    try {
      await signInWithGoogle(redirectTo);
    } catch (err) {
      const msg = err.message || '';
      if (isGoogleDisabledMessage(msg)) {
        toast('Google no está habilitado en Supabase. Usa email y contraseña.', 'error');
      } else {
        toast(msg, 'error');
      }
    }
  };

  return (
    <div className="brand-splash-screen client-auth-screen flex items-center justify-center p-4" data-role="client">
      <div className="relative z-10 w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-white/90 hover:text-white"
        >
          <AppIcon name="home" size="sm" /> Volver
        </button>

        <SurfaceCard className="space-y-5 border border-[#D5E3EF] bg-white shadow-lift">
          <div className="flex flex-col items-center text-center">
            <img src={logo} alt={BRAND.name} className="h-20 w-20 rounded-full object-cover ring-4 ring-primary/25 shadow-lift" />
            <p className="text-label mt-4 text-[#4A6278]">{BRAND.shortTagline}</p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#0D2B45]">{BRAND.name}</h1>
            <p className="mt-2 text-sm text-[#4A6278]">{BRAND.tagline}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'password', label: 'Contraseña' },
              { id: 'email', label: 'Enlace email' },
              { id: 'phone', label: 'Celular' },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => { setMode(id); setOtpSent(false); }}
                className={`rounded-xl py-2.5 text-xs font-semibold transition-colors sm:text-sm ${
                  mode === id ? 'bg-primary text-primary-foreground shadow-soft' : 'bg-[#E6F4FF] text-[#4A6278] hover:bg-[#D5EBFF]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {isGoogleAuthEnabled() ? (
            <>
              <Button variant="secondary" className="w-full" onClick={handleGoogle}>
                Entrar con Google
              </Button>
              <div className="relative text-center">
                <span className="bg-white px-3 text-xs text-[#4A6278]">o continúa con</span>
              </div>
            </>
          ) : (
            <p className="rounded-xl bg-[#E6F4FF] px-3 py-2 text-center text-xs text-[#4A6278]">
              Entra con <strong className="text-[#0D2B45]">email y contraseña</strong> abajo. Google se activará cuando esté disponible en la plataforma.
            </p>
          )}

          {mode === 'password' && (
            <form onSubmit={handlePassword} className="space-y-4">
              <div className="flex gap-2">
                {[
                  { id: 'login', label: 'Entrar' },
                  { id: 'signup', label: 'Crear cuenta' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPasswordMode(id)}
                    className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
                      passwordMode === id ? 'bg-primary/15 text-primary' : 'bg-[#E6F4FF] text-[#4A6278]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
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
                autoComplete={passwordMode === 'signup' ? 'new-password' : 'current-password'}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? 'Procesando…'
                  : passwordMode === 'signup'
                    ? 'Crear cuenta'
                    : 'Entrar'}
              </Button>
            </form>
          )}

          {mode === 'phone' ? (
            otpSent ? (
              <form onSubmit={handlePhoneVerify} className="space-y-4">
                <Input label="Código SMS" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" required />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Verificando...' : 'Confirmar código'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePhoneSend} className="space-y-4">
                <Input label="Celular" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="3001234567" required />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar código SMS'}
                </Button>
              </form>
            )
          ) : mode === 'email' ? (
            <form onSubmit={handleEmail} className="space-y-4">
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@correo.com" required />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar enlace mágico'}
              </Button>
              <p className="text-xs text-[#4A6278]">Si es tu primera vez, el enlace crea la cuenta automáticamente.</p>
            </form>
          ) : null}

          {isDemoAccessEnabled() ? (
          <SurfaceCard className="space-y-2 border-dashed border-primary/25 bg-[#E6F4FF]/50 p-3 text-xs text-[#4A6278]">
            <p className="font-semibold text-[#0D2B45]">Acceso equipo (demo)</p>
            <p>Escenarios de prueba internos. No compartir en público.</p>
            <div className="mt-2 grid gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <Button
                  key={account.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-auto w-full flex-col items-start gap-0.5 py-2 text-left"
                  disabled={loading}
                  onClick={() => handleDemoLogin(account)}
                >
                  <span className="text-sm font-semibold text-[#0D2B45]">{account.label}</span>
                  <span className="text-xs font-normal text-[#4A6278]">{account.description}</span>
                </Button>
              ))}
            </div>
          </SurfaceCard>
          ) : null}

          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-center text-xs">
            <Link to="/negocio/onboarding" className="font-semibold text-primary">{STORE.register}</Link>
            <span className="text-[#4A6278]">·</span>
            <Link to="/domiciliario/registro" className="font-semibold text-primary">Ser mensajero</Link>
          </div>

          <Link to="/recuperar-cuenta" className="block text-center text-sm text-[#4A6278] hover:text-primary">
            ¿Olvidaste tu contraseña?
          </Link>
          <Link to="/" className="block text-center text-sm font-semibold text-primary">
            Continuar sin entrar →
          </Link>
        </SurfaceCard>
      </div>
    </div>
  );
}
