import RoleShell from '@/design-system/layouts/RoleShell';
import { ROLES } from '@/utils/constants';
import { useRiderLightTheme } from '@/hooks/useRiderLightTheme';

export default function RiderLayout() {
  useRiderLightTheme();
  return <RoleShell role={ROLES.RIDER} />;
}
