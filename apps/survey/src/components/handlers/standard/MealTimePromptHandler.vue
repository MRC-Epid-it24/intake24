<template>
  <meal-time-prompt
    v-bind="{ initialState: state, mealName: meal.name, promptComponent, promptProps }"
    @nav-action="navAction"
    @update="update"
  ></meal-time-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { MealTimePromptProps, StandardComponentType } from '@intake24/common/prompts';
import type { MealTime } from '@intake24/common/types';
import { MealTimePrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

import { useMealPromptUtils, usePromptHandlerNoStore } from '../mixins';

export default defineComponent({
  name: 'MealTimePromptHandler',

  components: { MealTimePrompt },

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
      type: Object as PropType<MealTimePromptProps>,
      required: true,
    },
  },

  setup(props, context) {
    const { meal } = useMealPromptUtils();

    const getInitialState = (): MealTime => meal.value.time ?? meal.value.defaultTime;

    const { state, update } = usePromptHandlerNoStore(getInitialState, context);

    return { meal, state, update };
  },

  methods: {
    ...mapActions(useSurvey, ['setMealTime', 'deleteMeal']),

    navAction(action: 'next' | 'cancel') {
      if (action === 'next') {
        this.commitAnswer();
        this.$emit('nav-action', action);
      } else {
        this.deleteMeal(this.meal.id);
        this.$emit('nav-action', 'complete');
      }
    },

    commitAnswer() {
      this.setMealTime({ mealId: this.meal.id, time: this.state });
    },
  },
});
</script>

<style scoped></style>
