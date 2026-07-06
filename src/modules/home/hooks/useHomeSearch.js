import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from './useDebouncedValue';
import { homeSearch, homeTrack } from '../services/home-api.service';
import { useHomeSearchStore } from '../store/homeSearchStore';

export function useHomeSearch({ query, municipio, catalog, getBusinessesParams, enabled = true, userId }) {
  const debounced = useDebouncedValue(query, 300);
  const addHistory = useHomeSearchStore((s) => s.addHistory);
  const history = useHomeSearchStore((s) => s.history);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['home-search', debounced, municipio, catalog?.mode],
    queryFn: async () => {
      const result = await homeSearch({
        q: debounced,
        municipio,
        catalog,
        getBusinessesParams,
      });
      if (debounced.trim().length >= 2) {
        homeTrack('search', { query: debounced, municipio, results: result.businesses.length }, userId);
      }
      return result;
    },
    enabled: enabled && debounced.trim().length >= 2,
    staleTime: 30_000,
  });

  const commitSearch = (q) => addHistory(q);

  return {
    debouncedQuery: debounced,
    results: data ?? { businesses: [], products: [], categories: [], suggestions: [] },
    history,
    isLoading,
    isError,
    refetch,
    commitSearch,
    isEmpty: debounced.length >= 2 && !isLoading && !(data?.businesses?.length || data?.products?.length),
  };
}
