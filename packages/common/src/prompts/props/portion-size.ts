import type { UserAssociatedFoodPrompt } from '@intake24/common/types/http';
import { copy } from '@intake24/common/util';

import type { PromptQuestion } from '..';
import type {
  BasePromptProps,
  LocaleOptionList,
  RadioOrientation,
  ValidatedPromptProps,
} from './base';
import type { LocaleOptionList } from './custom';
import { basePromptProps, promptValidation } from './base';

export type PortionSizeOptionPromptProps = BasePromptProps;

export type AsServedPromptProps = BasePromptProps;

export type CerealPromptProps = BasePromptProps;

export type DrinkScalePromptProps = BasePromptProps;

export type GuideImagePromptProps = BasePromptProps;

export type StandardPortionPromptProps = BasePromptProps;

export type MilkCerealPromptProps = BasePromptProps;

export interface MilkInAHotDrinkPromptProps extends ValidatedPromptProps {
  options: LocaleOptionList;
  orientation: RadioOrientation;
}

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

export const milkInAHotDrinkPromptDefaultProps: MilkInAHotDrinkPromptProps = copy({
  ...basePromptProps,
  ...promptValidation,
  name: { en: 'Milk in a hot drink' },
  options: {
    en: [
      { value: '0.1', label: 'A little' },
      { value: '0.16', label: 'Average amount' },
      { value: '0.24', label: 'A lot' },
    ],
  },
  orientation: 'column',
});

export const pizzaPromptDefaultProps: PizzaPromptProps = copy({
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
    component: 'milk-in-a-hot-drink-prompt',
    type: 'portion-size',
    id: 'milk-in-a-hot-drink-prompt',
    name: 'Milk in a hot drink',
    props: copy(milkInAHotDrinkPromptDefaultProps),
  },
  {
    component: 'portion-size-option-prompt',
    type: 'portion-size',
    id: 'portion-size-option-prompt',
    name: 'Choose portion size method',
    props: copy(portionSizeOptionPromptDefaultProps),
  },
  {
    component: 'standard-portion-prompt',
    type: 'portion-size',
    id: 'standard-portion-prompt',
    name: 'Standard portion',
    props: copy(standardPortionPromptDefaultProps),
  },
];
