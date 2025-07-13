import type { PhraseMatchResult } from '@intake24/api/food-index/phrase-index';

export interface SemanticMatchResult {
  key: string;
  phrase: string;
  semanticScore: number;
  textHash: string;
}

export interface HybridMatchResult extends PhraseMatchResult<string> {
  semanticScore: number;
  hybridScore: number;
  matchMethod: 'phonetic' | 'semantic' | 'hybrid';
  isExactMatch?: boolean;
}

export interface SemanticSearchConfig {
  enabled: boolean;
  weight: number; // 0-1, balance with phonetic
  phoneticWeight: number; // 0-1, balance with semantic
  similarityThreshold: number;
  maxResults: number;
  fallbackToPhonetic: boolean;
}

export interface ExactMatchConfig {
  enabled: boolean;
  strictPriority: boolean; // Whether exact matches always rank first
  crossScriptMatching: boolean; // Enable hiragana/katakana/romaji cross-matching
  ignoreBoostsForExactMatches: boolean; // Don't apply category boosts to exact matches
  preserveExactMatchScores: boolean; // Preserve original scores for exact matches
}

export interface EmbeddingCacheEntry {
  id: string;
  foodCode: string;
  localeId: string;
  embedding: number[];
  textHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueryEmbeddingRequest {
  query: string;
  localeId: string;
  maxResults?: number;
  similarityThreshold?: number;
}

export interface SemanticSearchResult {
  foods: HybridMatchResult[];
  categories: HybridMatchResult[];
  searchMethod: 'phonetic' | 'semantic' | 'hybrid';
  semanticEnabled: boolean;
  debugInfo?: {
    phoneticResults: number;
    semanticResults: number;
    hybridResults: number;
    queryEmbeddingTime: number;
    semanticSearchTime: number;
    hybridScoringTime: number;
  };
}
