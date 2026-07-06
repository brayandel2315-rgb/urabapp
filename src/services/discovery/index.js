/**
 * Discovery API surface — home, verticales, búsqueda, trending.
 * @module discovery
 */
export {
  getHomeDiscovery,
  getVerticalDiscovery,
  getVerticalSection,
  discoverySearch,
  getTrendingSearches,
  getPopularSearches,
  trackSearchEvent,
  getLightMarketStats,
  filterVerticalPool,
} from '../discovery.service';
