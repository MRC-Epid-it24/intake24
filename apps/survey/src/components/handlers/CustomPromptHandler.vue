<template>
  <component
    :is="prompt.component"
    :key="prompt.id"
    v-model="state"
    v-bind="{
      meal: mealOptional,
      food: foodOptional,
      prompt,
      section,
    }"
    @action="action"
  ></component>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';

import type { Prompt } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import type { CustomPromptAnswer } from '@intake24/common/types';
import { customPrompts } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, useMealPromptUtils } from './mixins';

const infoPrompts = ['info-prompt', 'no-more-information-prompt'];

export default defineComponent({
  name: 'CustomPromptHandler',

  components: { ...customPrompts },

  props: {
    prompt: {
      type: Object as PropType<Prompt>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const { foodOptional } = useFoodPromptUtils();
    const { mealOptional } = useMealPromptUtils();
    const survey = useSurvey();

    const isInfoPrompt = computed(() => infoPrompts.includes(props.prompt.component));

    const state = ref<CustomPromptAnswer | undefined>(isInfoPrompt.value ? 'ok' : undefined);

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      if (type === 'next' || isInfoPrompt.value) commitAnswer();

      emit('action', type, ...args);
    };

    const commitAnswer = () => {
      if (state.value === undefined) {
        console.warn('Did not expect answer to be undefined');
        return;
      }

      if (props.prompt.component === 'no-more-information-prompt') {
        const newSelection = survey.selection;
        newSelection.mode = 'auto';
        survey.setSelection(newSelection);
      }

      const promptId = props.prompt.id;

      if (survey.selection !== undefined && survey.selection.element !== null) {
        // eslint-disable-next-line default-case
        switch (survey.selection.element.type) {
          case 'food': {
            const food = foodOptional.value;
            if (!food) {
              console.warn('Expected meal to be defined');
              return;
            }

            if (isInfoPrompt.value) survey.addFoodFlag(food.id, `${promptId}-acknowledged`);
            else
              survey.setFoodCustomPromptAnswer({
                foodId: food.id,
                promptId,
                answer: state.value,
              });
            break;
          }
          case 'meal': {
            if (!mealOptional.value) {
              console.warn('Expected meal to be defined');
              return;
            }

            if (isInfoPrompt.value)
              survey.addMealFlag(mealOptional.value.id, `${promptId}-acknowledged`);
            else
              survey.setMealCustomPromptAnswer({
                mealId: mealOptional.value.id,
                promptId,
                answer: state.value,
              });

            break;
          }
        }
      } else if (isInfoPrompt.value) {
        survey.addFlag(`${promptId}-acknowledged`);
      } else {
        survey.setCustomPromptAnswer({ promptId, answer: state.value });
      }
    };

    return {
      action,
      foodOptional,
      mealOptional,
      state,
      survey,
    };
  },
});
</script>

<style scoped></style>
