import type { LanguageBackend } from '@intake24/api/food-index/phrase-index';

const sanitiseRegexp = /[.`,/\\\-+)(]|e\.g\.|e\.g|'s/g;

export default {
  name: 'Arabic (UAE)',
  languageCode: 'ar-AE',
  indexIgnore: [],
  phoneticEncoder: undefined,

  splitCompound(word: string): Array<string> {
    return [word];
  },

  stem(word: string): string {
    return word;
  },

  sanitiseDescription(description: string): string {
    return description.replace(sanitiseRegexp, ' ');
  },
} satisfies LanguageBackend;
