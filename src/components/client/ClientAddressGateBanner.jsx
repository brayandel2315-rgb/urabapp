import { useLocation } from 'react-router-dom';
import ClientAddressGateExperience from '@/components/client/ClientAddressGateExperience';
import { useClientAddressGate } from '@/hooks/useClientAddressGate';

const SETUP_PATH = '/cuenta/direcciones';

/**
 * Banner persistente: cuenta sin dirección de casa completa.
 */
export default function ClientAddressGateBanner() {
  const { pathname } = useLocation();
  const { needsAddress, isLoading } = useClientAddressGate();

  if (isLoading || !needsAddress) return null;
  if (pathname.startsWith(SETUP_PATH)) return null;

  return (
    <div className="address-gate-banner-wrap relative z-30 px-3 pb-1 pt-2 sm:px-4">
      <ClientAddressGateExperience
        variant="banner"
        href={`${SETUP_PATH}?required=1`}
      />
    </div>
  );
}
