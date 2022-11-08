<template>
  <as-served-prompt
    v-bind="{
      food: food(),
      parentFood,
      initialState: state,
      parameters,
      promptComponent,
      promptProps,
    }"
    @confirm="$emit('continue')"
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

  setup(props, context) {
    const {
      encodedFood: food,
      parameters,
      parentFoodOptional: parentFood,
      portionSize,
    } = useFoodPromptUtils<'as-served'>();

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
      getInitialState,
      context
    );

    return {
      food,
      parameters,
      parentFood,
      portionSize,
      state,
      update,
      clearStoredState,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    async commitAnswer() {
      const { portionSize } = this.state;

      this.updateFood({ foodId: this.food().id, update: { portionSize } });
      this.clearStoredState();
    },
  },
});
</script>
