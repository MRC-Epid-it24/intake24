<template>
  <meal-add-prompt
    v-bind="{ defaultMeals, hasMeals, prompt }"
    @action="action"
    @update="update"
  ></meal-add-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import { useI18n } from '@intake24/i18n';
import { MealAddPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

import { usePromptHandlerNoStore } from '../mixins';

export default defineComponent({
  name: 'MealAddPromptHandler',

  components: { MealAddPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['meal-add-prompt']>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, { emit }) {
    const getInitialState = computed<string | undefined>(() => undefined);

    const { state, update } = usePromptHandlerNoStore(getInitialState);
    const i18n = useI18n();
    const survey = useSurvey();

    const hasMeals = computed(() => survey.hasMeals);
    const defaultMeals = computed(
      () => survey.defaultSchemeMeals?.map((meal) => meal.name[i18n.locale] ?? meal.name.en) ?? []
    );

    const action = async (type: 'next' | 'cancel') => {
      if (type === 'next') commitAnswer();
      else survey.setAutoSelection();

      emit('action', 'next');
    };

    const commitAnswer = () => {
      if (!state.value) {
        console.warn('MealAddPromptHandler: no meal selected');
        survey.setAutoSelection();
        return;
      }

      const mealId = survey.addMeal(state.value, i18n.locale);
      survey.setSelection({ element: { type: 'meal', mealId }, mode: 'manual' });
    };

    return { state, action, update, defaultMeals, hasMeals };
  },
});
</script>
