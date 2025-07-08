/**
 * Locale Configuration System for Food Search
 *
 * This module provides a generic, configurable system for applying
 * locale-specific optimizations to food search functionality.
 *
 * Features:
 * - Generic locale configuration via JSON files or database
 * - Language-specific variant matching
 * - Cultural food mappings
 * - Configurable search optimizations
 * - Primary name boosting
 * - Custom processors for complex linguistic rules
 *
 * Usage:
 * ```typescript
 * import { localeOptimizer } from '@intake24/api/food-index/locale-config';
 *
 * // Apply search optimizations
 * const optimizedOptions = await localeOptimizer.applySearchOptimizations(
 *   'jp_JP_2024', originalOptions, logger
 * );
 *
 * // Apply primary name boost
 * const boostedResults = await localeOptimizer.applyPrimaryNameBoost(
 *   'zh_CN_2024', results, foodNames, logger
 * );
 * ```
 */

export * from './config-loader';
export * from './locale-optimizer';
// Re-export the main optimizer instance
export { localeOptimizer } from './locale-optimizer';

export * from './types';
