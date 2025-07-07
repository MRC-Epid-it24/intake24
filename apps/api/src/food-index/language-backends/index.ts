import type { LanguageBackend } from '../phrase-index';
import ArabicUAELanguageBackend from './ar-AE/arabic-UAE-language-backend';
import EnglishLanguageBackend from './en/english-language-backend';
import FrenchLanguageBackend from './fr/french-language-backend';
import JapaneseLanguageBackend from './ja/japanese-language-backend';

export const languageBackendCodes = ['en', 'fr', 'ja'] as const;
export type LanguageBackendCodes = typeof languageBackendCodes[number] | 'ar-AE';

export type LanguagesBackend = Record<string, LanguageBackend>;

const languagesBackend: LanguagesBackend = {
  en: EnglishLanguageBackend,
  fr: FrenchLanguageBackend,
  'ar-AE': ArabicUAELanguageBackend,
  ja: JapaneseLanguageBackend,
};

export default languagesBackend;
