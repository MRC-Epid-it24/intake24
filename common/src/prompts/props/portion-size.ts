import clone from 'lodash/cloneDeep';
import type { LocaleTranslation } from '../../types';
import { basePromptProps, promptValidation, ValidatedPromptProps } from './base';
import type { PortionSizeMethod, AsServedSet } from '../../types/models';
import type { QuantityValues } from '..';

// TODO Migrate these out
export interface PortionSizeOptionPromptProps extends ValidatedPromptProps {
  // Stores which methods to display
  methods: PortionSizeMethod[];
  localDescription: LocaleTranslation;
}

export interface AsServedPromptProps extends ValidatedPromptProps {
  localDescription: LocaleTranslation;
  selectionImageUrl: string;
  servingImageSet: AsServedSet;
  // images: Object[];
}

export type AsServedLeftoverPromptProps = ValidatedPromptProps;

export type LeftoverQuestionPromptProps = ValidatedPromptProps;

export interface GuideImagePromptProps extends ValidatedPromptProps {
  quantityValue: QuantityValues;
}

export type DrinkScalePromptProps = ValidatedPromptProps;

export interface StandardPortionPromptProps extends ValidatedPromptProps {
  quantityValue: QuantityValues;
}

export type CerealPromptProps = ValidatedPromptProps;

export type MilkCerealPromptProps = ValidatedPromptProps;

export type PizzaPromptProps = ValidatedPromptProps;

export type MilkHotDrinkPromptProps = ValidatedPromptProps;

export type DirectWeightPromptProps = ValidatedPromptProps;

// TO DO: migrate this over to portion.ts
export const portionSizeOptionPromptProps: PortionSizeOptionPromptProps = clone({
  ...basePromptProps,
  ...promptValidation,
  localDescription: { en: null },
  methods: [],
});

export const asServedPromptDefaultProps: AsServedPromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  localDescription: { en: null },
  selectionImageUrl: '',
  servingImageSet: {
    id: '',
    description: '',
    selectionImageId: 0,
  },
  validation: {
    required: false,
    message: { en: null },
  },
};

export const asServedLeftoverPromptDefaultProps: AsServedLeftoverPromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  validation: {
    required: false,
    message: { en: null },
  },
};

export const guideImagePromptDefaultProps: GuideImagePromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  validation: {
    required: false,
    message: { en: null },
  },
  quantityValue: {
    whole: 1,
    fraction: 0,
  },
};

export const drinkScalePromptDefaultProps: DrinkScalePromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  validation: {
    required: false,
    message: { en: null },
  },
};

export const standardPortionPromptDefaultProps: StandardPortionPromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  validation: {
    required: false,
    message: { en: null },
  },
  quantityValue: {
    whole: 1,
    fraction: 0,
  },
};

export const cerealPromptDefaultProps: CerealPromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  validation: {
    required: false,
    message: { en: null },
  },
};

export const milkCerealPromptDefaultProps: MilkCerealPromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  validation: {
    required: false,
    message: { en: null },
  },
};

export const pizzaPromptDefaultProps: PizzaPromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  validation: {
    required: false,
    message: { en: null },
  },
};

export const milkHotDrinkPromptDefaultProps: MilkHotDrinkPromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  validation: {
    required: false,
    message: { en: null },
  },
};

export const directWeightPromptDefaultProps: DirectWeightPromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  validation: {
    required: false,
    message: { en: null },
  },
};

export const leftoverQuestionPromptDefaultProps: LeftoverQuestionPromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  validation: {
    required: false,
    message: { en: null },
  },
};
