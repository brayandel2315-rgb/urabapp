import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import { CLIENT_HOME } from '@/app/clientNav';

export default function PageLayout({
  title,
  backTo = CLIENT_HOME,
  navbarRight,
  children,
  className,
  contentClassName,
  maxWidth = 'lg',
  bottomPad = false,
  stickyCheckout = false,
  chrome = 'compact',
}) {
  const maxW = {
    sm: 'max-w-lg',
    md: 'max-w-xl',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
    store: 'max-w-2xl',
    full: 'max-w-2xl',
  }[maxWidth] || 'max-w-xl';

  return (
    <div
      className={cn(
        'w-full min-w-0 overflow-x-hidden bg-[#F7FAFC] text-[#0D2B45]',
        bottomPad && (stickyCheckout ? 'pb-safe-checkout-extra' : 'pb-safe-nav'),
      )}
    >
      {title !== false && chrome === 'full' && <Navbar title={title} backTo={backTo} right={navbarRight} />}
      <div className={cn('mx-auto w-full min-w-0 px-4 py-4', maxW, contentClassName, className)}>
        {children}
      </div>
    </div>
  );
}
