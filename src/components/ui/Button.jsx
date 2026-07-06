import { Button as DSButton } from '@/design-system/ui/button';

const variantMap = {
  primary: 'default',
  secondary: 'secondary',
  outline: 'outline',
  accent: 'accent',
  ghost: 'ghost',
  destructive: 'destructive',
};

const sizeMap = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <DSButton
      variant={variantMap[variant] || 'default'}
      size={sizeMap[size] || 'default'}
      className={className}
      {...props}
    >
      {children}
    </DSButton>
  );
}
