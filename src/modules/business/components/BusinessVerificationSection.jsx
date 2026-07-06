import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import FormSelect from '@/design-system/patterns/FormSelect';
import { updateBusiness } from '@/services/business.service';
import { uploadBusinessVerificationDoc } from '@/services/storage.service';
import { toast } from '@/utils/toast';
import { isValidColombianDocument } from '@/utils/validate';
import {
  LEGAL_ENTITY_TYPES,
  getRequiredLegalDocuments,
  validateBusinessTaxId,
} from '@/utils/business-registration';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import BusinessDocumentUpload from './BusinessDocumentUpload';
import BusinessLegalConsentPanel, { allMerchantConsentsAccepted } from './BusinessLegalConsentPanel';
import BusinessLegalReadonly from './BusinessLegalReadonly';
import AppIcon from '@/design-system/icons/AppIcon';

const EMPTY_CONSENTS = { terms: false, privacy: false, merchant: false, truthful: false };

export default function BusinessVerificationSection({ business }) {
  const queryClient = useQueryClient();
  const docs = business.verification_documents || {};
  const [nit, setNit] = useState(business.nit || '');
  const [legalName, setLegalName] = useState(business.legal_representative_name || '');
  const [repDoc, setRepDoc] = useState(business.representative_document_number || '');
  const [entityType, setEntityType] = useState(business.legal_entity_type || 'natural');
  const [consents, setConsents] = useState(EMPTY_CONSENTS);

  const isRejected = business.verification_status === 'rejected';
  const isApproved = business.verification_status === 'approved';
  const submitted = Boolean(business.verification_submitted_at) && !isRejected;
  const canEditLegal = !isApproved && !submitted;

  const requiredDocs = getRequiredLegalDocuments({
    legalEntityType: entityType,
    categoryId: business.category,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!canEditLegal && !isRejected) {
        throw new Error('La información legal ya fue enviada y no puede modificarse');
      }

      const trimmedNit = nit.trim();
      const trimmedName = legalName.trim();
      const trimmedRepDoc = repDoc.trim();

      const taxErr = validateBusinessTaxId({ legalEntityType: entityType, taxId: trimmedNit });
      if (taxErr) throw new Error(taxErr);
      if (!trimmedName) throw new Error('Completa el nombre del titular o representante legal');
      if (!isValidColombianDocument(trimmedRepDoc)) throw new Error('Cédula del titular inválida');

      const currentDocs = { ...(business.verification_documents || {}) };
      for (const doc of requiredDocs.filter((d) => d.required)) {
        if (!currentDocs[doc.key]) {
          throw new Error(`Falta documento: ${doc.label}`);
        }
      }
      if (!allMerchantConsentsAccepted(consents)) {
        throw new Error('Debes aceptar las declaraciones legales');
      }

      return updateBusiness(business.id, {
        nit: trimmedNit,
        legal_entity_type: entityType,
        legal_representative_name: trimmedName,
        representative_document_number: trimmedRepDoc,
        verification_documents: currentDocs,
        verification_submitted_at: new Date().toISOString(),
        verification_status: 'pending',
        rejection_reason: null,
        registration_consent_at: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-businesses'] });
      toast('Documentos enviados a revisión');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const uploadDoc = async (docType, file) => {
    if (!canEditLegal && !isRejected) {
      toast('No puedes modificar documentos mientras están en revisión', 'error');
      throw new Error('locked');
    }
    const url = await uploadBusinessVerificationDoc(business.id, docType, file);
    const nextDocs = { ...(business.verification_documents || {}), [docType]: url };
    await updateBusiness(business.id, { verification_documents: nextDocs });
    queryClient.invalidateQueries({ queryKey: ['my-businesses'] });
    queryClient.invalidateQueries({ queryKey: ['admin-businesses-review'] });
    return url;
  };

  if (isApproved || (submitted && !isRejected)) {
    return (
      <SurfaceCard className="space-y-4">
        <SectionTitle>Verificación legal</SectionTitle>
        <BusinessLegalReadonly
          business={business}
          variant={isApproved ? 'approved' : 'pending'}
        />
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="space-y-4">
      <div className="flex items-start gap-3">
        <AppIcon name="lock" size="sm" className="mt-0.5 shrink-0 text-primary" />
        <div>
          <SectionTitle>Verificación legal · Colombia</SectionTitle>
          <p className="text-sm text-muted">
            {isRejected
              ? `Solicitud rechazada: ${business.rejection_reason || 'Corrige tus documentos y reenvía.'}`
              : 'Completa una sola vez. Tras enviar, los datos quedan bloqueados hasta la revisión de Urabapp.'}
          </p>
        </div>
      </div>

      <FormSelect label="Tipo de comerciante" value={entityType} onChange={(e) => setEntityType(e.target.value)}>
        {Object.values(LEGAL_ENTITY_TYPES).map(({ id, label }) => (
          <option key={id} value={id}>{label}</option>
        ))}
      </FormSelect>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label={entityType === 'juridica' ? 'NIT de la empresa' : 'NIT o cédula (RUT)'}
          value={nit}
          onChange={(e) => setNit(e.target.value)}
          placeholder={entityType === 'juridica' ? '900.123.456-7' : '1234567890'}
        />
        <Input
          label="Titular / representante legal"
          value={legalName}
          onChange={(e) => setLegalName(e.target.value)}
        />
      </div>
      <Input
        label="Cédula del titular"
        value={repDoc}
        onChange={(e) => setRepDoc(e.target.value)}
        placeholder="Solo números"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {requiredDocs.map((doc) => (
          <BusinessDocumentUpload
            key={doc.key}
            label={doc.label}
            description={doc.description}
            hint={doc.hint}
            accept={doc.accept}
            currentUrl={docs[doc.key]}
            onUpload={(file) => uploadDoc(doc.key, file)}
          />
        ))}
      </div>

      <BusinessLegalConsentPanel
        consents={consents}
        onChange={(id, value) => setConsents((c) => ({ ...c, [id]: value }))}
      />

      <Button
        className="w-full"
        disabled={saveMutation.isPending}
        onClick={() => saveMutation.mutate()}
      >
        {saveMutation.isPending ? 'Enviando…' : isRejected ? 'Reenviar documentos' : 'Enviar a revisión'}
      </Button>
    </SurfaceCard>
  );
}
