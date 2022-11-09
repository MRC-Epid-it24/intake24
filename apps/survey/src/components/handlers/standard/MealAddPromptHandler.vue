<template>
  <meal-add-prompt v-bind="{ meals, promptComponent, promptProps }" @add="add" @cancel="cancel">
  </meal-add-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { BasePromptProps } from '@intake24/common/prompts';
import type { Meal } from '@intake24/common/types';
import { MealAddPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'MealAddPromptHandler',

  components: { MealAddPrompt },

  props: {
    promptComponent: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
  },

  computed: {
    ...mapState(useSurvey, ['defaultSchemeMeals']),

    meals(): string[] {
      return (
        this.defaultSchemeMeals?.map(
          (meal: Meal) => meal.name[this.$i18n.locale] ?? meal.name.en
        ) ?? []
      );
    },
  },

  methods: {
    ...mapActions(useSurvey, ['addMeal']),

    add(newMeal: string) {
      this.addMeal(newMeal, this.$i18n.locale);
      this.$emit('complete');
    },

    cancel() {
      this.$emit('complete');
    },

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async commitAnswer() {},
  },
});
</script>
