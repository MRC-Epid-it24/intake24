<template>
  <meal-time-prompt
    v-bind="{ initialState: state, meal, prompt, section }"
    @action="action"
    @update="update"
  ></meal-time-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
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

  setup() {
    const { meal } = useMealPromptUtils();

    const getInitialState = computed(() => meal.value.time ?? meal.value.defaultTime);

    const { state, update } = usePromptHandlerNoStore(getInitialState);

    return { meal, state, update };
  },

  methods: {
    ...mapActions(useSurvey, ['setMealTime', 'deleteMeal']),

    action(type: string, ...args: [id?: string, params?: object]) {
      if (type === 'next') {
        this.commitAnswer();
        this.$emit('action', type);
        return;
      }
      if (type === 'cancel') {
        this.deleteMeal(this.meal.id);
        this.$emit('action', 'next');
        return;
      }

      this.$emit('action', type, ...args);
    },

    commitAnswer() {
      this.setMealTime(this.meal.id, this.state);
    },
  },
});
</script>

<style scoped></style>
