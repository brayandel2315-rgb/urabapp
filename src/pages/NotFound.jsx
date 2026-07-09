import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { PageState } from '@/design-system/patterns/PageState';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <PageState
        type="empty"
        icon="map"
        title="Página no encontrada"
        description="Esta ruta no existe en Urabapp."
        action={(
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Link to="/"><Button className="w-full">Ir al inicio</Button></Link>
            <Link to="/pedidos"><Button variant="outline" className="w-full">Ver mis pedidos</Button></Link>
          </div>
        )}
      />
    </div>
  );
}
