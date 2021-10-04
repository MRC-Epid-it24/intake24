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
