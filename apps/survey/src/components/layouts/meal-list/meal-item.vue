<template>
  <div>
    <v-list-item
      :class="{ selected: selected || selectedFoodInMeal, 'selected-food': selectedFoodInMeal }"
      @click="mealSelected"
    >
      <v-list-item-title class="font-weight-bold text-wrap">
        {{ mealName }}
      </v-list-item-title>
      <v-list-item-action>
        <v-list-item-action-text v-if="mealTime?.length">
          {{ mealTime }}
        </v-list-item-action-text>
        <v-tooltip v-else bottom>
          <template #activator="{ on, attrs }">
            <v-icon v-bind="attrs" small v-on="on">$question</v-icon>
          </template>
          <span>{{ $t('recall.menu.mealSuggested') }}</span>
        </v-tooltip>
      </v-list-item-action>
      <v-list-item-action class="my-auto">
        <context-menu
          :entity="meal"
          :entity-name="mealName"
          v-bind="{ menu }"
          @action="action"
        ></context-menu>
      </v-list-item-action>
    </v-list-item>
    <v-divider></v-divider>
    <food-item
      :foods="meal.foods"
      :selected-food-id="selectedFoodId"
      @action="action"
      @food-selected="foodSelected"
    ></food-item>
    <v-divider v-if="meal.foods.length"></v-divider>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import mealItemMixin from './meal-item-mixin';

export default defineComponent({
  name: 'MealItem',

  mixins: [mealItemMixin],
});
</script>

<style lang="scss"></style>
