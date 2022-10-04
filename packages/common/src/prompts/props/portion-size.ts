import type { UserAssociatedFoodPrompt } from '@intake24/common/types/http';
import { copy } from '@intake24/common/util';

import type { PromptQuestion } from '..';
import type { BasePromptProps } from './base';
import { basePromptProps } from './base';

export type PortionSizeOptionPromptProps = BasePromptProps;

export type AsServedPromptProps = BasePromptProps;

export type CerealPromptProps = BasePromptProps;

export type DrinkScalePromptProps = BasePromptProps;

export type GuideImagePromptProps = BasePromptProps;

export type StandardPortionPromptProps = BasePromptProps;

export type MilkCerealPromptProps = BasePromptProps;

export type MilkHotDrinkPromptProps = BasePromptProps;

export type PizzaPromptProps = BasePromptProps;

export type DirectWeightPromptProps = BasePromptProps;

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

export const portionSizeOptionPromptDefaultProps: PortionSizeOptionPromptProps = copy({
  ...basePromptProps,
  name: { en: 'Choose Portion Method' },
});

export const asServedPromptDefaultProps: AsServedPromptProps = copy({
  ...basePromptProps,
  name: { en: 'As served' },
});

export const drinkScalePromptDefaultProps: DrinkScalePromptProps = copy({
  ...basePromptProps,
  name: { en: 'Drink Scale' },
});

export const guideImagePromptDefaultProps: GuideImagePromptProps = copy({
  ...basePromptProps,
  name: { en: 'Guide image' },
});

export const standardPortionPromptDefaultProps: StandardPortionPromptProps = copy({
  ...basePromptProps,
  name: { en: 'Standard portion' },
});

export const cerealPromptDefaultProps: CerealPromptProps = copy({
  ...basePromptProps,
});

export const milkCerealPromptDefaultProps: MilkCerealPromptProps = copy({
  ...basePromptProps,
});

export const pizzaPromptDefaultProps: PizzaPromptProps = copy({
  ...basePromptProps,
});

export const milkHotDrinkPromptDefaultProps: MilkHotDrinkPromptProps = copy({
  ...basePromptProps,
});

export const directWeightPromptDefaultProps: DirectWeightPromptProps = copy({
  ...basePromptProps,
});

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
    props: copy(portionSizeOptionPromptDefaultProps),
  },
  {
    component: 'as-served-prompt',
    type: 'portion-size',
    id: 'as-served-prompt',
    name: 'As served',
    props: copy(asServedPromptDefaultProps),
  },
  {
    component: 'drink-scale-prompt',
    type: 'portion-size',
    id: 'drink-scale-prompt',
    name: 'Drink Scale',
    props: copy(drinkScalePromptDefaultProps),
  },
  {
    component: 'guide-image-prompt',
    type: 'portion-size',
    id: 'guide-image-prompt',
    name: 'Guide image',
    props: copy(guideImagePromptDefaultProps),
  },
  {
    component: 'standard-portion-prompt',
    type: 'portion-size',
    id: 'standard-portion-prompt',
    name: 'Standard portion',
    props: copy(standardPortionPromptDefaultProps),
  },
];
