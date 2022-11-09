<template>
  <standard-portion-prompt
    v-bind="{
      conversionFactor,
      food: food(),
      parentFood,
      initialState: state,
      parameters,
      promptComponent,
      promptProps,
    }"
    @confirm="$emit('continue')"
    @update="update"
  >
  </standard-portion-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type {
  PortionSizeComponentType,
  StandardPortionPromptProps,
} from '@intake24/common/prompts';
import type { StandardPortionPromptState } from '@intake24/survey/components/prompts';
import { StandardPortionPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'StandardPortionPromptHandler',

  components: { StandardPortionPrompt },

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
      type: Object as PropType<StandardPortionPromptProps>,
      required: true,
    },
  },

  setup(props, context) {
    const {
      conversionFactor,
      encodedFood: food,
      parameters,
      parentFoodOptional: parentFood,
    } = useFoodPromptUtils<'standard-portion'>();

    const getInitialState = (): StandardPortionPromptState => ({
      portionSize: {
        method: 'standard-portion',
        unit: null,
        quantity: 1,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
      quantityConfirmed: false,
    });

    const { state, update, clearStoredState } = usePromptHandlerStore(
      props.promptId,
      props.promptComponent,
      getInitialState,
      context
    );

    return {
      conversionFactor,
      food,
      parameters,
      parentFood,
      state,
      update,
      clearStoredState,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    commitAnswer() {
      const { portionSize } = this.state;

      this.updateFood({ foodId: this.food().id, update: { portionSize } });
      this.clearStoredState();
    },
  },
});
</script>
