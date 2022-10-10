<template>
  <cereal-prompt
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
  ></cereal-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { CerealPromptProps, PortionSizeComponentType } from '@intake24/common/prompts';
import type { CerealPromptState } from '@intake24/survey/components/prompts/portion/CerealPrompt.vue';
import {
  useFoodPromptUtils,
  usePromptHandlerStore,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import { CerealPrompt } from '@intake24/survey/components/prompts/portion';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'CerealPromptHandler',

  components: { CerealPrompt },

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
      type: Object as PropType<CerealPromptProps>,
      required: true,
    },
  },

  setup(props) {
    const { encodedSelectedFood, foodName, parameters, selectedFood, selectedPortionSize } =
      useFoodPromptUtils<'cereal'>();

    const getInitialState = (): CerealPromptState => ({
      portionSize: {
        method: 'cereal',
        type: parameters.value.type,
        bowl: null,
        bowlIndex: undefined,
        serving: null,
        leftovers: null,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
      objectConfirmed: false,
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

    objectValid() {
      return (
        this.state.portionSize.bowlIndex !== undefined &&
        this.state.portionSize.bowl &&
        this.state.objectConfirmed
      );
    },

    servingValid(): boolean {
      return !!(this.state.portionSize.serving && this.state.servingImageConfirmed);
    },

    leftoversValid(): boolean {
      return !!(this.state.portionSize.leftovers && this.state.leftoversImageConfirmed);
    },

    isValid(): boolean {
      // object not yet selected
      if (!this.objectValid) return false;

      // serving not yet selected
      if (!this.servingValid) return false;

      // Leftover disables || leftovers have been confirmed
      if (this.disabledLeftovers || this.state.leftoversPrompt === false) return true;

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
