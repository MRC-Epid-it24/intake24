import type { LanguageBackend } from '../phrase-index';
import EnglishLanguageBackend from './en/english-language-backend';
import FrenchLanguageBackend from './fr/french-language-backend';

export type LanguagesBackend = Record<string, LanguageBackend>;

const languagesBackend: LanguagesBackend = {
  en: EnglishLanguageBackend,
  fr: FrenchLanguageBackend,
};

export default languagesBackend;
