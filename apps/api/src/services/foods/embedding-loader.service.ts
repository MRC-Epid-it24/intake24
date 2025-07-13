import type { EmbeddingCacheEntry } from '@intake24/api/food-index/semantic/types';
import type { IoC } from '@intake24/api/ioc';

export default function embeddingLoaderService({
  db,
  cache,
  cacheConfig,
  logger,
}: Pick<IoC, 'db' | 'cache' | 'cacheConfig' | 'logger'>) {
  const embeddingLogger = logger.child({ service: 'EmbeddingLoaderService' });

  /**
   * Load embeddings from database for a specific locale
   */
  const loadEmbeddings = async (localeId: string): Promise<Map<string, EmbeddingCacheEntry>> => {
    const cacheKey = `embeddings:${localeId}` as any;

    return cache.remember(cacheKey, cacheConfig.ttl, async () => {
      try {
        const embeddings = new Map<string, EmbeddingCacheEntry>();

        const query = `
          SELECT id, food_code, locale_id, text_content, embedding, embedding_hash, created_at, updated_at
          FROM food_embeddings 
          WHERE locale_id = :localeId
          ORDER BY updated_at DESC
        `;

        const result = await db.foods.query(query, { replacements: { localeId } });
        const rows = result[0] || [];

        for (const row of rows as any[]) {
          try {
            const embedding = JSON.parse(row.embedding);
            embeddings.set(row.food_code, {
              id: row.id.toString(),
              foodCode: row.food_code,
              localeId: row.locale_id,
              embedding,
              textHash: row.embedding_hash,
              createdAt: new Date(row.created_at),
              updatedAt: new Date(row.updated_at),
            });
          }
          catch (parseError) {
            embeddingLogger.warn('Failed to parse embedding for food', {
              foodCode: row.food_code,
              error: parseError,
            });
          }
        }

        embeddingLogger.info('Loaded embeddings from database', {
          localeId,
          count: embeddings.size,
          totalRows: rows.length,
        });

        return embeddings;
      }
      catch (error) {
        embeddingLogger.error('Failed to load embeddings', { error, localeId });
        return new Map();
      }
    });
  };

  /**
   * Check if embeddings exist for a locale
   */
  const hasEmbeddings = async (localeId: string): Promise<boolean> => {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM food_embeddings 
        WHERE locale_id = :localeId
      `;

      const result = await db.foods.query(query, { replacements: { localeId } });
      const rows = result[0] as any[];
      const count = Number.parseInt(rows[0]?.count || '0', 10);

      return count > 0;
    }
    catch (error) {
      embeddingLogger.error('Failed to check embeddings', { error, localeId });
      return false;
    }
  };

  /**
   * Clear embeddings cache for a locale
   */
  const clearCache = async (localeId: string): Promise<void> => {
    const cacheKey = `embeddings:${localeId}` as any;
    await cache.forget(cacheKey);
    embeddingLogger.debug('Cleared embeddings cache', { localeId });
  };

  return {
    loadEmbeddings,
    hasEmbeddings,
    clearCache,
  };
}

export type EmbeddingLoaderService = ReturnType<typeof embeddingLoaderService>;
