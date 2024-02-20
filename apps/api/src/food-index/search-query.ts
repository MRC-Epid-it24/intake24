import type { SearchSortingAlgorithm } from '@intake24/common/surveys';

export interface SearchQuery {
  type: 'query';
  queryId: number;
  localeId: string;
  description: string;
  previous: string[];
  limit?: string;
  rankingAlgorithm: SearchSortingAlgorithm;
  matchScoreWeight: number;
  includeHidden: boolean;
  limitToCategory?: string;
  exit?: boolean;
  rebuild?: boolean;
}
