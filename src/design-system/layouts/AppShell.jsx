import { cn } from '@/lib/utils';

export default function AppShell({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'relative min-h-screen w-full max-w-full overflow-x-clip overflow-y-visible bg-background font-body text-foreground antialiased',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
