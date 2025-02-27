<template>
  <portion-size-option-prompt
    v-model="state"
    v-bind="{
      portionSizeMethods,
      food,
      meal,
      parentFood,
      prompt,
      section,
    }"
    @action="action"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import type { Prompts } from '@intake24/common/prompts';
import type { EncodedFood, PromptSection } from '@intake24/common/surveys';
import { PortionSizeOptionPrompt } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';
import { useFoodPromptUtils, useMealPromptUtils, usePromptHandlerNoStore } from '../mixins';

export default defineComponent({
  name: 'PortionSizeOptionPromptHandler',

  components: { PortionSizeOptionPrompt },

  props: {
    prompt: {
      type: Object as PropType<Prompts['portion-size-option-prompt']>,
      required: true,
    },
    section: {
      type: String as PropType<PromptSection>,
      required: true,
    },
  },

  emits: ['action'],

  setup(props, ctx) {
    const survey = useSurvey();
    const { encodedFood, parentFoodOptional: parentFood, portionSizeMethods } = useFoodPromptUtils();
    const { meal } = useMealPromptUtils();

    const food = encodedFood();

    const getInitialState = computed(() => ({ option: food.portionSizeMethodIndex }));

    const commitAnswer = () => {
      const update: Partial<Omit<EncodedFood, 'type'>> = { portionSizeMethodIndex: state.value.option };

      if (food.portionSizeMethodIndex !== null && food.portionSizeMethodIndex !== state.value.option
      ) {
        update.portionSize = null;
      }

      survey.updateFood({ foodId: food.id, update });
      survey.addFoodFlag(food.id, 'portion-size-option-complete');
    };

    const { state, action } = usePromptHandlerNoStore(ctx, getInitialState, commitAnswer);

    return {
      food,
      meal,
      parentFood,
      portionSizeMethods,
      state,
      action,
    };
  },
});
</script>
