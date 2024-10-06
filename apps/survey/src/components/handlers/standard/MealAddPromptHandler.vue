<template>
  <meal-add-prompt
    v-model="state"
    v-bind="{ defaultMeals, meals, prompt, section }"
    @action="action"
  />
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
    const { i18n: { locale } } = useI18n();
    const survey = useSurvey();

    const defaultMeals = computed(() => survey.defaultSchemeMeals?.map(({ name }) => name[locale.value] ?? name.en) ?? []);
    const meals = computed(() => survey.meals.map(({ name }) => (name[locale.value] ?? name.en).toLowerCase().trim()));

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      if (type === 'next')
        commitAnswer();

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

      survey.addMeal({ name: { en: state.value, [locale.value]: state.value } }, locale.value);
    };

    return { state, action, defaultMeals, meals };
  },
});
</script>
