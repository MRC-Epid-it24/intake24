<template>
  <pizza-prompt
    v-model="state"
    v-bind="{
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
import { PizzaPrompt } from '@intake24/survey/components/prompts';
import { createHandlerProps, useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../composables';

const props = defineProps(createHandlerProps<'pizza-prompt'>());

const emit = defineEmits(['action']);

const {
  encodedFood: food,
  encodedFoodPortionSizeData,
  parameters,
  parentFoodOptional: parentFood,
  portionSizeMethods,
} = useFoodPromptUtils<'pizza'>();
const { meal } = useMealPromptUtils();

function getInitialState(): PromptStates['pizza-prompt'] {
  return {
    portionSize: encodedFoodPortionSizeData() ?? {
      method: 'pizza',
      type: { id: undefined, index: undefined, image: null },
      thickness: { id: undefined, index: undefined, image: null },
      slice: { id: undefined, index: undefined, image: null, quantity: 1 },
      servingWeight: 0,
      leftoversWeight: 0,
    },
    panel: food().portionSizeMethodIndex !== null ? 1 : 0,
    confirmed: { type: false, thickness: false, slice: false, quantity: false },
  };
}

const { state, actionPortionSize: action, update } = usePromptHandlerStore(props, { emit }, getInitialState);
</script>
