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
import { useSurvey } from '@intake24/survey/stores';
import { defineComponent } from '@vue/composition-api';
import { mapState } from 'pinia';

export default defineComponent({
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
    ...mapState(useSurvey, ['selectedMeal', 'selectedFood']),
  },

  methods: {
    onItemClick(tab: number) {
      if (!tab) this.$emit('navigation-item-click', this.$props.bottomNavigation);
      this.$emit('navigation-item-click', tab);
    },
  },
});
</script>
