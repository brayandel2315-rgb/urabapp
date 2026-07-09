import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PanelHeader from '@/design-system/patterns/PanelHeader';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { useMyDriverProfile } from '@/hooks/useMyDriverProfile';
import { renderRiderProfileGate } from '../components/RiderProfileGate';
import { getCourierWalletSummary, getCourierPayouts, requestCourierPayout } from '@/services/courier-panel.service';
import { formatCOP } from '@/utils/currency';
import { MetricCard, MetricGrid } from '@/design-system/patterns/MetricCard';
import { toast } from '@/utils/toast';
import { Link } from 'react-router-dom';

const MIN_PAYOUT = 20000;

export default function RiderEarnings() {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('ahorros');
  const [accountHolder, setAccountHolder] = useState('');

  const driverQuery = useMyDriverProfile();
  const { data: driver } = driverQuery;

  const { data: wallet } = useQuery({
    queryKey: ['courier-wallet', driver?.id],
    queryFn: getCourierWalletSummary,
    enabled: !!driver?.id,
    refetchInterval: 30000,
  });

  const { data: payouts = [] } = useQuery({
    queryKey: ['courier-payouts', driver?.id],
    queryFn: () => getCourierPayouts(driver.id),
    enabled: !!driver?.id,
  });

  const payoutMutation = useMutation({
    mutationFn: () => requestCourierPayout({
      amount: Number(amount),
      bankName,
      accountNumber,
      accountType,
      accountHolder: accountHolder || undefined,
    }),
    onSuccess: () => {
      toast('Solicitud de retiro enviada. Te pagamos en 1–3 días hábiles.');
      setAmount('');
      queryClient.invalidateQueries({ queryKey: ['courier-wallet'] });
      queryClient.invalidateQueries({ queryKey: ['courier-payouts'] });
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const available = Number(wallet?.wallet?.balance_available ?? 0);
  const pending = Number(wallet?.wallet?.balance_pending ?? 0);

  const blocked = renderRiderProfileGate(driverQuery, { compactMissing: true });
  if (blocked) return blocked;

  return (
    <div className="space-y-4">
      <PanelHeader tag="Ganancias" title="Tu billetera" subtitle="Ingresos y retiros bancarios" />

      <MetricGrid className="grid-cols-2">
        <MetricCard label="Hoy" value={formatCOP(wallet?.today ?? 0)} icon="money" accent trend="Ganancia del día" />
        <MetricCard label="Semana" value={formatCOP(wallet?.week ?? 0)} icon="calendar" trend="Lunes a hoy" />
        <MetricCard label="Mes" value={formatCOP(wallet?.month ?? 0)} icon="chart" trend="Mes en curso" />
        <MetricCard label="Pendiente" value={formatCOP(pending)} icon="clock" trend="Liquidación semanal UrabApp" />
      </MetricGrid>

      <SurfaceCard>
        <SectionTitle>Saldo disponible</SectionTitle>
        <p className="mt-2 font-display text-3xl font-bold text-primary">{formatCOP(available)}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Pendiente: {formatCOP(pending)} · Total histórico: {formatCOP(wallet?.wallet?.total_earned ?? 0)}
        </p>
        {wallet?.next_settlement_date && (
          <p className="mt-1 text-xs text-primary">
            Próxima liquidación: {new Date(wallet.next_settlement_date).toLocaleDateString('es-CO')}
          </p>
        )}
      </SurfaceCard>

      <SurfaceCard className="space-y-3">
        <SectionTitle>Solicitar retiro</SectionTitle>
        <p className="text-xs text-muted-foreground">Mínimo {formatCOP(MIN_PAYOUT)} · Transferencia a cuenta colombiana</p>
        <Input
          label="Monto a retirar"
          type="number"
          min={MIN_PAYOUT}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={String(MIN_PAYOUT)}
        />
        <Input label="Banco" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Ej. Bancolombia" />
        <Input label="Número de cuenta" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
        <div>
          <label className="text-sm font-medium">Tipo de cuenta</label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="ahorros">Ahorros</option>
            <option value="corriente">Corriente</option>
          </select>
        </div>
        <Input label="Titular (opcional)" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} />
        <Button
          className="w-full"
          loading={payoutMutation.isPending}
          disabled={!amount || Number(amount) < MIN_PAYOUT || !bankName || !accountNumber}
          onClick={() => payoutMutation.mutate()}
        >
          Solicitar retiro
        </Button>
      </SurfaceCard>

      <SurfaceCard>
        <SectionTitle>Historial de retiros</SectionTitle>
        {payouts.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Sin retiros registrados aún.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {payouts.map((p) => (
              <li key={p.id} className="flex justify-between rounded-xl bg-muted/30 px-3 py-2 text-sm">
                <div>
                  <p>{new Date(p.created_at).toLocaleDateString('es-CO')}</p>
                  <p className="text-xs text-muted-foreground capitalize">{p.status} · {p.bank_name || 'Transferencia'}</p>
                </div>
                <span className="font-bold">{formatCOP(p.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </SurfaceCard>

      <Link to="/domiciliario">
        <Button variant="outline" className="w-full">Volver a entregas</Button>
      </Link>
    </div>
  );
}
