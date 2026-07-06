import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Loader from '../../../components/ui/Loader';
import AppIcon from '@/design-system/icons/AppIcon';
import IconPicker from '../../../components/ui/IconPicker';
import { resolveIconKey } from '@/design-system/icons/icon-map';
import CategoryRail from '../../../components/marketplace/CategoryRail';
import CategoryBadge from '../../../components/marketplace/CategoryBadge';
import {
  getAllCategoriesAdmin,
  getCategoryBusinessCounts,
  createCategory,
  updateCategory,
  deleteCategory,
  syncCatalogCategoriesToDb,
} from '../../../services/category.service';
import { BUSINESS_CATEGORIES } from '../../../data/category-catalog';
import { toast } from '../../../utils/toast';
import PanelHeader from '@/design-system/patterns/PanelHeader';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';

const EMPTY_CATEGORY = {
  id: '',
  name: '',
  emoji: 'store',
  sort_order: 10,
  is_active: true,
};

export default function AdminCategoriesPanel() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_CATEGORY);
  const [editingId, setEditingId] = useState(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: getAllCategoriesAdmin,
  });

  const { data: businessCounts = {} } = useQuery({
    queryKey: ['admin-category-counts'],
    queryFn: getCategoryBusinessCounts,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    queryClient.invalidateQueries({ queryKey: ['admin-category-counts'] });
    queryClient.invalidateQueries({ queryKey: ['explore-categories'] });
    queryClient.invalidateQueries({ queryKey: ['businesses'] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        sort_order: Number(form.sort_order) || 0,
      };
      if (editingId) return updateCategory(editingId, payload);
      return createCategory(payload);
    },
    onSuccess: () => {
      invalidate();
      setForm(EMPTY_CATEGORY);
      setEditingId(null);
      toast(editingId ? 'Categoría actualizada' : 'Categoría creada');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      invalidate();
      toast('Categoría eliminada');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const syncMutation = useMutation({
    mutationFn: syncCatalogCategoriesToDb,
    onSuccess: (n) => {
      invalidate();
      toast(`Catálogo sincronizado (${n} categorías)`);
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      id: cat.id,
      name: cat.name,
      emoji: resolveIconKey(cat.emoji) || 'store',
      sort_order: cat.sortOrder ?? cat.sort_order ?? 0,
      is_active: cat.is_active !== false,
    });
  };

  const moveOrder = (cat, delta) => {
    const next = (cat.sortOrder ?? cat.sort_order ?? 0) + delta;
    updateCategory(cat.id, { sort_order: Math.max(0, next) })
      .then(() => {
        invalidate();
        toast('Orden actualizado');
      })
      .catch((err) => toast(err.message, 'error'));
  };

  const previewCategories = categories.filter((c) => c.is_active !== false);

  return (
    <div className="space-y-4">
      <PanelHeader
        tag="Catálogo"
        title="Categorías de /search"
        subtitle="Nombre, icono sticker y orden visibles en la app. Los cambios se reflejan al instante en el carrusel de categorías."
      />

      <SurfaceCard className="space-y-3">
        <SectionTitle>Vista previa en la app</SectionTitle>
        <CategoryRail
          variant="scroll"
          categories={previewCategories}
          activeId={editingId}
          counts={businessCounts}
          onSelect={() => {}}
        />
        <p className="text-xs text-muted-foreground">
          Así se ven en /search. El contador muestra tiendas activas por categoría.
        </p>
      </SurfaceCard>

      <SurfaceCard className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionTitle>{editingId ? 'Editar categoría' : 'Nueva categoría'}</SectionTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={syncMutation.isPending}
            onClick={() => syncMutation.mutate()}
          >
            Sincronizar catálogo local
          </Button>
        </div>

        {!editingId && (
          <Input
            label="ID (slug)"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase() })}
            placeholder="ej: licoreria"
          />
        )}
        {editingId && (
          <p className="text-sm text-muted-foreground">
            ID: <span className="font-mono font-bold text-foreground">{editingId}</span>
            {BUSINESS_CATEGORIES[editingId] && (
              <span className="ml-2">
                · Icono app: <AppIcon name={BUSINESS_CATEGORIES[editingId].icon} size="xs" className="inline" />
              </span>
            )}
          </p>
        )}
        <Input label="Nombre visible" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div className="grid gap-3 sm:grid-cols-2">
        <IconPicker
          value={resolveIconKey(form.emoji)}
          onChange={(v) => setForm({ ...form, emoji: v })}
          label="Icono (sticker)"
        />
          <Input
            label="Orden"
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          Activa en /search
        </label>
        <div className="flex gap-2">
          <Button
            className="flex-1"
            disabled={!form.name || (!editingId && !form.id) || saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
          >
            {saveMutation.isPending ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear categoría'}
          </Button>
          {editingId && (
            <Button variant="outline" onClick={() => { setEditingId(null); setForm(EMPTY_CATEGORY); }}>
              Cancelar
            </Button>
          )}
        </div>
      </SurfaceCard>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <SurfaceCard key={cat.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted/50">
                  <AppIcon name={resolveIconKey(cat.emoji)} size="md" className="text-primary" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-secondary">{cat.name}</p>
                    <CategoryBadge categoryId={cat.id} size="xs" />
                    {cat.is_active === false && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                        Oculta
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted">
                    <span className="font-mono">{cat.id}</span>
                    {' · '}Orden {cat.sortOrder ?? cat.sort_order ?? 0}
                    {' · '}{businessCounts[cat.id] ?? 0} tienda(s)
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => moveOrder(cat, -1)} aria-label="Subir">
                  ↑
                </Button>
                <Button size="sm" variant="outline" onClick={() => moveOrder(cat, 1)} aria-label="Bajar">
                  ↓
                </Button>
                <Button size="sm" variant="outline" onClick={() => startEdit(cat)}>Editar</Button>
                <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(cat.id)}>Eliminar</Button>
              </div>
            </SurfaceCard>
          ))}
        </div>
      )}
    </div>
  );
}
