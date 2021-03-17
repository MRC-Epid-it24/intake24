import type {
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
  LeftoverQuestionPromptProps,
} from '.';

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
