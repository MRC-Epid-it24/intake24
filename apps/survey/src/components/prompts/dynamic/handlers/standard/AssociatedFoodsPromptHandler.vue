<template>
  <associated-foods-prompt
    v-bind="{
      food: encodedSelectedFood(),
      initialState: state,
      localeId,
      promptComponent,
      promptProps,
    }"
    @confirm="$emit('continue')"
    @update="update"
  >
  </associated-foods-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { AssociatedFoodsPromptProps, StandardComponentType } from '@intake24/common/prompts';
import type {
  AssociatedFoodPromptState,
  AssociatedFoodsState,
  EncodedFood,
  FoodState,
} from '@intake24/common/types';
import type { FoodHeader, UserFoodData } from '@intake24/common/types/http';
import {
  useFoodPromptUtils,
  usePromptHandlerStore,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import { AssociatedFoodsPrompt } from '@intake24/survey/components/prompts/standard';
import foodSearchService from '@intake24/survey/services/foods.service';
import { useSurvey } from '@intake24/survey/stores';
import { getFoodIndexRequired } from '@intake24/survey/stores/meal-food-utils';

const initialPromptState = (): AssociatedFoodPromptState => ({
  confirmed: undefined,
  selectedFood: undefined,
  existingFoodId: undefined,
});

export default defineComponent({
  name: 'AssociatedFoodsPromptHandler',

  components: { AssociatedFoodsPrompt },

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
      type: Object as PropType<AssociatedFoodsPromptProps>,
      required: true,
    },
  },

  setup(props, context) {
    const { encodedSelectedFood, localeId, meals } = useFoodPromptUtils();

    const getInitialState = (): AssociatedFoodsState => {
      return {
        activePrompt: 0,
        prompts: encodedSelectedFood().data.associatedFoodPrompts.map(() => initialPromptState()),
      };
    };

    const { state, update, clearStoredState } = usePromptHandlerStore(
      props.promptId,
      props.promptComponent,
      getInitialState,
      context
    );

    return {
      encodedSelectedFood,
      localeId,
      meals,
      state,
      update,
      clearStoredState,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood', 'setFoods', 'getNextFoodId']),

    async fetchFoodData(headers: FoodHeader[]): Promise<UserFoodData[]> {
      //TODO: Show loading

      return Promise.all(
        headers.map((header) => foodSearchService.getData(this.localeId, header.code))
      );
    },

    async commitAnswer() {
      const newFoods: FoodHeader[] = [];

      this.state.prompts.forEach((prompt) => {
        if (prompt.confirmed === 'yes' && prompt.selectedFood !== undefined) {
          newFoods.push(prompt.selectedFood);
        }
      });

      const existingFoods = this.state.prompts
        .filter((prompt) => prompt.confirmed === 'existing')
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((prompt) => prompt.existingFoodId!);

      const foodId = this.encodedSelectedFood().id;
      const foodIndex = getFoodIndexRequired(this.meals, foodId);
      const mealIndex = foodIndex.mealIndex;
      const mealId = this.meals[mealIndex].id;

      const moveFoods: EncodedFood[] = [];
      const keepFoods: FoodState[] = [];

      this.meals[mealIndex].foods.forEach((food) => {
        if (food.type === 'encoded-food' && existingFoods.includes(food.id)) {
          moveFoods.push(food);
        } else {
          keepFoods.push(food);
        }
      });

      const foodData = await this.fetchFoodData(newFoods);

      const linkedFoods: EncodedFood[] = foodData.map((data) => ({
        type: 'encoded-food',
        id: this.getNextFoodId(),
        flags: [],
        linkedFoods: [],
        customPromptAnswers: {},
        data,
        searchTerm: 'associated food prompt',
        portionSizeMethodIndex: null,
        portionSize: null,
        associatedFoodsComplete: false,
      }));

      linkedFoods.push(...moveFoods);

      this.setFoods({ mealId, foods: keepFoods });

      this.updateFood({
        foodId: this.encodedSelectedFood().id,
        update: { associatedFoodsComplete: true, linkedFoods },
      });

      this.clearStoredState();
    },
  },
});
</script>
