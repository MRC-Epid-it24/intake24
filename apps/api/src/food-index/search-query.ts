export interface SearchQuery {
  queryId: number;
  localeId: string;
  description: string;
  previous: string[];
  limit?: string;
  rankingAlgorithm: string;
  matchScoreWeight: number;
}
