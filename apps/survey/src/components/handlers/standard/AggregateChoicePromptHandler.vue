<template>
  <aggregate-choice-prompt
    v-model="state"
    v-bind="{ filteredMeals, prompt, section }"
    @action="action"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { AggregateChoicePrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

import { filterMealsForAggregateChoicePrompt } from '../../prompts/standard/aggregate-choice/aggregate-choice';
import { usePromptHandlerNoStore } from '../mixins';

export default defineComponent({
  name: 'AggregateChoicePromptHandler',

  components: { AggregateChoicePrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['aggregate-choice-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, ctx) {
    const survey = useSurvey();

    const filteredMeals = computed(() => filterMealsForAggregateChoicePrompt(survey, props.prompt));

    const getInitialState = computed(() =>
      Object.fromEntries(filteredMeals.value.flatMap(meal => meal.foods.map(food => [food.id, food.customPromptAnswers[props.prompt.id]]))));

    // TODO: use store for intermediate state
    const { state } = usePromptHandlerNoStore(ctx, getInitialState);

    const commitAnswer = () => {
      function commitAnswers(food: FoodState) {
        const answer = state.value[food.id];
        if (answer !== undefined)
          food.customPromptAnswers[props.prompt.id] = answer;

        for (const linkedFood of food.linkedFoods) {
          commitAnswers(linkedFood);
        }
      }

      survey.meals.forEach(meal => meal.foods.forEach(food => commitAnswers(food)));
    };

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      if (type === 'next') {
        commitAnswer();
        ctx.emit('action', type);
        return;
      }
      ctx.emit('action', type, ...args);
    };

    return { state, action, filteredMeals };
  },
});
</script>

<style scoped></style>
