<template>
  <guide-image-prompt
    v-model="state"
    v-bind="{
      conversionFactor,
      food: food(),
      linkedParent,
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
import { GuideImagePrompt } from '@intake24/survey/components/prompts';
import { createHandlerProps, useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../composables';

const props = defineProps(createHandlerProps<'guide-image-prompt'>());

const emit = defineEmits(['action']);

const {
  conversionFactor,
  encodedFood: food,
  encodedFoodPortionSizeData,
  linkedParent,
  linkedParentQuantity,
  parameters,
  parentFoodOptional: parentFood,
  portionSizeMethods,
} = useFoodPromptUtils<'guide-image'>();
const { meal } = useMealPromptUtils();

function getInitialState(): PromptStates['guide-image-prompt'] {
  return {
    portionSize: encodedFoodPortionSizeData() ?? {
      method: 'guide-image',
      guideImageId: '',
      imageUrl: null,
      objectId: undefined,
      objectIndex: undefined,
      objectWeight: 0,
      quantity: 1,
      linkedQuantity: linkedParentQuantity.value,
      servingWeight: 0,
      leftoversWeight: 0,
    },
    panel: food().portionSizeMethodIndex !== null ? 1 : 0,
    objectConfirmed: false,
    quantityConfirmed: false,
    linkedQuantityConfirmed: false,
  };
}

const { state, actionPortionSize: action, update } = usePromptHandlerStore(props, { emit }, getInitialState);
</script>
