/* eslint-disable perfectionist/sort-imports */
import { porBr } from 'stopword';
import doubleMetaphone from 'talisman/phonetics/double-metaphone';
import type { LanguageBackend } from '@intake24/api/food-index/phrase-index';

// eslint-disable-next-line ts/no-require-imports
const snowball = require('node-snowball');

/**
 * Remove diacritics (accents) from a string using Unicode normalization.
 * E.g., "Açaí" -> "Acai"
 */
function removeDiacritics(str: string): string {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

const sanitiseRegexp = /[.`,/\\\-+)(]|e\.g\.|e\.g|'s/gi;

const brazilianPortugueseBackend: LanguageBackend = {
  name: 'Brazilian Portuguese',
  languageCode: 'pt-BR',
  indexIgnore: porBr,
  phoneticEncoder: {
    encode: (input: string): string[] => {
      const normalized = removeDiacritics(input.toLocaleLowerCase());
      const [primary, secondary] = doubleMetaphone(normalized);
      return Array.from(new Set([primary, secondary].filter(Boolean)));
    },
  },

  splitCompound(word: string): Array<string> {
    // Portuguese rarely uses compound words; return as-is
    return [word];
  },

  stem(word: string): string {
    // Alternative way to use the stemmer if the previous method doesn't work
    return snowball.stemword(word, 'portuguese');
  },

  sanitiseDescription(description: string): string {
    return removeDiacritics(description.toLocaleLowerCase()).replace(sanitiseRegexp, ' ');
  },
};

export default brazilianPortugueseBackend;
