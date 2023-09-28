<template>
  <v-bottom-sheet v-model="navigation" content-class="meal-list-mobile__sheet" scrollable>
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" class="navigation__btn-summary" value="summary" v-on="on">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.review') }}
        </span>
        <v-icon class="pb-1">fas fa-list-check</v-icon>
      </v-btn>
    </template>
    <v-card class="meal-list-mobile__card">
      <div class="py-4 pl-4 pr-3 d-flex flex-row justify-space-between align-center">
        <div class="text-h6 font-weight-medium">{{ $t('recall.menu.title') }}</div>
        <v-btn color="primary" icon @click="action('addMeal')">
          <v-icon large>$add</v-icon>
        </v-btn>
      </div>
      <v-card-text class="pa-0">
        <v-list class="meal-list__list" dense subheader>
          <meal-item
            v-for="meal in meals"
            :key="meal.id"
            v-bind="{ contextId, meal, selectedMealId, selectedFoodId }"
            :selected-food-in-meal="isSelectedFoodInMeal(meal.id)"
            @action="action"
            @update:context-id="updateContextId"
          ></meal-item>
          <div>
            <next-mobile @click="action('next')">
              {{ $t('recall.actions.nav.submit') }}
            </next-mobile>
          </div>
        </v-list>
      </v-card-text>
      <v-card-actions> </v-card-actions>
    </v-card>
  </v-bottom-sheet>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref, watch } from 'vue';

import type { MealState } from '@intake24/common/types';
import { useMealUtils } from '@intake24/survey/composables';

import { useMealList } from '../use-meal-list';
import MealItem from './meal-item.vue';

export default defineComponent({
  name: 'MealListMobile',

  components: { MealItem },

  props: {
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
  },

  setup(props, ctx) {
    const { selectedMealId, selectedFoodId, isSelectedFoodInMeal, action } = useMealList(
      props,
      ctx
    );

    const { getMealName, getMealTime } = useMealUtils();

    const contextId = ref<string | undefined>(undefined);
    const navigation = ref<boolean>(false);

    const updateContextId = (id: string) => {
      contextId.value = id === contextId.value ? undefined : id;
    };

    watch(navigation, (val) => {
      if (!val) return;

      contextId.value = selectedMealId.value ?? selectedFoodId.value;
    });

    return {
      contextId,
      navigation,
      updateContextId,
      getMealName,
      getMealTime,
      selectedMealId,
      selectedFoodId,
      isSelectedFoodInMeal,
      action,
    };
  },
});
</script>

<style lang="scss"></style>
