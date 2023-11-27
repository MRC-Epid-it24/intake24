import porter from 'talisman/stemmers/french/porter';

import type { LanguageBackend } from '@intake24/api/food-index/phrase-index';

import FrenchPhoneticEncoder from './phonetic';

const sanitiseRegexp = new RegExp(/[.`,/\\\-+)(]|e\.g\.|e\.g|n\.s\.'s/g);

export default {
  name: 'French',
  indexIgnore: ['de', 'au', 'aux', 'pour'],
  phoneticEncoder: new FrenchPhoneticEncoder(),

  splitCompound(word: string): Array<string> {
    return new Array<string>(word);
  },

  stem(word: string): string {
    return porter(word);
  },

  sanitiseDescription(description: string): string {
    return description.replace(sanitiseRegexp, ' ');
  },
} satisfies LanguageBackend;
