<template>
  <pizza-v2-prompt
    v-model="state"
    v-bind="{
      conversionFactor,
      food: food(),
      meal,
      parameters,
      parentFood,
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
import { PizzaV2Prompt } from '@intake24/survey/components/prompts';
import { createHandlerProps, useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../composables';

const props = defineProps(createHandlerProps<'pizza-v2-prompt'>());

const emit = defineEmits(['action']);

const {
  conversionFactor,
  encodedFood: food,
  encodedFoodPortionSizeData,
  parameters,
  parentFoodOptional: parentFood,
  portionSizeMethods,
} = useFoodPromptUtils<'pizza-v2'>();
const { meal } = useMealPromptUtils();

function getInitialState(): PromptStates['pizza-v2-prompt'] {
  return {
    portionSize: encodedFoodPortionSizeData() ?? {
      method: 'pizza-v2',
      size: null,
      crust: null,
      unit: null,
      quantity: 1,
      servingWeight: 0,
      leftoversWeight: 0,
    },
    panel: food().portionSizeMethodIndex !== null ? 1 : 0,
    confirmed: { size: false, crust: false, unit: false, quantity: false },
  };
}

const { state, actionPortionSize: action, update } = usePromptHandlerStore(props, { emit }, getInitialState);
</script>
