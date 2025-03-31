import { env, pipeline } from '@huggingface/transformers';
import NodeCache from 'node-cache';
import { logger } from '@intake24/common-backend';

let embedderPromise: Promise<any> | null = null;
// Using a multilingual model. A dedicated Japanese model could potentially offer better performance. (Currently, none that is optimized for Japanese and compatible withTransformers.js)
// See: https://huggingface.co/models?language=ja&pipeline_tag=feature-extraction&sort=trending
const multilingualModel = 'Supabase/gte-small';

const embeddingCache = new NodeCache({
  stdTTL: 86400, // 1 day
  checkperiod: 3600, // 1 hour
  useClones: false, // Store embeddings directly for performance
  maxKeys: 10000, // Adjust based on expected unique phrases
});

async function getEmbedder() {
  if (embedderPromise)
    return await embedderPromise;

  env.cacheDir = './.cache'; // Configure cache directory for Hugging Face models

  try {
    logger.info(`Initializing feature extraction pipeline with model: ${multilingualModel}`);
    embedderPromise = pipeline('feature-extraction', multilingualModel, {
      dtype: 'fp16',
    });
    const embedder = await embedderPromise;
    logger.info(`Pipeline initialized successfully.`);
    return embedder;
  }
  catch (error) {
    logger.error(`Failed to initialize Hugging Face pipeline: ${error instanceof Error ? error.message : error}`, { error });
    embedderPromise = null;
    return null;
  }
}

/**
 * Uses the transformer embedder to compute semantic similarity.
 * Returns a similarity score between 0 and 1. Returns null if embeddings cannot be generated.
 */
async function getSemanticSimilarity(query: string, phrase: string): Promise<number | null> {
  const transformer = await getEmbedder();

  if (!transformer) {
    logger.warn('Transformer unavailable, cannot compute semantic similarity.');
    return null;
  }

  try {
    // Helper to get embedding from cache or compute and cache it
    const getEmbedding = async (text: string): Promise<number[] | null> => {
      const cachedEmbedding = embeddingCache.get<number[]>(text);
      if (cachedEmbedding)
        return cachedEmbedding;

      const output = await transformer(text, { pooling: 'mean', normalize: true });

      if (!output?.[0]?.ort_tensor?.cpuData) {
        logger.warn(`Could not extract embedding tensor data for text: "${text}"`);
        return null;
      }
      const embedding = Array.from(output[0].ort_tensor.cpuData) as number[];

      embeddingCache.set(text, embedding);
      return embedding;
    };

    const queryEmbedding = await getEmbedding(query);
    const phraseEmbedding = await getEmbedding(phrase);

    if (!queryEmbedding || !phraseEmbedding) {
      logger.warn('Failed to generate embeddings for query or phrase.');
      return null;
    }

    // Compute and return cosine similarity.
    // Since embeddings are normalized, dot product is equivalent to cosine similarity
    let dot = 0;
    for (let i = 0; i < queryEmbedding.length; i++) {
      dot += queryEmbedding[i] * phraseEmbedding[i];
    }
    // Clamp the value slightly due to potential floating point inaccuracies
    return Math.max(0, Math.min(1, dot));
  }
  catch (error) {
    logger.error(`Error computing semantic similarity for query "${query}" and phrase "${phrase}": ${error instanceof Error ? error.message : error}`, { error });
    return null;
  }
}

export { getSemanticSimilarity };
