<template>
  <v-card elevation="5" class="stickytop">
    <v-toolbar flat>
      <v-tabs icons-and-text center-active touch show-arrows>
        <v-tabs-slider></v-tabs-slider>
        <v-tab class="add_button">
          <span>ADD</span>
        </v-tab>
        <v-tab v-for="meal in meals" :key="meal.name" @click="emitFoodsList(meal.foods)">
          {{ meal.name }}
          <v-icon x-small v-if="meal.time.length === 0">far fa-question-circle </v-icon>
          <p v-else>{{ meal.time }}</p>
        </v-tab>
      </v-tabs>
    </v-toolbar>
  </v-card>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';

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
    },
  },
});
</script>
//
<style lang="scss" scoped>
// @import '../../scss/meallistmobile2.scss';
//
</style>
