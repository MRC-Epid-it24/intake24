<template>
  <v-list-group :value="true">
    <template v-slot:activator>
      <v-list-item-title class="font-weight-bold">{{ name }}</v-list-item-title>
    </template>
    <v-list-item v-for="(food, i) in foods" :key="i" link>
      <v-list-item-title v-text="food"></v-list-item-title>
    </v-list-item>
  </v-list-group>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'MealItem',
  props: {
    name: String,
    foods: Array,
  },
  data() {
    return {};
  },
});
</script>
