import type { ExactMatchConfig, HybridMatchResult, SemanticMatchResult, SemanticSearchConfig } from './types';
import type { PhraseMatchResult } from '@intake24/api/food-index/phrase-index';
import type { Logger } from '@intake24/common-backend';

/**
 * Hybrid scoring service that combines phonetic and semantic search results
 */
export default function hybridScorerService({ logger }: { logger: Logger }) {
  const hybridLogger = logger.child({ service: 'HybridScorer' });

  /**
   * Detect if a result is an exact match with the search query
   */
  const isExactMatch = (phrase: string, searchQuery: string): boolean => {
    const normalizedPhrase = normalizeForExactMatch(phrase);
    const normalizedQuery = normalizeForExactMatch(searchQuery);

    // Check direct equality
    if (normalizedPhrase === normalizedQuery) {
      return true;
    }

    // For Japanese text, also check common script variations
    if (isJapaneseText(normalizedQuery)) {
      return checkJapaneseExactMatch(normalizedPhrase, normalizedQuery);
    }

    return false;
  };

  /**
   * Normalize text for exact match comparison
   */
  const normalizeForExactMatch = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      // Unicode normalization
      .normalize('NFKC')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Handle common punctuation variations
      .replace(/[・･]/g, '')
      .replace(/[ー‐－−]/g, 'ー');
  };

  /**
   * Check if text contains Japanese characters
   */
  const isJapaneseText = (text: string): boolean => {
    return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
  };

  /**
   * Check exact match for Japanese text considering script variations
   */
  const checkJapaneseExactMatch = (phrase: string, query: string): boolean => {
    // Convert both to hiragana for comparison
    const phraseHiragana = convertToHiragana(phrase);
    const queryHiragana = convertToHiragana(query);

    if (phraseHiragana === queryHiragana) {
      return true;
    }

    // Convert both to katakana for comparison
    const phraseKatakana = convertToKatakana(phrase);
    const queryKatakana = convertToKatakana(query);

    return phraseKatakana === queryKatakana;
  };

  /**
   * Simple hiragana conversion for exact match checking
   */
  const convertToHiragana = (text: string): string => {
    return text.replace(/[\u30A1-\u30F6]/g, (match) => {
      const code = match.charCodeAt(0) - 0x60;
      return String.fromCharCode(code);
    });
  };

  /**
   * Simple katakana conversion for exact match checking
   */
  const convertToKatakana = (text: string): string => {
    return text.replace(/[\u3041-\u3096]/g, (match) => {
      const code = match.charCodeAt(0) + 0x60;
      return String.fromCharCode(code);
    });
  };

  /**
   * Normalize scores to 0-1 range for consistent comparison
   */
  const normalizeScores = <T extends { quality: number }>(results: T[]): T[] => {
    if (results.length === 0)
      return [];

    const scores = results.map(r => r.quality);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const range = max - min;

    if (Math.abs(range) < 1e-6) {
      // All scores are the same, normalize to 1
      return results.map(r => ({ ...r, quality: 1 }));
    }

    return results.map(r => ({
      ...r,
      quality: (r.quality - min) / range,
    }));
  };

  /**
   * Convert phonetic match cost to similarity score (higher is better)
   * Preserves perfect matches (cost = 0) as similarity = 1.0
   */
  const convertPhoneticToSimilarity = (results: PhraseMatchResult<string>[]): PhraseMatchResult<string>[] => {
    if (results.length === 0)
      return [];

    const costs = results.map(r => r.quality);
    const min = Math.min(...costs);
    const max = Math.max(...costs);
    const range = max - min;

    // If all costs are the same
    if (Math.abs(range) < 1e-6) {
      // If all costs are 0 (perfect matches), return 1.0 for all
      const similarityScore = min === 0 ? 1.0 : 0.5;
      return results.map(r => ({ ...r, quality: similarityScore }));
    }

    return results.map((r) => {
      // Perfect match (cost = 0) always gets similarity = 1.0
      if (Math.abs(r.quality) < 1e-6) {
        return { ...r, quality: 1.0 };
      }

      // For non-perfect matches, use normalized conversion
      // Ensure perfect matches stay at 1.0 even in mixed results
      const similarity = 1.0 - (r.quality - min) / range;

      // Clamp to reasonable range and ensure perfect matches are preserved
      return {
        ...r,
        quality: Math.max(0, Math.min(1, similarity)),
      };
    });
  };

  /**
   * Merge phonetic and semantic results into hybrid results
   */
  const mergeResults = (
    phoneticResults: PhraseMatchResult<string>[],
    semanticResults: SemanticMatchResult[],
    config: SemanticSearchConfig,
    searchQuery?: string,
  ): HybridMatchResult[] => {
    const startTime = Date.now();

    // Convert phonetic costs to similarity scores and normalize
    const normalizedPhonetic = normalizeScores(convertPhoneticToSimilarity(phoneticResults));
    const normalizedSemantic = normalizeScores(semanticResults.map(r => ({ ...r, quality: r.semanticScore })));

    // Create maps for efficient lookup
    const phoneticMap = new Map<string, PhraseMatchResult<string>>();
    const semanticMap = new Map<string, SemanticMatchResult>();

    normalizedPhonetic.forEach(result => phoneticMap.set(result.key, result));
    normalizedSemantic.forEach(result => semanticMap.set(result.key, result));

    // Get all unique keys
    const allKeys = new Set([...phoneticMap.keys(), ...semanticMap.keys()]);

    const hybridResults: HybridMatchResult[] = [];

    for (const key of allKeys) {
      const phoneticResult = phoneticMap.get(key);
      const semanticResult = semanticMap.get(key);

      if (phoneticResult && semanticResult) {
        // Both phonetic and semantic matches - hybrid scoring
        const phoneticScore = phoneticResult.quality * config.phoneticWeight;
        const semanticScore = semanticResult.semanticScore * config.weight;
        const hybridScore = phoneticScore + semanticScore;

        // Check if this is an exact match
        const exactMatch = searchQuery ? isExactMatch(phoneticResult.phrase, searchQuery) : false;

        hybridResults.push({
          key,
          phrase: phoneticResult.phrase, // Prefer phonetic phrase for display
          quality: phoneticResult.quality,
          semanticScore: semanticResult.semanticScore,
          hybridScore,
          matchMethod: 'hybrid',
          isExactMatch: exactMatch,
        });
      }
      else if (phoneticResult) {
        // Only phonetic match
        const exactMatch = searchQuery ? isExactMatch(phoneticResult.phrase, searchQuery) : false;

        hybridResults.push({
          key,
          phrase: phoneticResult.phrase,
          quality: phoneticResult.quality,
          semanticScore: 0,
          hybridScore: phoneticResult.quality * config.phoneticWeight,
          matchMethod: 'phonetic',
          isExactMatch: exactMatch,
        });
      }
      else if (semanticResult) {
        // Only semantic match
        const exactMatch = searchQuery ? isExactMatch(semanticResult.phrase, searchQuery) : false;

        hybridResults.push({
          key,
          phrase: semanticResult.phrase,
          quality: 0,
          semanticScore: semanticResult.semanticScore,
          hybridScore: semanticResult.semanticScore * config.weight,
          matchMethod: 'semantic',
          isExactMatch: exactMatch,
        });
      }
    }

    // Enhanced sorting with exact match prioritization
    hybridResults.sort((a, b) => {
      // First tier: exact matches always rank first
      if (a.isExactMatch && !b.isExactMatch) {
        return -1; // a comes first
      }
      if (!a.isExactMatch && b.isExactMatch) {
        return 1; // b comes first
      }

      // If both are exact matches or both are not exact matches, use enhanced scoring
      if (a.isExactMatch && b.isExactMatch) {
        // Among exact matches, prefer higher quality scores
        return b.quality - a.quality;
      }

      // For non-exact matches, use the enhanced scoring system
      // Prioritize high phonetic quality matches significantly
      const aPhoneticBonus = a.quality > 0.9 ? 1.0 : 0;
      const bPhoneticBonus = b.quality > 0.9 ? 1.0 : 0;

      // Penalize semantic-only matches that are likely false positives
      const aSemanticPenalty = a.matchMethod === 'semantic' && a.semanticScore < 0.9 ? -0.3 : 0;
      const bSemanticPenalty = b.matchMethod === 'semantic' && b.semanticScore < 0.9 ? -0.3 : 0;

      const aFinalScore = a.hybridScore + aPhoneticBonus + aSemanticPenalty;
      const bFinalScore = b.hybridScore + bPhoneticBonus + bSemanticPenalty;

      return bFinalScore - aFinalScore;
    });

    // Limit results
    const limitedResults = hybridResults.slice(0, config.maxResults);

    const endTime = Date.now();
    hybridLogger.debug('Merged phonetic and semantic results', {
      phoneticCount: normalizedPhonetic.length,
      semanticCount: normalizedSemantic.length,
      hybridCount: limitedResults.length,
      exactMatches: limitedResults.filter(r => r.isExactMatch).length,
      hybridMethods: {
        phonetic: limitedResults.filter(r => r.matchMethod === 'phonetic').length,
        semantic: limitedResults.filter(r => r.matchMethod === 'semantic').length,
        hybrid: limitedResults.filter(r => r.matchMethod === 'hybrid').length,
      },
      processingTime: endTime - startTime,
    });

    return limitedResults;
  };

  /**
   * Apply boost to results that have both phonetic and semantic matches
   */
  const applyHybridBoost = (
    results: HybridMatchResult[],
    boostFactor: number = 1.2,
  ): HybridMatchResult[] => {
    return results.map((result) => {
      // Don't modify exact matches with boosts
      if (result.isExactMatch) {
        return result;
      }

      if (result.matchMethod === 'hybrid') {
        return {
          ...result,
          hybridScore: result.hybridScore * boostFactor,
        };
      }
      return result;
    }).sort((a, b) => {
      // Prioritize exact matches
      if (a.isExactMatch && !b.isExactMatch)
        return -1;
      if (!a.isExactMatch && b.isExactMatch)
        return 1;
      return b.hybridScore - a.hybridScore;
    });
  };

  /**
   * Apply category-based boosting for Japanese food contexts
   */
  const applyCategoryBoost = (
    results: HybridMatchResult[],
    searchQuery: string,
  ): HybridMatchResult[] => {
    const query = searchQuery.toLowerCase();

    // Define category boost rules
    const categoryBoosts = {
      // Sushi context - boost sushi-related items
      sushi: {
        triggers: ['すし', 'スシ', '寿司', 'sushi', 'nigiri', 'maki', 'にぎり', 'まき', '握り', '巻き'],
        patterns: [
          /寿司/g,
          /握り/g,
          /巻き/g,
          /軍艦/g,
          /刺身/g,
          /海鮮/g,
          /ちらし/g,
          /chirashi/g,
          /いなり/g,
          /inari/g,
          /california/g,
          /カリフォルニア/g,
        ],
        boost: 1.5,
      },
      // Sashimi context - boost raw fish
      sashimi: {
        triggers: ['さしみ', 'サシミ', '刺身', 'sashimi'],
        patterns: [
          /刺身/g,
          /生/g,
          /まぐろ/g,
          /マグロ/g,
          /鮪/g,
          /さけ/g,
          /サケ/g,
          /鮭/g,
          /サーモン/g,
          /salmon/g,
          /tuna/g,
          /えび/g,
          /エビ/g,
          /海老/g,
          /いか/g,
          /イカ/g,
          /烏賊/g,
          /たこ/g,
          /タコ/g,
          /蛸/g,
          /うに/g,
          /ウニ/g,
          /雲丹/g,
          /いくら/g,
          /イクラ/g,
        ],
        boost: 1.4,
      },
      // Japanese fish context
      japanese_fish: {
        triggers: ['魚', 'さかな', 'サカナ', 'fish', '海鮮', 'seafood'],
        patterns: [
          /魚/g,
          /海鮮/g,
          /鮮魚/g,
          /seafood/g,
          /fish/g,
        ],
        boost: 1.3,
      },
    };

    // Apply semantic blacklist for obviously wrong categories
    const semanticBlacklist = {
      triggers: ['すし', 'スシ', '寿司', 'sushi'],
      blacklistPatterns: [
        /coffee/gi,
        /コーヒー/g,
        /珈琲/g,
        /chocolate/gi,
        /チョコ/g,
        /ショコラ/g,
        /cake/gi,
        /ケーキ/g,
        /bread/gi,
        /パン/g,
        /pizza/gi,
        /ピザ/g,
        /pasta/gi,
        /パスタ/g,
        /burger/gi,
        /バーガー/g,
        /sandwich/gi,
        /サンドイッチ/g,
        /drink/gi,
        /飲み物/g,
        /beverage/gi,
        /smoothie/gi,
        /スムージー/g,
      ],
      penalty: 0.05,
    };

    return results.map((result) => {
      // Protect exact matches from being affected by category boosts/penalties
      if (result.isExactMatch) {
        return result; // Don't modify exact matches
      }

      let boostFactor = 1.0;
      let penaltyFactor = 1.0;

      // Apply category boosts
      for (const [categoryName, category] of Object.entries(categoryBoosts)) {
        const isTriggered = category.triggers.some(trigger =>
          query.includes(trigger.toLowerCase()),
        );

        if (isTriggered) {
          const hasMatchingPattern = category.patterns.some(pattern =>
            pattern.test(result.phrase),
          );

          if (hasMatchingPattern) {
            boostFactor = Math.max(boostFactor, category.boost);
            hybridLogger.debug(`Applied ${categoryName} boost`, {
              phrase: result.phrase,
              boost: category.boost,
              query: searchQuery,
            });
          }
        }
      }

      // Apply semantic blacklist penalties
      const shouldApplyBlacklist = semanticBlacklist.triggers.some(trigger =>
        query.includes(trigger.toLowerCase()),
      );

      if (shouldApplyBlacklist) {
        const hasBlacklistPattern = semanticBlacklist.blacklistPatterns.some(pattern =>
          pattern.test(result.phrase),
        );

        if (hasBlacklistPattern) {
          // Apply severe penalty to blacklisted items, especially for semantic-only matches
          penaltyFactor = result.matchMethod === 'semantic'
            ? semanticBlacklist.penalty
            : semanticBlacklist.penalty * 2; // Even hybrid matches get penalized

          hybridLogger.debug('Applied semantic blacklist penalty', {
            phrase: result.phrase,
            penalty: penaltyFactor,
            matchMethod: result.matchMethod,
            query: searchQuery,
          });
        }
      }

      return {
        ...result,
        hybridScore: result.hybridScore * boostFactor * penaltyFactor,
      };
    }).sort((a, b) => {
      // Prioritize exact matches
      if (a.isExactMatch && !b.isExactMatch)
        return -1;
      if (!a.isExactMatch && b.isExactMatch)
        return 1;
      return b.hybridScore - a.hybridScore;
    });
  };

  /**
   * Filter results by minimum semantic similarity threshold
   */
  const filterBySemanticThreshold = (
    results: HybridMatchResult[],
    threshold: number,
  ): HybridMatchResult[] => {
    return results.filter((result) => {
      // Always keep phonetic-only matches
      if (result.matchMethod === 'phonetic')
        return true;

      // Filter semantic and hybrid matches by threshold
      return result.semanticScore >= threshold;
    });
  };

  /**
   * Calculate diversity score to promote varied results
   */
  const calculateDiversityScore = (results: HybridMatchResult[]): HybridMatchResult[] => {
    const seen = new Set<string>();
    const diverseResults: HybridMatchResult[] = [];

    for (const result of results) {
      // Simple diversity based on first few characters of food name
      const diversityKey = result.phrase.toLowerCase().substring(0, 3);

      if (!seen.has(diversityKey) || diverseResults.length < 10) {
        diverseResults.push(result);
        seen.add(diversityKey);
      }
      else {
        // Don't penalize exact matches for diversity
        if (result.isExactMatch) {
          diverseResults.push(result);
        }
        else {
          // Apply small penalty for similar items
          diverseResults.push({
            ...result,
            hybridScore: result.hybridScore * 0.95,
          });
        }
      }
    }

    return diverseResults.sort((a, b) => {
      // Prioritize exact matches
      if (a.isExactMatch && !b.isExactMatch)
        return -1;
      if (!a.isExactMatch && b.isExactMatch)
        return 1;
      return b.hybridScore - a.hybridScore;
    });
  };

  /**
   * Main hybrid scoring function
   */
  const scoreHybridResults = (
    phoneticResults: PhraseMatchResult<string>[],
    semanticResults: SemanticMatchResult[],
    config: SemanticSearchConfig,
    options: {
      applyBoost?: boolean;
      diversityPenalty?: boolean;
      strictThreshold?: boolean;
      searchQuery?: string;
      applyCategoryBoost?: boolean;
      exactMatchConfig?: ExactMatchConfig;
    } = {},
  ): HybridMatchResult[] => {
    hybridLogger.debug('Starting hybrid scoring', {
      phoneticCount: phoneticResults.length,
      semanticCount: semanticResults.length,
      config: {
        semanticWeight: config.weight,
        phoneticWeight: config.phoneticWeight,
        threshold: config.similarityThreshold,
        maxResults: config.maxResults,
      },
    });

    let results = mergeResults(phoneticResults, semanticResults, config, options.searchQuery);

    // Apply semantic threshold filtering
    if (options.strictThreshold) {
      results = filterBySemanticThreshold(results, config.similarityThreshold);
    }

    // Apply hybrid boost to results with both types of matches
    if (options.applyBoost) {
      results = applyHybridBoost(results, 1.2);
    }

    // Apply category-based boosting for Japanese food contexts
    if (options.applyCategoryBoost && options.searchQuery) {
      results = applyCategoryBoost(results, options.searchQuery);
    }

    // Apply diversity scoring to promote varied results
    if (options.diversityPenalty) {
      results = calculateDiversityScore(results);
    }

    hybridLogger.debug('Completed hybrid scoring', {
      finalCount: results.length,
      exactMatches: results.filter(r => r.isExactMatch).length,
      topScores: results.slice(0, 5).map(r => ({
        key: r.key,
        phrase: r.phrase,
        method: r.matchMethod,
        hybridScore: r.hybridScore,
        phoneticQuality: r.quality,
        semanticScore: r.semanticScore,
        isExactMatch: r.isExactMatch,
      })),
    });

    return results;
  };

  return {
    normalizeScores,
    convertPhoneticToSimilarity,
    mergeResults,
    applyHybridBoost,
    applyCategoryBoost,
    filterBySemanticThreshold,
    calculateDiversityScore,
    scoreHybridResults,
  };
}

export type HybridScorerService = ReturnType<typeof hybridScorerService>;
