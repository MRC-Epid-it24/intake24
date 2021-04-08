<template>
  <v-card elevation="5">
    <v-toolbar flat>
      <v-tabs icons-and-text center-active touch show-arrows>
        <v-tabs-slider></v-tabs-slider>
        <v-tab class="add_button">
          <span>ADD</span>
        </v-tab>
        <v-tab v-for="meal in meals" :key="meal.name" @click="emitFoodsList(meal.foods)">
          {{ meal.name }}
          <v-icon x-small v-if="meal.time.length === 0">far fa-question-circle </v-icon>
        </v-tab>
      </v-tabs>
    </v-toolbar>
  </v-card>
  <!-- <v-bottom-navigation absolute color="orange" horizontal grow>
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
          <v-icon v-else >far fa-question-circle </v-icon>
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
  </v-bottom-navigation> -->
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import MealItemMobile from './MealItemMobile2.vue';

export default (Vue as VueConstructor<Vue>).extend({
  // components: { MealItemMobile },
  name: 'MealListMobileTop',

  props: {
    meals: Array,
    foods: Array,
  },
  data() {
    return {
      // Test Data for food
      offset: true,
    };
  },
  methods: {
    emitFoodsList(foods: Array<any>) {
      this.$emit('displayFoods', foods);
      console.log(foods);
    },
  },
});
</script>
<style lang="scss" scoped>
@import '../../../scss/meallistmobile2.scss';
</style>
