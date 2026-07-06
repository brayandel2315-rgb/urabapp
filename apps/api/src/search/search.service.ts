import { Injectable } from '@nestjs/common';
import type { SearchQuery } from '../common/schemas';

@Injectable()
export class SearchService {
  async execute({ q, municipio, limit }: SearchQuery) {
    // TODO: conectar PostgreSQL / Supabase REST
    return {
      businesses: [],
      products: [],
      categories: [],
      suggestions: [q],
      meta: { municipio, limit },
    };
  }
}
