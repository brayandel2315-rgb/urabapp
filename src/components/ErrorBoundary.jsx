import { Component } from 'react';
import Button from './ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { isStaleChunkError, reloadForUpdate } from '@/pwa/swUpdate';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, staleAssets: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      staleAssets: isStaleChunkError(error?.message),
      message: error?.message || '',
    };
  }

  componentDidCatch(error, info) {
     
    console.error('Urabapp ErrorBoundary:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
          <SurfaceCard className="max-w-md text-center">
            <AppIcon name="alert" size="3xl" className="mx-auto text-destructive" />
            <h1 className="font-display mt-4 text-xl font-bold text-foreground">Algo falló</h1>
            <p className="mt-2 text-sm text-muted">
              {this.state.staleAssets
                ? 'Hay una versión nueva. Actualiza para continuar con los últimos cambios.'
                : 'Recarga la página o limpia la caché de la app. Si persiste, escríbenos por WhatsApp.'}
            </p>
            {import.meta.env.DEV && this.state.message && (
              <p className="mt-2 break-all text-left font-mono text-[10px] text-muted">
                {this.state.message}
              </p>
            )}
            <div className="mt-6 flex flex-col gap-2">
              <Button onClick={() => reloadForUpdate()}>
                {this.state.staleAssets ? 'Actualizar app' : 'Limpiar caché y recargar'}
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>Recargar</Button>
              <Button variant="outline" onClick={this.handleReset}>Ir al inicio</Button>
            </div>
          </SurfaceCard>
        </div>
      );
    }

    return this.props.children;
  }
}
