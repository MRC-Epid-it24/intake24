<template>
  <v-list v-if="foods.length > 0">
    <v-list-item v-for="(food, i) in foods" :key="i" link>
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
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';

export default (Vue as VueConstructor<Vue>).extend({
  name: 'FoodItem',
  props: {
    foods: Array,
  },
  data() {
    return {};
  },
  methods: {
    chooseFood(foodName: string) {
      this.$emit('breadcrumbFood', foodName);
    },
  },
});
</script>
