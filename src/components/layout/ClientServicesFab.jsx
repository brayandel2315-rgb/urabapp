import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import AppIcon from '@/design-system/icons/AppIcon';
import ServiceIconTile from '@/design-system/patterns/ServiceIconTile';
import { CLIENT_SERVICE_LINKS } from '@/app/clientNav';
import { useClientServicesFab } from '@/hooks/useClientServicesFab';

const GROWTH_SERVICES = [
  {
    to: '/mandado',
    label: 'Mandado local',
    hint: 'Recogemos y entregamos hoy',
    badge: 'Rápido',
    icon: 'mensajeria',
    tone: 'blue',
  },
  {
    to: '/envios',
    label: 'Envío Urabá',
    hint: 'Entre municipios · cotiza ya',
    badge: 'Inter',
    icon: 'envios',
    tone: 'blue',
  },
];

const SUPPORT_LINK = CLIENT_SERVICE_LINKS.find((l) => l.to === '/soporte');

/** Panel de servicios logísticos — se abre desde el dock inferior */
export default function ClientServicesFab() {
  const { open, close, dismiss } = useClientServicesFab();

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[45] bg-[#111111]/25"
            aria-label="Cerrar menú de servicios"
            onClick={close}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="services-panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="services-panel-anchor fixed inset-x-0 z-[46] flex justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="services-panel-title"
          >
            <div className="services-panel w-full max-w-[18rem] overflow-hidden rounded-[22px] border border-[#EFEFEF] bg-white shadow-[0_16px_48px_rgba(17,17,17,0.16)]">
            <div className="border-b border-[#EFEFEF] bg-[#F7F7F7] px-4 py-3 text-center">
              <p id="services-panel-title" className="font-display text-[15px] font-bold text-[#111111]">Servicios</p>
              <p className="mt-0.5 text-xs font-medium text-[#4B5563]">Mensajería local o envío intermunicipal</p>
            </div>

            <div className="space-y-2 p-3">
              {GROWTH_SERVICES.map((service) => (
                <Link
                  key={service.to}
                  to={service.to}
                  onClick={close}
                  className="flex items-center gap-2.5 rounded-[18px] border border-[#EFEFEF] bg-white px-3 py-2.5 transition-all duration-300 hover:border-[#2E7D32]/25 active:scale-[0.99]"
                >
                  <ServiceIconTile
                    serviceId={service.icon}
                    name={service.icon}
                    tone={service.tone}
                    size="sm"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-display text-[13px] font-bold text-[#111111]">{service.label}</span>
                      <span className="rounded-md bg-[#E8F5E9] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[#2E7D32]">
                        {service.badge}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-[10px] font-medium text-[#4B5563]">{service.hint}</span>
                  </span>
                  <AppIcon name="chevronDown" size="sm" className="-rotate-90 text-[#2E7D32]" />
                </Link>
              ))}

              {SUPPORT_LINK && (
                <Link
                  to={SUPPORT_LINK.to}
                  onClick={close}
                  className="flex items-center gap-3 rounded-[18px] px-3 py-2 text-sm font-semibold text-[#4B5563] hover:bg-[#F7F7F7]"
                >
                  <ServiceIconTile serviceId="soporte" name="headset" tone="green" size="sm" />
                  <span>{SUPPORT_LINK.label}</span>
                </Link>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[#EFEFEF] px-3 py-2.5">
              <button
                type="button"
                onClick={() => dismiss(1)}
                className="text-xs font-bold text-[#4B5563]"
              >
                Ocultar hoy
              </button>
              <button
                type="button"
                onClick={close}
                className="text-xs font-bold text-[#2E7D32]"
              >
                Cerrar
              </button>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
