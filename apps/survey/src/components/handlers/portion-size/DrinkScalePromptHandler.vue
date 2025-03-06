<template>
  <drink-scale-prompt
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
import { computed } from 'vue';
import type { PromptStates } from '@intake24/common/prompts';
import { DrinkScalePrompt } from '@intake24/survey/components/prompts';
import { createHandlerProps, useFoodPromptUtils, useMealPromptUtils, usePromptHandlerStore } from '../composables';

const props = defineProps(createHandlerProps<'drink-scale-prompt'>());

const emit = defineEmits(['action']);

const {
  encodedFood: food,
  encodedFoodPortionSizeData,
  parameters,
  parentFoodOptional: parentFood,
  portionSizeMethods,
} = useFoodPromptUtils<'drink-scale'>();

const currentValue = computed(() => {
  if (!props.prompt.multiple)
    return 1;

  return (props.prompt.multiple.type === 'counter' ? props.prompt.multiple.current : props.prompt.multiple.current.value) ?? 1;
});

function getInitialState(): PromptStates['drink-scale-prompt'] {
  return {
    portionSize: encodedFoodPortionSizeData() ?? {
      method: 'drink-scale',
      drinkwareId: '',
      initialFillLevel: 0.9,
      skipFillLevel: false,
      imageUrl: '',
      containerId: undefined,
      containerIndex: undefined,
      fillLevel: 0,
      servingWeight: 0,
      leftoversLevel: 0,
      leftoversWeight: 0,
      leftovers: false,
      count: currentValue.value,
    },
    panel: food().portionSizeMethodIndex !== null ? 1 : 0,
    objectConfirmed: false,
    quantityConfirmed: false,
    leftoversConfirmed: false,
    leftoversPrompt: undefined,
    countConfirmed: false,
  };
}

const { state, actionPortionSize: action, update } = usePromptHandlerStore(props, { emit }, getInitialState);
const { meal } = useMealPromptUtils();
</script>
