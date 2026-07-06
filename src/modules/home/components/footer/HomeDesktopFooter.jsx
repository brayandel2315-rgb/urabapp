import { Link } from 'react-router-dom';
import logo from '@/assets/logo/logo-icon.svg';
import { BRAND } from '@/utils/constants';
import { HOME_FOOTER_COLUMNS } from '@/modules/home/constants/footer-links';
import AppIcon from '@/design-system/icons/AppIcon';

const DECO_ICONS = ['envios', 'package', 'delivery', 'map'];

export default function HomeDesktopFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="urabapp-desktop-footer" aria-label="Pie de página">
      <div className="urabapp-desktop-footer__waves" aria-hidden />
      <div className="urabapp-desktop-footer__dots" aria-hidden />
      <div className="urabapp-desktop-footer__glow urabapp-desktop-footer__glow--left" aria-hidden />
      <div className="urabapp-desktop-footer__glow urabapp-desktop-footer__glow--right" aria-hidden />

      <div className="urabapp-desktop-footer__inner">
        <div className="urabapp-desktop-footer__main">
          <div className="urabapp-desktop-footer__brand">
            <Link to="/" className="urabapp-desktop-footer__logo-link">
              <img src={logo} alt="" className="urabapp-desktop-footer__logo" />
              <span>
                <span className="urabapp-desktop-footer__name">{BRAND.name}</span>
                <span className="urabapp-desktop-footer__tagline">{BRAND.shortTagline}</span>
              </span>
            </Link>
            <p className="urabapp-desktop-footer__motto">{BRAND.motto}</p>
            <div className="urabapp-desktop-footer__badges" aria-hidden>
              {DECO_ICONS.map((icon) => (
                <span key={icon} className="urabapp-desktop-footer__badge">
                  <AppIcon name={icon} size={18} />
                </span>
              ))}
            </div>
          </div>

          <nav className="urabapp-desktop-footer__nav" aria-label="Enlaces del sitio">
            {HOME_FOOTER_COLUMNS.map((col) => (
              <div key={col.id} className="urabapp-desktop-footer__col">
                <p className="urabapp-desktop-footer__col-title">{col.title}</p>
                <ul className="urabapp-desktop-footer__links">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <Link to={link.to} className="urabapp-desktop-footer__link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="urabapp-desktop-footer__swoosh" aria-hidden />

        <div className="urabapp-desktop-footer__bottom">
          <p className="urabapp-desktop-footer__copy">
            © {year} {BRAND.name} · Urabá, Antioquia
          </p>
          <div className="urabapp-desktop-footer__swoosh-lines" aria-hidden>
            <span className="urabapp-desktop-footer__line urabapp-desktop-footer__line--orange" />
            <span className="urabapp-desktop-footer__line urabapp-desktop-footer__line--blue" />
            <span className="urabapp-desktop-footer__line urabapp-desktop-footer__line--green" />
          </div>
        </div>
      </div>

      <div className="urabapp-desktop-footer__leaf-band" aria-hidden />
    </footer>
  );
}
