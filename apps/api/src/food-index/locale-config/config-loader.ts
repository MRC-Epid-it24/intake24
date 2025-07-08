/**
 * Locale configuration loader
 * Loads locale-specific search configurations from files or database
 */

import type { LocaleConfigLoader, LocaleSearchConfig } from './types';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

export class FileBasedLocaleConfigLoader implements LocaleConfigLoader {
  private configDir: string;
  private configCache: Map<string, LocaleSearchConfig> = new Map();

  constructor(configDir: string = path.join(__dirname, 'configs')) {
    this.configDir = configDir;
  }

  async loadConfig(localeId: string): Promise<LocaleSearchConfig | null> {
    // Check cache first
    if (this.configCache.has(localeId)) {
      return this.configCache.get(localeId)!;
    }

    try {
      const configPath = path.join(this.configDir, `${localeId}.json`);
      const configData = await fs.readFile(configPath, 'utf-8');
      const config: LocaleSearchConfig = JSON.parse(configData);

      // Validate config
      this.validateConfig(config, localeId);

      // Cache the config
      this.configCache.set(localeId, config);

      return config;
    }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // Config file doesn't exist - return null
        return null;
      }
      throw new Error(`Failed to load locale config for ${localeId}: ${(error as Error).message}`);
    }
  }

  async hasOptimizations(localeId: string): Promise<boolean> {
    const config = await this.loadConfig(localeId);
    return config !== null;
  }

  private validateConfig(config: LocaleSearchConfig, localeId: string): void {
    if (!config.localeId || !config.name || !config.languageCode) {
      throw new Error(`Invalid config for ${localeId}: missing required fields`);
    }

    if (!config.searchOptimizations) {
      throw new Error(`Invalid config for ${localeId}: missing searchOptimizations`);
    }

    // Validate matchScoreWeight range
    const { matchScoreWeight } = config.searchOptimizations;
    if (matchScoreWeight !== undefined && (matchScoreWeight < 0 || matchScoreWeight > 100)) {
      throw new Error(`Invalid matchScoreWeight for ${localeId}: must be between 0 and 100`);
    }

    // Validate primaryNameBoostFactor range
    const { primaryNameBoostFactor } = config.searchOptimizations;
    if (primaryNameBoostFactor !== undefined && (primaryNameBoostFactor < 0 || primaryNameBoostFactor > 1)) {
      throw new Error(`Invalid primaryNameBoostFactor for ${localeId}: must be between 0 and 1`);
    }
  }

  /**
   * Clear caches - useful for testing
   */
  clearCache(): void {
    this.configCache.clear();
  }
}

// Default instance
export const defaultConfigLoader = new FileBasedLocaleConfigLoader();
