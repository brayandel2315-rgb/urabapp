import { cn } from '@/lib/utils';

function initialsFrom(name, email) {
  const base = (name || email || '?').trim();
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

const SIZE_CLASS = {
  bottomNav: 'h-6 w-6 text-[9px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-10 w-10 text-sm',
};

const ONLINE_DOT_CLASS = {
  bottomNav: 'h-2 w-2 border',
  sm: 'h-2.5 w-2.5 border-2',
  md: 'h-2.5 w-2.5 border-2',
  lg: 'h-3 w-3 border-2',
};

export function getClientAvatarUrl(profile, user) {
  return profile?.avatar_url || user?.user_metadata?.avatar_url || null;
}

export default function ClientUserAvatar({
  profile,
  user,
  size = 'md',
  showOnline = false,
  active = false,
  className,
}) {
  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email || '';
  const avatarUrl = getClientAvatarUrl(profile, user);
  const initials = initialsFrom(name, user?.email);
  const sizeClass = SIZE_CLASS[size] || SIZE_CLASS.md;
  const dotClass = ONLINE_DOT_CLASS[size] || ONLINE_DOT_CLASS.md;

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          className={cn(
            'rounded-full object-cover',
            sizeClass,
            active && 'ring-2 ring-[#2E7D32] ring-offset-1',
          )}
        />
      ) : (
        <span
          className={cn(
            'flex items-center justify-center rounded-full bg-[#2E7D32] font-display font-bold text-white',
            sizeClass,
            active && 'ring-2 ring-[#2E7D32] ring-offset-1',
          )}
          aria-hidden
        >
          {initials}
        </span>
      )}
      {showOnline && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-white bg-[#22C55E]',
            dotClass,
          )}
          aria-hidden
        />
      )}
    </span>
  );
}
