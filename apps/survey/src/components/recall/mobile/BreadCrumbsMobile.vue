<template>
  <v-toolbar flat dense class="brdcrmbs">
    <v-breadcrumbs :items="breads">
      <template v-slot:divider>
        <v-icon>{{ forwardIcon }}</v-icon>
      </template>
    </v-breadcrumbs>
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
  name: 'RecallBreadCrumbsMobile',

  props: {
    prompt: String,
  },

  data: () => {
    return {
      forwardIcon: 'fas fa-caret-right',
    };
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
        {
          text: this.prompt ? this.prompt : '',
          disabled: this.prompt === '',
        },
      ];
    },
  },
});
</script>

<style lang="scss" scoped>
/* Style the food bar */

.brdcrmbs {
  position: sticky;
  top: 0px;
  left: 0;
  width: 100%;
  z-index: 1;
  //padding-top: 5px;
}
</style>
