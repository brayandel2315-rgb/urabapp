import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/design-system/ui/command';
import AppIcon from '@/design-system/icons/AppIcon';
import { globalSearch } from '@/services/search.service';
import { useCatalogLocation } from '@/hooks/useCatalogLocation';

import { useAuthStore } from '@/store/authStore';
import { getCommandNavItems } from '@/app/roleConfig';

import { CLIENT_NAV_LINKS } from '@/app/clientNav';
import { STORE } from '@/utils/marketplace-copy';

const BASE_NAV_ITEMS = [
  ...CLIENT_NAV_LINKS.map((link) => ({
    label: link.label,
    to: link.to,
    icon: link.icon,
  })),
  { label: 'Carrito', to: '/carrito', icon: 'cart' },
  { label: 'Perfil', to: '/cuenta/perfil', icon: 'profile' },
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { catalog, getBusinessesParams, activeMunicipio } = useCatalogLocation();
  const profileRole = useAuthStore((s) => s.profile?.role);
  const navItems = useMemo(() => (
    profileRole
      ? [...BASE_NAV_ITEMS, ...getCommandNavItems(profileRole).filter((i) => !BASE_NAV_ITEMS.some((b) => b.to === i.to))]
      : BASE_NAV_ITEMS
  ), [profileRole]);

  const { data: results } = useQuery({
    queryKey: ['global-search', query, catalog.mode, activeMunicipio],
    queryFn: () => globalSearch({ q: query, municipio: activeMunicipio, catalog, getBusinessesParams }),
    enabled: open && query.trim().length >= 2,
    staleTime: 15_000,
  });

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const run = useCallback((to) => {
    setOpen(false);
    setQuery('');
    navigate(to);
  }, [navigate]);

  const businesses = results?.businesses ?? [];
  const products = results?.products ?? [];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder={`Buscar ${STORE.manyLower}, productos, páginas…`}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {query.length < 2 ? 'Escribe al menos 2 letras' : 'Sin resultados'}
        </CommandEmpty>
        {businesses.length > 0 && (
          <CommandGroup heading={STORE.many}>
            {businesses.map((item) => (
              <CommandItem key={item.id} onSelect={() => run(item.to)}>
                <AppIcon name={item.emoji || 'store'} size="sm" />
                {item.name}
                <span className="ml-auto text-xs text-muted">{item.municipio}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {products.length > 0 && (
          <CommandGroup heading="Productos">
            {products.map((item) => (
              <CommandItem key={item.id} onSelect={() => run(item.to)}>
                <AppIcon name={item.emoji || 'food'} size="sm" />
                {item.name}
                <span className="ml-auto text-xs text-muted">{item.businessName}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        <CommandGroup heading="Navegación">
          {navItems.map((item) => (
            <CommandItem key={item.to + item.label} onSelect={() => run(item.to)}>
              <AppIcon name={item.icon} size="sm" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
