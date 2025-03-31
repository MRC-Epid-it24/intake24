import * as kuromoji from 'kuromoji';
import NodeCache from 'node-cache';
import * as wanakana from 'wanakana';

import type { LanguageBackend } from '@intake24/api/food-index/phrase-index';
import { commonJapaneseFoods } from './food-dictionary';
import { getSemanticSimilarity } from './transformer';

const sanitiseRegexp = /[.`,/\\\-+)(…、。！？「」『』（）［］｛｝]/g;

// Cache configuration values
const CACHE_TTL = 86400; // 1 day in seconds
const CACHE_CHECK_PERIOD = 1800; // 30 minutes in seconds
const CACHE_MAX_KEYS = 10000;

// Stop words to exclude from indexing
const stopWords = [
  'の', // possessive particle
  'は', // topic marker
  'を', // direct object marker
  'に', // indirect object marker
  'が', // subject marker
  'と', // and, with
  'で', // at, in, by
  'から', // from
  'まで', // until, to
  'より', // than, from
  'へ', // to, toward
  'や', // and, or
  'また', // also, again
  'など', // etc.
  'だけ', // only
  'これ', // this
  'それ', // that
  'あれ', // that over there
  'この', // this (adjective)
  'その', // that (adjective)
  'あの', // that over there (adjective)
];

let tokenizer: any = null;
const _tokenizerPromise: Promise<any> = new Promise((resolve) => {
  kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict/' }).build((err, _tokenizer) => {
    if (err) {
      console.error('Error initializing kuromoji tokenizer:', err);
      resolve(null);
    }
    else {
      tokenizer = _tokenizer;
      resolve(tokenizer);
    }
  });
});

/**
 * Check if a token contains any Latin (English) characters
 */
function isLatinText(token: string): boolean {
  return /[a-z]/i.test(token);
}

/**
 * Process description for indexing
 * - Sanitizes text (removes punctuation)
 * - Tokenizes using kuromoji
 * - Removes stop words
 * - Gets base forms of words where possible
 * - Generates n-grams for better partial matching
 */
function processDescriptionForIndexing(description: string): string[] {
  if (!tokenizer)
    return description.split(/\s+/);

  const sanitized = description.replace(sanitiseRegexp, ' ');

  // Check if the sanitized text matches any common food terms before tokenization
  for (const [food, variants] of Object.entries(commonJapaneseFoods)) {
    if (sanitized.includes(food) || variants.some(v => sanitized.includes(v))) {
      return [food, ...variants];
    }
  }

  const tokens = tokenizer.tokenize(sanitized);
  const processedTokens: string[] = [];

  // Process consecutive tokens to identify potential food compound words
  let compoundCandidate = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.surface_form.length <= 1 || stopWords.includes(token.surface_form))
      continue;

    compoundCandidate += token.surface_form;

    // Check if current compound candidate matches any food terms
    const foodMatch = Object.entries(commonJapaneseFoods).find(
      ([food, variants]) => food === compoundCandidate || variants.includes(compoundCandidate),
    );

    if (foodMatch) {
      processedTokens.push(foodMatch[0]); // Add the canonical food name
      compoundCandidate = '';
      continue;
    }

    // If no match and token ends with a typical word boundary, reset compound
    if (['。', '、', '！', '？', '　', ' '].includes(token.surface_form)) {
      compoundCandidate = '';
    }

    processedTokens.push(token.surface_form);

    if (token.basic_form && token.basic_form !== token.surface_form && token.basic_form !== '*')
      processedTokens.push(token.basic_form);

    if (!isLatinText(token.surface_form) && token.reading) {
      const hiragana = wanakana.toHiragana(token.reading);
      if (hiragana !== token.surface_form)
        processedTokens.push(hiragana);
    }
  }

  return processedTokens;
}

const phoneticCache = new NodeCache({
  stdTTL: CACHE_TTL,
  checkperiod: CACHE_CHECK_PERIOD,
  maxKeys: CACHE_MAX_KEYS,
});

function encodePhonetically(word: string): string[] {
  // For non-Japanese text, return as is
  if (isLatinText(word))
    return [word.toLowerCase()];

  const results: string[] = [];

  // Add original form
  results.push(word);

  // Convert to hiragana for phonetic matching
  if (!wanakana.isHiragana(word)) {
    const hiragana = wanakana.toHiragana(word);
    results.push(hiragana);
  }

  // Handle common variations in Japanese food terminology
  let normalized = wanakana.isHiragana(word) ? word : wanakana.toHiragana(word);

  // Normalize long vowel marks to repeated vowels for better matching
  normalized = normalized
    .replace(/([あいうえお])ー/g, '$1$1')
    // Handle common sound variations that shouldn't affect matching
    .replace(/づ/g, 'ず')
    .replace(/ぢ/g, 'じ');

  if (normalized !== results[results.length - 1])
    results.push(normalized);

  // Add a version without small っ which is often pronunciation variation
  if (normalized.includes('っ')) {
    results.push(normalized.replace(/っ/g, ''));
  }

  return results;
}

export default {
  name: 'Japanese',
  languageCode: 'ja',
  indexIgnore: stopWords,
  minWordLength: 1,

  // Phonetic encoding for Japanese
  phoneticEncoder: {
    encode: (input: string): Array<string> => {
      const cached = phoneticCache.get<string[]>(input);
      if (cached)
        return cached;

      const result = encodePhonetically(input);
      phoneticCache.set(input, result);
      return result;
    },
  },

  transformer: {
    getSemanticSimilarity,
  },

  splitCompound(word: string): string[] {
    if (!tokenizer)
      return [word];

    const tokens = tokenizer.tokenize(word);
    return tokens.map((token: any) => token.surface_form);
  },

  stem(word: string): string {
    if (!tokenizer)
      return word;

    const tokens = tokenizer.tokenize(word);
    if (tokens.length === 1 && tokens[0].basic_form && tokens[0].basic_form !== '*')
      return tokens[0].basic_form;

    return word;
  },

  sanitiseDescription(description: string): string {
    return description.replace(sanitiseRegexp, ' ');
  },

  processDescriptionForIndexing,
} satisfies LanguageBackend;
