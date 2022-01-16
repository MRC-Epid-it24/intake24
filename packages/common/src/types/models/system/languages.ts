import type { LocaleMessageObject } from '@intake24/i18n';
import type { Application } from '../..';

export type LanguageAttributes = {
  id: string;
  englishName: string;
  localName: string;
  countryFlagCode: string;
  textDirection: string;
  createdAt: Date;
  updatedAt: Date;
};

export type LanguageCreationAttributes = Omit<LanguageAttributes, 'createdAt' | 'updatedAt'>;

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
