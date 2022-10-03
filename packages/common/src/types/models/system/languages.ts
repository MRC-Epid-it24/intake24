import type { LocaleMessageObject } from '@intake24/i18n';

import type { Application, OmitAndOptional, TextDirection } from '../..';

export type LanguageAttributes = {
  id: string;
  code: string;
  englishName: string;
  localName: string;
  countryFlagCode: string;
  textDirection: TextDirection;
  ownerId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type LanguageCreationAttributes = OmitAndOptional<
  LanguageAttributes,
  'id' | 'createdAt' | 'updatedAt',
  'ownerId'
>;

export type LanguageTranslationAttributes = {
  id: string;
  languageId: string;
  application: Application;
  section: string;
  messages: LocaleMessageObject;
  createdAt: Date;
  updatedAt: Date;
};

export type LanguageTranslationCreationAttributes = Omit<
  LanguageTranslationAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;
