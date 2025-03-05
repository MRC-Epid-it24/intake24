<template>
  <component :is="customPromptLayout" v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <v-card-text class="pt-2">
      <v-form @submit.prevent="action('next')">
        <v-checkbox-btn
          v-for="food in filteredFoods"
          :key="food.id"
          v-model="selected"
          hide-details="auto"
          :label="getFoodName(food)"
          :value="food.id"
          @update:model-value="update()"
        />
      </v-form>
    </v-card-text>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </component>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, ref } from 'vue';
import type { FoodState, MealState } from '@intake24/common/surveys';
import { usePromptUtils } from '@intake24/survey/composables';
import { Next, NextMobile } from '../../actions';
import { BaseLayout, CardLayout, PanelLayout } from '../../layouts';
import { createBasePromptProps } from '../../prompt-props';

defineOptions({
  name: 'FoodSelectionPrompt',
  components: { BaseLayout, CardLayout, PanelLayout },
});

const props = defineProps({
  ...createBasePromptProps<'food-selection-prompt'>(),
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => [] as string[],
  },
  meal: {
    type: Object as PropType<MealState>,
    required: true,
  },
  filteredFoods: {
    type: Array as PropType<FoodState[]>,
    required: true,
  },
});

const emit = defineEmits(['action', 'update:modelValue']);

const { action, getFoodName, customPromptLayout } = usePromptUtils(
  props,
  { emit },
);

const selected = ref(Array.isArray(props.modelValue) ? props.modelValue : []);
const isValid = computed(() => true);

function update() {
  emit('update:modelValue', [...selected.value]);
}

defineExpose({ isValid });
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
  .option-label {
    font-size: smaller;
  }
  .food-label {
    font-size: smaller;
  }
}
</style>
