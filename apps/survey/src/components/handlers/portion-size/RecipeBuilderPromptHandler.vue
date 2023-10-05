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
import type { EncodedFood, RecipeFoodStepsType } from '@intake24/common/types';
import type { UserFoodData } from '@intake24/common/types/http';
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

    const addLinkedFood = async (data: { ingredient: UserFoodData; idx: number; id: string }) => {
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
        link: [{ id: data.id, linkedTo: [foodId] }],
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
      survey.addFoodFlag(foodId, 'portion-size-method-complete');
      survey.addFoodFlag(foodId, 'recipe-builder-complete');
      survey.addFoodFlag(foodId, 'associated-foods-complete');
      clearStoredState();
      ctx.emit('action', 'next');
    };

    const deleteComponentAndThenFood = (type: string, id: string, stepId: number) => {
      console.warn('deleteComponent', id, stepId);
      const recipeParent = survey.selectedFoodOptional;
      if (recipeParent !== undefined && recipeParent.type === 'recipe-builder') {
        const updatedComponents = [...recipeParent.components];
        if (updatedComponents[stepId] === undefined) return;
        updatedComponents[stepId].ingredients = updatedComponents[stepId].ingredients.filter(
          (i) => i !== id
        );
        survey.updateFood({
          foodId: foodId,
          update: {
            components: updatedComponents,
          },
        });
      }
      ctx.emit('action', type, id);
    };

    const action = async (
      type: string,
      ...args: [id?: string, stepId?: number, params?: object]
    ) => {
      if (type === 'next') await commitAnswer();
      if (type === 'remove')
        deleteComponentAndThenFood('deleteFood', args[0] as string, args[1] as number);
    };

    return { recipeBuilder, recipeFood, meal, state, localeId, update, action, addLinkedFood };
  },
});
</script>
