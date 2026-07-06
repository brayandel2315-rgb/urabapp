import PanelHeader from '@/design-system/patterns/PanelHeader';

/** Encabezado de página cliente — alineado con PanelHeader de paneles operativos */
export default function ClientPageHeader({ tag, title, subtitle, action, children, className }) {
  return (
    <PanelHeader
      tag={tag}
      title={title}
      subtitle={subtitle}
      action={action}
      className={className}
    >
      {children}
    </PanelHeader>
  );
}
