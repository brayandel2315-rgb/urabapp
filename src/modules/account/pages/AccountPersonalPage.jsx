import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import DetectedLocationChip from '@/components/geo/DetectedLocationChip';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore, selectHomeMunicipio } from '@/store/locationStore';
import { updateProfile } from '@/services/auth.service';
import { emitCommEvent } from '@/communication';
import { saveUserDocument } from '@/services/promo.service';
import { formatCOP } from '@/utils/currency';
import { WELCOME_BENEFIT } from '@/utils/constants';
import { isValidColombianDocument, sanitizeText } from '@/utils/validate';
import { toast } from '@/utils/toast';

export default function AccountPersonalPage() {
  const { user, profile, setProfile } = useAuthStore();
  const homeMunicipio = useLocationStore(selectHomeMunicipio);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [documentNumber, setDocumentNumber] = useState(profile?.document_number || '');
  const [saving, setSaving] = useState(false);
  const [savingDoc, setSavingDoc] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const updated = await updateProfile(user.id, {
        full_name: sanitizeText(fullName, 120),
        phone: phone.trim(),
      });
      if (updated) setProfile(updated);
      setEditing(false);
      toast('Perfil actualizado');
      emitCommEvent('account_profile_updated', {
        recipientId: user.id,
        actorId: user.id,
        payload: { fields: ['full_name', 'phone'] },
      }).catch(() => {});
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDocument = async () => {
    if (!user?.id) return;
    setSavingDoc(true);
    try {
      const updated = await saveUserDocument(user.id, documentNumber);
      if (updated) setProfile(updated);
      setDocumentNumber(updated.document_number || '');
      toast('Cédula registrada');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSavingDoc(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <SectionTitle>Datos personales</SectionTitle>
          {!editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              Editar
            </Button>
          )}
        </div>

        {editing ? (
          <div className="space-y-3">
            <Input label="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input label="Teléfono / WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={handleSave} loading={saving}>Guardar</Button>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
            </div>
          </div>
        ) : (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[#4A6278]">Nombre</dt>
              <dd className="font-medium text-[#0D2B45]">{profile?.full_name || '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#4A6278]">Correo</dt>
              <dd className="truncate font-medium text-[#0D2B45]">{profile?.email || user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#4A6278]">Teléfono</dt>
              <dd className="font-medium text-[#0D2B45]">{profile?.phone || '—'}</dd>
            </div>
          </dl>
        )}
      </SurfaceCard>

      <SurfaceCard className="space-y-3 p-5">
        <SectionTitle>Beneficio de bienvenida</SectionTitle>
        <p className="text-sm text-[#4A6278]">
          Registra tu cédula una vez. En tu primer pedido desde {formatCOP(WELCOME_BENEFIT.minOrder)} el domicilio es gratis.
        </p>
        {profile?.welcome_delivery_used_at ? (
          <p className="rounded-xl bg-[#F0F4F8] p-3 text-sm text-[#4A6278]">
            Ya usaste tu entrega gratis el {new Date(profile.welcome_delivery_used_at).toLocaleDateString('es-CO')}.
          </p>
        ) : profile?.document_number ? (
          <p className="rounded-xl bg-[#E6F4FF] p-3 text-sm text-[#0D2B45]">
            Cédula ···{profile.document_number.slice(-4)} registrada. Se aplica automáticamente en checkout.
          </p>
        ) : (
          <>
            <Input
              label="Cédula de ciudadanía"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="1234567890"
              inputMode="numeric"
            />
            <Button
              className="w-full bg-[#0E6BA8] hover:bg-[#0B5A8C]"
              disabled={savingDoc || !isValidColombianDocument(documentNumber)}
              onClick={handleSaveDocument}
            >
              {savingDoc ? 'Guardando...' : 'Registrar cédula'}
            </Button>
          </>
        )}
      </SurfaceCard>

      <SurfaceCard className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <SectionTitle>Zona de entrega</SectionTitle>
          <Link to="/cuenta/direcciones" className="text-sm font-semibold text-[#0E6BA8]">
            Direcciones
          </Link>
        </div>
        <DetectedLocationChip className="w-full max-w-none" />
        <p className="text-xs text-[#4A6278]">
          Municipio de referencia: <strong>{homeMunicipio}</strong>
        </p>
      </SurfaceCard>
    </div>
  );
}
