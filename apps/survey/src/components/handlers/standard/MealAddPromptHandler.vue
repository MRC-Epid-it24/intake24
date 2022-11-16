<template>
  <meal-add-prompt
    v-bind="{ meals, promptComponent, promptProps }"
    @action="action"
    @update="update"
  >
  </meal-add-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { BasePromptProps, StandardComponentType } from '@intake24/common/prompts';
import type { Meal } from '@intake24/common/types';
import { MealAddPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

import { usePromptHandlerNoStore } from '../mixins';

export default defineComponent({
  name: 'MealAddPromptHandler',

  components: { MealAddPrompt },

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
    const getInitialState = (): string | undefined => undefined;

    const { state, update } = usePromptHandlerNoStore(getInitialState, context);

    return { state, update };
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

    async action(type: 'next' | 'cancel') {
      if (type === 'next' && this.state) this.commitAnswer();

      this.$emit('action', 'next');
    },

    commitAnswer() {
      if (!this.state) {
        console.warn('MealAddPromptHandler: no meal selected');
        return;
      }

      this.addMeal(this.state, this.$i18n.locale);
    },
  },
});
</script>
