<template>
  <recipe-builder-prompt
    v-model="state"
    v-bind="{
      food: recipeBuilder(),
      localeId,
      meal,
      initialState: state,
      prompt,
      section,
    }"
    @action="action"
    @update="update"
  ></recipe-builder-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { Prompts, PromptStates } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import { RecipeBuilderPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'RecipeBuilderPromptHandler',

  components: { RecipeBuilderPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['recipe-builder-prompt']>,
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
    const { recipeBuilder, localeId } = useFoodPromptUtils();
    const { meal } = useMealPromptUtils();

    const recipeFood = recipeBuilder().template;

    const getInitialState = (): PromptStates['recipe-builder-prompt'] => ({
      recipe: recipeFood,
      panel: 0,
      finishedSteps: [],
      steps: [],
    });

    // eslint-disable-next-line vue/no-setup-props-destructure
    const { state, action, update, clearStoredState } = usePromptHandlerStore(
      props,
      ctx,
      getInitialState
    );

    const commitAnswer = () => {
      //const { steps } = state.value;

      // if (['name', 'description', 'portionSize'].some((key) => !info[key as keyof typeof info]))
      //   throw new Error('Recipe Builder food prompt: missing data');

      // survey.updateFood({ foodId: food().id, update: { info } });
      // survey.addFoodFlag(food().id, 'recipe-builder-complete');

      clearStoredState();
    };

    const searchParameters = computed(() => {
      const { searchSortingAlgorithm: rankingAlgorithm, searchMatchScoreWeight: matchScoreWeight } =
        survey.parameters ?? {};

      return { matchScoreWeight, rankingAlgorithm };
    });

    return { recipeBuilder, recipeFood, meal, state, localeId, update, action };
  },
});
</script>
