<template>
  <meal-add-prompt
    v-model="state"
    v-bind="{ defaultMeals, hasMeals, prompt, section }"
    @action="action"
  ></meal-add-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
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
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, ctx) {
    const getInitialState = computed<string | undefined>(() => undefined);

    const { state } = usePromptHandlerNoStore(ctx, getInitialState);
    const { i18n } = useI18n();
    const survey = useSurvey();

    const hasMeals = computed(() => survey.hasMeals);
    const defaultMeals = computed(
      () => survey.defaultSchemeMeals?.map((meal) => meal.name[i18n.locale] ?? meal.name.en) ?? []
    );

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      if (type === 'next') commitAnswer();

      if (type === 'cancel') {
        survey.setAutoSelection();
        type = 'next';
      }

      ctx.emit('action', type, ...args);
    };

    const commitAnswer = () => {
      if (!state.value) {
        console.warn('MealAddPromptHandler: no meal selected');
        survey.setAutoSelection();
        return;
      }

      survey.addMeal({ name: { en: state.value, [i18n.locale]: state.value } }, i18n.locale);
    };

    return { state, action, defaultMeals, hasMeals };
  },
});
</script>
