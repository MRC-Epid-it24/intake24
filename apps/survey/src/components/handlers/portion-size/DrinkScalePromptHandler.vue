<template>
  <drink-scale-prompt
    v-bind="{
      food: food(),
      initialState: state,
      parameters,
      parentFood,
      prompt,
    }"
    @action="action"
    @update="update"
  >
  </drink-scale-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { DrinkScalePromptState } from '@intake24/survey/components/prompts';
import { DrinkScalePrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'DrinkScalePromptHandler',

  components: { DrinkScalePrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['drink-scale-prompt']>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props) {
    const {
      encodedFood: food,
      parameters,
      parentFoodOptional: parentFood,
    } = useFoodPromptUtils<'drink-scale'>();

    const getInitialState = (): DrinkScalePromptState => ({
      portionSize: {
        method: 'drink-scale',
        drinkwareId: '',
        initialFillLevel: 0.9,
        skipFillLevel: false,
        imageUrl: '',
        containerId: undefined,
        containerIndex: undefined,
        fillLevel: 0,
        servingWeight: 0,
        leftoversLevel: 0,
        leftoversWeight: 0,
        leftovers: false,
      },
      panel: 0,
      objectConfirmed: false,
      quantityConfirmed: false,
      leftoversConfirmed: false,
      leftoversPrompt: undefined,
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
