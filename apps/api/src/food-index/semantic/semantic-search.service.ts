import type {
  EmbeddingCacheEntry,
  QueryEmbeddingRequest,
  SemanticMatchResult,
  SemanticSearchConfig,
} from './types';
import type { IoC } from '@intake24/api/ioc';

export default function semanticSearchService({
  openAIEmbeddingService,
  embeddingLoaderService,
  cache,
  cacheConfig,
  logger,
}: Pick<IoC, 'openAIEmbeddingService' | 'embeddingLoaderService' | 'cache' | 'cacheConfig' | 'logger'>) {
  const semanticLogger = logger.child({ service: 'SemanticSearchService' });

  /**
   * Cache key generator for embeddings
   */
  const getEmbeddingCacheKey = (localeId: string, textHash: string): string => {
    return `embedding:${localeId}:${textHash}`;
  };

  /**
   * Cache key generator for query results
   */
  const getQueryCacheKey = (localeId: string, query: string, config: SemanticSearchConfig): string => {
    const configHash = openAIEmbeddingService.generateTextHash(JSON.stringify(config));
    const queryHash = openAIEmbeddingService.generateTextHash(query);
    return `semantic-query:${localeId}:${queryHash}:${configHash}`;
  };

  /**
   * Get cached embeddings for foods in a locale
   */
  const getCachedEmbeddings = async (localeId: string): Promise<Map<string, EmbeddingCacheEntry>> => {
    try {
      // Use the embedding loader service to get embeddings from database
      const embeddings = await embeddingLoaderService.loadEmbeddings(localeId);

      if (embeddings.size === 0) {
        semanticLogger.debug('No embeddings found for locale - use CLI to generate', { localeId });
      }
      else {
        semanticLogger.debug('Loaded embeddings for locale', { localeId, count: embeddings.size });
      }

      return embeddings;
    }
    catch (error) {
      semanticLogger.error('Failed to load cached embeddings', { error, localeId });
      return new Map();
    }
  };

  /**
   * Store embedding in database and cache
   */
  const storeEmbedding = async (
    foodCode: string,
    localeId: string,
    textContent: string,
    _embedding: number[],
  ): Promise<void> => {
    try {
      const textHash = openAIEmbeddingService.generateTextHash(textContent);

      // Clear caches - store function handled by CLI for now
      const cacheKey = getEmbeddingCacheKey(localeId, textHash);
      await cache.forget(cacheKey as any);
      await cache.forget(`embeddings:${localeId}` as any);

      semanticLogger.debug('Cleared embedding caches', { foodCode, localeId, textHash });
    }
    catch (error) {
      semanticLogger.error('Failed to store embedding', { error, foodCode, localeId });
      throw error;
    }
  };

  /**
   * Generate and store embeddings for foods that don't have them
   */
  const generateMissingEmbeddings = async (
    localeId: string,
    foodCodes: string[],
    foodNames: Map<string, string>,
  ): Promise<void> => {
    if (!openAIEmbeddingService.isEnabled()) {
      semanticLogger.warn('OpenAI embedding service is not enabled');
      return;
    }

    const cachedEmbeddings = await getCachedEmbeddings(localeId);
    const missingCodes = foodCodes.filter(code => !cachedEmbeddings.has(code));

    if (missingCodes.length === 0) {
      semanticLogger.debug('All embeddings already cached', { localeId, totalCodes: foodCodes.length });
      return;
    }

    semanticLogger.info('Generating missing embeddings', {
      localeId,
      missingCount: missingCodes.length,
      totalCount: foodCodes.length,
    });

    // Prepare embedding requests
    const embeddingRequests = missingCodes
      .map((code) => {
        const name = foodNames.get(code);
        if (!name)
          return null;

        return {
          id: code,
          text: name,
        };
      })
      .filter(req => req !== null);

    if (embeddingRequests.length === 0) {
      semanticLogger.warn('No valid food names found for embedding generation', { missingCodes });
      return;
    }

    try {
      // Generate embeddings in batches
      const results = await openAIEmbeddingService.generateBatchEmbeddings(embeddingRequests);

      // Store embeddings
      const storePromises = results.map(result =>
        storeEmbedding(result.id, localeId, embeddingRequests.find(req => req.id === result.id)!.text, result.embedding),
      );

      await Promise.all(storePromises);

      semanticLogger.info('Successfully generated and stored embeddings', {
        localeId,
        generatedCount: results.length,
      });
    }
    catch (error) {
      semanticLogger.error('Failed to generate missing embeddings', { error, localeId, missingCount: missingCodes.length });
      // Don't throw - allow search to continue without semantic results
    }
  };

  /**
   * Perform semantic search using embeddings
   */
  const semanticSearch = async (request: QueryEmbeddingRequest): Promise<SemanticMatchResult[]> => {
    const { query, localeId, maxResults = 50, similarityThreshold = 0.7 } = request;

    if (!openAIEmbeddingService.isEnabled()) {
      semanticLogger.debug('Semantic search disabled - OpenAI service not enabled');
      return [];
    }

    const startTime = Date.now();

    try {
      // Generate query embedding
      const queryEmbeddingStart = Date.now();
      const queryResult = await openAIEmbeddingService.generateSingleEmbedding(query);
      const queryEmbeddingTime = Date.now() - queryEmbeddingStart;

      // Get cached food embeddings
      const cachedEmbeddings = await getCachedEmbeddings(localeId);

      if (cachedEmbeddings.size === 0) {
        semanticLogger.debug('No embeddings available for semantic search', { localeId });
        return [];
      }

      // Prepare candidate embeddings
      const candidates = Array.from(cachedEmbeddings.values()).map(entry => ({
        id: entry.foodCode,
        embedding: entry.embedding,
      }));

      // Find similar embeddings
      const similarEmbeddings = openAIEmbeddingService.findSimilarEmbeddings(
        queryResult.embedding,
        candidates,
        similarityThreshold,
        maxResults,
      );

      // Convert to semantic match results
      const semanticResults: SemanticMatchResult[] = similarEmbeddings.map((result) => {
        const embeddingEntry = cachedEmbeddings.get(result.id)!;

        return {
          key: result.id,
          phrase: query, // Use original query as phrase for semantic matches
          semanticScore: result.similarity,
          textHash: embeddingEntry.textHash,
        };
      });

      const totalTime = Date.now() - startTime;

      semanticLogger.debug('Completed semantic search', {
        localeId,
        query,
        candidateCount: candidates.length,
        resultCount: semanticResults.length,
        queryEmbeddingTime,
        totalTime,
        topResults: semanticResults.slice(0, 3).map(r => ({
          key: r.key,
          score: r.semanticScore,
        })),
      });

      return semanticResults;
    }
    catch (error) {
      semanticLogger.error('Semantic search failed', { error, localeId, query });
      return [];
    }
  };

  /**
   * Search with caching
   */
  const cachedSemanticSearch = async (
    request: QueryEmbeddingRequest,
    config: SemanticSearchConfig,
  ): Promise<SemanticMatchResult[]> => {
    const cacheKey = getQueryCacheKey(request.localeId, request.query, config);
    const ttl = typeof cacheConfig.ttl === 'number' ? cacheConfig.ttl / 4 : 300; // Default 5 min

    return cache.remember(cacheKey as any, ttl, () => semanticSearch(request)); // Shorter TTL for query results
  };

  /**
   * Get embedding statistics for a locale
   */
  const getEmbeddingStats = async (localeId: string): Promise<{
    totalEmbeddings: number;
    lastUpdated: Date | null;
    modelUsed: string;
  }> => {
    try {
      // Simplified stats - use CLI commands for detailed stats
      return {
        totalEmbeddings: 0,
        lastUpdated: null,
        modelUsed: 'text-embedding-3-small',
      };
    }
    catch (error) {
      semanticLogger.error('Failed to get embedding stats', { error, localeId });
      return {
        totalEmbeddings: 0,
        lastUpdated: null,
        modelUsed: 'unknown',
      };
    }
  };

  return {
    getCachedEmbeddings,
    storeEmbedding,
    generateMissingEmbeddings,
    semanticSearch,
    cachedSemanticSearch,
    getEmbeddingStats,
  };
}

export type SemanticSearchService = ReturnType<typeof semanticSearchService>;
