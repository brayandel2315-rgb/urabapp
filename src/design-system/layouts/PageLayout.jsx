import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import { CLIENT_HOME } from '@/app/clientNav';

const WIDTH_CLASS = {
  sm: 'max-w-lg',
  md: 'max-w-xl lg:max-w-2xl',
  lg: 'max-w-xl lg:max-w-4xl',
  xl: 'max-w-2xl lg:max-w-5xl',
  store: 'max-w-2xl lg:max-w-6xl',
  full: 'max-w-2xl lg:max-w-7xl',
};

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
  const maxW = WIDTH_CLASS[maxWidth] || WIDTH_CLASS.lg;

  return (
    <div
      className={cn(
        'w-full min-w-0 overflow-x-hidden bg-background text-foreground',
        bottomPad && (
          stickyCheckout
            ? 'pb-safe-checkout lg:pb-6'
            : 'pb-safe-nav lg:pb-0'
        ),
      )}
    >
      {title !== false && chrome === 'full' && (
        <Navbar title={title} backTo={backTo} right={navbarRight} />
      )}
      <div
        className={cn(
          'mx-auto w-full min-w-0 px-4 py-4 sm:px-5 lg:px-8 lg:py-6 xl:px-10',
          maxW,
          contentClassName,
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
