import { getHomeDiscovery } from '../src/services/discovery.service.js';
import { buildCatalogContext } from '../src/utils/catalog-location.js';

const catalog = buildCatalogContext({ homeMunicipio: 'Apartadó' });
const r = await getHomeDiscovery({
  municipio: 'Apartadó',
  catalog,
  getBusinessesParams: { catalog, municipio: 'Apartadó' },
});
console.log('OK', Object.keys(r), 'featured', r.featured?.length);
