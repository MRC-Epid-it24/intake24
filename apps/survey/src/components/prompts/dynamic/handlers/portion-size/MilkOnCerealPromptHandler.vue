<template>
  <milk-on-cereal-prompt
    v-bind="{
      foodName: foodName(),
      initialState: state,
      promptComponent,
      promptProps,
    }"
    @continue="$emit('continue')"
    @update="update"
  ></milk-on-cereal-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { MilkOnCerealPromptProps, PortionSizeComponentType } from '@intake24/common/prompts';
import type { MilkOnCerealPromptState } from '@intake24/survey/components/prompts/portion/MilkOnCerealPrompt.vue';
import {
  useFoodPromptUtils,
  usePromptHandlerStore,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import { MilkOnCerealPrompt } from '@intake24/survey/components/prompts/portion';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'MilkOnCerealPromptHandler',

  components: { MilkOnCerealPrompt },

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
      type: Object as PropType<MilkOnCerealPromptProps>,
      required: true,
    },
  },

  setup(props, context) {
    const { foodName, selectedFood, selectedPortionSize } = useFoodPromptUtils();

    const getInitialState = (): MilkOnCerealPromptState => ({
      portionSize: {
        method: 'milk-on-cereal',
        imageUrl: null,
        bowl: null,
        bowlIndex: undefined,
        milkLevelChoice: undefined,
        milkLevelImage: null,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
      bowlConfirmed: false,
      milkLevelConfirmed: false,
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
