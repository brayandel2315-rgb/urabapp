import ClientPageHeader from '@/design-system/patterns/ClientPageHeader';
import { cn } from '@/lib/utils';

/** Encabezado de pantalla cliente con espaciado consistente */
export default function ClientScreenHeader({
  tag = 'UrabApp',
  title,
  subtitle,
  action,
  className,
  children,
}) {
  return (
    <ClientPageHeader
      tag={tag}
      title={title}
      subtitle={subtitle}
      action={action}
      className={cn('border-0 bg-transparent p-0 shadow-none ring-0', className)}
    >
      {children}
    </ClientPageHeader>
  );
}
