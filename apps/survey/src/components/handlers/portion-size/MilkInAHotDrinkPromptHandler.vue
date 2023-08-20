<template>
  <milk-in-a-hot-drink-prompt
    v-bind="{
      food: food(),
      meal,
      initialState: state,
      parameters,
      parentFood,
      prompt,
      section,
    }"
    @action="action"
    @update="update"
  ></milk-in-a-hot-drink-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { MilkInAHotDrinkPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'MilkInAHotDrinkPromptHandler',

  components: { MilkInAHotDrinkPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['milk-in-a-hot-drink-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, ctx) {
    const {
      encodedFood: food,
      encodedFoodPortionSizeData,
      parameters,
      parentFood,
      portionSize,
    } = useFoodPromptUtils<'milk-in-a-hot-drink'>();
    const { meal } = useMealPromptUtils();

    const getInitialState = (): PromptStates['milk-in-a-hot-drink-prompt'] => ({
      portionSize: encodedFoodPortionSizeData() ?? {
        method: 'milk-in-a-hot-drink',
        milkPartIndex: null,
        milkVolumePercentage: null,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
    });

    const commitAnswer = () => {
      const {
        portionSize: { milkVolumePercentage },
      } = state.value;

      if (!milkVolumePercentage) {
        console.warn(`Milk volume percentage is not set yet.`);
        return;
      }

      if (!parentFood.value) throw new Error('Milk in a hot drink prompt: parent food not found.');

      if (
        !parentFood.value.portionSize ||
        parentFood.value.portionSize.servingWeight === null ||
        parentFood.value.portionSize.leftoversWeight === null
      )
        throw new Error('Milk in a hot drink prompt: Parent food missing portion size data');

      const { servingWeight, leftoversWeight } = parentFood.value.portionSize;

      const drinkPortionSize = {
        ...parentFood.value.portionSize,
        servingWeight: servingWeight * (1 - milkVolumePercentage),
        leftoversWeight: leftoversWeight * (1 - milkVolumePercentage),
      };

      const milkPortionSize = {
        ...state.value.portionSize,
        servingWeight: servingWeight * milkVolumePercentage,
        leftoversWeight: leftoversWeight * milkVolumePercentage,
      };

      const survey = useSurvey();

      survey.updateFood({ foodId: food().id, update: { portionSize: milkPortionSize } });
      survey.updateFood({
        foodId: parentFood.value.id,
        update: { portionSize: drinkPortionSize },
      });
      survey.addFoodFlag(food().id, 'portion-size-method-complete');

      clearStoredState();
    };

    const { state, action, update, clearStoredState } = usePromptHandlerStore(
      props,
      ctx,
      getInitialState,
      commitAnswer
    );

    return {
      food,
      meal,
      parameters,
      parentFood,
      portionSize,
      state,
      action,
      update,
    };
  },
});
</script>
