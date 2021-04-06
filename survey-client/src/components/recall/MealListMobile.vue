<template>
  <v-bottom-navigation absolute color="orange" horizontal grow>
    <v-menu top v-for="(meal, index) in meals" :key="meal.name" :offset-y="offset">
      <template v-slot:activator="{ on, attrs }">
				<v-btn v-if="isMobile" v-bind="attrs" v-on="on">
          <span>{{ index+1 }}</span>
        </v-btn>
        <v-btn v-else-if="!isMobile" v-bind="attrs" v-on="on">
          <span>{{ meal.name }}</span>
        </v-btn>

      </template>
      <meal-item-mobile :foods="foodsTest"></meal-item-mobile>
    </v-menu>
  </v-bottom-navigation>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import MealItemMobile from './MealItemMobile.vue';

export default (Vue as VueConstructor<Vue>).extend({
  components: { MealItemMobile },
  name: 'MealListMobile',

  props: {
    meals: Array,
  },
  data() {
    return {
      // Test Data for food
      foodsTest: ['Chicken breast', 'Tea', 'muffin'],
      offset: true,
    };
  },
});
</script>
