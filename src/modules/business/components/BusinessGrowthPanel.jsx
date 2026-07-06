import { useState } from 'react';
import { cn } from '@/lib/utils';
import BusinessOffersPanel from './BusinessOffersPanel';
import BusinessCrmPanel from './BusinessCrmPanel';

const SUB_TABS = [
  { id: 'ofertas', label: 'Ofertas' },
  { id: 'clientes', label: 'Clientes' },
];

export default function BusinessGrowthPanel({ business }) {
  const [subTab, setSubTab] = useState('ofertas');

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-2xl bg-muted/40 p-1">
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSubTab(t.id)}
            className={cn(
              'flex-1 rounded-xl py-2 text-sm font-semibold transition-colors',
              subTab === t.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted hover:text-foreground',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {subTab === 'ofertas' ? (
        <BusinessOffersPanel business={business} />
      ) : (
        <BusinessCrmPanel business={business} />
      )}
    </div>
  );
}
