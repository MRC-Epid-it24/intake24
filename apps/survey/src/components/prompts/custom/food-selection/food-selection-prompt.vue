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

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';

import type { FoodState, MealState } from '@intake24/common/surveys';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';

import { usePromptUtils } from '@intake24/survey/composables';
import createBasePrompt from '../../createBasePrompt';

export default defineComponent({
  name: 'FoodSelectionPrompt',

  mixins: [createBasePrompt<'food-selection-prompt'>()],

  props: {
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
  },

  emits: ['action', 'update:modelValue'],

  setup(props, ctx) {
    const { i18n: translate } = useI18n();

    const promptAnswers = ref(copy(props.modelValue));

    const { action, getFoodName, getMealTime, customPromptLayout, type } = usePromptUtils(
      props,
      ctx,
    );

    const selected = ref(Array.isArray(props.modelValue) ? props.modelValue : []);
    const isValid = computed(() => true);

    const update = () => {
      ctx.emit('update:modelValue', [...selected.value]);
    };

    return {
      action,
      customPromptLayout,
      type,
      selected,
      getFoodName,
      getMealTime,
      isValid,
      promptAnswers,
      translate,
      update,
    };
  },
});
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
