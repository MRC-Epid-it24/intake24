<template>
  <meal-time-prompt
    v-bind="{ initialState: state, meal, prompt }"
    @action="action"
    @update="update"
  ></meal-time-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { computed, defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
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
  },

  setup(props, context) {
    const { meal } = useMealPromptUtils();

    const getInitialState = computed(() => meal.value.time ?? meal.value.defaultTime);

    const { state, update } = usePromptHandlerNoStore(getInitialState, context);

    return { meal, state, update };
  },

  methods: {
    ...mapActions(useSurvey, ['setMealTime', 'deleteMeal']),

    action(type: 'next' | 'cancel') {
      if (type === 'next') {
        this.commitAnswer();
        this.$emit('action', type);
      } else {
        this.deleteMeal(this.meal.id);
        this.$emit('action', 'next');
      }
    },

    commitAnswer() {
      this.setMealTime({ mealId: this.meal.id, time: this.state });
    },
  },
});
</script>

<style scoped></style>
