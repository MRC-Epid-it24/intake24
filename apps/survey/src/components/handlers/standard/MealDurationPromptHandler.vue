<template>
  <meal-duration-prompt
    v-bind="{ initialState: state, meal, prompt, section }"
    @action="action"
    @update="update"
  ></meal-duration-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { computed, defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { MealDurationPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

import { useMealPromptUtils, usePromptHandlerNoStore } from '../mixins';

export default defineComponent({
  name: 'MealDurationPromptHandler',

  components: { MealDurationPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['meal-duration-prompt']>,
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

    const getInitialState = computed(() => props.prompt.initial);

    const { state, update } = usePromptHandlerNoStore(getInitialState);

    return { meal, state, update };
  },

  methods: {
    ...mapActions(useSurvey, ['setMealDuration']),

    action(type: string, ...args: [id?: string, params?: object]) {
      if (type === 'next') this.commitAnswer();

      this.$emit('action', type, ...args);
    },

    commitAnswer() {
      this.setMealDuration(this.meal.id, this.state);
    },
  },
});
</script>

<style scoped></style>
