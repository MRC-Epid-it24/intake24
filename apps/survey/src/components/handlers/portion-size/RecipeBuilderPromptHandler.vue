<template>
  <recipe-builder-prompt
    v-model="state"
    v-bind="{
      food: recipeBuilder(),
      localeId,
      meal,
      prompt,
      section,
    }"
    @action="action"
    @add-food="addLinkedFood"
    @input="update"
  ></recipe-builder-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { Prompts, PromptStates, RecipeBuilderStepState } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import type { RecipeFoodStepsType } from '@intake24/common/types';
import type { UserFoodData } from '@intake24/common/types/http';
import { RecipeBuilderPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';
import { getEntityId, getFoodIndexRequired } from '@intake24/survey/util';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

const initialPromptState = (step: RecipeFoodStepsType): RecipeBuilderStepState => ({
  confirmed: undefined,
  type: undefined,
  repeat: step.repeatable ? true : false,
  selectedFoods: [],
  order: step.order - 1,
  description: step.description,
  name: step.name,
  categoryCode: step.categoryCode,
});

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
    const { recipeBuilder, localeId, meals } = useFoodPromptUtils();
    const { meal } = useMealPromptUtils();

    const recipeFood = recipeBuilder().template;
    const foodId = recipeBuilder().id;
    const { foodIndex } = getFoodIndexRequired(meals.value, foodId);

    const getInitialState = (): PromptStates['recipe-builder-prompt'] => ({
      recipe: recipeFood,
      activeStep: 0,
      finishedSteps: [],
      recipeSteps: recipeFood.steps.map((step) => initialPromptState(step)),
    });

    // eslint-disable-next-line vue/no-setup-props-destructure
    const { state, action, update, clearStoredState } = usePromptHandlerStore(
      props,
      ctx,
      getInitialState
    );

    const addLinkedFood = async (data: { ingredient: UserFoodData; idx: number }) => {
      const hasOnePortionSizeMethod = data.ingredient.portionSizeMethods.length === 1;
      const flags = ['recipe-builder-complete'];

      if (hasOnePortionSizeMethod) flags.push('portion-size-option-complete');

      const id = getEntityId();
      survey.addFood({
        mealId: meal.value.id,
        food: {
          id: id,
          type: 'encoded-food',
          data: data.ingredient,
          searchTerm: data.ingredient.localName,
          flags,
          portionSizeMethodIndex: hasOnePortionSizeMethod ? 0 : null,
          portionSize: null,
          customPromptAnswers: {},
          linkedFoods: [],
          link: [{ id: id, linkedTo: [foodId] }],
        },
        at: foodIndex + (data.idx + 1),
      });

      const newComponents = [];
      const recipeParent = survey.selectedFoodOptional;
      if (recipeParent !== undefined && recipeParent.type === 'recipe-builder') {
        newComponents.push(...recipeParent.components);
      }

      survey.updateFood({
        foodId: foodId,
        update: { components: [...newComponents, { order: data.idx, ingredients: [id] }] },
      });
    };

    const commitAnswer = () => {
      //const { steps } = state.value;

      // if (['name', 'description', 'portionSize'].some((key) => !info[key as keyof typeof info]))
      //   throw new Error('Recipe Builder food prompt: missing data');

      // survey.updateFood({ foodId: food().id, update: { info } });
      // survey.addFoodFlag(food().id, 'recipe-builder-complete');

      clearStoredState();
    };

    return { recipeBuilder, recipeFood, meal, state, localeId, update, action, addLinkedFood };
  },
});
</script>
