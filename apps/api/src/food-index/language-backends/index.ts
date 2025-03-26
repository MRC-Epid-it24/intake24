import type { LanguageBackend } from '../phrase-index';
import ArabicUAELanguageBackend from './ar-AE/arabic-UAE-language-backend';
import EnglishLanguageBackend from './en/english-language-backend';
import FrenchLanguageBackend from './fr/french-language-backend';
import TamilLanguageBackend from './ta/tamil-language-backend';
import ChineseLanguageBackend from './zh/chinese-language-backend';

export const languageBackendCodes = ['en', 'fr', 'ta', 'zh'];
export type LanguageBackendCodes = (typeof languageBackendCodes)[number];

export type LanguagesBackend = Record<LanguageBackendCodes, LanguageBackend>;

const languagesBackend: LanguagesBackend = {
  en: EnglishLanguageBackend,
  fr: FrenchLanguageBackend,
  'ar-AE': ArabicUAELanguageBackend,
  ta: TamilLanguageBackend,
  zh: ChineseLanguageBackend,
};

export default languagesBackend;
