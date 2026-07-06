import { Component } from 'react';
import Button from './ui/Button';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { reloadForUpdate } from '@/pwa/swUpdate';

export default class SectionErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Error de interfaz' };
  }

  componentDidCatch(error, info) {
     
    console.error(`SectionErrorBoundary [${this.props.label || 'section'}]:`, error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: '' });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <SurfaceCard className="space-y-3 p-5 text-center">
          <p className="font-semibold text-foreground">
            No pudimos cargar {this.props.label || 'esta sección'}
          </p>
          <p className="text-sm text-muted">
            {this.state.message?.slice(0, 160) || 'Error temporal de la interfaz.'}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button size="sm" onClick={this.handleRetry}>Reintentar</Button>
            <Button size="sm" variant="outline" onClick={() => reloadForUpdate()}>
              Limpiar caché y actualizar
            </Button>
          </div>
        </SurfaceCard>
      );
    }
    return this.props.children;
  }
}
