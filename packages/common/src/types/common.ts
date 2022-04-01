export type Dictionary<T = any> = { [key: string]: T };

export type Environment = 'development' | 'test' | 'production';

export const applications = ['admin', 'survey', 'shared'] as const;

export type Application = typeof applications[number];

export type CustomField = {
  name: string;
  value: string;
};

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

export interface FormRefs {
  $refs: {
    form: HTMLFormElement;
  };
}

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
