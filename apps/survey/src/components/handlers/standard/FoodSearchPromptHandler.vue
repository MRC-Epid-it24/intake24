<template>
  <food-search-prompt
    v-bind="{ discardedFoodName, food: food(), meal, localeId, parameters, prompt, section }"
    v-model="searchTerm"
    @action="action"
    @food-missing="foodMissing"
    @food-selected="foodSelected"
    @recipe-builder="recipeBuilder"
  ></food-search-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { computed, defineComponent, ref } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import type {
  EncodedFood,
  FoodState,
  MissingFood,
  RecipeBuilder,
  RecipeFood,
} from '@intake24/common/types';
import type { UserFoodData } from '@intake24/common/types/http';
import { FoodSearchPrompt } from '@intake24/survey/components/prompts/standard';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, useMealPromptUtils } from '../mixins';

export default defineComponent({
  name: 'FoodSearchPromptHandler',

  components: { FoodSearchPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['food-search-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, { emit }) {
    function getSearchTerm(foodEntry: FoodState) {
      switch (foodEntry.type) {
        case 'encoded-food':
          return foodEntry.searchTerm;
        case 'free-text':
          return foodEntry.description;
        case 'missing-food':
          return foodEntry.searchTerm;
        case 'recipe-builder':
          return foodEntry.searchTerm;
      }
    }

    const { food, localeId, initializeRecipeComponents } = useFoodPromptUtils();
    const { meal } = useMealPromptUtils();
    const parameters = computed(() => {
      const { searchSortingAlgorithm: rankingAlgorithm, searchMatchScoreWeight: matchScoreWeight } =
        useSurvey().parameters ?? {};

      return { matchScoreWeight, rankingAlgorithm };
    });

    const foodData = ref<UserFoodData | undefined>(undefined);
    const searchTerm = ref(getSearchTerm(food()));
    const discardedFoodName = ref<string | null>(null);

    const currentState = food();

    // Warn user if they try to replace an encoded food that already has some portion size
    // data associated with it by coming back to the food search prompt using the back or forward
    // buttons.
    //
    // TODO: make sure this cannot result in an invalid survey state some other way, for instance
    //       by invalidating custom prompt answers or associated food links.

    if (
      currentState.type === 'encoded-food' &&
      (currentState.portionSizeMethodIndex !== null || currentState.portionSize !== null)
    ) {
      discardedFoodName.value = currentState.data.localName;
    } else {
      discardedFoodName.value = null;
    }

    const action = (type: string, ...args: [id?: string, params?: object]) => {
      emit('action', type, ...args);
    };

    return {
      action,
      food,
      meal,
      localeId,
      foodData,
      parameters,
      searchTerm,
      discardedFoodName,
      initializeRecipeComponents,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['replaceFood']),

    foodSelected(foodData: UserFoodData) {
      this.foodData = foodData;
      this.commitAnswer();
      this.action('next');
    },

    foodMissing() {
      const { searchTerm } = this;
      const { id, customPromptAnswers, flags } = this.food();

      const newState: MissingFood = {
        id,
        type: 'missing-food',
        info: null,
        searchTerm: searchTerm ? searchTerm : '',
        customPromptAnswers,
        flags,
        linkedFoods: [],
      };

      this.replaceFood({ foodId: id, food: newState });

      this.action('next');
    },

    recipeBuilder(recipeFood: RecipeFood) {
      const { searchTerm } = this;
      const { id, customPromptAnswers, flags } = this.food();
      const components = this.initializeRecipeComponents(
        recipeFood.steps.map((step) => step.order - 1)
      );

      const newState: RecipeBuilder = {
        id,
        type: 'recipe-builder', // TODO: Check if "recipe-builder" is the correct type here or should ity be "template"
        description: recipeFood.recipeWord,
        searchTerm: searchTerm ? searchTerm : '',
        customPromptAnswers,
        flags,
        linkedFoods: [],
        template_id: recipeFood.name,
        template: recipeFood,
        markedAsComplete: [],
        components,
        link: [],
      };

      this.replaceFood({ foodId: id, food: newState });

      this.action('next');
    },

    commitAnswer() {
      const { foodData, searchTerm } = this;
      if (foodData === undefined) {
        console.warn('FoodSearchPromptHandler: foodData is undefined.');
        return;
      }

      const { id, customPromptAnswers, flags } = this.food();

      // Automatically select the only portion size method available to avoid triggering
      // redundant portion size option prompt
      const hasOnePortionSizeMethod = foodData.portionSizeMethods.length === 1;
      if (hasOnePortionSizeMethod) flags.push('portion-size-option-complete');

      const newState: EncodedFood = {
        id,
        type: 'encoded-food',
        data: foodData,
        searchTerm: searchTerm ? searchTerm : '',
        portionSizeMethodIndex: hasOnePortionSizeMethod ? 0 : null,
        portionSize: null,
        customPromptAnswers,
        flags,
        linkedFoods: [],
      };

      this.replaceFood({ foodId: id, food: newState });
    },
  },
});
</script>

<style scoped></style>
