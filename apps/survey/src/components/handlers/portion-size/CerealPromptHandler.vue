<template>
  <cereal-prompt
    v-bind="{
      food: food(),
      initialState: state,
      parameters,
      parentFood,
      prompt,
    }"
    @action="action"
    @update="update"
  ></cereal-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { Prompts } from '@intake24/common/prompts';
import type { CerealPromptState } from '@intake24/survey/components/prompts';
import { CerealPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, usePromptHandlerStore } from '../mixins';

export default defineComponent({
  name: 'CerealPromptHandler',

  components: { CerealPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['cereal-prompt']>,
      required: true,
    },
  },

  setup(props) {
    const {
      encodedFood: food,
      parameters,
      parentFoodOptional: parentFood,
    } = useFoodPromptUtils<'cereal'>();

    const getInitialState = (): CerealPromptState => ({
      portionSize: {
        method: 'cereal',
        imageUrl: null,
        type: parameters.value.type,
        bowl: null,
        bowlId: undefined,
        bowlIndex: undefined,
        serving: null,
        leftovers: null,
        servingWeight: 0,
        leftoversWeight: 0,
      },
      panel: 0,
      bowlConfirmed: false,
      servingImageConfirmed: false,
      leftoversPrompt: undefined,
      leftoversImageConfirmed: false,
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
