import { createHash } from 'node:crypto';
import OpenAI from 'openai';
import type { Logger } from '@intake24/common-backend';

export interface EmbeddingConfig {
  apiKey: string;
  model: string;
  maxRequestsPerMinute: number;
  maxTokensPerMinute: number;
  batchSize: number;
  enabled: boolean;
}

export interface EmbeddingRequest {
  id: string;
  text: string;
}

export interface EmbeddingResult {
  id: string;
  embedding: number[];
  textHash: string;
}

export interface RateLimitInfo {
  requestsRemaining: number;
  tokensRemaining: number;
  resetTime: Date;
}

export default function openAIEmbeddingService({
  embeddingConfig,
  logger,
}: {
  embeddingConfig: EmbeddingConfig;
  logger: Logger;
}) {
  const embeddingLogger = logger.child({ service: 'OpenAIEmbeddingService' });

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: embeddingConfig.apiKey,
  });

  // Rate limiting state
  let requestCount = 0;
  let tokenCount = 0;
  let lastResetTime = new Date();

  /**
   * Check if service is properly configured and enabled
   */
  const isEnabled = (): boolean => {
    return embeddingConfig.enabled && !!embeddingConfig.apiKey;
  };

  /**
   * Generate SHA256 hash of text content for caching
   */
  const generateTextHash = (text: string): string => {
    return createHash('sha256').update(text.trim().toLowerCase()).digest('hex');
  };

  /**
   * Estimate token count for text (rough approximation)
   */
  const estimateTokenCount = (text: string): number => {
    // Rough estimation: ~4 characters per token for English
    // Japanese text may have different ratios, but this is a conservative estimate
    return Math.ceil(text.length / 4);
  };

  /**
   * Check and update rate limits
   */
  const checkRateLimits = (estimatedTokens: number): { allowed: boolean; info: RateLimitInfo } => {
    const now = new Date();
    const minutesSinceReset = (now.getTime() - lastResetTime.getTime()) / (1000 * 60);

    // Reset counters every minute
    if (minutesSinceReset >= 1) {
      requestCount = 0;
      tokenCount = 0;
      lastResetTime = now;
    }

    const requestsRemaining = embeddingConfig.maxRequestsPerMinute - requestCount;
    const tokensRemaining = embeddingConfig.maxTokensPerMinute - tokenCount;
    const resetTime = new Date(lastResetTime.getTime() + 60 * 1000);

    const allowed = requestsRemaining > 0 && tokensRemaining >= estimatedTokens;

    return {
      allowed,
      info: {
        requestsRemaining,
        tokensRemaining,
        resetTime,
      },
    };
  };

  /**
   * Generate embedding for a single text
   */
  const generateSingleEmbedding = async (text: string): Promise<EmbeddingResult> => {
    if (!isEnabled()) {
      throw new Error('OpenAI embedding service is not enabled or configured');
    }

    const normalizedText = text.trim();
    if (!normalizedText) {
      throw new Error('Text cannot be empty');
    }

    const estimatedTokens = estimateTokenCount(normalizedText);
    const rateLimitCheck = checkRateLimits(estimatedTokens);

    if (!rateLimitCheck.allowed) {
      throw new Error(
        `Rate limit exceeded. Requests remaining: ${rateLimitCheck.info.requestsRemaining}, `
        + `Tokens remaining: ${rateLimitCheck.info.tokensRemaining}. `
        + `Resets at: ${rateLimitCheck.info.resetTime.toISOString()}`,
      );
    }

    try {
      embeddingLogger.debug('Generating single embedding', {
        textLength: normalizedText.length,
        estimatedTokens,
      });

      const response = await openai.embeddings.create({
        model: embeddingConfig.model,
        input: normalizedText,
        encoding_format: 'float',
      });

      // Update rate limit counters
      requestCount += 1;
      tokenCount += response.usage?.total_tokens || estimatedTokens;

      const embedding = response.data[0].embedding;
      const textHash = generateTextHash(normalizedText);

      embeddingLogger.debug('Successfully generated embedding', {
        embeddingDimensions: embedding.length,
        tokensUsed: response.usage?.total_tokens,
        textHash,
      });

      return {
        id: textHash, // Use hash as ID for single embeddings
        embedding,
        textHash,
      };
    }
    catch (error) {
      embeddingLogger.error('Failed to generate embedding', { error, textLength: normalizedText.length });
      throw new Error(`OpenAI embedding generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  /**
   * Generate embeddings for multiple texts in batch
   */
  const generateBatchEmbeddings = async (requests: EmbeddingRequest[]): Promise<EmbeddingResult[]> => {
    if (!isEnabled()) {
      throw new Error('OpenAI embedding service is not enabled or configured');
    }

    if (requests.length === 0) {
      return [];
    }

    if (requests.length > embeddingConfig.batchSize) {
      // Process in chunks
      const results: EmbeddingResult[] = [];
      for (let i = 0; i < requests.length; i += embeddingConfig.batchSize) {
        const chunk = requests.slice(i, i + embeddingConfig.batchSize);
        const chunkResults = await generateBatchEmbeddings(chunk);
        results.push(...chunkResults);
      }
      return results;
    }

    const texts = requests.map(req => req.text.trim()).filter(text => text.length > 0);
    const totalEstimatedTokens = texts.reduce((sum, text) => sum + estimateTokenCount(text), 0);

    const rateLimitCheck = checkRateLimits(totalEstimatedTokens);

    if (!rateLimitCheck.allowed) {
      throw new Error(
        `Rate limit exceeded for batch of ${requests.length} texts. `
        + `Requests remaining: ${rateLimitCheck.info.requestsRemaining}, `
        + `Tokens remaining: ${rateLimitCheck.info.tokensRemaining}. `
        + `Resets at: ${rateLimitCheck.info.resetTime.toISOString()}`,
      );
    }

    try {
      embeddingLogger.debug('Generating batch embeddings', {
        batchSize: texts.length,
        totalEstimatedTokens,
      });

      const response = await openai.embeddings.create({
        model: embeddingConfig.model,
        input: texts,
        encoding_format: 'float',
      });

      // Update rate limit counters
      requestCount += 1;
      tokenCount += response.usage?.total_tokens || totalEstimatedTokens;

      const results: EmbeddingResult[] = response.data.map((item, index) => ({
        id: requests[index].id,
        embedding: item.embedding,
        textHash: generateTextHash(requests[index].text),
      }));

      embeddingLogger.debug('Successfully generated batch embeddings', {
        batchSize: results.length,
        embeddingDimensions: results[0]?.embedding.length,
        tokensUsed: response.usage?.total_tokens,
      });

      return results;
    }
    catch (error) {
      embeddingLogger.error('Failed to generate batch embeddings', {
        error,
        batchSize: requests.length,
      });
      throw new Error(`OpenAI batch embedding generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  /**
   * Calculate cosine similarity between two embeddings
   */
  const calculateCosineSimilarity = (a: number[], b: number[]): number => {
    if (a.length !== b.length) {
      throw new Error('Embeddings must have the same dimensions');
    }

    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  };

  /**
   * Find most similar embeddings from a collection
   */
  const findSimilarEmbeddings = (
    queryEmbedding: number[],
    candidateEmbeddings: Array<{ id: string; embedding: number[] }>,
    threshold: number = 0.7,
    maxResults: number = 50,
  ): Array<{ id: string; similarity: number }> => {
    const similarities = candidateEmbeddings
      .map(candidate => ({
        id: candidate.id,
        similarity: calculateCosineSimilarity(queryEmbedding, candidate.embedding),
      }))
      .filter(result => result.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxResults);

    return similarities;
  };

  /**
   * Get current rate limit status
   */
  const getRateLimitStatus = (): RateLimitInfo => {
    const now = new Date();
    const minutesSinceReset = (now.getTime() - lastResetTime.getTime()) / (1000 * 60);

    if (minutesSinceReset >= 1) {
      return {
        requestsRemaining: embeddingConfig.maxRequestsPerMinute,
        tokensRemaining: embeddingConfig.maxTokensPerMinute,
        resetTime: new Date(now.getTime() + 60 * 1000),
      };
    }

    return {
      requestsRemaining: embeddingConfig.maxRequestsPerMinute - requestCount,
      tokensRemaining: embeddingConfig.maxTokensPerMinute - tokenCount,
      resetTime: new Date(lastResetTime.getTime() + 60 * 1000),
    };
  };

  return {
    isEnabled,
    generateSingleEmbedding,
    generateBatchEmbeddings,
    calculateCosineSimilarity,
    findSimilarEmbeddings,
    generateTextHash,
    estimateTokenCount,
    getRateLimitStatus,
  };
}

export type OpenAIEmbeddingService = ReturnType<typeof openAIEmbeddingService>;
