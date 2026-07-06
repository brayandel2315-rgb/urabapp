import AppIcon from '@/design-system/icons/AppIcon';

export default function Loader({ size = 'md' }) {
  const iconSize = size === 'lg' ? 'xl' : size === 'sm' ? 'sm' : 'md';
  return (
    <div className="flex items-center justify-center p-8" role="status" aria-label="Cargando">
      <AppIcon name="loading" size={iconSize} spin className="text-primary" />
    </div>
  );
}
