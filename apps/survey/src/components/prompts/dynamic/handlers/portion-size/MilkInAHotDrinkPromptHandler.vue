<template>
  <milk-in-a-hot-drink-prompt
    v-bind="{
      foodName: foodName(),
      initialState: state,
      isValid,
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

  setup(props) {
    const { encodedSelectedFood, foodName, selectedFood, selectedPortionSize } =
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
      getInitialState
    );

    return {
      encodedSelectedFood,
      foodName,
      selectedFood,
      selectedPortionSize,
      state,
      update,
      clearStoredState,
    };
  },

  computed: {
    milkValid() {
      return (
        this.state.portionSize.milkPartIndex !== null &&
        this.state.portionSize.milkVolumePercentage !== null
      );
    },

    isValid() {
      return this.milkValid;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    async commitAnswer() {
      const { portionSize } = this.state;

      this.updateFood({
        foodId: this.selectedFood().id,
        update: {
          portionSize: {
            ...portionSize,
            // TODO: recalculate drink & food
            servingWeight: 0,
            leftoversWeight: 0,
          },
        },
      });

      this.clearStoredState();
    },
  },
});
</script>
