<template>
  <milk-in-a-hot-drink-prompt
    v-bind="{
      food: food(),
      parentFood,
      initialState: state,
      promptComponent,
      promptProps,
    }"
    @action="action"
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
import type { MilkInAHotDrinkPromptState } from '@intake24/survey/components/prompts/portion';
import { MilkInAHotDrinkPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, usePromptHandlerStore } from '../mixins';

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
    const { encodedFood: food, parentFood, portionSize } = useFoodPromptUtils();

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
      food,
      parentFood,
      portionSize,
      state,
      update,
      clearStoredState,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    action(type: string) {
      if (type === 'next') this.commitAnswer();

      this.$emit('action', type);
    },

    commitAnswer() {
      const {
        state: {
          portionSize: { milkVolumePercentage },
        },
        parentFood,
      } = this;

      if (!milkVolumePercentage) {
        console.warn(`Milk volume percentage is not set yet.`);
        return;
      }

      if (!parentFood) throw new Error('Milk in a hot drink prompt: parent food not found.');

      if (
        !parentFood.portionSize ||
        parentFood.portionSize.servingWeight === null ||
        parentFood.portionSize.leftoversWeight === null
      )
        throw new Error('Milk in a hot drink prompt: Parent food missing portion size data');

      const { servingWeight, leftoversWeight } = parentFood.portionSize;

      const drinkPortionSize = {
        ...parentFood.portionSize,
        servingWeight: servingWeight * (1 - milkVolumePercentage),
        leftoversWeight: leftoversWeight * (1 - milkVolumePercentage),
      };

      const milkPortionSize = {
        ...this.state.portionSize,
        servingWeight: servingWeight * milkVolumePercentage,
        leftoversWeight: leftoversWeight * milkVolumePercentage,
      };

      this.updateFood({ foodId: this.food().id, update: { portionSize: milkPortionSize } });
      this.updateFood({
        foodId: this.parentFood.id,
        update: { portionSize: drinkPortionSize },
      });
      this.clearStoredState();
    },
  },
});
</script>
