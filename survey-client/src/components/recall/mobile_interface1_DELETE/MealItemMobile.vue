<template>
  <v-list>
    <v-list-item>
      <v-btn icon color="pink">
        <v-icon x-small color="red darken-2">fas fa-times</v-icon>
      </v-btn>
      <v-list-item-title> {{ time + ' - ' + name }} </v-list-item-title>
      <v-list-item-action>
        <v-btn icon color="green">
          <v-icon x-small color="green darken-2">fas fa-plus</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item v-for="(food, i) in foods" :key="i" link>
      <v-btn icon color="pink">
        <v-icon x-small color="red darken-2" class="pa-2">fas fa-times</v-icon>
      </v-btn>
      <v-list-item-title v-if="food.name" v-text="food.name"></v-list-item-title>
      <v-list-item-title v-else v-text="food.searchTerm"></v-list-item-title>
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
  name: 'MealItemMobile',
  props: {
    foods: Array,
    name: String,
    time: String,
  },
  data() {
    return {};
  },
});
</script>
