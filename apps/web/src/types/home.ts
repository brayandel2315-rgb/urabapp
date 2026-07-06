export type HomeCategory = {
  id: string;
  label: string;
  emoji: string;
  filter?: string;
  route?: string;
};

export type HomeBusiness = {
  id: string;
  name: string;
  slug?: string;
  rating?: number;
  deliveryTime?: number;
  isOpen?: boolean;
  distanceKm?: number | null;
  promoLabel?: string | null;
};

export type SearchResult = {
  businesses: Array<{ id: string; name: string; to: string; emoji?: string }>;
  products: Array<{ id: string; name: string; to: string; businessName?: string }>;
  categories: Array<{ id: string; label: string; to: string }>;
  suggestions: string[];
};
