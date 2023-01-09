<template>
  <split-food-prompt v-bind="{ food: freeTextFood(), prompt, suggestions }" @action="action">
  </split-food-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { computed, defineComponent, onMounted } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import { SplitFoodPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';
import { getFoodIndexRequired } from '@intake24/survey/stores/meal-food-utils';

import type { RecallAction } from '../../recall/recall-mixin';
import { useFoodPromptUtils } from '../mixins';

export default defineComponent({
  name: 'SplitFoodPromptHandler',

  components: { SplitFoodPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['split-food-prompt']>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const { freeTextFood, meals } = useFoodPromptUtils();
    const survey = useSurvey();

    // TODO: use server-side implementation for split words & lists
    const suggestions = computed(() =>
      freeTextFood()
        .description.split(/(?:,| and | with )+/)
        .map((item) => item.trim())
    );

    const single = () => {
      survey.setFoodFlag({ foodId: freeTextFood().id, flag: 'split-food-complete' });
      emit('action', 'next');
    };

    const separate = () => {
      const foodId = freeTextFood().id;
      const { foodIndex, mealIndex } = getFoodIndexRequired(meals.value, foodId);
      const mealId = meals.value[mealIndex].id;

      const [first, ...rest] = suggestions.value;

      rest.forEach((suggestion, idx) => {
        survey.addFood({
          mealId,
          food: {
            id: survey.getNextFoodId(),
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
      survey.setFoodFlag({ foodId, flag: 'split-food-complete' });
      emit('action', 'next');
    };

    onMounted(() => {
      if (suggestions.value.length === 1) single();
    });

    return { freeTextFood, separate, single, suggestions };
  },

  methods: {
    ...mapActions(useSurvey, ['setFoods']),

    action(type: 'single' | 'separate' | RecallAction, id?: number) {
      if (['single', 'separate'].includes(type)) {
        this[type as 'single' | 'separate']();
        return;
      }

      this.$emit('action', type, id);
    },
  },
});
</script>
