import RoleShell from '@/design-system/layouts/RoleShell';
import { ROLES } from '@/utils/constants';

export default function AdminLayout() {
  return <RoleShell role={ROLES.ADMIN} />;
}
