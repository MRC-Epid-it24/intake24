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
    />
    <template #actions>
      <v-btn
        v-if="!meal.flags.includes('meal-time:disabled')"
        class="px-4"
        color="primary"
        large
        text
        :title="$t('recall.actions.mealTime')"
        @click="action('mealTime', meal.id)"
      >
        <v-icon left>
          fas fa-clock
        </v-icon>
        {{ $t('recall.actions.mealTime') }}
      </v-btn>
      <confirm-dialog
        :label="$t('recall.menu.meal.delete').toString()"
        @confirm="action('deleteMeal', meal.id)"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            class="px-4"
            color="primary"
            large
            text
            :title="$t('recall.actions.deleteMeal')"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon left>
              $delete
            </v-icon>
            {{ $t('recall.actions.nav.deleteMeal') }}
          </v-btn>
        </template>
        <i18n path="recall.menu.meal.deleteConfirm">
          <template #item>
            <span class="font-weight-medium">{{ mealName }}</span>
          </template>
        </i18n>
      </confirm-dialog>
      <next :disabled="!isValid" @click="action('next')" />
    </template>
    <template #nav-actions>
      <v-btn
        v-if="!meal.flags.includes('meal-time:disabled')"
        color="primary"
        text
        :title="$t('recall.actions.nav.mealTime')"
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
        :label="$t('recall.menu.meal.delete').toString()"
        @confirm="action('deleteMeal', meal.id)"
      >
        <template #activator="{ on, attrs }">
          <v-btn color="primary" text v-bind="attrs" v-on="on">
            <span class="text-overline font-weight-medium">
              {{ $t('recall.actions.nav.deleteMeal') }}
            </span>
            <v-icon class="pb-1">
              $delete
            </v-icon>
          </v-btn>
        </template>
        <i18n path="recall.menu.meal.deleteConfirm">
          <template #item>
            <span class="font-weight-medium">{{ mealName }}</span>
          </template>
        </i18n>
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
import { useI18n } from '@intake24/i18n';
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
    value: {
      type: Array as PropType<PromptStates['edit-meal-prompt']>,
      required: true,
    },
  },

  emits: ['input'],

  setup(props, ctx) {
    const { translate } = useI18n();
    const { mealName } = useMealUtils(props);
    const { action } = usePromptUtils(props, ctx);

    const state = computed({
      get() {
        return props.value;
      },
      set(value) {
        ctx.emit('input', value);
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

    return { action, drinksOnly, foodsOnly, isValid, mealName, state, deleteFood, translate };
  },
});
</script>
