import AppIcon from '@/design-system/icons/AppIcon';
import { Button } from '@/design-system/ui/button';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/themeStore';

export default function ThemeToggle({ showLabel = false, variant = 'ghost', className }) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <Button
      type="button"
      variant={variant}
      size={showLabel ? 'sm' : 'icon'}
      onClick={toggleTheme}
      className={cn(showLabel && 'gap-2', className)}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
    >
      <AppIcon name={isDark ? 'sun' : 'moon'} size="sm" />
      {showLabel && (isDark ? 'Claro' : 'Oscuro')}
    </Button>
  );
}
