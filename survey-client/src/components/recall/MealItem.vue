<template>
  <v-list-group :value="meal.time.length > 0 ? true : false">
    <template v-slot:activator>
      <v-list-item-title class="font-weight-bold">
        {{ meal.name }}
        <context-menu :menu="menuMeal" :icon="menuMealIcon"></context-menu>
      </v-list-item-title>
      <v-list-item-action>
        <v-list-item-action-text
          v-if="meal.time.length > 0"
          v-text="meal.time"
        ></v-list-item-action-text>
        <v-icon v-else>far fa-question-circle </v-icon>
      </v-list-item-action>
    </template>
    <v-list-item v-for="(food, i) in meal.foods" :key="i" link>
      <v-list-item-title v-if="food.name" v-text="food.name"></v-list-item-title>
      <v-list-item-title v-else v-text="food.searchTerm"></v-list-item-title>
      <v-list-item-action>
        <v-icon v-if="food.code" color="green darken-2">fa-check</v-icon>
      </v-list-item-action>
      <v-list-item-action>
        <v-icon v-if="food.portionSizeMethod" color="green darken-2">fa-check</v-icon>
      </v-list-item-action>
    </v-list-item>
  </v-list-group>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import ContextMenu from '../elements/ContextMenu.vue';

export default (Vue as VueConstructor<Vue>).extend({
  name: 'MealItem',

  components: {
    ContextMenu,
  },
  props: {
    meal: Object,
  },
  data() {
    return {
      menuMealIcon: '#',
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
});
</script>
