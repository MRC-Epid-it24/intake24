export interface LocaleV3 {
  id: string;
  englishName: string;
  localName: string;
  respondentLanguage: string;
  adminLanguage: string;
  flagCode: string;
  prototypeLocale: string[];
  textDirection: string;
}

export type Locales = { [id: string]: LocaleV3 };
