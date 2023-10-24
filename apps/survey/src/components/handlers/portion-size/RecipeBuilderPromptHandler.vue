<template>
  <recipe-builder-prompt
    v-model="state"
    v-bind="{
      food: recipeBuilder(),
      localeId,
      meal,
      prompt,
      searchParameters,
      section,
    }"
    @action="action"
    @add-food="addingIngredientsAsALinkedFood"
    @input="update"
  ></recipe-builder-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type {
  Prompts,
  PromptStates,
  RecipeBuilderStepIngredietData,
  RecipeBuilderStepState,
} from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import type { EncodedFood, RecipeFoodStepsType } from '@intake24/common/types';
import { RecipeBuilderPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

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
    const { recipeBuilder, localeId } = useFoodPromptUtils();
    const { meal } = useMealPromptUtils();

    const recipeFood = recipeBuilder().template;
    const foodId = recipeBuilder().id;

    const getInitialState = (): PromptStates['recipe-builder-prompt'] => ({
      recipe: recipeFood,
      activeStep: 0,
      finishedSteps: [],
      recipeSteps: recipeFood.steps.map((step) => initialPromptState(step)),
    });

    const { state, update, clearStoredState } = usePromptHandlerStore(props, ctx, getInitialState);

    const addingIngredientsAsALinkedFood = async (
      ingredients: RecipeBuilderStepIngredietData[][]
    ) => {
      ingredients.forEach(async (stepIngredients) => {
        stepIngredients.forEach(async (ingredient) => {
          await addLinkedFood(ingredient);
        });
      });
      commitAnswer();
    };

    const addLinkedFood = async (data: RecipeBuilderStepIngredietData) => {
      const hasOnePortionSizeMethod = data.ingredient.portionSizeMethods.length === 1;

      const ingredientToAdd: EncodedFood = {
        id: data.id,
        type: 'encoded-food',
        data: data.ingredient,
        searchTerm: 'recipe builder prompt',
        flags: ['portion-size-option-complete'],
        portionSizeMethodIndex: hasOnePortionSizeMethod ? 0 : null,
        portionSize: null,
        customPromptAnswers: {},
        linkedFoods: [],
      };

      const newComponents = [];
      const linkedFood = [];
      const recipeParent = survey.selectedFoodOptional;
      if (recipeParent !== undefined && recipeParent.type === 'recipe-builder') {
        newComponents.push(...recipeParent.components);
        linkedFood.push(...recipeParent.linkedFoods);
      }

      //adding the new ingredient to existing component or creating a new one.
      const componentIndex = newComponents[data.idx] !== undefined ? data.idx : -1;
      if (componentIndex !== -1 && newComponents.length > 0) {
        newComponents[componentIndex].ingredients.push(data.id);
      } else {
        newComponents.push({ order: data.idx, ingredients: [data.id] });
      }

      survey.updateFood({
        foodId: foodId,
        update: {
          linkedFoods: [...linkedFood, ingredientToAdd],
          components: [...newComponents],
        },
      });
    };

    const commitAnswer = () => {
      survey.addFoodFlag(foodId, [
        'portion-size-method-complete',
        'recipe-builder-complete',
        'associated-foods-complete',
      ]);
      clearStoredState();
      ctx.emit('action', 'next');
    };

    const action = async (type: string) => {
      if (type === 'next') commitAnswer();
      else console.log('Unhandled action', type);
    };

    return {
      recipeBuilder,
      recipeFood,
      meal,
      state,
      localeId,
      searchParameters: survey.searchParameters,
      update,
      action,
      addLinkedFood,
      addingIngredientsAsALinkedFood,
    };
  },
});
</script>