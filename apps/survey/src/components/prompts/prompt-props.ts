import type { PropType } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { EncodedFood, FoodState, MealState, MissingFood, PromptSection, RecipeBuilder } from '@intake24/common/surveys';

export function createBasePromptProps<P extends keyof Prompts, F extends FoodState = EncodedFood>() {
  return {
    food: {
      type: Object as PropType<F>,
    },
    meal: {
      type: Object as PropType<MealState>,
    },
    prompt: {
      type: Object as PropType<Prompts[P]>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  } as const;
};

export function createPortionPromptProps<P extends keyof Prompts & keyof PromptStates, F extends EncodedFood | MissingFood | RecipeBuilder = EncodedFood, PF extends EncodedFood | RecipeBuilder = EncodedFood | RecipeBuilder>() {
  return {
    food: {
      type: Object as PropType<F>,
      required: true,
    },
    parentFood: {
      type: Object as PropType<PF>,
    },
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
    prompt: {
      type: Object as PropType<Prompts[P]>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
    modelValue: {
      type: Object as PropType<PromptStates[P]>,
      required: true,
    },
  } as const;
};
