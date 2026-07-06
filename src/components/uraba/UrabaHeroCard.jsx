import { cn } from '@/lib/utils';

export default function UrabaHeroCard({ children, className = '', padding = 'default' }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-border/50 bg-background/95 shadow-lift backdrop-blur-xl',
        padding === 'compact' ? 'p-4' : 'p-5 sm:p-6',
        className
      )}
    >
      {children}
    </div>
  );
}
