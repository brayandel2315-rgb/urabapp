import { cn } from '@/lib/utils';

export default function AppShell({ children, className, ...props }) {
  return (
    <div
      className={cn('min-h-screen w-full overflow-x-hidden bg-background font-body text-foreground antialiased', className)}
      {...props}
    >
      {children}
    </div>
  );
}
