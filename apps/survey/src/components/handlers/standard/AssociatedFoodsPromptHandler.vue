<template>
  <associated-foods-prompt
    v-bind="{
      food: food(),
      initialState: state,
      localeId,
      prompt,
    }"
    @action="action"
    @update="update"
  >
  </associated-foods-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type {
  AssociatedFoodPromptState,
  AssociatedFoodsState,
  EncodedFood,
  FoodState,
} from '@intake24/common/types';
import type { FoodHeader, UserFoodData } from '@intake24/common/types/http';
import { AssociatedFoodsPrompt } from '@intake24/survey/components/prompts/standard';
import foodSearchService from '@intake24/survey/services/foods.service';
import { useSurvey } from '@intake24/survey/stores';
import { getFoodIndexRequired } from '@intake24/survey/stores/meal-food-utils';

import { useFoodPromptUtils, usePromptHandlerStore } from '../mixins';

const initialPromptState = (): AssociatedFoodPromptState => ({
  confirmed: undefined,
  selectedFood: undefined,
  existingFoodId: undefined,
});

export default defineComponent({
  name: 'AssociatedFoodsPromptHandler',

  components: { AssociatedFoodsPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['associated-foods-prompt']>,
      required: true,
    },
  },

  setup(props, context) {
    const { encodedFood: food, localeId, meals } = useFoodPromptUtils();

    const getInitialState = (): AssociatedFoodsState => {
      return {
        activePrompt: 0,
        prompts: food().data.associatedFoodPrompts.map(() => initialPromptState()),
      };
    };

    const { state, update, clearStoredState } = usePromptHandlerStore(
      props.prompt.id,
      props.prompt.component,
      getInitialState,
      context
    );

    return {
      food,
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

    async action(type: string, id?: number) {
      if (type === 'next') await this.commitAnswer();

      this.$emit('action', type, id);
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

      const foodId = this.food().id;
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
        foodId: this.food().id,
        update: { associatedFoodsComplete: true, linkedFoods },
      });

      this.clearStoredState();
    },
  },
});
</script>
