import type { SearchSortingAlgorithm } from '@intake24/common/surveys';

export interface OptionalSearchQueryParameters {
  previous?: string[];
  limit?: number;
  rankingAlgorithm?: SearchSortingAlgorithm;
  matchScoreWeight?: number;
  includeHidden?: boolean;
  limitToCategory?: string;
  minWordLength1?: number;
  minWordLength2?: number;
}

export interface SearchQueryParameters {
  localeId: string;
  description: string;
  previous: string[];
  limit: number;
  rankingAlgorithm: SearchSortingAlgorithm;
  matchScoreWeight: number;
  includeHidden: boolean;
  limitToCategory?: string;
  minWordLength1: number;
  minWordLength2: number;
}

export interface SearchQuery {
  type: 'query';
  queryId: number;
  parameters: SearchQueryParameters;
}

export function applyDefaultSearchQueryParameters(localeId: string, description: string, optionalParameters: OptionalSearchQueryParameters): SearchQueryParameters {
  return {
    localeId,
    description,
    previous: optionalParameters.previous ?? [],
    limit: optionalParameters.limit ?? 50,
    rankingAlgorithm: optionalParameters.rankingAlgorithm ?? 'popularity',
    matchScoreWeight: optionalParameters.matchScoreWeight ?? 20,
    includeHidden: optionalParameters.includeHidden ?? false,
    limitToCategory: optionalParameters.limitToCategory,
    minWordLength1: optionalParameters.minWordLength1 ?? 3,
    minWordLength2: optionalParameters.minWordLength2 ?? 6,
  };
}
