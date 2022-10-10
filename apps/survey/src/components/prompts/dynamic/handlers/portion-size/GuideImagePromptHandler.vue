<template>
  <guide-image-prompt
    v-bind="{
      conversionFactor: selectedPortionSize().conversionFactor,
      foodName: foodName(),
      initialState: state,
      isValid,
      parameters,
      promptComponent,
      promptProps,
    }"
    @continue="$emit('continue')"
    @update="update"
  >
  </guide-image-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { GuideImagePromptProps, PortionSizeComponentType } from '@intake24/common/prompts';
import type { GuideImagePromptState } from '@intake24/survey/components/prompts/portion/GuideImagePrompt.vue';
import {
  useFoodPromptUtils,
  usePromptHandlerStore,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import { GuideImagePrompt } from '@intake24/survey/components/prompts/portion';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'GuideImagePromptHandler',

  components: { GuideImagePrompt },

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
      type: Object as PropType<GuideImagePromptProps>,
      required: true,
    },
  },

  setup(props) {
    const { encodedSelectedFood, foodName, parameters, selectedFood, selectedPortionSize } =
      useFoodPromptUtils<'guide-image'>();

    const getInitialState = (): GuideImagePromptState => ({
      portionSize: {
        method: 'guide-image',
        object: null,
        quantity: { whole: 1, fraction: 0 },
        servingWeight: 0,
        leftoversWeight: 0,
      },
      objectConfirmed: false,
      quantityConfirmed: false,
      objectIdx: undefined,
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
      parameters,
      selectedFood,
      selectedPortionSize,
      state,
      update,
      clearStoredState,
    };
  },

  computed: {
    objectValid() {
      return this.state.objectIdx !== undefined && this.state.objectConfirmed;
    },

    quantityValid() {
      return this.state.quantityConfirmed;
    },

    isValid() {
      return this.objectValid && this.quantityValid;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    async commitAnswer() {
      const { portionSize } = this.state;

      this.updateFood({
        foodId: this.selectedFood().id,
        update: { portionSize },
      });

      this.clearStoredState();
    },
  },
});
</script>
