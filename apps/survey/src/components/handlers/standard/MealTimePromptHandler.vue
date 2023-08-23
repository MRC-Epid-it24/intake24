<template>
  <meal-time-prompt
    v-bind="{ initialState: state, meal, prompt, section }"
    @action="action"
    @update="update"
  ></meal-time-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { MealTimePrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

import { useMealPromptUtils, usePromptHandlerNoStore } from '../mixins';

export default defineComponent({
  name: 'MealTimePromptHandler',

  components: { MealTimePrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['meal-time-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, ctx) {
    const { meal } = useMealPromptUtils();
    const survey = useSurvey();

    const getInitialState = computed(() => meal.value.time ?? meal.value.defaultTime);

    const { state, update } = usePromptHandlerNoStore(ctx, getInitialState);

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      if (type === 'next') {
        commitAnswer();
        ctx.emit('action', type);
        return;
      }
      if (type === 'cancel') {
        survey.deleteMeal(meal.value.id);
        ctx.emit('action', 'next');
        return;
      }

      ctx.emit('action', type, ...args);
    };

    const commitAnswer = () => {
      survey.setMealTime(meal.value.id, state.value);
    };

    return { meal, state, action, update };
  },
});
</script>

<style scoped></style>
