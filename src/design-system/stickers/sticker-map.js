import { STICKER_COMPONENTS } from './StickerArt';
import { EMOJI_TO_ICON } from '../icons/icon-map';

/** Mapeo nombre → sticker IA (sin emojis en UI) */
export const STICKER_IDS = new Set(Object.keys(STICKER_COMPONENTS));

const LEGACY_ICON_TO_STICKER = {
  home: 'search',
  comida: 'restaurantes',
  pharmacy: 'farmacia',
  market: 'mercado',
  mensajeria: 'mensajeria',
  mandado: 'mensajeria',
  envios: 'envios',
  tiendas: 'tiendas',
  store: 'comercio',
  cart: 'pedido',
  orders: 'pedido',
  profile: 'perfil',
  money: 'pago',
  wallet: 'pago',
  card: 'pago',
  tag: 'cupones',
  bell: 'notificaciones',
  settings: 'configuracion',
  search: 'search',
  star: 'favoritos',
};

export function resolveStickerId(name) {
  if (!name) return 'comercio';
  if (STICKER_IDS.has(name)) return name;
  if (LEGACY_ICON_TO_STICKER[name]) return LEGACY_ICON_TO_STICKER[name];
  if (EMOJI_TO_ICON[name] && LEGACY_ICON_TO_STICKER[EMOJI_TO_ICON[name]]) {
    return LEGACY_ICON_TO_STICKER[EMOJI_TO_ICON[name]];
  }
  return 'comercio';
}

export function hasSticker(name) {
  const id = resolveStickerId(name);
  return Boolean(STICKER_COMPONENTS[id]);
}
