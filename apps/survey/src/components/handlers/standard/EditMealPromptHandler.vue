<template>
  <edit-meal-prompt
    v-bind="{ initialState: state, meal, promptComponent, promptProps }"
    @action="action"
    @update="update"
  >
  </edit-meal-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent, ref } from 'vue';

import type { BasePromptProps, StandardComponentType } from '@intake24/common/prompts';
import type { EditMealPromptState } from '@intake24/survey/components/prompts/standard/EditMealPrompt.vue';
import { EditMealPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

import { useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'EditMealPromptHandler',

  components: { EditMealPrompt },

  props: {
    promptComponent: {
      type: String as PropType<StandardComponentType>,
      required: true,
    },
    promptId: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
  },

  setup(props, context) {
    const { meal } = useMealPromptUtils();

    const getInitialState = (): EditMealPromptState => ({ foods: meal.value.foods });

    const { state, update, clearStoredState } = usePromptHandlerStore(
      props.promptId,
      props.promptComponent,
      getInitialState,
      context
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

    action(type: string, id?: number) {
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