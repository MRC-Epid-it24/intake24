<template>
  <v-navigation-drawer permanent width="100%">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title"> Recall </v-list-item-title>
        <v-list-item-subtitle>
          {{ surveyName }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list dense nav>
      <v-list-item v-for="meal in meals" :key="meal.name" link>
        <v-list-item-content>
          <meal-item :name="meal.name" :foods="foodsTest"></meal-item>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import MealItem from './MealItem.vue';

export default (Vue as VueConstructor<Vue>).extend({
  name: 'MealList',

  components: {
    MealItem,
  },
  props: {
    surveyName: String,
    meals: Array,
  },
  data() {
    return {
      foodsTest: ['Chicken breast', 'Tea', 'muffin'],
    };
  },
});
</script>
