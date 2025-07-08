/**
 * Generic locale-specific search configuration system
 * Supports linguistic and cultural nuances for different locales
 */

export interface SearchOptimizations {
  /** Weight for match quality vs popularity (0-100, higher = more quality focus) */
  matchScoreWeight?: number;

  /** Enable primary name boosting for better relevance */
  enablePrimaryNameBoost?: boolean;

  /** Factor for primary name boost (0-1, lower = stronger boost) */
  primaryNameBoostFactor?: number;

  /** Enable deduplication logging for debugging */
  enableDeduplicationLogging?: boolean;
}

export interface LanguageVariants {
  /** Map of search terms to their linguistic variants */
  [searchTerm: string]: string[];
}

export interface LocaleSearchConfig {
  /** Locale identifier (e.g., 'jp_JP_2024', 'zh_CN_2024') */
  localeId: string;

  /** Human-readable locale name */
  name: string;

  /** Language code (e.g., 'ja', 'zh', 'ta', 'pt') */
  languageCode: string;

  /** Search behavior optimizations */
  searchOptimizations: SearchOptimizations;

  /** Language-specific term variants */
  languageVariants: LanguageVariants;
}

export interface LocaleConfigRegistry {
  [localeId: string]: LocaleSearchConfig;
}

/**
 * Configuration loader interface
 */
export interface LocaleConfigLoader {
  /** Load configuration for a specific locale */
  loadConfig: (localeId: string) => Promise<LocaleSearchConfig | null>;

  /** Check if a locale has specific optimizations */
  hasOptimizations: (localeId: string) => Promise<boolean>;
}
