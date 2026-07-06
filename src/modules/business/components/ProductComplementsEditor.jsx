import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  listProductModifierGroups,
  saveProductModifierGroups,
} from '@/services/product-modifiers.service';
import { toast } from '@/utils/toast';
import AppIcon from '@/design-system/icons/AppIcon';

const EMPTY_GROUP = () => ({
  name: '',
  description: '',
  is_required: true,
  selection_type: 'single',
  modifiers: [{ name: '', price_delta: 0, action_type: 'add' }],
});

function toEditableGroups(groups = []) {
  if (!groups.length) return [EMPTY_GROUP()];
  return groups.map((g) => ({
    name: g.name,
    description: g.description || '',
    is_required: Boolean(g.is_required),
    selection_type: g.selection_type || 'single',
    modifiers: (g.modifiers || []).map((m) => ({
      name: m.name,
      price_delta: m.price_delta || 0,
      action_type: m.action_type || 'add',
    })),
  }));
}

export default function ProductComplementsEditor({ product, businessId }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState([EMPTY_GROUP()]);

  const { data: savedGroups = [], isLoading } = useQuery({
    queryKey: ['product-modifiers', businessId, product.id],
    queryFn: () => listProductModifierGroups(product.id, businessId),
    enabled: open && !!businessId && !!product?.id,
  });

  useEffect(() => {
    if (open && !isLoading) {
      setDraft(toEditableGroups(savedGroups));
    }
  }, [open, isLoading, savedGroups]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const cleaned = draft
        .filter((g) => g.name.trim())
        .map((g) => ({
          ...g,
          modifiers: g.modifiers.filter((m) => m.name.trim()),
        }))
        .filter((g) => g.modifiers.length);
      return saveProductModifierGroups(product.id, businessId, cleaned);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-modifiers', businessId, product.id] });
      toast('Complementos guardados');
      setOpen(false);
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const updateGroup = (index, patch) => {
    setDraft((prev) => prev.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  };

  const updateModifier = (gi, mi, patch) => {
    setDraft((prev) => prev.map((g, i) => {
      if (i !== gi) return g;
      return {
        ...g,
        modifiers: g.modifiers.map((m, j) => (j === mi ? { ...m, ...patch } : m)),
      };
    }));
  };

  return (
    <div className="border-t border-border/50 pt-3">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="inline-flex items-center gap-1"
        onClick={() => setOpen((v) => !v)}
      >
        <AppIcon name="plate" size="xs" />
        {open ? 'Cerrar complementos' : 'Configurar complementos'}
      </Button>

      {open && (
        <div className="mt-3 space-y-4 rounded-2xl bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">
            Define grupos obligatorios (ej. patacón, hogao) y opciones de agregar o quitar. Tus clientes verán este menú al pulsar +.
          </p>

          {draft.map((group, gi) => (
            <div key={gi} className="space-y-2 rounded-xl border border-border/60 bg-background p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  label="Grupo"
                  placeholder="Ej: Elige tu patacón"
                  value={group.name}
                  onChange={(e) => updateGroup(gi, { name: e.target.value })}
                />
                <label className="flex items-center gap-2 text-xs font-semibold text-secondary">
                  <input
                    type="checkbox"
                    checked={group.is_required}
                    onChange={(e) => updateGroup(gi, { is_required: e.target.checked })}
                    className="accent-primary"
                  />
                  Obligatorio
                </label>
              </div>
              <Input
                label="Descripción (opcional)"
                value={group.description}
                onChange={(e) => updateGroup(gi, { description: e.target.value })}
                placeholder="Ej: Debes elegir una base"
              />

              <div className="space-y-2">
                <p className="text-xs font-bold text-secondary">Opciones</p>
                {group.modifiers.map((mod, mi) => (
                  <div key={mi} className="grid gap-2 sm:grid-cols-[1fr_100px_120px_auto]">
                    <Input
                      placeholder="Nombre (Ej: Con hogao)"
                      value={mod.name}
                      onChange={(e) => updateModifier(gi, mi, { name: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Precio +"
                      value={mod.price_delta}
                      onChange={(e) => updateModifier(gi, mi, { price_delta: Number(e.target.value) || 0 })}
                    />
                    <select
                      value={mod.action_type}
                      onChange={(e) => updateModifier(gi, mi, { action_type: e.target.value })}
                      className="rounded-xl border border-border bg-background px-2 py-2 text-sm"
                    >
                      <option value="add">Agregar</option>
                      <option value="remove">Quitar</option>
                    </select>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => updateGroup(gi, {
                        modifiers: group.modifiers.filter((_, j) => j !== mi),
                      })}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => updateGroup(gi, {
                    modifiers: [...group.modifiers, { name: '', price_delta: 0, action_type: 'add' }],
                  })}
                >
                  + Opción
                </Button>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setDraft((d) => [...d, EMPTY_GROUP()])}>
              + Grupo
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
            >
              Guardar complementos
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
