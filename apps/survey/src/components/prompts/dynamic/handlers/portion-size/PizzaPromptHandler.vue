<template>
  <pizza-prompt
    v-bind="{
      foodName: foodName(),
      initialState: state,
      promptComponent,
      promptProps,
    }"
    @continue="$emit('continue')"
    @update="update"
  ></pizza-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { PizzaPromptProps, PortionSizeComponentType } from '@intake24/common/prompts';
import type { PizzaPromptState } from '@intake24/survey/components/prompts/portion/PizzaPrompt.vue';
import {
  useFoodPromptUtils,
  usePromptHandlerStore,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import { PizzaPrompt } from '@intake24/survey/components/prompts/portion';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'PizzaPromptHandler',

  components: { PizzaPrompt },

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
      type: Object as PropType<PizzaPromptProps>,
      required: true,
    },
  },

  setup(props, context) {
    const { foodName, selectedFood, selectedPortionSize } = useFoodPromptUtils();

    const getInitialState = (): PizzaPromptState => ({
      portionSize: {
        method: 'pizza',
        imageUrl: null,
        pizzaType: undefined,
        pizzaThickness: undefined,
        sliceImage: null,
        sliceQuantity: 1,
        sliceType: undefined,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
      confirmed: {
        pizzaType: false,
        pizzaThickness: false,
        sliceType: false,
        quantity: false,
      },
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
      selectedPortionSize,
      state,
      update,
      clearStoredState,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    async commitAnswer() {
      const { portionSize } = this.state;

      this.updateFood({ foodId: this.selectedFood().id, update: { portionSize } });
      this.clearStoredState();
    },
  },
});
</script>
