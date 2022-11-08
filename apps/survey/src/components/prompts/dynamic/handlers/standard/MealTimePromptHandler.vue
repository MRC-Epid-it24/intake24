<template>
  <meal-time-prompt
    v-bind="{ initialState: state, mealName: meal.name, promptComponent, promptProps }"
    @confirm="$emit('continue')"
    @remove-meal="removeMeal"
    @update="update"
  ></meal-time-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { MealTimePromptProps, StandardComponentType } from '@intake24/common/prompts';
import type { MealTime } from '@intake24/common/types';
import {
  useMealPromptUtils,
  usePromptHandlerNoStore,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import { MealTimePrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

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

    removeMeal() {
      this.deleteMeal(this.meal.id);
      this.$emit('complete');
    },

    async commitAnswer() {
      this.setMealTime({ mealId: this.meal.id, time: this.state });
    },
  },
});
</script>

<style scoped></style>
