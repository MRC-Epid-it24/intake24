<template>
  <v-bottom-navigation absolute color="orange" horizontal grow>
    <v-menu
      :close-on-content-click="false"
      top
      v-for="(meal, index) in meals"
      :key="meal.name"
      :offset-y="offset"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-if="isMobile" v-bind="attrs" v-on="on" x-small text>
          <span v-if="meal.time.length > 0">{{ index + 1 }}</span>
          <v-icon v-else>far fa-question-circle </v-icon>
        </v-btn>
        <v-btn v-else-if="!isMobile" v-bind="attrs" v-on="on">
          <span>{{ meal.name }}</span>
          <v-icon v-if="meal.time.length === 0">far fa-question-circle </v-icon>
        </v-btn>
      </template>
      <meal-item-mobile :name="meal.name" :time="meal.time" :foods="meal.foods"></meal-item-mobile>
    </v-menu>
    <v-btn color="secondary">
      <span>Add </span>
    </v-btn>
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
      offset: true,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../../../scss/meallistmobile.scss';
</style>
