import { useQuery } from '@tanstack/react-query';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { useAuthStore } from '@/store/authStore';
import { getWallet, getWalletTransactions } from '@/services/wallet.service';
import { formatCOP } from '@/utils/currency';

export default function AccountCreditsPage() {
  const { user } = useAuthStore();
  const { data: wallet } = useQuery({
    queryKey: ['wallet', user?.id],
    queryFn: () => getWallet(user.id),
    enabled: !!user?.id,
  });
  const { data: transactions = [] } = useQuery({
    queryKey: ['wallet-tx', user?.id],
    queryFn: () => getWalletTransactions(user.id),
    enabled: !!user?.id,
  });

  if (!user) return <p className="text-sm text-muted-foreground">Inicia sesión para ver créditos.</p>;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <SurfaceCard className="p-4 text-center">
          <p className="text-xs text-muted-foreground">Saldo</p>
          <p className="font-display text-2xl font-bold text-primary">{formatCOP(wallet?.balance ?? 0)}</p>
        </SurfaceCard>
        <SurfaceCard className="p-4 text-center">
          <p className="text-xs text-muted-foreground">Puntos</p>
          <p className="font-display text-2xl font-bold">{wallet?.points ?? 0}</p>
        </SurfaceCard>
        <SurfaceCard className="p-4 text-center">
          <p className="text-xs text-muted-foreground">Cashback pendiente</p>
          <p className="font-display text-2xl font-bold text-secondary">{formatCOP(wallet?.cashback_pending ?? 0)}</p>
        </SurfaceCard>
      </div>

      <SurfaceCard className="space-y-3 p-5">
        <SectionTitle>Historial</SectionTitle>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Gana créditos con pedidos y UrabApp Pro.</p>
        ) : (
          <ul className="divide-y divide-border text-sm">
            {transactions.map((tx) => (
              <li key={tx.id} className="flex justify-between py-2">
                <div>
                  <p className="font-medium">{tx.description || tx.type}</p>
                  <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString('es-CO')}</p>
                </div>
                <span className={tx.type === 'debit' ? 'text-destructive' : 'text-primary'}>
                  {tx.amount ? (tx.type === 'debit' ? '-' : '+') + formatCOP(tx.amount) : `+${tx.points} pts`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SurfaceCard>
    </div>
  );
}
