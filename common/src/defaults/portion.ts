import {
  AsServedPromptProps,
  AsServedLeftoverPromptProps,
  GuideImagePromptProps,
  DrinkScalePromptProps,
  StandardPortionPromptProps,
  CerealPromptProps,
  MilkCerealPromptProps,
  PizzaPromptProps,
  MilkHotDrinkPromptProps,
  DirectWeightPromptProps,
} from '../types';

export const asServedPromptDefaultProps: AsServedPromptProps = {
  text: { en: null },
  description: { en: null },
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
  validation: {
    required: false,
    message: { en: null },
  },
};

export const guideImagePromptDefaultProps: GuideImagePromptProps = {
  text: { en: null },
  description: { en: null },
  validation: {
    required: false,
    message: { en: null },
  },
};

export const drinkScalePromptDefaultProps: DrinkScalePromptProps = {
  text: { en: null },
  description: { en: null },
  validation: {
    required: false,
    message: { en: null },
  },
};

export const standardPortionPromptDefaultProps: StandardPortionPromptProps = {
  text: { en: null },
  description: { en: null },
  validation: {
    required: false,
    message: { en: null },
  },
};

export const cerealPromptDefaultProps: CerealPromptProps = {
  text: { en: null },
  description: { en: null },
  validation: {
    required: false,
    message: { en: null },
  },
};

export const milkCerealPromptDefaultProps: MilkCerealPromptProps = {
  text: { en: null },
  description: { en: null },
  validation: {
    required: false,
    message: { en: null },
  },
};

export const pizzaPromptDefaultProps: PizzaPromptProps = {
  text: { en: null },
  description: { en: null },
  validation: {
    required: false,
    message: { en: null },
  },
};

export const milkHotDrinkPromptDefaultProps: MilkHotDrinkPromptProps = {
  text: { en: null },
  description: { en: null },
  validation: {
    required: false,
    message: { en: null },
  },
};

export const directWeightPromptDefaultProps: DirectWeightPromptProps = {
  text: { en: null },
  description: { en: null },
  validation: {
    required: false,
    message: { en: null },
  },
};
