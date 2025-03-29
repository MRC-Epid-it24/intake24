import { env, pipeline } from '@huggingface/transformers';

let embedderPromise: Promise<any> | null = null;
const zhModel = 'jinaai/jina-embeddings-v2-base-zh';

/**
 * Returns a cached embedder for feature extraction using a lightweight transformer model.
 */
async function getEmbedder() {
  env.cacheDir = './.cache';
  try {
    if (!embedderPromise) {
      embedderPromise = pipeline('feature-extraction', zhModel, {
        dtype: 'int8',
      });
    }
    return await embedderPromise;
  }
  catch {
    return null;
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-8);
}

/**
 * Uses the transformer embedder to compute semantic similarity.
 * Returns a similarity score between 0 and 1.
 */
async function getSemanticSimilarity(query: string, phrase: string): Promise<number> {
  const transformer = await getEmbedder();

  if (!transformer)
    return 0.5;

  try {
    const queryTensor = (await transformer(query, { pooling: 'mean' }))[0];
    const phraseTensor = (await transformer(phrase, { pooling: 'mean' }))[0];

    // Extract the underlying data as normal arrays.
    const queryEmbedding = Array.from(queryTensor.ort_tensor.cpuData) as number[];
    const phraseEmbedding = Array.from(phraseTensor.ort_tensor.cpuData) as number[];

    // Compute and return cosine similarity.
    return cosineSimilarity(queryEmbedding, phraseEmbedding);
  }
  catch {
    return 0.5;
  }
}

export { getSemanticSimilarity };
