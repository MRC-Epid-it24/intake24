import type { LanguageBackend } from '@intake24/api/food-index/phrase-index';
import EnglishLanguageBackend from '@intake24/api/food-index/english-language-backend';
import FrenchLanguageBackend from '@intake24/api/food-index/fr/french-language-backend';

export default {
  en: EnglishLanguageBackend,
  fr: FrenchLanguageBackend,
} as { [key: string]: LanguageBackend };
