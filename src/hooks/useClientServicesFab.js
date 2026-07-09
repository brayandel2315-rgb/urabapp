import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CLIENT_HOME } from '@/app/clientNav';

const DISMISS_KEY = 'urabapp-services-fab-dismiss';
const PEEK_KEY = 'urabapp-services-fab-peeked';
const VISIT_KEY = 'urabapp-services-fab-visits';
const SCROLL_DELTA = 14;
const TOP_ZONE = 56;

const HIDDEN_ROUTE_PREFIXES = ['/mandado', '/envios', '/soporte', '/checkout', '/carrito'];

function readDismissUntil() {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return 0;
  const ts = Number(raw);
  return Number.isFinite(ts) ? ts : 0;
}

function bumpVisits() {
  const n = Number(localStorage.getItem(VISIT_KEY) || 0) + 1;
  localStorage.setItem(VISIT_KEY, String(n));
  return n;
}

function hasPeeked() {
  return localStorage.getItem(PEEK_KEY) === '1';
}

function markPeeked() {
  localStorage.setItem(PEEK_KEY, '1');
}

export function useClientServicesFab() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrollVisible, setScrollVisible] = useState(true);
  const [dismissedUntil, setDismissedUntil] = useState(readDismissUntil);
  const [visitCount, setVisitCount] = useState(() => Number(localStorage.getItem(VISIT_KEY) || 0));
  const [showTeaser, setShowTeaser] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  const onHiddenRoute = HIDDEN_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const dismissed = Date.now() < dismissedUntil;
  const isHome = pathname === CLIENT_HOME;
  const shouldRender = !onHiddenRoute && !dismissed;
  const visible = shouldRender && scrollVisible;

  const dismiss = useCallback((days = 1) => {
    const until = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, String(until));
    setDismissedUntil(until);
    setOpen(false);
    setShowTeaser(false);
  }, []);

  const toggle = useCallback(() => {
    setOpen((v) => !v);
    setShowTeaser(false);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    setOpen(false);
    setScrollVisible(true);
    lastY.current = window.scrollY;
    const visits = bumpVisits();
    setVisitCount(visits);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current || open) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;

        if (y <= TOP_ZONE) {
          setScrollVisible(true);
        } else if (delta > SCROLL_DELTA) {
          setScrollVisible(false);
        } else if (delta < -SCROLL_DELTA) {
          setScrollVisible(true);
        }

        lastY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  useEffect(() => {
    if (!shouldRender || !isHome || hasPeeked() || visitCount > 4) return undefined;

    const timer = window.setTimeout(() => {
      setShowTeaser(true);
      markPeeked();
    }, 2200);

    const hideTimer = window.setTimeout(() => {
      setShowTeaser(false);
    }, 9000);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(hideTimer);
    };
  }, [shouldRender, isHome, visitCount]);

  return {
    open,
    visible,
    shouldRender,
    showTeaser,
    toggle,
    close,
    dismiss,
    isHome,
  };
}
