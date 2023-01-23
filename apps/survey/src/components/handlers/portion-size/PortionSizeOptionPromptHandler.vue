<template>
  <portion-size-option-prompt
    v-bind="{
      availableMethods,
      food: food(),
      initialState: state,
      parentFood,
      prompt,
    }"
    @action="action"
    @update="update"
  >
  </portion-size-option-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { UserPortionSizeMethod } from '@intake24/common/types/http';
import type { PortionSizeOptionState } from '@intake24/survey/components/prompts';
import { PortionSizeOptionPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'PortionSizeOptionPromptHandler',

  components: { PortionSizeOptionPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['portion-size-option-prompt']>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props) {
    const { encodedFood: food, parentFoodOptional: parentFood } = useFoodPromptUtils();

    const getInitialState = (): PortionSizeOptionState => ({
      option: food().portionSizeMethodIndex,
    });

    const { state, update, clearStoredState } = usePromptHandlerStore(
      props.prompt.id,
      props.prompt.component,
      getInitialState
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

    action(type: string, id?: number) {
      if (type === 'next') this.commitAnswer();

      this.$emit('action', type, id);
    },

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
