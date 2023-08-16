<template>
  <edit-meal-prompt
    v-bind="{ initialState: state, meal, prompt, section }"
    @action="action"
    @update="update"
  >
  </edit-meal-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { EditMealPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

import { useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'EditMealPromptHandler',

  components: { EditMealPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['edit-meal-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props) {
    const { meal } = useMealPromptUtils();

    const getInitialState = (): PromptStates['edit-meal-prompt'] => ({ foods: meal.value.foods });

    const { state, update, clearStoredState } = usePromptHandlerStore(props, getInitialState);

    return {
      meal,
      state,
      update,
      clearStoredState,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['setFoods', 'addMealFlag']),

    action(type: string, ...args: [id?: string, params?: object]) {
      if (type === 'next') this.commitAnswer();

      this.$emit('action', type, ...args);
    },

    commitAnswer() {
      const { foods } = this.state;
      const mealId = this.meal.id;

      this.setFoods({ mealId, foods });
      this.clearStoredState();
      this.addMealFlag(mealId, 'free-entry-complete');
    },
  },
});
</script>
