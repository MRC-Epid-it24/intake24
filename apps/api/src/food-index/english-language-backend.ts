import { PorterStemmer } from 'natural';

import type { LanguageBackend } from '@intake24/api/food-index/phrase-index';
import Metaphone3Encoder from '@intake24/api/food-index/metaphone-encoder';

const sanitiseRegexp = new RegExp(/[.`,/\\\-+)(]|e\.g\.|e\.g|'s/g);

export default {
  indexIgnore: ['and', 'the', 'with', 'from'],

  phoneticEncoder: new Metaphone3Encoder(),

  splitCompound(word: string): Array<string> {
    return new Array<string>(word);
  },

  stem(word: string): string {
    return PorterStemmer.stem(word);
  },

  sanitiseDescription(description: string): string {
    return description.replace(sanitiseRegexp, '');
  },
} as LanguageBackend;
