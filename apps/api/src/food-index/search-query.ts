import type { SearchSortingAlgorithm } from '@intake24/common/surveys';

export interface SearchQuery {
  queryId: number;
  localeId: string;
  description: string;
  previous: string[];
  limit?: string;
  rankingAlgorithm: SearchSortingAlgorithm;
  matchScoreWeight: number;
  exit?: boolean;
}
