import { Controller, Get, Query } from '@nestjs/common';
import { SearchQuerySchema } from '../common/schemas';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get()
  async search(@Query() raw: Record<string, string>) {
    const query = SearchQuerySchema.parse(raw);
    return this.search.execute(query);
  }
}
