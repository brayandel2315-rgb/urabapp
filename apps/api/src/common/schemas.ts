import { z } from 'zod';

export const SearchQuerySchema = z.object({
  q: z.string().min(2),
  municipio: z.string().optional(),
  limit: z.coerce.number().max(50).default(12),
});

export const OffersQuerySchema = z.object({
  municipio: z.string(),
  barrio: z.string().optional(),
});

export const NearQuerySchema = z.object({
  municipio: z.string(),
  barrio: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  limit: z.coerce.number().max(50).default(12),
});

export const DeliveryQuoteSchema = z.object({
  pickup: z.string().min(3),
  dropoff: z.string().min(3),
  municipio: z.string(),
  priority: z.enum(['normal', 'urgent']).default('normal'),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type DeliveryQuoteDto = z.infer<typeof DeliveryQuoteSchema>;
