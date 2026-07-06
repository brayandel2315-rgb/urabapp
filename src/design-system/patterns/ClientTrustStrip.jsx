import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';

/**
 * Banda de confianza — mismo patrón que RoleShell.securityNote en paneles operativos.
 */
export default function ClientTrustStrip({ className, compact = false }) {
  return (
    <div
      className={cn(
        'role-shell-security flex items-center gap-2 border-b border-primary/10 bg-primary/[0.06] text-foreground',
        compact ? 'px-3 py-1.5 text-[10px]' : 'px-4 py-2 text-xs',
        className
      )}
      role="status"
    >
      <AppIcon name="lock" size="xs" className="shrink-0 text-primary" />
      <span className="font-semibold leading-snug">
        Compra segura · datos cifrados · tu perfil no puede alterar roles ni beneficios de otros
      </span>
    </div>
  );
}
