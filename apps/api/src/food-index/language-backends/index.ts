import type { LanguageBackend } from '../phrase-index';
import ArabicUAELanguageBackend from './ar-AE/arabic-UAE-language-backend';
import EnglishLanguageBackend from './en/english-language-backend';
import FrenchLanguageBackend from './fr/french-language-backend';
import JapaneseLanguageBackend from './ja/japanese-language-backend';
import BrazilianPortugueseLanguageBackend from './pt-BR/brazillian-portuguese-language-backend';
import TamilLanguageBackend from './ta/tamil-language-backend';
import ChineseLanguageBackend from './zh/chinese-language-backend';

export const languageBackendCodes = ['en', 'fr', 'ta', 'zh', 'ja', 'ar-AE', 'pt-BR'];
export type LanguageBackendCodes = (typeof languageBackendCodes)[number];

export type LanguagesBackend = Record<LanguageBackendCodes, LanguageBackend>;

const languagesBackend: LanguagesBackend = {
  en: EnglishLanguageBackend,
  fr: FrenchLanguageBackend,
  'ar-AE': ArabicUAELanguageBackend,
  ta: TamilLanguageBackend,
  zh: ChineseLanguageBackend,
  ja: JapaneseLanguageBackend,
  'pt-BR': BrazilianPortugueseLanguageBackend,
};

export default languagesBackend;
