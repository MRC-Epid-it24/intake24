<template>
  <missing-food-prompt
    v-bind="{
      food: food(),
      initialState: state,
      prompt,
    }"
    @action="action"
    @update="update"
  ></missing-food-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { MissingFoodPromptState } from '@intake24/survey/components/prompts/portion';
import { MissingFoodPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'MissingFoodPromptHandler',

  components: { MissingFoodPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['missing-food-prompt']>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props) {
    const { missingFood: food } = useFoodPromptUtils();

    const getInitialState = (): MissingFoodPromptState => ({
      info: {
        name: '',
        brand: '',
        description: '',
        leftovers: '',
        portionSize: '',
      },
      panel: 0,
    });

    const { state, update, clearStoredState } = usePromptHandlerStore(
      props.prompt.id,
      props.prompt.component,
      getInitialState
    );

    return {
      food,
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
      const {
        state: { info },
      } = this;

      if (Object.values(info).some((value) => !value))
        throw new Error('Missing food prompt: missing data');

      this.updateFood({ foodId: this.food().id, update: { info } });

      this.clearStoredState();
    },
  },
});
</script>
