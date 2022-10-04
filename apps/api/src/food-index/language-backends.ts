import type { LanguageBackend } from '@intake24/api/food-index/phrase-index';
import EnglishLanguageBackend from '@intake24/api/food-index/english-language-backend';

export default {
  en: EnglishLanguageBackend,
} as { [key: string]: LanguageBackend };
