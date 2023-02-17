<template>
  <v-list-group
    :class="{ selected: selected || selectedFoodInMeal, 'selected-food': selectedFoodInMeal }"
    :sub-group="true"
    :value="true"
    @click="mealSelected"
  >
    <template #prependIcon>
      <v-icon :class="{ rotate: selected || selectedFoodInMeal }">$expand</v-icon>
    </template>
    <template #activator>
      <v-list-item-title class="font-weight-bold text-wrap">
        {{ mealName }}
      </v-list-item-title>
      <v-list-item-action>
        <v-list-item-action-text v-if="mealTimeString.length">
          {{ mealTimeString }}
        </v-list-item-action-text>
        <v-icon v-else small>$question</v-icon>
      </v-list-item-action>
      <v-list-item-action class="my-auto">
        <context-menu
          :entity-name="mealName"
          v-bind="{ icon, menu }"
          @action="action"
        ></context-menu>
      </v-list-item-action>
    </template>
    <v-divider></v-divider>
    <food-item
      :foods="meal.foods"
      :selected-food-id="selectedFoodId"
      @food-selected="foodSelected"
    ></food-item>
    <v-divider v-if="meal.foods.length"></v-divider>
  </v-list-group>
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
