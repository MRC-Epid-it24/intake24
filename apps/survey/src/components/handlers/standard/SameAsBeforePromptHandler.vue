<template>
  <same-as-before-prompt
    v-if="sabFood"
    v-bind="{ food: encodedFood(), meal, prompt, sabFood, section }"
    @action="action"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, onMounted } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { SameAsBeforePrompt } from '@intake24/survey/components/prompts/standard';
import { useSameAsBefore, useSurvey } from '@intake24/survey/stores';
import { getEntityId } from '@intake24/survey/util';

import { useFoodPromptUtils, useMealPromptUtils } from '../mixins';

export default defineComponent({
  name: 'SameAsBeforePromptHandler',

  components: { SameAsBeforePrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['same-as-before-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, { emit }) {
    const { encodedFood } = useFoodPromptUtils();
    const { meal } = useMealPromptUtils();
    const {
      id: foodId,
      data: { code },
    } = encodedFood();

    const survey = useSurvey();

    const sabFood = useSameAsBefore().getItem(survey.localeId, code);

    const sabAction = (type: 'notSame' | 'same') => {
      if (type === 'same' && sabFood) {
        const { id, ...update } = sabFood.food;
        survey.updateFood({
          foodId,
          update: {
            ...update,
            linkedFoods: update.linkedFoods.map(linkedFood => ({
              ...linkedFood,
              id: getEntityId(),
            })),
          },
        });
      }

      survey.addFoodFlag(foodId, 'same-as-before-complete');
      emit('action', 'next');
    };

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      if (['notSame', 'same'].includes(type)) {
        sabAction(type as 'notSame' | 'same');
        return;
      }

      emit('action', type, ...args);
    };

    onMounted(() => {
      if (!sabFood)
        sabAction('notSame');
    });

    return { action, encodedFood, meal, sabFood };
  },
});
</script>
