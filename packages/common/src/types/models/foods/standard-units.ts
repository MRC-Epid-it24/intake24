import type { RequiredLocaleTranslation } from '../../common';

export type StandardUnitAttributes = {
  id: string;
  estimateIn: RequiredLocaleTranslation;
  howMany: RequiredLocaleTranslation;
  createdAt: Date;
  updatedAt: Date;
};

export type StandardUnitCreationAttributes = Omit<
  StandardUnitAttributes,
  'createdAt' | 'updatedAt'
>;
