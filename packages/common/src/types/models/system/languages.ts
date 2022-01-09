import type { LocaleMessages } from '@intake24/i18n';
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

export type LanguageMessageAttributes = {
  id: string;
  languageId: string;
  application: Application;
  section: string;
  messages: LocaleMessages;
  createdAt: Date;
  updatedAt: Date;
};

export type LanguageMessageCreationAttributes = Omit<
  LanguageMessageAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;
