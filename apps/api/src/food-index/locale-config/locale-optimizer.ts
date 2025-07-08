/**
 * Generic locale-specific search optimizer
 * Replaces hardcoded Japanese optimizations with configurable system
 */

import type { LocaleConfigLoader, LocaleSearchConfig } from './types';
import type { PhraseMatchResult } from '@intake24/api/food-index/phrase-index';
import type { OptionalSearchQueryParameters } from '@intake24/api/food-index/search-query';
import type { Logger } from '@intake24/common-backend';
import { defaultConfigLoader } from './config-loader';

export class LocaleOptimizer {
  private configLoader: LocaleConfigLoader;
  private configCache: Map<string, LocaleSearchConfig | null> = new Map();

  constructor(configLoader: LocaleConfigLoader = defaultConfigLoader) {
    this.configLoader = configLoader;
  }

  /**
   * Apply locale-specific search parameter optimizations
   * Replaces the hardcoded Japanese logic in food-search.service.ts
   */
  async applySearchOptimizations(
    localeId: string,
    originalOptions: OptionalSearchQueryParameters,
    logger: Logger,
  ): Promise<OptionalSearchQueryParameters> {
    const config = await this.getLocaleConfig(localeId);

    if (!config || !config.searchOptimizations) {
      return originalOptions;
    }

    const optimizations = config.searchOptimizations;
    const optimizedOptions = { ...originalOptions };

    // Apply match score weight optimization if not already specified
    if (optimizations.matchScoreWeight !== undefined && !originalOptions.matchScoreWeight) {
      optimizedOptions.matchScoreWeight = optimizations.matchScoreWeight;

      logger.debug(
        `Applied locale optimization for ${localeId}: matchScoreWeight set to ${optimizations.matchScoreWeight}%`,
      );
    }

    return optimizedOptions;
  }

  /**
   * Apply primary name boost for locale-specific ranking
   * Replaces the hardcoded Japanese logic in ranking.ts
   */
  async applyPrimaryNameBoost(
    localeId: string,
    results: PhraseMatchResult<string>[],
    foodNames: Map<string, string>,
    logger: Logger,
  ): Promise<PhraseMatchResult<string>[]> {
    const config = await this.getLocaleConfig(localeId);

    if (!config || !config.searchOptimizations.enablePrimaryNameBoost) {
      return results;
    }

    const boostFactor = config.searchOptimizations.primaryNameBoostFactor || 0.2;
    const languageVariants = config.languageVariants || {};

    return results.map((result) => {
      const primaryName = foodNames.get(result.key);

      if (!primaryName) {
        return result;
      }

      const matchedPhrase = result.phrase.toLowerCase();
      const primaryNameLower = primaryName.toLowerCase();

      // Check for language-specific variants
      let isVariantMatch = false;
      if (languageVariants[matchedPhrase]) {
        isVariantMatch = languageVariants[matchedPhrase].some(variant =>
          primaryNameLower.includes(variant.toLowerCase()),
        );
      }

      // Check for exact match or if primary name contains the matched phrase
      const isPrimaryNameMatch = matchedPhrase === primaryNameLower
        || primaryNameLower.includes(matchedPhrase)
        || isVariantMatch;

      if (isPrimaryNameMatch) {
        const boostedQuality = result.quality * boostFactor;

        logger.debug(
          `Primary name boost applied for ${localeId}: ${result.key} (${matchedPhrase} -> ${primaryNameLower}) quality: ${result.quality} -> ${boostedQuality}`,
        );

        return {
          ...result,
          quality: boostedQuality,
        };
      }

      return result;
    });
  }

  /**
   * Check if deduplication logging should be enabled
   * Replaces the hardcoded Japanese logic in index-builder.ts
   */
  async shouldLogDeduplication(localeId: string): Promise<boolean> {
    const config = await this.getLocaleConfig(localeId);
    return config?.searchOptimizations.enableDeduplicationLogging || false;
  }

  /**
   * Get locale configuration with caching
   */
  private async getLocaleConfig(localeId: string): Promise<LocaleSearchConfig | null> {
    if (this.configCache.has(localeId)) {
      return this.configCache.get(localeId)!;
    }

    const config = await this.configLoader.loadConfig(localeId);
    this.configCache.set(localeId, config);
    return config;
  }

  /**
   * Get language variants for a specific search term
   */
  async getLanguageVariants(localeId: string, searchTerm: string): Promise<string[]> {
    const config = await this.getLocaleConfig(localeId);
    if (!config || !config.languageVariants) {
      return [];
    }

    return config.languageVariants[searchTerm.toLowerCase()] || [];
  }

  /**
   * Check if a locale has specific optimizations configured
   */
  async hasOptimizations(localeId: string): Promise<boolean> {
    return await this.configLoader.hasOptimizations(localeId);
  }

  /**
   * Clear configuration cache (useful for testing or runtime updates)
   */
  clearCache(): void {
    this.configCache.clear();
  }

  /**
   * Extract base locale from full locale ID
   * e.g., 'jp_JP_2024' -> 'jp', 'zh_CN_2024' -> 'zh'
   */
  static extractBaseLocale(localeId: string): string {
    return localeId.split('_')[0];
  }

  /**
   * Check if locale belongs to a specific language family
   */
  static isLanguageFamily(localeId: string, languageCode: string): boolean {
    return localeId.toLowerCase().startsWith(languageCode.toLowerCase());
  }
}

// Export singleton instance
export const localeOptimizer = new LocaleOptimizer();
