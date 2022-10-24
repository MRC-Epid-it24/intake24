<template>
  <milk-in-a-hot-drink-prompt
    v-bind="{
      foodName: foodName(),
      initialState: state,
      promptComponent,
      promptProps,
    }"
    @continue="$emit('continue')"
    @update="update"
  ></milk-in-a-hot-drink-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type {
  MilkInAHotDrinkPromptProps,
  PortionSizeComponentType,
} from '@intake24/common/prompts';
import type { MilkInAHotDrinkPromptState } from '@intake24/survey/components/prompts/portion/MilkInAHotDrinkPrompt.vue';
import {
  useFoodPromptUtils,
  usePromptHandlerStore,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import { MilkInAHotDrinkPrompt } from '@intake24/survey/components/prompts/portion';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'MilkInAHotDrinkPromptHandler',

  components: { MilkInAHotDrinkPrompt },

  props: {
    promptComponent: {
      type: String as PropType<PortionSizeComponentType>,
      required: true,
    },
    promptId: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<MilkInAHotDrinkPromptProps>,
      required: true,
    },
  },

  setup(props, context) {
    const { foodName, selectedFood, selectedParentFood, selectedPortionSize } =
      useFoodPromptUtils();

    const getInitialState = (): MilkInAHotDrinkPromptState => ({
      portionSize: {
        method: 'milk-in-a-hot-drink',
        milkPartIndex: null,
        milkVolumePercentage: null,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
    });

    const { state, update, clearStoredState } = usePromptHandlerStore(
      props.promptId,
      props.promptComponent,
      getInitialState,
      context
    );

    return {
      foodName,
      selectedFood,
      selectedParentFood,
      selectedPortionSize,
      state,
      update,
      clearStoredState,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    async commitAnswer() {
      const {
        state: {
          portionSize: { milkVolumePercentage },
        },
        selectedParentFood,
      } = this;

      if (!milkVolumePercentage) {
        console.warn(`Milk volume percentage is not set yet.`);
        return;
      }

      if (!selectedParentFood)
        throw new Error('Milk in a hot drink prompt: parent food not found.');

      if (
        !selectedParentFood.portionSize ||
        selectedParentFood.portionSize.servingWeight === null ||
        selectedParentFood.portionSize.leftoversWeight === null
      )
        throw new Error('Milk in a hot drink prompt: Parent food missing portion size data');

      const { servingWeight, leftoversWeight } = selectedParentFood.portionSize;

      const drinkPortionSize = {
        ...selectedParentFood.portionSize,
        servingWeight: servingWeight * (1 - milkVolumePercentage),
        leftoversWeight: leftoversWeight * (1 - milkVolumePercentage),
      };

      const milkPortionSize = {
        ...this.state.portionSize,
        servingWeight: servingWeight * milkVolumePercentage,
        leftoversWeight: leftoversWeight * milkVolumePercentage,
      };

      this.updateFood({ foodId: this.selectedFood().id, update: { portionSize: milkPortionSize } });
      this.updateFood({
        foodId: this.selectedParentFood.id,
        update: { portionSize: drinkPortionSize },
      });
      this.clearStoredState();
    },
  },
});
</script>
