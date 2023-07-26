<template>
  <split-food-prompt v-bind="{ food: freeTextFood(), meal, prompt, suggestions }" @action="action">
  </split-food-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { computed, defineComponent, onMounted } from 'vue';

import type { GenericActionType, Prompts } from '@intake24/common/prompts';
import { SplitFoodPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';
import { getEntityId, getFoodIndexRequired } from '@intake24/survey/util';

import { useFoodPromptUtils, useMealPromptUtils } from '../mixins';

export default defineComponent({
  name: 'SplitFoodPromptHandler',

  components: { SplitFoodPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['split-food-prompt']>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, { emit }) {
    const { freeTextFood, meals } = useFoodPromptUtils();
    const { meal } = useMealPromptUtils();
    const survey = useSurvey();

    // TODO: use server-side implementation for split words & lists
    const suggestions = computed(() =>
      freeTextFood()
        .description.split(/(?:,| and | with )+/)
        .map((item) => item.trim())
    );

    const single = () => {
      survey.addFoodFlag(freeTextFood().id, 'split-food-complete');
      emit('action', 'next');
    };

    const separate = () => {
      const foodId = freeTextFood().id;
      const { foodIndex } = getFoodIndexRequired(meals.value, foodId);

      const [first, ...rest] = suggestions.value;

      rest.forEach((suggestion, idx) => {
        survey.addFood({
          mealId: meal.value.id,
          food: {
            id: getEntityId(),
            type: 'free-text',
            description: suggestion,
            flags: ['split-food-complete'],
            customPromptAnswers: {},
            linkedFoods: [],
          },
          at: foodIndex + (idx + 1),
        });
      });

      survey.updateFood({ foodId, update: { description: first } });
      survey.addFoodFlag(foodId, 'split-food-complete');
      emit('action', 'next');
    };

    onMounted(() => {
      if (suggestions.value.length === 1) single();
    });

    return { freeTextFood, meal, separate, single, suggestions };
  },

  methods: {
    ...mapActions(useSurvey, ['setFoods']),

    action(type: 'single' | 'separate' | GenericActionType, id?: string) {
      if (['single', 'separate'].includes(type)) {
        this[type as 'single' | 'separate']();
        return;
      }

      this.$emit('action', type, id);
    },
  },
});
</script>
