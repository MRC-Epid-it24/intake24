<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <template v-if="prompt.separateDrinks">
      <editable-food-list
        v-model="foodsOnly"
        v-bind="{ prompt, section }"
        :focus="prompt.inputAutoFocus"
        mode="foodsOnly"
        @delete="deleteFood"
      />
      <editable-food-list
        v-bind="{ prompt, section }"
        v-model="drinksOnly"
        mode="drinksOnly"
        @delete="deleteFood"
      />
    </template>
    <editable-food-list
      v-else
      v-bind="{ prompt, section }"
      v-model="state"
      :focus="prompt.inputAutoFocus"
      @delete="deleteFood"
    />
    <template #actions>
      <v-btn
        v-if="!meal.flags.includes('meal-time:disabled')"
        class="px-4"
        color="primary"
        size="large"
        :title="$t('recall.actions.mealTime')"
        variant="text"
        @click="action('mealTime', meal.id)"
      >
        <v-icon icon="fas fa-clock" start />
        {{ $t('recall.actions.mealTime') }}
      </v-btn>
      <confirm-dialog
        :label="$t('recall.menu.meal.delete')"
        @confirm="action('deleteMeal', meal.id)"
      >
        <template #activator="{ props }">
          <v-btn
            class="px-4"
            color="primary"
            size="large"
            :title="$t('recall.actions.deleteMeal')"
            variant="text"
            v-bind="props"
          >
            <v-icon icon="$delete" start />
            {{ $t('recall.actions.nav.deleteMeal') }}
          </v-btn>
        </template>
        <i18n-t keypath="recall.menu.meal.deleteConfirm" tag="span">
          <template #item>
            <span class="font-weight-medium">{{ mealName }}</span>
          </template>
        </i18n-t>
      </confirm-dialog>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <v-btn
        v-if="!meal.flags.includes('meal-time:disabled')"
        color="primary"
        :title="$t('recall.actions.nav.mealTime')"
        variant="text"
        @click.stop="action('mealTime', meal.id)"
      >
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.mealTime') }}
        </span>
        <v-icon class="pb-1" icon="fas fa-clock" />
      </v-btn>
      <confirm-dialog
        :label="$t('recall.menu.meal.delete')"
        @confirm="action('deleteMeal', meal.id)"
      >
        <template #activator="{ props }">
          <v-btn color="primary" variant="text" v-bind="props">
            <span class="text-overline font-weight-medium">
              {{ $t('recall.actions.nav.deleteMeal') }}
            </span>
            <v-icon class="pb-1" icon="$delete" />
          </v-btn>
        </template>
        <i18n-t keypath="recall.menu.meal.deleteConfirm" tag="span">
          <template #item>
            <span class="font-weight-medium">{{ mealName }}</span>
          </template>
        </i18n-t>
      </confirm-dialog>
      <next-mobile :disabled="!isValid" @click="action('next')" />
    </template>
  </card-layout>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';
import type { PromptStates } from '@intake24/common/prompts';
import type { MealState } from '@intake24/common/surveys';
import { useMealUtils, usePromptUtils } from '@intake24/survey/composables';
import { ConfirmDialog } from '@intake24/ui';
import { Next, NextMobile } from '../actions';
import { CardLayout } from '../layouts';
import { EditableFoodList } from '../partials';
import { createBasePromptProps } from '../prompt-props';

defineOptions({ name: 'EditMealPrompt' });

const props = defineProps({
  ...createBasePromptProps<'edit-meal-prompt'>(),
  meal: {
    type: Object as PropType<MealState>,
    required: true,
  },
  modelValue: {
    type: Array as PropType<PromptStates['edit-meal-prompt']>,
    required: true,
  },
});

const emit = defineEmits(['action', 'update:modelValue']);

const { mealName } = useMealUtils(props);
const { action } = usePromptUtils(props, { emit });

const state = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
const isValid = computed(() => !!state.value.length);
const drinksOnly = computed({
  get() {
    return state.value.filter(food => food.flags.includes('is-drink'));
  },
  set(val) {
    // eslint-disable-next-line ts/no-use-before-define
    state.value = [...foodsOnly.value, ...val];
  },
});
const foodsOnly = computed({
  get() {
    return state.value.filter(food => !food.flags.includes('is-drink'));
  },
  set(val) {
    state.value = [...drinksOnly.value, ...val];
  },
});

function deleteFood(foodId: string) {
  const food = props.meal.foods.find(food => food.id === foodId);
  if (!food)
    return;

  action('deleteFood', foodId);
}
</script>
