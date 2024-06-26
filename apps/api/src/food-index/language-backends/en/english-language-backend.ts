import { PorterStemmer } from 'natural';

import type { LanguageBackend } from '@intake24/api/food-index/phrase-index';

import Metaphone3Encoder from './metaphone-encoder';

const sanitiseRegexp = /[.`,/\\\-+)(]|e\.g\.|e\.g|'s/g;

export default {
  name: 'English',
  languageCode: 'en',
  indexIgnore: ['and', 'the', 'with', 'from'],
  phoneticEncoder: new Metaphone3Encoder(),

  splitCompound(word: string): Array<string> {
    return [word];
  },

  stem(word: string): string {
    return PorterStemmer.stem(word);
  },

  sanitiseDescription(description: string): string {
    return description.replace(sanitiseRegexp, ' ');
  },
} satisfies LanguageBackend;
