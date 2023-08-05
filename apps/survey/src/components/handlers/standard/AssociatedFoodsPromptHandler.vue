<template>
  <associated-foods-prompt
    v-bind="{
      food: food(),
      meal,
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

import type {
  AssociatedFoodPromptItemState,
  Prompts,
  PromptStates,
} from '@intake24/common/prompts';
import type { EncodedFood, FoodState, MissingFood } from '@intake24/common/types';
import type { FoodHeader, UserFoodData } from '@intake24/common/types/http';
import { capitalize } from '@intake24/common/util';
import { AssociatedFoodsPrompt } from '@intake24/survey/components/prompts/standard';
import foodSearchService from '@intake24/survey/services/foods.service';
import { useSurvey } from '@intake24/survey/stores';
import { getEntityId, getFoodIndexRequired } from '@intake24/survey/util';
import { useLocale } from '@intake24/ui';

import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../mixins';

const initialPromptState = (): AssociatedFoodPromptItemState => ({
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

  emits: ['action'],

  setup(props) {
    const { getLocaleContent } = useLocale();
    const { encodedFood: food, localeId, meals } = useFoodPromptUtils();
    const { meal } = useMealPromptUtils();

    const getInitialState = (): PromptStates['associated-foods-prompt'] => ({
      activePrompt: 0,
      prompts: food().data.associatedFoodPrompts.map(() => initialPromptState()),
    });

    const { state, update, clearStoredState } = usePromptHandlerStore(props, getInitialState);

    return {
      food,
      getLocaleContent,
      localeId,
      meal,
      meals,
      state,
      update,
      clearStoredState,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood', 'setFoods']),

    async fetchFoodData(headers: FoodHeader[]): Promise<UserFoodData[]> {
      //TODO: Show loading

      return Promise.all(
        headers.map((header) => foodSearchService.getData(this.localeId, header.code))
      );
    },

    async action(type: string, id?: string) {
      if (type === 'next') await this.commitAnswer();

      this.$emit('action', type, id);
    },

    async commitAnswer() {
      const newFoods: FoodHeader[] = [];
      const missingFoods: MissingFood[] = [];

      this.state.prompts.forEach((prompt, idx) => {
        if (prompt.confirmed === 'yes' && prompt.selectedFood !== undefined) {
          newFoods.push(prompt.selectedFood);
        }

        if (prompt.confirmed === 'missing') {
          missingFoods.push({
            id: getEntityId(),
            type: 'missing-food',
            info: null,
            searchTerm: capitalize(
              this.getLocaleContent(this.food().data.associatedFoodPrompts[idx].genericName)
            ),
            customPromptAnswers: {},
            flags: [],
            linkedFoods: [],
          });
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

      const linkedFoods: FoodState[] = foodData.map((data) => {
        const hasOnePortionSizeMethod = data.portionSizeMethods.length === 1;

        return {
          type: 'encoded-food',
          id: getEntityId(),
          flags: hasOnePortionSizeMethod ? ['portion-size-option-complete'] : [],
          linkedFoods: [],
          customPromptAnswers: {},
          data,
          searchTerm: 'associated food prompt',
          portionSizeMethodIndex: hasOnePortionSizeMethod ? 0 : null,
          portionSize: null,
          associatedFoodsComplete: false,
        };
      });

      linkedFoods.push(...moveFoods, ...missingFoods);

      this.setFoods({ mealId, foods: keepFoods });

      this.updateFood({
        foodId,
        update: { associatedFoodsComplete: true, linkedFoods },
      });

      this.clearStoredState();
    },
  },
});
</script>
