export const frontEnds = ['admin', 'survey'] as const;

export type FrontEnd = typeof frontEnds[number];

export const applications = [...frontEnds, 'shared'] as const;

export type Application = typeof applications[number];

export const captchaProviders = ['h-captcha', 're-captcha'] as const;

export type CaptchaProvider = typeof captchaProviders[number];

export const isCaptchaProvider = (provider: any): provider is CaptchaProvider =>
  captchaProviders.includes(provider);

export type CustomField = {
  name: string;
  value: string;
};

export type Dictionary<T = any> = { [key: string]: T };

export type WithKey<K extends string | number | symbol> = {
  [k in K]: string;
};

export const emailCopy = ['cc', 'bcc', 'none'] as const;

export type EmailCopy = typeof emailCopy[number];

export type Environment = 'development' | 'test' | 'production';

export type LocaleTranslation<T = string | null> = {
  en: T;
  [locale: string]: T;
};

export type RequiredLocaleTranslation = { en: string } & {
  [locale: string]: string | null;
};

export type ValidationError = {
  location: string;
  msg: string;
  param: string;
  value: string;
};

export type ValidationErrorResult = Record<string, ValidationError>;

export const textDirections = ['ltr', 'rtl'] as const;
export type TextDirection = typeof textDirections[number];

// TODO (performance): better done when the current locale is already known rather than processing all strings
export function replaceInTranslation(
  translation: LocaleTranslation,
  string: string,
  replaceValue: string
): LocaleTranslation {
  const rest = Object.fromEntries(
    Object.entries(translation)
      .filter((entry) => entry[0] !== 'en')
      .map((entry) => [entry[0], entry[1]?.replace(string, replaceValue) ?? null])
  );

  return {
    en: translation.en?.replace(string, replaceValue) ?? null,
    ...rest,
  };
}
