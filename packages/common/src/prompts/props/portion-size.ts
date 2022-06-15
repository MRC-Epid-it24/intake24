import { copy } from '@intake24/common/util';
import type { UserAssociatedFoodPrompt } from '@intake24/common/types/http';
import type { PromptQuestion, QuantityValues } from '..';
import { basePromptProps, promptValidation, ValidatedPromptProps } from './base';

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
  ...basePromptProps,
  ...promptValidation,
};

export const standardPortionPromptDefaultProps: StandardPortionPromptProps = {
  ...basePromptProps,
  ...promptValidation,
  quantityValue: {
    whole: 1,
    fraction: 0,
  },
};

export const cerealPromptDefaultProps: CerealPromptProps = {
  ...basePromptProps,
  ...promptValidation,
};

export const milkCerealPromptDefaultProps: MilkCerealPromptProps = {
  ...basePromptProps,
  ...promptValidation,
};

export const pizzaPromptDefaultProps: PizzaPromptProps = {
  ...basePromptProps,
  ...promptValidation,
  typeImageMapId: 'gpizza',
  thicknessImageMapId: 'gpthick',
  slicePrefix: 'gpiz',
};

export const milkHotDrinkPromptDefaultProps: MilkHotDrinkPromptProps = {
  ...basePromptProps,
  ...promptValidation,
};

export const directWeightPromptDefaultProps: DirectWeightPromptProps = {
  ...basePromptProps,
  ...promptValidation,
};

export const leftoverQuestionPromptDefaultProps: LeftoverQuestionPromptProps = {
  ...basePromptProps,
  ...promptValidation,
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
    props: copy({ ...basePromptProps, name: { en: 'Choose Portion Method' } }),
  },
  {
    component: 'as-served-prompt',
    type: 'portion-size',
    id: 'as-served-prompt',
    name: 'As served',
    props: copy({ ...basePromptProps, name: { en: 'As served' } }),
  },
  {
    component: 'as-served-leftovers-prompt',
    type: 'portion-size',
    id: 'as-served-leftovers-prompt',
    name: 'As served (leftovers)',
    props: copy({ ...basePromptProps, name: { en: 'Leftovers' } }),
  },
  {
    component: 'guide-image-prompt',
    type: 'portion-size',
    id: 'guide-image-prompt',
    name: 'Guide image',
    props: copy({ ...basePromptProps, name: { en: 'Guide image' } }),
  },
  {
    component: 'drinkware-prompt',
    type: 'portion-size',
    id: 'drinkware-prompt',
    name: 'Drinkware',
    props: copy({ ...basePromptProps, name: { en: 'Drinkware' } }),
  },
  {
    component: 'drink-scale-prompt',
    type: 'portion-size',
    id: 'drink-scale-prompt',
    name: 'Drink Scale',
    props: copy({ ...basePromptProps, name: { en: 'Drink Scale' } }),
  },
  {
    component: 'standard-portion-prompt',
    type: 'portion-size',
    id: 'standard-portion-prompt',
    name: 'Standard portion',
    props: copy({ ...basePromptProps, name: { en: 'Standard portion' } }),
  },
];
