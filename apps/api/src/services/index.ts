export * from './admin';
export * from './ai';
export * from './core';
export * from './feedback';
export * from './foods';
export * from './survey';
export * from './user.service';
export { default as userService } from './user.service';

// Re-export semantic services for easier access
export {
  hybridScorerService,
  type HybridScorerService,
  semanticSearchService,
  type SemanticSearchService,
} from '@intake24/api/food-index/semantic';
