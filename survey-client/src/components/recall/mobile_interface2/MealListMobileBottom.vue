<template>
  <v-card elevation="5" :loading="loading">
    <v-toolbar dense>
      <v-tabs center-active touch show-arrows icons-and-text>
        <v-tab class="add_food"> ADD </v-tab>
        <v-tab @displayFoods="foods = $event" v-for="food in foods" :key="food.name">
          {{ food.name ? food.name : food.searchTerm }}
          <v-icon x-small v-if="food.code" color="green darken-2">fa-check</v-icon>
        </v-tab>
      </v-tabs>
    </v-toolbar>
  </v-card>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';

export default (Vue as VueConstructor<Vue>).extend({
  // components: { MealItemMobile },
  name: 'MealListMobileBottom',

  props: {
    foods: Array,
    loading: Boolean,
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
@import '../../../scss/meallistmobile2.scss';
</style>
