import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getRoleLabel } from '@/app/roleConfig';
import { ROLES } from '@/utils/constants';
import { cn } from '@/lib/utils';

function initialsFrom(name, email) {
  const base = (name || email || '?').trim();
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

export default function AccountUserCard({ className, showEditLink = false, compact = false }) {
  const { user, profile } = useAuthStore();
  if (!user) return null;

  const name = profile?.full_name || 'Usuario';
  const email = profile?.email || user.email;
  const role = profile?.role || ROLES.CLIENT;

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border border-[#D5E3EF] bg-white p-4 shadow-card',
        compact && 'p-3',
        className,
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full bg-[#0E6BA8] font-display font-bold text-white',
          compact ? 'h-10 w-10 text-sm' : 'h-12 w-12 text-base',
        )}
        aria-hidden
      >
        {initialsFrom(name, email)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base font-bold text-[#0D2B45] sm:text-lg">
          {name}
        </p>
        <p className="truncate text-sm text-[#4A6278]">{email}</p>
        {!compact && (
          <p className="mt-1 text-xs font-medium text-[#0E6BA8]">{getRoleLabel(role)}</p>
        )}
      </div>
      {showEditLink && (
        <Link
          to="/cuenta/datos"
          className="shrink-0 text-sm font-semibold text-[#0E6BA8]"
        >
          Editar
        </Link>
      )}
    </div>
  );
}
