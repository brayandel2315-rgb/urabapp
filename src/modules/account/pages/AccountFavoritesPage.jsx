import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { useAuthStore } from '@/store/authStore';
import { getFavorites } from '@/services/favorites.service';
import AppIcon from '@/design-system/icons/AppIcon';

export default function AccountFavoritesPage() {
  const { user } = useAuthStore();
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => getFavorites(user.id),
    enabled: !!user?.id,
  });

  if (!user) return <p className="text-sm text-muted-foreground">Inicia sesión para ver favoritos.</p>;

  return (
    <SurfaceCard className="space-y-4 p-5">
      <SectionTitle>Favoritos</SectionTitle>
      {favorites.length === 0 ? (
        <p className="text-sm text-muted-foreground">Guarda comercios desde su página de tienda.</p>
      ) : (
        <ul className="space-y-2">
          {favorites.map((f) => (
            <li key={f.id}>
              {f.businesses ? (
                <Link to={`/tienda/${f.businesses.slug || f.businesses.id}`} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/50">
                  <AppIcon name={f.businesses.emoji || 'store'} size="sm" />
                  <div>
                    <p className="font-semibold">{f.businesses.name}</p>
                    <p className="text-xs text-muted-foreground">{f.businesses.municipio}</p>
                  </div>
                </Link>
              ) : (
                <p className="text-sm">{f.products?.name || 'Producto'}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </SurfaceCard>
  );
}
