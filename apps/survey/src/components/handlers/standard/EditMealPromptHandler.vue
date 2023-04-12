<template>
  <edit-meal-prompt
    v-bind="{ initialState: state, meal, prompt }"
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
  },

  emits: ['action'],

  setup(props) {
    const { meal } = useMealPromptUtils();

    const getInitialState = (): PromptStates['edit-meal-prompt'] => ({ foods: meal.value.foods });

    const { state, update, clearStoredState } = usePromptHandlerStore(
      props.prompt.id,
      props.prompt.component,
      getInitialState
    );

    return {
      meal,
      state,
      update,
      clearStoredState,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['setFoods', 'setMealFlag']),

    action(type: string, id?: string) {
      if (type === 'next') this.commitAnswer();

      this.$emit('action', type, id);
    },

    commitAnswer() {
      const { foods } = this.state;
      const mealId = this.meal.id;

      this.setFoods({ mealId, foods });
      this.clearStoredState();
      this.setMealFlag({ mealId, flag: 'free-entry-complete' });
    },
  },
});
</script>
