import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  signInWithEmail,
  signInWithGoogle,
  signInWithPhone,
  verifyPhoneOtp,
  signInWithPassword,
  signUpWithPassword,
  getProfile,
} from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { safeRedirectPath } from '@/utils/validate';
import { isSupabaseConfigured } from '@/lib/supabase';
import { toast } from '@/utils/toast';
import { isGoogleAuthEnabled, isGoogleDisabledMessage } from '@/utils/auth-providers';
import { withTimeout } from '@/utils/async';
import { DEMO_ACCOUNTS, getDemoPassword, isDemoAccessEnabled } from '@/config/demo-accounts';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { AUTH_INTENT } from '@/auth/auth-intents';
import { getPostAuthPath } from '@/auth/post-auth-path';
import { buildAuthEntryUrl, parseAuthSearchParams } from '@/utils/auth-routes';
import AuthShell from '@/components/auth/AuthShell';
import AuthRolePicker from '@/components/auth/AuthRolePicker';
import AuthIntentHeader from '@/components/auth/AuthIntentHeader';
import AuthEntryFeedback from '@/components/auth/AuthEntryFeedback';
import JoinAuthPanel from '@/components/auth/JoinAuthPanel';
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
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isRegisterPath = location.pathname === '/registro';
  const parsed = parseAuthSearchParams(searchParams);
  const intent = parsed.intent;
  const redirectTo = parsed.redirect;
  const initialMode = isRegisterPath ? 'signup' : parsed.mode;

  const [step, setStep] = useState(intent ? 'auth' : 'pick');
  const [activeIntent, setActiveIntent] = useState(intent);
  const [mode, setMode] = useState('password');
  const [passwordMode, setPasswordMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [normalizedPhone, setNormalizedPhone] = useState('');
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (intent) {
      setActiveIntent(intent);
      setStep('auth');
    }
  }, [intent]);

  const updateUrl = (nextIntent, nextMode = passwordMode) => {
    const base = isRegisterPath ? '/registro' : '/login';
    navigate(buildAuthEntryUrl({
      basePath: base,
      redirect: redirectTo,
      intent: nextIntent,
      mode: nextMode,
    }), { replace: true });
  };

  const handleSelectIntent = (nextIntent) => {
    setActiveIntent(nextIntent);
    setStep('auth');
    setPasswordMode(isRegisterPath ? 'signup' : parsed.mode);
    updateUrl(nextIntent, isRegisterPath ? 'signup' : parsed.mode);
  };

  const handleChangeRole = () => {
    setStep('pick');
    setActiveIntent(null);
    const base = isRegisterPath ? '/registro' : '/login';
    navigate(buildAuthEntryUrl({ basePath: base, redirect: redirectTo }), { replace: true });
  };

  const finishLogin = async (session) => {
    if (!session?.user) throw new Error('No se pudo iniciar sesión');
    setUser(session.user);
    let profile;
    try {
      profile = await withTimeout(getProfile(session.user.id), 6_000, 'Perfil no disponible aún');
    } catch {
      profile = useAuthStore.getState().profile;
    }
    if (profile) setProfile(profile);
    toast('¡Bienvenido!');
    navigate(getPostAuthPath({
      intent: activeIntent || AUTH_INTENT.CLIENT,
      redirectPath: searchParams.get('redirect'),
      profileRole: profile?.role,
    }));
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
    if (!isSupabaseConfigured) return;
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
      } catch { /* optional */ }
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
    if (!isSupabaseConfigured) return;
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
    if (!isSupabaseConfigured) return;
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
      navigate(getPostAuthPath({
        intent: activeIntent || AUTH_INTENT.CLIENT,
        redirectPath: searchParams.get('redirect'),
        profileRole: nextProfile?.role,
      }));
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!isSupabaseConfigured) return;
    try {
      await signInWithGoogle(safeRedirectPath(searchParams.get('redirect'), redirectTo));
    } catch (err) {
      const msg = err.message || '';
      if (isGoogleDisabledMessage(msg)) {
        toast('Google no está habilitado. Usa email y contraseña.', 'error');
      } else {
        toast(msg, 'error');
      }
    }
  };

  const isPartnerIntent = activeIntent === AUTH_INTENT.BUSINESS || activeIntent === AUTH_INTENT.RIDER;

  return (
    <AuthShell backTo="/" backLabel="Volver al inicio">
      {step === 'pick' ? (
        <>
          <AuthRolePicker onSelect={handleSelectIntent} selectedIntent={activeIntent} />
          <AuthEntryFeedback intent={null} step="picker" />
          <Link to="/" className="mt-5 block text-center text-sm font-semibold text-primary">
            Explorar sin cuenta →
          </Link>
        </>
      ) : (
        <>
          <AuthIntentHeader
            intent={activeIntent}
            mode={passwordMode}
            onChangeRole={handleChangeRole}
          />

          {isPartnerIntent ? (
            <JoinAuthPanel
              intent={activeIntent}
              redirectPath={redirectTo}
              defaultMode={passwordMode}
              onAuthenticated={(profile) => {
                navigate(getPostAuthPath({
                  intent: activeIntent,
                  redirectPath: searchParams.get('redirect'),
                  profileRole: profile?.role,
                }));
              }}
            />
          ) : (
            <>
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
                    className={`rounded-xl py-2.5 text-xs font-semibold sm:text-sm ${
                      mode === id ? 'bg-primary text-primary-foreground' : 'bg-[#E6F4FF] text-[#4A6278]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {isGoogleAuthEnabled() ? (
                <>
                  <Button variant="secondary" className="mt-4 w-full" onClick={handleGoogle}>
                    Continuar con Google
                  </Button>
                  <p className="relative my-3 text-center text-xs text-[#4A6278]">o continúa con</p>
                </>
              ) : (
                <p className="mt-4 rounded-xl bg-[#E6F4FF] px-3 py-2 text-center text-xs text-[#4A6278]">
                  Usa <strong>email y contraseña</strong> abajo.
                </p>
              )}

              {mode === 'password' && (
                <form onSubmit={handlePassword} className="space-y-4">
                  <div className="flex gap-2">
                    {[
                      { id: 'login', label: 'Ya tengo cuenta' },
                      { id: 'signup', label: 'Crear cuenta nueva' },
                    ].map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setPasswordMode(id);
                          updateUrl(activeIntent, id);
                        }}
                        className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
                          passwordMode === id ? 'bg-primary/15 text-primary' : 'bg-[#E6F4FF] text-[#4A6278]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                  <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete={passwordMode === 'signup' ? 'new-password' : 'current-password'} />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Procesando…' : passwordMode === 'signup' ? 'Crear mi cuenta de cliente' : 'Entrar'}
                  </Button>
                </form>
              )}

              {mode === 'phone' && (
                otpSent ? (
                  <form onSubmit={handlePhoneVerify} className="space-y-4">
                    <Input label="Código SMS" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                    <Button type="submit" className="w-full" disabled={loading}>Confirmar código</Button>
                  </form>
                ) : (
                  <form onSubmit={handlePhoneSend} className="space-y-4">
                    <Input label="Celular" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    <Button type="submit" className="w-full" disabled={loading}>Enviar código SMS</Button>
                  </form>
                )
              )}

              {mode === 'email' && (
                <form onSubmit={handleEmail} className="space-y-4">
                  <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <Button type="submit" className="w-full" disabled={loading}>Enviar enlace mágico</Button>
                  <p className="text-xs text-[#4A6278]">Si es tu primera vez, el enlace crea tu cuenta de cliente.</p>
                </form>
              )}

              {isDemoAccessEnabled() && (
                <SurfaceCard className="mt-4 space-y-2 border-dashed p-3 text-xs">
                  <p className="font-semibold text-[#0D2B45]">Acceso equipo (demo)</p>
                  <div className="grid gap-2">
                    {DEMO_ACCOUNTS.map((account) => (
                      <Button key={account.id} type="button" variant="outline" size="sm" disabled={loading} onClick={() => handleDemoLogin(account)}>
                        {account.label}
                      </Button>
                    ))}
                  </div>
                </SurfaceCard>
              )}
            </>
          )}

          <AuthEntryFeedback intent={activeIntent} step="auth" />

          <div className="mt-5 space-y-2 text-center text-sm">
            <Link to="/recuperar-cuenta" className="block text-[#4A6278] hover:text-primary">
              ¿Olvidaste tu contraseña?
            </Link>
            {!isRegisterPath && (
              <Link
                to={buildAuthEntryUrl({ basePath: '/registro', redirect: redirectTo, intent: activeIntent, mode: 'signup' })}
                className="block font-semibold text-primary"
              >
                ¿Primera vez? Crear cuenta →
              </Link>
            )}
            {isRegisterPath && (
              <Link
                to={buildAuthEntryUrl({ basePath: '/login', redirect: redirectTo, intent: activeIntent, mode: 'login' })}
                className="block font-semibold text-primary"
              >
                Ya tengo cuenta → Entrar
              </Link>
            )}
            <Link to="/" className="block text-[#4A6278] hover:text-primary">
              Continuar sin cuenta
            </Link>
          </div>
        </>
      )}
    </AuthShell>
  );
}
