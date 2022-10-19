<template>
  <associated-foods-prompt
    v-bind="{
      food: encodedSelectedFood(),
      initialState: state,
      localeId,
      promptComponent,
      promptProps,
    }"
    @continue="$emit('continue')"
    @update="update"
  >
  </associated-foods-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { AssociatedFoodsPromptProps, StandardComponentType } from '@intake24/common/prompts';
import type { AssociatedFoodsState, EncodedFood } from '@intake24/common/types';
import type { FoodHeader, UserFoodData } from '@intake24/common/types/http';
import {
  useFoodPromptUtils,
  usePromptHandlerStore,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import AssociatedFoodsPrompt from '@intake24/survey/components/prompts/standard/AssociatedFoodsPrompt.vue';
import foodSearchService from '@intake24/survey/services/foods.service';
import { useSurvey } from '@intake24/survey/stores';

interface AssociatedFoodPromptState {
  confirmed: boolean | undefined;
  selectedFood: FoodHeader | undefined;
}

const initialPromptState = (): AssociatedFoodPromptState => ({
  confirmed: undefined,
  selectedFood: undefined,
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
    const { encodedSelectedFood, localeId } = useFoodPromptUtils();

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
      state,
      update,
      clearStoredState,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood', 'getNextFoodId']),

    async fetchFoodData(headers: FoodHeader[]): Promise<UserFoodData[]> {
      //TODO: Show loading

      return Promise.all(
        headers.map((header) => foodSearchService.getData(this.localeId, header.code))
      );
    },

    async commitAnswer() {
      const headers: FoodHeader[] = [];

      this.state.prompts.forEach((prompt) => {
        if (prompt.confirmed && prompt.selectedFood !== undefined) {
          headers.push(prompt.selectedFood);
        }
      });

      const foodData = await this.fetchFoodData(headers);

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

      this.updateFood({
        foodId: this.encodedSelectedFood().id,
        update: { associatedFoodsComplete: true, linkedFoods },
      });

      this.clearStoredState();
    },
  },
});
</script>
