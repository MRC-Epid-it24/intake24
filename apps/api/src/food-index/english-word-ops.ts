import type { WordOps } from '@intake24/api/food-index/phrase-index';

const sanitiseRegexp = new RegExp(/[.`,/\\\-+)(]|e\.g\.|e\.g|'s/g);

export default {
  indexIgnore: ['and', 'the', 'with', 'from'],

  splitCompound(word: string): Array<string> {
    return new Array<string>(word);
  },

  stem(word: string): string {
    return word;
  },

  sanitiseDescription(description: string): string {
    return description.replace(sanitiseRegexp, '');
  },
} as WordOps;
