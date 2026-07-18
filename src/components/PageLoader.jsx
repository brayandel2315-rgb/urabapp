import BrandedLoadingScreen from '@/components/feedback/BrandedLoadingScreen';

export default function PageLoader({ message = 'Cargando…' }) {
  return <BrandedLoadingScreen variant="screen" message={message} />;
}
