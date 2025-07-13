import { createHash } from 'node:crypto';
import OpenAI from 'openai';
import { logger as mainLogger } from '@intake24/common-backend';
import type { Environment } from '@intake24/common/types';
import { Database, databaseConfig } from '@intake24/db';

export type GenerateEmbeddingsArgs = {
  localeId: string;
  batchSize?: number;
  dryRun?: boolean;
  force?: boolean;
};

export default async (cmd: GenerateEmbeddingsArgs): Promise<void> => {
  const logger = mainLogger.child({ service: 'GenerateEmbeddings' });

  const {
    localeId,
    batchSize = 50,
    dryRun = false,
    force = false,
  } = cmd;

  logger.info('Starting embedding generation', { localeId, batchSize, dryRun, force });

  // Initialize database connection
  const database = new Database({
    databaseConfig,
    logger,
    environment: (process.env.NODE_ENV || 'development') as Environment,
  });
  await database.init();

  try {
    // Initialize OpenAI client directly
    if (process.env.OPENAI_EMBEDDING_ENABLED !== 'true') {
      logger.error('OpenAI embedding service is not enabled. Set OPENAI_EMBEDDING_ENABLED=true');
      return;
    }

    if (!process.env.OPENAI_API_KEY) {
      logger.error('OpenAI API key is required. Set OPENAI_API_KEY environment variable.');
      return;
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const embeddingModel = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';
    const _maxBatchSize = Number.parseInt(process.env.OPENAI_EMBEDDING_BATCH_SIZE || '100', 10);

    // Get foods for the locale
    const foodsQuery = `
      SELECT f.code, fl.name
      FROM foods f
      JOIN food_locals fl ON f.code = fl.food_code
      WHERE fl.locale_id = :localeId
      AND fl.name IS NOT NULL
      AND fl.name != ''
      ORDER BY f.code
    `;

    const foodsResult = await database.foods.query(foodsQuery, { replacements: { localeId } }) as any;

    if (foodsResult[0].length === 0) {
      logger.warn('No foods found for locale', { localeId });
      return;
    }

    logger.info('Found foods for embedding generation', {
      localeId,
      totalFoods: foodsResult[0].length,
    });

    // Check existing embeddings
    let existingEmbeddings: Set<string> = new Set();

    if (!force) {
      const existingQuery = `
        SELECT food_code 
        FROM food_embeddings 
        WHERE locale_id = :localeId
      `;
      const existingResult = await database.foods.query(existingQuery, { replacements: { localeId } }) as any;
      existingEmbeddings = new Set(existingResult[0].map((row: any) => row.food_code));

      logger.info('Found existing embeddings', {
        localeId,
        existingCount: existingEmbeddings.size,
      });
    }

    // Filter foods that need embeddings
    const foodsToProcess = foodsResult[0].filter((row: any) =>
      force || !existingEmbeddings.has(row.code),
    );

    if (foodsToProcess.length === 0) {
      logger.info('All foods already have embeddings. Use --force to regenerate.');
      return;
    }

    logger.info('Foods requiring embeddings', {
      localeId,
      toProcess: foodsToProcess.length,
      skipped: foodsResult[0].length - foodsToProcess.length,
    });

    if (dryRun) {
      logger.info('Dry run - would process the following foods:', {
        sampleFoods: foodsToProcess.slice(0, 10).map((row: any) => ({
          code: row.code,
          name: row.name,
        })),
        totalToProcess: foodsToProcess.length,
      });
      return;
    }

    // Process foods in batches
    let processedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < foodsToProcess.length; i += batchSize) {
      const batch = foodsToProcess.slice(i, i + batchSize);

      logger.info('Processing batch', {
        batchNumber: Math.floor(i / batchSize) + 1,
        totalBatches: Math.ceil(foodsToProcess.length / batchSize),
        batchSize: batch.length,
      });

      try {
        // Prepare texts for embedding
        const texts = batch.map((food: any) => food.name);

        // Generate embeddings using OpenAI directly
        const response = await openai.embeddings.create({
          model: embeddingModel,
          input: texts,
          encoding_format: 'float',
        });

        // Process embedding results
        const embeddings = response.data.map((embeddingData: any, index: number) => {
          const food = batch[index];
          const textHash = createHash('sha256').update(food.name).digest('hex');

          return {
            id: food.code,
            embedding: embeddingData.embedding,
            textHash,
          };
        });

        // Store embeddings
        for (const embedding of embeddings) {
          try {
            const foodName = batch.find((f: any) => f.code === embedding.id)?.name;
            if (!foodName)
              continue;

            const embeddingJson = JSON.stringify(embedding.embedding);
            const now = new Date().toISOString();

            const insertQuery = `
              INSERT INTO food_embeddings (food_code, locale_id, text_content, embedding, embedding_hash, created_at, updated_at)
              VALUES (:foodCode, :localeId, :textContent, :embedding, :embeddingHash, :createdAt, :updatedAt)
              ON CONFLICT (locale_id, food_code) 
              DO UPDATE SET 
                text_content = EXCLUDED.text_content,
                embedding = EXCLUDED.embedding,
                embedding_hash = EXCLUDED.embedding_hash,
                updated_at = EXCLUDED.updated_at
            `;

            await database.foods.query(insertQuery, {
              replacements: {
                foodCode: embedding.id,
                localeId,
                textContent: foodName,
                embedding: embeddingJson,
                embeddingHash: embedding.textHash,
                createdAt: now,
                updatedAt: now,
              },
            });

            processedCount++;
          }
          catch (error) {
            logger.error('Failed to store embedding', {
              foodCode: embedding.id,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
            errorCount++;
          }
        }

        logger.info('Batch completed', {
          processed: embeddings.length,
          totalProcessed: processedCount,
          errors: errorCount,
        });

        // Rate limiting: small delay between batches
        if (i + batchSize < foodsToProcess.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      catch (error) {
        logger.error('Batch processing failed', {
          batchStart: i,
          batchSize: batch.length,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        errorCount += batch.length;
      }
    }

    logger.info('Embedding generation completed', {
      localeId,
      totalProcessed: processedCount,
      errors: errorCount,
      success: processedCount > 0 && errorCount === 0,
    });
  }
  catch (error) {
    logger.error('Embedding generation failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      localeId,
    });
    throw error;
  }
  finally {
    await database.close();
  }
};
