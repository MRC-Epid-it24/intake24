<template>
  <standard-portion-prompt
    v-bind="{
      conversionFactor,
      foodName: foodName(),
      initialState: state,
      parameters,
      promptComponent,
      promptProps,
    }"
    @continue="$emit('continue')"
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
import type { StandardPortionPromptState } from '@intake24/survey/components/prompts/portion/StandardPortionPrompt.vue';
import {
  useFoodPromptUtils,
  usePromptHandlerStore,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import { StandardPortionPrompt } from '@intake24/survey/components/prompts/portion';
import { useSurvey } from '@intake24/survey/stores';

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

  setup(props) {
    const { conversionFactor, foodName, parameters, selectedFood } =
      useFoodPromptUtils<'standard-portion'>();

    const getInitialState = (): StandardPortionPromptState => ({
      portionSize: {
        method: 'standard-portion',
        unit: null,
        quantity: { whole: 1, fraction: 0 },
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
      quantityConfirmed: false,
    });

    const { state, update, clearStoredState } = usePromptHandlerStore(
      props.promptId,
      props.promptComponent,
      getInitialState
    );

    return {
      conversionFactor,
      foodName,
      parameters,
      selectedFood,
      state,
      update,
      clearStoredState,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    commitAnswer() {
      const { portionSize } = this.state;

      this.updateFood({ foodId: this.selectedFood().id, update: { portionSize } });
      this.clearStoredState();
    },
  },
});
</script>
