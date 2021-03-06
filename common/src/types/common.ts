export type Dictionary<T = any> = { [key: string]: T };

export type CustomField = {
  name: string;
  value: string;
};

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export type LocaleTranslation<T = string | null> = {
  en: T;
  [locale: string]: T;
};

export type ValidationError = {
  location: string;
  msg: string;
  param: string;
  value: string;
};

export type ValidationErrorResult = Record<string, ValidationError>;

export interface FormRefs {
  $refs: {
    form: HTMLFormElement;
  };
}
