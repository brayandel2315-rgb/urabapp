import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import BrandLogo from '@/components/brand/BrandLogo';
import { BRAND } from '@/utils/constants';

/** Shell profesional compartido — login, registro, recuperar */
export default function AuthShell({
  children,
  backTo = '/',
  backLabel = 'Volver al inicio',
  compact = false,
}) {
  return (
    <div className="brand-splash-screen client-auth-screen min-h-[100dvh] px-4 py-6 sm:flex sm:items-center sm:justify-center sm:py-10">
      <div className={`relative z-10 w-full ${compact ? 'max-w-md' : 'max-w-lg'}`}>
        <Link
          to={backTo}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 transition-colors hover:text-white"
        >
          <AppIcon name="back" size="sm" />
          {backLabel}
        </Link>

        <div className="overflow-hidden rounded-3xl border border-[#D5E3EF] bg-white shadow-lift">
          <div className="border-b border-[#E8F1F8] bg-gradient-to-br from-[#E6F4FF]/80 via-white to-white px-6 pb-5 pt-6 text-center">
            <BrandLogo variant="auth" className="mx-auto" />
            <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-primary">
              {BRAND.shortTagline}
            </p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-[#0D2B45] sm:text-3xl">
              {BRAND.name}
            </h1>
          </div>
          <div className="p-5 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
