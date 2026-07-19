import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import ImageUpload from '../../../components/ui/ImageUpload';
import CatalogImage from '../../../components/ui/CatalogImage';
import IconPicker from '../../../components/ui/IconPicker';
import {
  getProductsByBusiness,
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
} from '../../../services/business.service';
import { generateProductDescription } from '../../../services/ai.service';
import { uploadProductImage } from '../../../services/storage.service';
import { formatCOP } from '../../../utils/currency';
import { toast } from '../../../utils/toast';
import { PageState, PageLoader } from '@/design-system/patterns/PageState';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import AppIcon from '@/design-system/icons/AppIcon';
import ProductComplementsEditor from './ProductComplementsEditor';

export default function BusinessProducts({ businessId, business }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', price: '', emoji: 'package', description: '', category: 'General' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [uploadingProductId, setUploadingProductId] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', businessId],
    queryFn: () => getProductsByBusiness(businessId, { includeUnavailable: true }),
    enabled: !!businessId,
  });

  const createMutation = useMutation({
    mutationFn: () => createProduct(businessId, {
      name: form.name,
      price: Number(form.price),
      emoji: form.emoji,
      description: form.description,
      category: form.category || 'General',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', businessId] });
      setForm({ name: '', price: '', emoji: 'package', description: '', category: form.category || 'General' });
      toast('Producto agregado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_available }) => updateProduct(id, { is_available }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products', businessId] }),
  });

  const duplicateMutation = useMutation({
    mutationFn: (productId) => duplicateProduct(businessId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', businessId] });
      toast('Producto duplicado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', businessId] });
      setDeleteTarget(null);
      toast('Producto eliminado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', businessId] });
      setEditingId(null);
      setEditForm(null);
      toast('Producto actualizado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: String(product.price),
      description: product.description || '',
      category: product.category || 'General',
      emoji: product.emoji || 'package',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleGenerateDescription = async () => {
    if (!form.name.trim()) {
      toast('Escribe el nombre del producto primero', 'error');
      return;
    }
    setAiLoading(true);
    try {
      const { text } = await generateProductDescription({
        business,
        productName: form.name,
        category: form.category,
        price: form.price,
      });
      setForm((f) => ({ ...f, description: text }));
      toast('Descripción sugerida');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const handleProductImage = async (productId, file) => {
    setUploadingProductId(productId);
    try {
      const url = await uploadProductImage(businessId, productId, file);
      await updateProduct(productId, { image_url: url });
      queryClient.invalidateQueries({ queryKey: ['products', businessId] });
      toast('Foto del producto actualizada');
      return url;
    } catch (err) {
      toast(err.message, 'error');
      throw err;
    } finally {
      setUploadingProductId(null);
    }
  };

  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-3">
        <SectionTitle>Agregar producto</SectionTitle>
        <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Precio" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Input label="Categoría" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="General" />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <label className="text-sm font-semibold text-secondary">Descripción</label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={aiLoading || !form.name}
              onClick={handleGenerateDescription}
              className="inline-flex items-center gap-1"
            >
              <AppIcon name="bolt" size="xs" />
              {aiLoading ? 'Generando…' : 'Sugerir texto'}
            </Button>
          </div>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Describe el producto para tus clientes"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <IconPicker value={form.emoji} onChange={(v) => setForm({ ...form, emoji: v })} label="Icono (si no hay foto)" />
        <Button
          className="w-full"
          disabled={!form.name || !form.price || createMutation.isPending}
          onClick={() => createMutation.mutate()}
        >
          Agregar
        </Button>
      </SurfaceCard>

      <SectionTitle>Catálogo ({products.length})</SectionTitle>
      {isLoading ? (
        <PageLoader rows={3} />
      ) : products.length === 0 ? (
        <PageState
          type="empty"
          icon="food"
          title="Sin productos aún"
          description="Agrega tu primer producto arriba. Los clientes lo verán en tu tienda pública al instante."
          className="py-8"
        />
      ) : (
        products.map((p) => (
          <SurfaceCard key={p.id} className="space-y-3">
            {editingId === p.id && editForm ? (
              <div className="space-y-3">
                <SectionTitle>Editar producto</SectionTitle>
                <Input label="Nombre" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="Precio" type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                  <Input label="Categoría" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} />
                </div>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  placeholder="Descripción"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                />
                <IconPicker value={editForm.emoji} onChange={(v) => setEditForm({ ...editForm, emoji: v })} label="Icono" />
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    disabled={!editForm.name || !editForm.price || editMutation.isPending}
                    onClick={() => editMutation.mutate({
                      id: p.id,
                      payload: {
                        name: editForm.name.trim(),
                        price: Number(editForm.price),
                        description: editForm.description.trim(),
                        category: editForm.category || 'General',
                        emoji: editForm.emoji,
                      },
                    })}
                  >
                    Guardar
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={cancelEdit}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 overflow-hidden rounded-xl bg-primary/10">
                  <CatalogImage src={p.image_url} emoji={p.emoji} className="h-full w-full" />
                </div>
                <div>
                  <p className="font-semibold text-secondary">{p.name}</p>
                  <p className="text-sm text-primary">{formatCOP(p.price)}</p>
                  {p.category && (
                    <p className="text-xs text-muted">{p.category}</p>
                  )}
                  {p.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(p)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleMutation.mutate({ id: p.id, is_available: !p.is_available })}
                >
                  {p.is_available !== false ? 'Ocultar' : 'Activar'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={duplicateMutation.isPending}
                  onClick={() => duplicateMutation.mutate(p.id)}
                >
                  Duplicar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(p)} aria-label="Eliminar">
                  Eliminar
                </Button>
              </div>
            </div>
            <ImageUpload
              label="Foto del producto"
              currentUrl={p.image_url}
              onUpload={(file) => handleProductImage(p.id, file)}
              aspect="square"
            />
            {uploadingProductId === p.id && (
              <p className="text-xs text-muted">Subiendo imagen...</p>
            )}
            <ProductComplementsEditor product={p} businessId={businessId} />
              </>
            )}
          </SurfaceCard>
        ))
      )}

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="¿Eliminar producto?"
        message={`Se quitará "${deleteTarget?.name}" de tu catálogo. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
