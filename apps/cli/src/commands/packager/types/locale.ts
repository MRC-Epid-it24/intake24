export interface PkgLocale {
  id: string;
  englishName: string;
  localName: string;
  respondentLanguage: string;
  adminLanguage: string;
  flagCode: string;
  prototypeLocale: string | null;
  textDirection: 'ltr' | 'rtl';
  foodIndexLanguageBackendId?: string;
}
