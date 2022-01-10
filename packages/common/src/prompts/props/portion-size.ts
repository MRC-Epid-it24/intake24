import { copy } from '@intake24/common/util';
import { UserAssociatedFoodPrompt } from '@intake24/common/types/http';
import type { PromptQuestion, QuantityValues } from '..';
import { basePromptProps, ValidatedPromptProps } from './base';

export type LeftoverQuestionPromptProps = ValidatedPromptProps;

export type DrinkScalePromptProps = ValidatedPromptProps;

export interface StandardPortionPromptProps extends ValidatedPromptProps {
  quantityValue: QuantityValues;
}

export type CerealPromptProps = ValidatedPromptProps;

export type MilkCerealPromptProps = ValidatedPromptProps;

// export type PizzaPromptProps = ValidatedPromptProps;
export interface PizzaPromptProps extends ValidatedPromptProps {
  typeImageMapId: string;
  thicknessImageMapId: string;
  slicePrefix: string;
}

export type MilkHotDrinkPromptProps = ValidatedPromptProps;

export type DirectWeightPromptProps = ValidatedPromptProps;

export interface AssociatedFoodsPanelProps {
  expansionPanelTotal: number;
  assocPromptData: UserAssociatedFoodPrompt | null;
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
  localName: { en: '' },
  validation: {
    required: false,
    message: { en: null },
  },
};

export const standardPortionPromptDefaultProps: StandardPortionPromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  localName: { en: '' },
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
  localName: { en: '' },
  validation: {
    required: false,
    message: { en: null },
  },
};

export const milkCerealPromptDefaultProps: MilkCerealPromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  localName: { en: '' },
  validation: {
    required: false,
    message: { en: null },
  },
};

export const pizzaPromptDefaultProps: PizzaPromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  localName: { en: '' },
  validation: {
    required: false,
    message: { en: null },
  },
  typeImageMapId: 'gpizza',
  thicknessImageMapId: 'gpthick',
  slicePrefix: 'gpiz',
};

export const milkHotDrinkPromptDefaultProps: MilkHotDrinkPromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  localName: { en: '' },
  validation: {
    required: false,
    message: { en: null },
  },
};

export const directWeightPromptDefaultProps: DirectWeightPromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  localName: { en: '' },
  validation: {
    required: false,
    message: { en: null },
  },
};

export const leftoverQuestionPromptDefaultProps: LeftoverQuestionPromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  localName: { en: '' },
  validation: {
    required: false,
    message: { en: null },
  },
};

export const associatedFoodPanelDefaultProps: AssociatedFoodsPanelProps = {
  expansionPanelTotal: 3,
  assocPromptData: null,
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
    props: copy({ ...basePromptProps, localName: { en: 'Choose Portion Method' } }),
  },
  {
    component: 'as-served-prompt',
    type: 'portion-size',
    id: 'as-served-prompt',
    name: 'As served',
    props: copy({ ...basePromptProps, localName: { en: 'As served' } }),
  },
  {
    component: 'as-served-leftovers-prompt',
    type: 'portion-size',
    id: 'as-served-leftovers-prompt',
    name: 'As served (leftovers)',
    props: copy({ ...basePromptProps, localName: { en: 'Leftovers' } }),
  },
  {
    component: 'guide-image-prompt',
    type: 'portion-size',
    id: 'guide-image-prompt',
    name: 'Guide image',
    props: copy({ ...basePromptProps, localName: { en: 'Guide image' } }),
  },
  {
    component: 'standard-portion-prompt',
    type: 'portion-size',
    id: 'standard-portion-prompt',
    name: 'Standard portion',
    props: copy({ ...basePromptProps, localName: { en: 'Standart portion' } }),
  },
];
