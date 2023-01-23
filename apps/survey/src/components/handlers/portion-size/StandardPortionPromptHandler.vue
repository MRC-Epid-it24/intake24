<template>
  <standard-portion-prompt
    v-bind="{
      conversionFactor,
      food: food(),
      initialState: state,
      parameters,
      parentFood,
      prompt,
    }"
    @action="action"
    @update="update"
  >
  </standard-portion-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { StandardPortionPromptState } from '@intake24/survey/components/prompts';
import { StandardPortionPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'StandardPortionPromptHandler',

  components: { StandardPortionPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['standard-portion-prompt']>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props) {
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
      props.prompt.id,
      props.prompt.component,
      getInitialState
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
