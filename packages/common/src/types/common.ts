import { z } from 'zod';

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

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
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

export const localeTranslation = z.record(z.string().nullable());

export type LocaleTranslation = z.infer<typeof localeTranslation>;

export const requiredLocaleTranslation = z.intersection(
  z.object({ en: z.string() }),
  z.record(z.string().nullable())
);

export type RequiredLocaleTranslation = z.infer<typeof requiredLocaleTranslation>;

export const listOption = <T extends z.ZodTypeAny = z.ZodString>(schema: T) =>
  z.object({
    id: z.number().optional(),
    label: z.string(),
    value: schema,
  });

export type ListOption<T extends z.ZodTypeAny = z.ZodString> = z.infer<
  ReturnType<typeof listOption<T>>
>;

export const localeOptionList = <T extends z.ZodTypeAny = z.ZodString>(schema: T) =>
  z.intersection(
    z.object({
      en: z.array(listOption(schema)),
    }),
    z.record(z.array(listOption(schema)))
  );

export type LocaleOptionList<T extends z.ZodTypeAny = z.ZodString> = z.infer<
  ReturnType<typeof localeOptionList<T>>
>;

export const categoryLocaleOptionList = <T extends z.ZodTypeAny = z.ZodNumber>(schema: T) =>
  z.intersection(
    z.object({
      _default: localeOptionList(schema),
    }),
    z.record(localeOptionList(schema))
  );

export type CategoryLocaleOptionList<T extends z.ZodTypeAny = z.ZodNumber> = z.infer<
  ReturnType<typeof categoryLocaleOptionList<T>>
>;

export const textDirections = ['ltr', 'rtl'] as const;
export type TextDirection = (typeof textDirections)[number];
