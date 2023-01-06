<template>
  <as-served-prompt
    v-bind="{
      food: food(),
      parentFood,
      initialState: state,
      parameters,
      prompt,
    }"
    @action="action"
    @update="update"
  ></as-served-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { AsServedPromptState } from '@intake24/survey/components/prompts';
import { AsServedPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'AsServedPromptHandler',

  components: { AsServedPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['as-served-prompt']>,
      required: true,
    },
  },

  setup(props) {
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
      linkedQuantity: 1,
      linkedQuantityConfirmed: false,
    });

    const { state, update, clearStoredState } = usePromptHandlerStore(
      props.prompt.id,
      props.prompt.component,
      getInitialState
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

    action(type: string, id?: number) {
      if (type === 'next') this.commitAnswer();

      this.$emit('action', type, id);
    },

    commitAnswer() {
      const { portionSize } = this.state;

      this.updateFood({ foodId: this.food().id, update: { portionSize } });
      this.clearStoredState();
    },
  },
});
</script>
