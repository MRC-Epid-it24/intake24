<template>
  <milk-on-cereal-prompt
    v-bind="{
      food: food(),
      parentFood,
      initialState: state,
      promptComponent,
      promptProps,
    }"
    @action="action"
    @update="update"
  ></milk-on-cereal-prompt>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';

import type { MilkOnCerealPromptProps, PortionSizeComponentType } from '@intake24/common/prompts';
import type { MilkOnCerealPromptState } from '@intake24/survey/components/prompts';
import { MilkOnCerealPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, usePromptHandlerStore } from '../mixins';

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
    const { encodedFood: food, parentFoodOptional: parentFood, portionSize } = useFoodPromptUtils();

    const getInitialState = (): MilkOnCerealPromptState => ({
      portionSize: {
        method: 'milk-on-cereal',
        imageUrl: null,
        bowl: null,
        bowlId: undefined,
        bowlIndex: undefined,
        milkLevelId: undefined,
        milkLevelIndex: undefined,
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
