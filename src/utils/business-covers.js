/**
 * Portadas de comercio — delega al catálogo visual centralizado.
 */
import {
  BUSINESS_COVERS,
  CATEGORY_COVERS,
  resolveBusinessCoverFromCatalog,
} from '../data/catalog-visuals';

export const BUSINESS_COVER_BY_CATEGORY = CATEGORY_COVERS;
export const BUSINESS_COVER_BY_SLUG = BUSINESS_COVERS;

export function resolveBusinessCoverUrl(business) {
  return resolveBusinessCoverFromCatalog(business);
}
