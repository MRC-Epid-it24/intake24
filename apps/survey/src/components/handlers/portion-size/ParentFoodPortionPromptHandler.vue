<template>
  <parent-food-portion-prompt
    v-model="state"
    v-bind="{
      food: food(),
      meal,
      parameters,
      parentFood,
      prompt,
      section,
    }"
    @action="action"
    @input="update"
  ></parent-food-portion-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { ParentFoodPortionPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'ParentFoodPortionPromptHandler',

  components: { ParentFoodPortionPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['parent-food-portion-prompt']>,
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
      parentEncodedFood: parentFood,
      portionSize,
    } = useFoodPromptUtils<'parent-food-portion'>();
    const { meal } = useMealPromptUtils();

    const getInitialState = (): PromptStates['parent-food-portion-prompt'] => ({
      portionSize: encodedFoodPortionSizeData() ?? {
        method: 'parent-food-portion',
        portionIndex: null,
        portionValue: null,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
    });

    const commitAnswer = () => {
      const {
        portionSize: { portionValue },
      } = state.value;

      if (!portionValue) {
        console.warn(`Parent food portion is not set yet.`);
        return;
      }

      if (!parentFood.value) throw new Error('Parent food portion prompt: parent food not found.');

      if (
        !parentFood.value.portionSize ||
        parentFood.value.portionSize.servingWeight === null ||
        parentFood.value.portionSize.leftoversWeight === null
      )
        throw new Error('Parent food portion prompt: Parent food missing portion size data');

      const { servingWeight, leftoversWeight } = parentFood.value.portionSize;

      const portionSize = {
        ...state.value.portionSize,
        servingWeight: servingWeight * portionValue,
        leftoversWeight: leftoversWeight * portionValue,
      };

      const survey = useSurvey();

      survey.updateFood({ foodId: food().id, update: { portionSize } });
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
