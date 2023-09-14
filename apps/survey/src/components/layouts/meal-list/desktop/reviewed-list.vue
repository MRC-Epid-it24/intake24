<template>
  <v-card>
    <v-card-title>
      {{ $t('recall.menu.title') }}
    </v-card-title>
    <v-divider></v-divider>
    <p>{{ reviewed }}</p>
    <v-list class="meal-list__list pt-0" dense flat tile>
      <div v-for="meal in meals" :key="meal.id">
        <component
          :is="expandable ? 'meal-item-expandable' : 'meal-item'"
          v-bind="{ meal, selectedMealId, selectedFoodId }"
          :selected-food-in-meal="isSelectedFoodInMeal(meal.id)"
          @action="action"
        ></component>
        <v-checkbox v-model="reviewed" label="Reviewed" :value="meal.id"></v-checkbox>
      </div>
    </v-list>
    <v-card-actions>
      <v-hover v-slot="{ hover }">
        <v-btn
          block
          :color="hover ? 'primary' : 'inherit'"
          depressed
          :title="$t('recall.menu.meal.add')"
          @click="action('addMeal')"
        >
          <v-icon left>$add</v-icon>
          {{ $t('recall.menu.meal.add') }}
        </v-btn>
      </v-hover>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

import type { MealState } from '@intake24/common/types';

import { useMealList } from '../use-meal-list';
import MealItem from './meal-item.vue';
import MealItemExpandable from './meal-item-expandable.vue';

export default defineComponent({
  name: 'MealList',

  components: { MealItem, MealItemExpandable },

  props: {
    expandable: {
      type: Boolean,
      default: false,
    },
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
  },

  setup(props, ctx) {
    const reviewed = ref([]);

    const { selectedMealId, selectedFoodId, isSelectedFoodInMeal, action } = useMealList(
      props,
      ctx
    );

    return {
      reviewed,
      selectedMealId,
      selectedFoodId,
      isSelectedFoodInMeal,
      action,
    };
  },
});
</script>

<style lang="scss"></style>
