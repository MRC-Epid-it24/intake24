<template>
  <v-bottom-navigation
    app
    fixed
    grow
    v-model="activeItem"
    :color="color"
    background-color="secondary"
  >
    <v-btn value="meal" @click="onItemClick('meal')">
      <span>Meals</span>
      <v-icon>$meal</v-icon>
    </v-btn>

    <v-btn value="food" @click="onItemClick('food')">
      <span>Foods</span>
      <v-icon>$food</v-icon>
    </v-btn>

    <v-btn value="survey" @click="onItemClick('survey')">
      <span>Survey</span>
      <v-icon>$survey</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'BottomNavigationMobile',

  data() {
    return {
      activeItem: 'meal',
      color: '#ffffff',
    };
  },

  computed: {
    ...mapGetters('survey', ['selectedMeal', 'selectedFood']),
  },

  methods: {
    onItemClick(item: string) {
      this.$emit('navigation-item-click', item);
    },
  },
});
</script>
