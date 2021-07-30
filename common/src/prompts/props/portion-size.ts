import clone from 'lodash/cloneDeep';
import type { PromptQuestion, QuantityValues } from '..';
import { basePromptProps, ValidatedPromptProps } from './base';

export type LeftoverQuestionPromptProps = ValidatedPromptProps;

export type DrinkScalePromptProps = ValidatedPromptProps;

export interface StandardPortionPromptProps extends ValidatedPromptProps {
  quantityValue: QuantityValues;
}

export type CerealPromptProps = ValidatedPromptProps;

export type MilkCerealPromptProps = ValidatedPromptProps;

export type PizzaPromptProps = ValidatedPromptProps;

export type MilkHotDrinkPromptProps = ValidatedPromptProps;

export type DirectWeightPromptProps = ValidatedPromptProps;

export interface AssociatedFoodsPanelProps extends ValidatedPromptProps {
  expansionPanelTotal: number;
}

export interface ImageMapSelectorProps {
  imageMapId: string;
}

export interface ImageMapSelectorEmit {
  selectedIdx: number;
}

// Default props

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

export const associatedFoodPanelDefaultProps: AssociatedFoodsPanelProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  validation: {
    required: false,
    message: { en: null },
  },
  expansionPanelTotal: 3,
};

export const imageMapSelectorDefaultProps: ImageMapSelectorProps = {
  imageMapId: '',
};

export const portionSizePromptQuestions: PromptQuestion[] = [
  {
    component: 'portion-size-option-prompt',
    type: 'portion-size',
    id: 'portion-size-option-prompt',
    name: 'Choose portion size method',
    props: clone(basePromptProps),
  },
  {
    component: 'as-served-prompt',
    type: 'portion-size',
    id: 'as-served-prompt',
    name: 'As served',
    props: clone(basePromptProps),
  },
  {
    component: 'as-served-leftovers-prompt',
    type: 'portion-size',
    id: 'as-served-leftovers-prompt',
    name: 'As served (leftovers)',
    props: clone(basePromptProps),
  },
  {
    component: 'guide-image-prompt',
    type: 'portion-size',
    id: 'guide-image-prompt',
    name: 'Guide image',
    props: clone(basePromptProps),
  },
  {
    component: 'standard-portion-prompt',
    type: 'portion-size',
    id: 'standard-portion-prompt',
    name: 'Standard portion',
    props: clone(basePromptProps),
  },
];
