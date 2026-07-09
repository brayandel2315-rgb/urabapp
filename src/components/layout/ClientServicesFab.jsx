import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import mensajeriaImg from '@/assets/services/mensajeria.png';
import enviosImg from '@/assets/services/envios.png';
import AppIcon from '@/design-system/icons/AppIcon';
import ServiceIconTile from '@/design-system/patterns/ServiceIconTile';
import { CLIENT_SERVICE_LINKS } from '@/app/clientNav';
import { useClientServicesFab } from '@/hooks/useClientServicesFab';
import { cn } from '@/lib/utils';

const GROWTH_SERVICES = [
  {
    to: '/mandado',
    label: 'Mandado ya',
    hint: 'Recogemos y entregamos hoy',
    badge: 'Local',
    icon: 'mensajeria',
    tone: 'blue',
    accent: 'from-[#0E6BA8] to-[#0B5A8C]',
  },
  {
    to: '/envios',
    label: 'Envío intermunicipal',
    hint: 'Cotiza en segundos',
    badge: 'Urabá',
    icon: 'envios',
    tone: 'blue',
    accent: 'from-[#0D2B45] to-[#1A4A6E]',
  },
];

const SUPPORT_LINK = CLIENT_SERVICE_LINKS.find((l) => l.to === '/soporte');

/** FAB de servicios logísticos — mandados y envíos con growth UX */
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
            transition={{ duration: 0.18 }}
            className="services-fab-backdrop fixed inset-0 z-30 bg-[#0D2B45]/25 backdrop-blur-[2px]"
            aria-label="Cerrar menú de servicios"
            onClick={close}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="client-fab-left services-fab-anchor fixed left-3 z-40 flex flex-col items-start gap-2 sm:left-4"
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : 18,
          scale: visible ? 1 : 0.92,
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        style={{ pointerEvents: visible ? 'auto' : 'none' }}
      >
        <AnimatePresence>
          {showTeaser && !open && (
            <motion.div
              initial={{ opacity: 0, x: -8, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -6, scale: 0.96 }}
              className="services-fab-teaser mb-1 max-w-[13.5rem] rounded-2xl border border-[#0E6BA8]/25 bg-white px-3 py-2.5 text-xs font-semibold text-[#0D2B45] shadow-lg"
            >
              <span className="text-[#0E6BA8]">Nuevo</span>
              {' · '}
              Mandados locales y envíos entre municipios desde aquí
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="services-fab-panel mb-1 w-[min(19rem,88vw)] overflow-hidden rounded-2xl border border-[#D5E3EF] bg-white shadow-[0_12px_40px_rgba(13,43,69,0.18)]"
            >
              <div className="bg-gradient-to-br from-[#E6F4FF] to-white px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#0E6BA8]">Logística Urabá</p>
                <p className="mt-0.5 font-display text-base font-bold text-[#0D2B45]">¿Qué necesitas mover?</p>
              </div>

              <div className="space-y-2 p-3">
                {GROWTH_SERVICES.map((service, index) => (
                  <motion.div
                    key={service.to}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <Link
                      to={service.to}
                      onClick={close}
                      className={cn(
                        'group flex items-center gap-3 rounded-xl bg-gradient-to-r p-3 text-white shadow-md transition-transform active:scale-[0.98]',
                        service.accent,
                      )}
                    >
                      <ServiceIconTile
                        serviceId={service.icon}
                        name={service.icon}
                        tone={service.tone}
                        size="sm"
                        className="ring-2 ring-white/30"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-display text-sm font-bold">{service.label}</span>
                          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                            {service.badge}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-[11px] font-medium text-white/85">{service.hint}</span>
                      </span>
                      <AppIcon name="chevronDown" size="sm" className="-rotate-90 text-white/90" />
                    </Link>
                  </motion.div>
                ))}

                {SUPPORT_LINK && (
                  <Link
                    to={SUPPORT_LINK.to}
                    onClick={close}
                    className="flex items-center gap-3 rounded-xl border border-[#D5E3EF] px-3 py-2.5 text-sm font-semibold text-[#0D2B45] transition-colors hover:bg-[#F7FAFC]"
                  >
                    <ServiceIconTile serviceId="soporte" name="headset" tone="green" size="sm" />
                    <span className="min-w-0">
                      {SUPPORT_LINK.label}
                      <span className="block text-[10px] font-normal text-[#4A6278]">{SUPPORT_LINK.hint}</span>
                    </span>
                  </Link>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-[#D5E3EF] px-3 py-2">
                <button
                  type="button"
                  onClick={() => dismiss(1)}
                  className="text-[11px] font-semibold text-[#4A6278] transition-colors hover:text-[#0D2B45]"
                >
                  Ocultar por hoy
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="text-[11px] font-semibold text-[#0E6BA8]"
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
          animate={open ? { scale: 1 } : { scale: [1, 1.04, 1] }}
          transition={
            open
              ? { duration: 0.2 }
              : { duration: 2.4, repeat: Infinity, repeatDelay: 4.5, ease: 'easeInOut' }
          }
          className={cn(
            'services-fab-trigger relative flex items-center gap-2 overflow-hidden rounded-full text-white shadow-lg',
            open ? 'bg-[#0D2B45] px-3.5 py-3' : 'bg-gradient-to-r from-[#0E6BA8] to-[#0B5A8C] pl-2 pr-4 py-2.5',
          )}
          aria-expanded={open}
          aria-label={open ? 'Cerrar servicios de envío' : 'Abrir mandados y envíos'}
        >
          {!open && <span className="services-fab-pulse absolute inset-0 rounded-full" aria-hidden />}
          <span className="relative flex -space-x-1.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/40">
              <img src={mensajeriaImg} alt="" className="h-7 w-7 object-contain" draggable={false} />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/40">
              <img src={enviosImg} alt="" className="h-7 w-7 object-contain" draggable={false} />
            </span>
          </span>
          {open ? (
            <AppIcon name="chevronDown" size={20} className="relative rotate-180 text-white" />
          ) : (
            <span className="relative text-left leading-tight">
              <span className="block font-display text-sm font-bold">Envíos</span>
              <span className="block text-[10px] font-semibold text-white/85">Mandados · Urabá</span>
            </span>
          )}
        </motion.button>
      </motion.div>
    </>
  );
}
