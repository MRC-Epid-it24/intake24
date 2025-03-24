import nodejieba from 'nodejieba';
import pinyin from 'pinyin';

import type { LanguageBackend } from '@intake24/api/food-index/phrase-index';
import { getSemanticSimilarity } from './transformer';

const sanitiseRegexp = /[.`,/\\\-+)(…，。、？！“”]/g;

/**
 * Generate n-grams (substrings) from a token.
 * For example, generate bi-grams and tri-grams.
 */
function generateNGrams(token: string, minGram = 2, maxGram = 3): string[] {
  const ngrams: string[] = [];

  // Only generate n-grams for tokens longer than a threshold, say 3 characters.
  if (token.length < minGram + 1)
    return ngrams;

  for (let n = minGram; n <= Math.min(maxGram, token.length); n++) {
    for (let i = 0; i <= token.length - n; i++) {
      ngrams.push(token.substring(i, i + n));
    }
  }
  return ngrams;
}

/**
 * Check if a token contains any English letters.
 */
function isEnglish(token: string): boolean {
  return /[a-z]/i.test(token);
}

/**
 * Process an English token:
 *  - Convert it to lower case.
 *  - Generate its n-grams.
 */
function processEnglishToken(token: string): string[] {
  const lowerToken = token.toLowerCase();
  return [lowerToken, ...generateNGrams(lowerToken)];
}

/**
 * Process a Chinese token:
 *  - Use nodejieba to segment the token (using search-optimized mode).
 *  - Generate n-grams for each segmented part.
 */
function processChineseToken(token: string): string[] {
  // Use nodejieba's search mode with fallback.
  let tokens = nodejieba.cutForSearch(token);
  if (!tokens || tokens.length === 0) {
    tokens = nodejieba.cut(token);
  }
  const results: string[] = [];
  for (const t of tokens) {
    results.push(t);
    results.push(...generateNGrams(t));
  }
  return results;
}

/**
 * Process a description that may contain mixed languages.
 *  - Sanitises the description.
 *  - Splits it into tokens (by whitespace).
 *  - Processes each token based on whether it contains English or not.
 * Returns an enriched list of tokens that includes n-grams.
 */
export function processDescriptionForIndexing(description: string): string[] {
  // Remove unwanted punctuation.
  const sanitised = description.replace(sanitiseRegexp, ' ');
  // Split by whitespace (filtering out empty tokens).
  const rawTokens = sanitised.split(/\s+/).filter(t => t.length > 0);

  const processedTokens: string[] = [];
  for (const token of rawTokens) {
    if (isEnglish(token)) {
      processedTokens.push(...processEnglishToken(token));
    }
    else {
      processedTokens.push(...processChineseToken(token));
    }
  }
  return processedTokens;
}

const pinyinCache = new Map<string, string[]>();

export default {
  name: 'Mandarin',
  languageCode: 'zh',
  indexIgnore: [
    '的',
    '了',
    '在',
    '和',
    '是',
    '我',
    '有',
    'and',
    'the',
    'with',
    'from',
    'a',
    'of',
    'to',
  ],
  minWordLength: 1,

  // Use pinyin conversion for phonetic encoding
  phoneticEncoder: {
    encode: (input: string): Array<string> => {
      if (pinyinCache.has(input)) {
        return pinyinCache.get(input)!;
      }
      const result = pinyin(input, { style: pinyin.STYLE_NORMAL }).flat();
      pinyinCache.set(input, result);
      return result;
    },
  },
  transformer: {
    getSemanticSimilarity,
  },

  // Tokenize sentences into words (tokens) using nodejieba
  splitCompound(word: string): Array<string> {
    let tokens = nodejieba.cutForSearch(word);

    if (!tokens || tokens.length === 0) {
      tokens = nodejieba.cut(word);
    }
    return tokens;
  },

  // Mandarin typically doesn't use stemming, so return the original word
  stem(word: string): string {
    return word;
  },

  sanitiseDescription(description: string): string {
    return description.replace(sanitiseRegexp, ' ');
  },

  processDescriptionForIndexing,
} satisfies LanguageBackend;
