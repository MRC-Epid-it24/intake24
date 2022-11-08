<template>
  <portion-size-option-prompt
    v-bind="{
      food: food(),
      parentFood,
      initialState: state,
      promptComponent,
      promptProps,
      availableMethods,
    }"
    @confirm="$emit('continue')"
    @update="update"
  >
  </portion-size-option-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type {
  PortionSizeComponentType,
  PortionSizeOptionPromptProps,
} from '@intake24/common/prompts';
import type { UserPortionSizeMethod } from '@intake24/common/types/http';
import type { PortionSizeOptionState } from '@intake24/survey/components/prompts/portion/PortionSizeOptionPrompt.vue';
import {
  useFoodPromptUtils,
  usePromptHandlerStore,
} from '@intake24/survey/components/prompts/dynamic/handlers/mixins';
import { PortionSizeOptionPrompt } from '@intake24/survey/components/prompts/portion';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'PortionSizeOptionPromptHandler',

  components: { PortionSizeOptionPrompt },

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
      type: Object as PropType<PortionSizeOptionPromptProps>,
      required: true,
    },
  },

  setup(props, context) {
    const { encodedFood: food, parentFoodOptional: parentFood } = useFoodPromptUtils();

    const getInitialState = (): PortionSizeOptionState => ({
      option: food().portionSizeMethodIndex,
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
      state,
      update,
      clearStoredState,
    };
  },

  computed: {
    availableMethods(): UserPortionSizeMethod[] {
      return this.food().data.portionSizeMethods;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    commitAnswer() {
      this.updateFood({
        foodId: this.food().id,
        update: { portionSizeMethodIndex: this.state.option },
      });

      this.clearStoredState();
    },
  },
});
</script>
