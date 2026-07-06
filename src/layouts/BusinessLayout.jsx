import RoleShell from '@/design-system/layouts/RoleShell';
import { ROLES } from '@/utils/constants';
import { useBusinessLightTheme } from '@/hooks/useBusinessLightTheme';

export default function BusinessLayout() {
  useBusinessLightTheme();
  return <RoleShell role={ROLES.BUSINESS} />;
}
