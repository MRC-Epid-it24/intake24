<template>
  <pizza-prompt
    v-bind="{
      food: food(),
      initialState: state,
      parentFood,
      prompt,
    }"
    @action="action"
    @update="update"
  ></pizza-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { PizzaPromptState } from '@intake24/survey/components/prompts';
import { PizzaPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'PizzaPromptHandler',

  components: { PizzaPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['pizza-prompt']>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props) {
    const { encodedFood: food, parentFoodOptional: parentFood, portionSize } = useFoodPromptUtils();

    const getInitialState = (): PizzaPromptState => ({
      portionSize: {
        method: 'pizza',
        type: { id: undefined, index: undefined, image: null },
        thickness: { id: undefined, index: undefined, image: null },
        slice: { id: undefined, index: undefined, image: null, quantity: 1 },
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
      confirmed: { type: false, thickness: false, slice: false, quantity: false },
    });

    const { state, update, clearStoredState } = usePromptHandlerStore(
      props.prompt.id,
      props.prompt.component,
      getInitialState
    );

    return {
      food,
      parentFood,
      portionSize,
      state,
      update,
      clearStoredState,
    };
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood']),

    action(type: string, id?: string) {
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
