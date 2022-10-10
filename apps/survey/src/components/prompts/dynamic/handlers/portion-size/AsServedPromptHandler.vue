<template>
  <as-served-prompt
    v-bind="{
      foodName: foodName(),
      initialState: state,
      isValid,
      parameters,
      promptComponent,
      promptProps,
    }"
    @continue="$emit('continue')"
    @update="update"
  ></as-served-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { AsServedPromptProps, PortionSizeComponentType } from '@intake24/common/prompts';
import type { AsServedPromptState } from '@intake24/survey/components/prompts/portion/AsServedPrompt.vue';
import {
  useFoodPromptUtils,
  usePromptHandlerStore,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import { AsServedPrompt } from '@intake24/survey/components/prompts/portion';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'AsServedPromptHandler',

  components: { AsServedPrompt },

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
      type: Object as PropType<AsServedPromptProps>,
      required: true,
    },
  },

  setup(props) {
    const { encodedSelectedFood, foodName, parameters, selectedFood, selectedPortionSize } =
      useFoodPromptUtils<'as-served'>();

    const getInitialState = (): AsServedPromptState => ({
      portionSize: {
        method: 'as-served',
        serving: null,
        leftovers: null,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
      servingImageConfirmed: false,
      leftoversPrompt: undefined,
      leftoversImageConfirmed: false,
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
    disabledLeftovers() {
      return !this.promptProps.leftovers;
    },

    hasLeftovers() {
      return !!this.parameters['leftovers-image-set'];
    },

    servingValid(): boolean {
      return !!(this.state.portionSize.serving && this.state.servingImageConfirmed);
    },

    leftoversValid(): boolean {
      return !!(this.state.portionSize.leftovers && this.state.leftoversImageConfirmed);
    },

    isValid(): boolean {
      // serving not yet selected
      if (!this.servingValid) return false;

      // Leftover disables || food has no leftovers || leftovers have been confirmed
      if (this.disabledLeftovers || !this.hasLeftovers || this.state.leftoversPrompt === false)
        return true;

      // leftovers not yet selected
      if (!this.leftoversValid) return false;

      return true;
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
            servingWeight: portionSize.serving?.weight ?? 0,
            leftoversWeight: portionSize.leftovers?.weight ?? 0,
          },
        },
      });

      this.clearStoredState();
    },
  },
});
</script>
