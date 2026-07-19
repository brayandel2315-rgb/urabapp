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
      <div
        className="flex gap-2 overflow-x-auto hide-scrollbar"
        role="tablist"
        aria-label="Crecimiento de tienda"
      >
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={subTab === t.id}
            onClick={() => setSubTab(t.id)}
            className={cn(
              'urab-chip-tab flex-1 text-center',
              subTab === t.id
                ? 'urab-chip-tab--active'
                : 'urab-chip-tab--idle border border-border',
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
