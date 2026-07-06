import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MOBILE_SIDE_FAB_BOTTOM } from '@/constants/floatingUi';
import soporteIcon from '@/assets/services/soporte.png';

export default function InAppSupportButton() {
  return (
    <motion.div
      className="client-fab-right fixed right-4 z-40"
      style={{ bottom: MOBILE_SIDE_FAB_BOTTOM }}
      whileTap={{ scale: 0.94 }}
    >
      <Link
        to="/soporte"
        className="brand-fab brand-fab--support-image"
        aria-label="Soporte en la app"
      >
        <img
          src={soporteIcon}
          alt=""
          className="h-14 w-14 object-contain service-icon-3d"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </Link>
    </motion.div>
  );
}
