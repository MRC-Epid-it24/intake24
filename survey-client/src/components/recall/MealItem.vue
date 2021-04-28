<template>
  <v-list-group :value="meal.time.length > 0 ? true : false">
    <template v-slot:activator>
      <v-list-item-title class="font-weight-bold text-wrap" @click="chooseMeal(meal.name)">
        {{ meal.name }}
      </v-list-item-title>
      <context-menu :menu="menuMeal" :icon="menuMealIcon" :itemId="idx"></context-menu>
      <v-list-item-action>
        <v-list-item-action-text
          v-if="meal.time.length > 0"
          v-text="meal.time"
        ></v-list-item-action-text>
        <v-icon x-small v-else>far fa-question-circle </v-icon>
      </v-list-item-action>
    </template>
    <food-item :foods="meal.foods"></food-item>
  </v-list-group>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import ContextMenu from '../elements/ContextMenu.vue';
import FoodItem from './FoodItem.vue';

export default (Vue as VueConstructor<Vue>).extend({
  name: 'MealItem',

  components: {
    ContextMenu,
    FoodItem,
  },
  props: {
    meal: Object,
    idx: String,
  },
  data() {
    return {
      menuMealIcon: 'far fa-edit',
      menuMeal: [
        {
          name: 'Add Food',
          action: 'add-food-prompt',
        },
        {
          name: 'Delete Food',
          action: 'remove-food-prompt',
        },
      ],
    };
  },
  methods: {
    chooseMeal(mealName: string) {
      this.$emit('breadcrumbMeal', mealName);
    },
    chooseFood(foodName: string) {
      this.$emit('breadcrumbFood', foodName);
    },
  },
});
</script>
