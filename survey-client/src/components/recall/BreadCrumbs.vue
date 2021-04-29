<template>
  <v-toolbar class="mb-4">
    <v-breadcrumbs v-if="!isNotDesktop" :items="breads" divider="/"></v-breadcrumbs>
    <v-spacer v-if="!isNotDesktop"></v-spacer>
    <v-btn @click="$router.back()"> back </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

type BrdCrumbs = {
  text: string;
  disabled: boolean;
};

export default Vue.extend({
  name: 'RecallBreadCrumbs',

  data: () => {
    return {};
  },

  computed: {
    ...mapGetters('survey', ['selectedMeal', 'selectedMealIndex', 'selectedFood']),

    breads(): BrdCrumbs[] {
      return [
        {
          text: this.selectedMeal ? this.selectedMeal.name : 'Choose Meal',
          disabled: !this.selectedMeal,
        },
        {
          text: this.selectedFood ? this.selectedFood.name : 'Choose Food',
          disabled: !this.selectedFood,
        },
      ];
    },
  },
});
</script>
