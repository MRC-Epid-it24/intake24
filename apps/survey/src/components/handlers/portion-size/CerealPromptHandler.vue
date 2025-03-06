<template>
  <cereal-prompt
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
import { CerealPrompt } from '@intake24/survey/components/prompts';
import { createHandlerProps, useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../composables';

const props = defineProps(createHandlerProps<'cereal-prompt'>());

const emit = defineEmits(['action']);

const {
  encodedFood: food,
  encodedFoodPortionSizeData,
  parameters,
  parentFoodOptional: parentFood,
  portionSizeMethods,
} = useFoodPromptUtils<'cereal'>();
const { meal } = useMealPromptUtils();

function getInitialState(): PromptStates['cereal-prompt'] {
  return {
    portionSize: encodedFoodPortionSizeData() ?? {
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
    panel: food().portionSizeMethodIndex !== null ? 1 : 0,
    bowlConfirmed: false,
    servingImageConfirmed: false,
    leftoversPrompt: undefined,
    leftoversImageConfirmed: false,
  };
}

const { state, actionPortionSize: action, update } = usePromptHandlerStore(props, { emit }, getInitialState);
</script>
