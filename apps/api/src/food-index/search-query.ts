import {
  defaultSearchSettings,
  SearchSortingAlgorithm,
  SpellingCorrectionPreference,
} from '@intake24/common/surveys';

export interface OptionalSearchQueryParameters {
  previous?: string[];
  limit?: number;
  rankingAlgorithm?: SearchSortingAlgorithm;
  matchScoreWeight?: number;
  includeHidden?: boolean;
  limitToCategory?: string;
  spellingCorrectionPreference?: SpellingCorrectionPreference;
  minWordLength1?: number;
  minWordLength2?: number;
  enableEditDistance?: boolean;
  enablePhonetic?: boolean;
  minWordLengthPhonetic?: number;
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
  spellingCorrectionPreference: SpellingCorrectionPreference;
  minWordLength1: number;
  minWordLength2: number;
  enableEditDistance: boolean;
  enablePhonetic: boolean;
  minWordLengthPhonetic: number;
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
    rankingAlgorithm: optionalParameters.rankingAlgorithm ?? defaultSearchSettings.sortingAlgorithm,
    matchScoreWeight: optionalParameters.matchScoreWeight ?? defaultSearchSettings.matchScoreWeight,
    includeHidden: optionalParameters.includeHidden ?? false,
    limitToCategory: optionalParameters.limitToCategory,
    spellingCorrectionPreference: defaultSearchSettings.spellingCorrectionPreference,
    minWordLength1: optionalParameters.minWordLength1 ?? defaultSearchSettings.minWordLength1,
    minWordLength2: optionalParameters.minWordLength2 ?? defaultSearchSettings.minWordLength2,
    enableEditDistance: optionalParameters.enableEditDistance ?? defaultSearchSettings.enableEditDistance,
    enablePhonetic: optionalParameters.enablePhonetic ?? defaultSearchSettings.enablePhonetic,
    minWordLengthPhonetic: optionalParameters.minWordLengthPhonetic ?? defaultSearchSettings.minWordLengthPhonetic,
  };
}
