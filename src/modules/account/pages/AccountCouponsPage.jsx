import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { useAuthStore } from '@/store/authStore';
import { getUserCoupons, assignWelcomeCoupon } from '@/services/wallet.service';
import { formatCOP } from '@/utils/currency';

export default function AccountCouponsPage() {
  const { user } = useAuthStore();
  const { data: coupons = [], refetch, isError, error } = useQuery({
    queryKey: ['user-coupons', user?.id],
    queryFn: () => getUserCoupons(user.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!user?.id) return;
    assignWelcomeCoupon(user.id).then(() => refetch()).catch(() => {});
  }, [user?.id, refetch]);

  if (!user) return <p className="text-sm text-muted-foreground">Inicia sesión para ver cupones.</p>;

  return (
    <SurfaceCard className="space-y-4 p-5">
      <SectionTitle>Mis cupones</SectionTitle>
      <p className="text-xs text-muted-foreground">
        Cupones asignados a tu cuenta y promociones públicas activas.
      </p>

      {isError && (
        <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {error?.message || 'No se pudieron cargar los cupones. Intenta de nuevo.'}
        </p>
      )}

      {!isError && coupons.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No tienes cupones activos. Revisa <Link to="/ofertas" className="font-semibold text-primary">Ofertas</Link>.
        </p>
      ) : (
        <ul className="space-y-2">
          {coupons.map((c) => (
            <li key={c.id} className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display font-bold text-primary">{c.code}</p>
                {c.is_personal && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                    Personal
                  </span>
                )}
              </div>
              <p className="text-sm">{c.description || 'Descuento UrabApp'}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {c.discount_type === 'percent' ? `${c.discount_value}%` : formatCOP(c.discount_value)} de descuento
                {c.min_order ? ` · Mín. ${formatCOP(c.min_order)}` : ''}
              </p>
              <p className="mt-2 text-[11px] font-medium text-secondary">
                Usa el código en checkout al confirmar tu pedido.
              </p>
            </li>
          ))}
        </ul>
      )}
    </SurfaceCard>
  );
}
