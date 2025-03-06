<template>
  <direct-weight-prompt
    v-model="state"
    v-bind="{
      conversionFactor,
      food: food(),
      meal,
      parameters,
      portionSizeMethods,
      prompt,
      section,
    }"
    @action="action"
    @update:model-value="update"
  />
</template>

<script lang="ts" setup>
import type { PromptStates } from '@intake24/common/prompts';
import { DirectWeightPrompt } from '@intake24/survey/components/prompts';
import { createHandlerProps, useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../composables';

const props = defineProps(createHandlerProps<'direct-weight-prompt'>());

const emit = defineEmits(['action']);

const {
  conversionFactor,
  encodedFood: food,
  encodedFoodPortionSizeData,
  parameters,
  portionSizeMethods,
} = useFoodPromptUtils<'direct-weight'>();
const { meal } = useMealPromptUtils();

function getInitialState(): PromptStates['direct-weight-prompt'] {
  return {
    portionSize: encodedFoodPortionSizeData() ?? {
      method: 'direct-weight',
      quantity: null,
      servingWeight: 0,
      leftoversWeight: 0,
    },
    panel: food().portionSizeMethodIndex !== null ? 1 : 0,
  };
}

const { state, actionPortionSize: action, update } = usePromptHandlerStore(props, { emit }, getInitialState);
</script>
