import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import AppIcon from '@/design-system/icons/AppIcon';
import ServiceIconTile from '@/design-system/patterns/ServiceIconTile';
import { CLIENT_SERVICE_LINKS } from '@/app/clientNav';
import { MOBILE_SIDE_FAB_BOTTOM } from '@/constants/floatingUi';
import { usePwaInstallStore } from '@/store/pwaInstallStore';

/** FAB de servicios — mensajería, envíos y ayuda */
export default function ClientServicesFab() {
  const [open, setOpen] = useState(false);
  const isStandalone = usePwaInstallStore((s) => s.isStandalone);
  const triggerInstall = usePwaInstallStore((s) => s.triggerInstall);
  const installing = usePwaInstallStore((s) => s.installing);
  const deferredPrompt = usePwaInstallStore((s) => s.deferredPrompt);
  const platform = usePwaInstallStore((s) => s.platform);
  const isIos = platform === 'ios' || platform === 'ios-other';
  const showInstall = !isStandalone;

  const handleInstall = () => {
    setOpen(false);
    triggerInstall();
  };

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-secondary/20 backdrop-blur-[2px]"
          aria-label="Cerrar menú de servicios"
          onClick={() => setOpen(false)}
        />
      )}
      <div
        className="client-fab-left fixed left-4 z-40 flex flex-col items-start gap-2"
        style={{ bottom: MOBILE_SIDE_FAB_BOTTOM }}
      >
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mb-1 w-[min(18rem,85vw)] overflow-hidden rounded-2xl border border-border/50 bg-card shadow-lift"
          >
            {CLIENT_SERVICE_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 border-b border-[#D5E3EF] px-3.5 py-3 text-sm font-semibold text-[#0D2B45] transition-colors last:border-0 hover:bg-[#E6F4FF]/70"
              >
                <ServiceIconTile
                  serviceId={link.icon}
                  name={link.icon}
                  tone={link.icon === 'envios' || link.icon === 'mensajeria' ? 'blue' : 'green'}
                  size="sm"
                />
                <span className="min-w-0">
                  {link.label}
                  <span className="block text-[10px] font-normal text-[#4A6278]">{link.hint}</span>
                </span>
              </Link>
            ))}
            {showInstall && (
              <button
                type="button"
                onClick={handleInstall}
                disabled={installing}
                className="flex w-full items-center gap-3 px-3.5 py-3 text-left text-sm font-semibold text-[#0D2B45] transition-colors hover:bg-[#E6F4FF]/70 disabled:opacity-70"
              >
                <ServiceIconTile name="download" tone="green" size="sm" />
                <span>
                  {installing ? 'Instalando…' : isIos ? 'Agregar a inicio' : 'Instalar app'}
                  <span className="block text-[10px] font-normal text-muted-foreground">
                    {deferredPrompt ? 'Un toque en tu dispositivo' : 'Acceso rápido como app'}
                  </span>
                </span>
              </button>
            )}
          </motion.div>
        )}
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          whileTap={{ scale: 0.94 }}
          className="brand-fab brand-fab--services"
          aria-expanded={open}
          aria-label={open ? 'Cerrar servicios' : 'Servicios UrabApp'}
        >
          <AppIcon
            name={open ? 'chevronDown' : 'mensajeria'}
            size={22}
            className={open ? 'rotate-180 text-white' : 'text-white'}
          />
        </motion.button>
      </div>
    </>
  );
}
