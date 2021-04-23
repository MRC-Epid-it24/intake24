<template>
  <v-list-group :value="meal.time.length > 0 ? true : false">
    <template v-slot:activator>
      <v-list-item-title class="font-weight-bold" @click="chooseMeal(meal.name)">
        {{ meal.name }}
        <context-menu :menu="menuMeal" :icon="menuMealIcon"></context-menu>
      </v-list-item-title>
      <v-list-item-action>
        <v-list-item-action-text
          v-if="meal.time.length > 0"
          v-text="meal.time"
        ></v-list-item-action-text>
        <v-icon x-small v-else>far fa-question-circle </v-icon>
      </v-list-item-action>
    </template>
    <food-item :foods="meal.foods"></food-item>
    <!-- <v-list-item v-for="(food, i) in meal.foods" :key="i" link>
      <v-list-item-title
        v-if="food.name"
        v-text="food.name"
        @click="chooseFood(food.name)"
      ></v-list-item-title>
      <v-list-item-title
        v-else
        v-text="food.searchTerm"
        @click="chooseFood(food.searchTerm)"
      ></v-list-item-title>
      <v-list-item-action>
        <v-icon x-small v-if="food.code" color="green darken-2">fa-check</v-icon>
      </v-list-item-action>
      <v-list-item-action>
        <v-icon x-small v-if="food.portionSizeMethod" color="green darken-2">fa-check</v-icon>
      </v-list-item-action>
    </v-list-item> -->
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
  },
  data() {
    console.log(this.meal.name);
    return {
      menuMealIcon: 'far fa-edit',
      menuMeal: [
        {
          name: 'Add Food',
          action: '',
        },
        {
          name: 'Delete Food',
          action: '',
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
