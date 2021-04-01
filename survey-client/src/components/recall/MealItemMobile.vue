<template>
  <v-list>
    <v-list-item v-for="(food, i) in foods" :key="i" link>
      <v-list-item-title v-text="food"></v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';

export default (Vue as VueConstructor<Vue>).extend({
  name: 'MealItemMobile',
  props: {
    foods: Array,
  },
  data() {
    return {};
  },
});
</script>
