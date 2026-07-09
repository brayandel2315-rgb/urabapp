import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import mensajeriaImg from '@/assets/services/mensajeria.png';
import AppIcon from '@/design-system/icons/AppIcon';
import ServiceIconTile from '@/design-system/patterns/ServiceIconTile';
import { CLIENT_SERVICE_LINKS } from '@/app/clientNav';
import { useClientServicesFab } from '@/hooks/useClientServicesFab';
import { cn } from '@/lib/utils';

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

function ServicesFabTriggerVisual({ open }) {
  if (open) {
    return (
      <span className="services-fab-trigger__close flex h-10 w-10 items-center justify-center rounded-xl bg-white/12">
        <AppIcon name="chevronDown" size={22} className="rotate-180 text-white" />
      </span>
    );
  }

  return (
    <span className="services-fab-trigger__icon-wrap" aria-hidden>
      <img
        src={mensajeriaImg}
        alt=""
        className="services-fab-trigger__sticker services-fab-trigger__sticker--solo"
        draggable={false}
      />
    </span>
  );
}

/** FAB de servicios logísticos — mandados y envíos */
export default function ClientServicesFab() {
  const {
    open,
    visible,
    shouldRender,
    showTeaser,
    toggle,
    close,
    dismiss,
  } = useClientServicesFab();

  if (!shouldRender) return null;

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
            className="fixed inset-0 z-[45] bg-[#0D2B45]/30"
            aria-label="Cerrar menú de servicios"
            onClick={close}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="services-fab-anchor fixed left-0 z-[46] flex flex-col items-start gap-2"
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : 16,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{ pointerEvents: visible ? 'auto' : 'none' }}
      >
        <AnimatePresence>
          {showTeaser && !open && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="services-fab-teaser max-w-[11.5rem] rounded-xl border-2 border-[#D5E3EF] bg-white px-3 py-2 text-[11px] font-bold leading-snug text-[#0D2B45] shadow-lg"
            >
              Mandados y envíos desde aquí
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="mb-1 w-[min(17.5rem,86vw)] overflow-hidden rounded-2xl border-2 border-[#D5E3EF] bg-white shadow-[0_16px_40px_rgba(13,43,69,0.2)]"
            >
              <div className="border-b border-[#D5E3EF] bg-[#F7FAFC] px-4 py-3">
                <p className="font-display text-base font-bold text-[#0D2B45]">Mover algo</p>
                <p className="mt-0.5 text-xs font-medium text-[#4A6278]">Mensajería local o envío intermunicipal</p>
              </div>

              <div className="space-y-2 p-3">
                {GROWTH_SERVICES.map((service) => (
                  <Link
                    key={service.to}
                    to={service.to}
                    onClick={close}
                    className="flex items-center gap-3 rounded-xl border-2 border-[#D5E3EF] bg-white p-3 transition-colors active:bg-[#E6F4FF]"
                  >
                    <ServiceIconTile
                      serviceId={service.icon}
                      name={service.icon}
                      tone={service.tone}
                      size="sm"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold text-[#0D2B45]">{service.label}</span>
                        <span className="rounded-md bg-[#E6F4FF] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[#0E6BA8]">
                          {service.badge}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-[11px] font-medium text-[#4A6278]">{service.hint}</span>
                    </span>
                    <AppIcon name="chevronDown" size="sm" className="-rotate-90 text-[#0E6BA8]" />
                  </Link>
                ))}

                {SUPPORT_LINK && (
                  <Link
                    to={SUPPORT_LINK.to}
                    onClick={close}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#4A6278] hover:bg-[#F7FAFC]"
                  >
                    <ServiceIconTile serviceId="soporte" name="headset" tone="green" size="sm" />
                    <span>{SUPPORT_LINK.label}</span>
                  </Link>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-[#D5E3EF] px-3 py-2.5">
                <button
                  type="button"
                  onClick={() => dismiss(1)}
                  className="text-xs font-bold text-[#4A6278]"
                >
                  Ocultar hoy
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="text-xs font-bold text-[#0E6BA8]"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={toggle}
          whileTap={{ scale: 0.96 }}
          className={cn(
            'services-fab-trigger flex items-center gap-2.5 font-bold text-white',
            open
              ? 'h-12 w-12 translate-x-4 justify-center rounded-2xl border-2 border-[#0D2B45] bg-[#0D2B45]'
              : '-translate-x-[0.55rem] rounded-r-2xl border-2 border-[#0B5A8C] bg-gradient-to-r from-[#0E6BA8] to-[#0B5A8C] py-2 pl-[0.95rem] pr-3',
          )}
          aria-expanded={open}
          aria-label={open ? 'Cerrar servicios de envío' : 'Abrir mandados y envíos'}
        >
          <ServicesFabTriggerVisual open={open} />
          {!open && (
            <span className="text-left leading-tight">
              <span className="block text-[11px] font-black uppercase tracking-[0.08em] text-white">Envíos</span>
              <span className="block text-[10px] font-semibold text-white/90">y mandados</span>
            </span>
          )}
        </motion.button>
      </motion.div>
    </>
  );
}
