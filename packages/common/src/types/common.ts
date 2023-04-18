export const frontEnds = ['admin', 'survey'] as const;

export type FrontEnd = (typeof frontEnds)[number];

export const applications = [...frontEnds, 'api', 'shared'] as const;

export type Application = (typeof applications)[number];

export const isApplication = (app: any): app is Application => applications.includes(app);

export type CustomField = {
  name: string;
  value: string;
};

export type Dictionary<T = any> = { [key: string]: T };

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type OmitAndOptional<T, KOmit extends keyof T, KOptional extends keyof T> = Omit<
  T,
  KOmit | KOptional
> &
  Partial<Pick<T, KOptional>>;

export type WithKey<K extends string | number | symbol> = {
  [k in K]: string;
};

export const emailCopy = ['cc', 'bcc', 'none'] as const;

export type EmailCopy = (typeof emailCopy)[number];

export type Environment = 'development' | 'test' | 'production';

export type LocaleTranslation = {
  [locale: string]: string;
};

export type RequiredLocaleTranslation = {
  en: string;
  [locale: string]: string | null;
};

export const textDirections = ['ltr', 'rtl'] as const;
export type TextDirection = (typeof textDirections)[number];
