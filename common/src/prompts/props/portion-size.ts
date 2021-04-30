import clone from 'lodash/cloneDeep';
import type { LocaleTranslation } from '../../types';
import { PromptQuestion } from '../../types';
import { basePromptProps, ValidatedPromptProps } from './base';
import type { AsServedSet } from '../../types/models';
import type { QuantityValues } from '..';

export interface AsServedPromptProps extends ValidatedPromptProps {
  localDescription: LocaleTranslation;
  asServedSet: AsServedSet;
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

export const asServedPromptDefaultProps: AsServedPromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  localDescription: { en: null },
  asServedSet: {
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

export const portionSizePromptQuestions: PromptQuestion[] = [
  {
    component: 'portion-size-option-prompt',
    type: 'portion-size',
    id: 'portion-size-option-prompt',
    name: 'Choose portion size method',
    props: clone(basePromptProps),
  },
];
