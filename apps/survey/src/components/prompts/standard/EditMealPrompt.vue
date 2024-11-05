<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <template v-if="prompt.separateDrinks">
      <editable-food-list
        v-model="foodsOnly"
        v-bind="{ prompt, section }"
        focus
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
      focus
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
        <v-icon start>
          fas fa-clock
        </v-icon>
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
            <v-icon start>
              $delete
            </v-icon>
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
        <v-icon class="pb-1">
          fas fa-clock
        </v-icon>
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
            <v-icon class="pb-1">
              $delete
            </v-icon>
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

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { PromptStates } from '@intake24/common/prompts';
import type { MealState } from '@intake24/common/types';
import { useMealUtils, usePromptUtils } from '@intake24/survey/composables';
import { ConfirmDialog } from '@intake24/ui';

import createBasePrompt from '../createBasePrompt';
import { EditableFoodList } from '../partials';

export default defineComponent({
  name: 'EditMealPrompt',

  components: { EditableFoodList, ConfirmDialog },

  mixins: [createBasePrompt<'edit-meal-prompt'>()],

  props: {
    meal: {
      type: Object as PropType<MealState>,
      required: true,
    },
    modelValue: {
      type: Array as PropType<PromptStates['edit-meal-prompt']>,
      required: true,
    },
  },

  emits: ['action', 'update:modelValue'],

  setup(props, ctx) {
    const { mealName } = useMealUtils(props);
    const { action } = usePromptUtils(props, ctx);

    const state = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        ctx.emit('update:modelValue', value);
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

    const deleteFood = (foodId: string) => {
      const food = props.meal.foods.find(food => food.id === foodId);
      if (!food)
        return;

      action('deleteFood', foodId);
    };

    return { action, drinksOnly, foodsOnly, isValid, mealName, state, deleteFood };
  },
});
</script>
