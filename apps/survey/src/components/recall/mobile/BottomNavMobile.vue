<template>
  <v-bottom-navigation
    app
    fixed
    grow
    v-model="$props.bottomNavTab"
    @change="onItemClick"
    :color="color"
    background-color="secondary"
  >
    <v-btn>
      <span>Add meal</span>
      <v-icon>$plus</v-icon>
    </v-btn>

    <v-btn>
      <span>Review</span>
      <v-icon>$survey</v-icon>
    </v-btn>

    <v-btn>
      <span>Next question</span>
      <v-icon>$next</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'BottomNavigationMobile',

  props: {
    bottomNavigation: Number,
  },

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
    onItemClick(tab: number) {
      if (!tab) this.$emit('navigation-item-click', this.$props.bottomNavigation);
      this.$emit('navigation-item-click', tab);
    },
  },
});
</script>
