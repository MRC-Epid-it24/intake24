<template>
  <v-bottom-navigation app fixed grow :color="color" background-color="secondary">
    <v-btn @click="onItemClick(0)">
      <span>Add meal</span>
      <v-icon>$plus</v-icon>
    </v-btn>

    <v-btn @click="onItemClick(1)">
      <span>Review</span>
      <v-icon>$survey</v-icon>
    </v-btn>

    <v-btn
      :disabled="!this.continue"
      @click="onItemClick(2)"
      :color="this.continue ? 'success' : 'primary'"
    >
      <span>Next question</span>
      <v-icon>$next</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import { mapState } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import { defineComponent } from '@vue/composition-api';
import { PromptAnswer } from '@intake24/common/types';

export default defineComponent({
  name: 'BottomNavigationMobile',

  props: {
    bottomNavigation: Number,
  },

  data(): {
    activeItem: string;
    color: string;
    promptAnswer: PromptAnswer | null;
    continue: boolean;
  } {
    return {
      activeItem: 'meal',
      color: '#ffffff',
      promptAnswer: null,
      // TODO: change default to false once  all prompts will be changed to work with the tempPromptAnswer State.
      continue: true,
    };
  },

  computed: {
    ...mapState(useSurvey, ['selectedMeal', 'selectedFood', 'currentTempPromptAnswer']),
  },

  methods: {
    onItemClick(tab: number) {
      if (!tab) this.$emit('navigation-item-click', this.$props.bottomNavigation);
      this.$emit('navigation-item-click', tab);
    },
  },
  watch: {
    currentTempPromptAnswer: {
      immediate: true,
      deep: true,
      handler(value: PromptAnswer) {
        this.promptAnswer = value;
        // TODO: Switch it ON once all prompts will be changed to work with the tempPromptAnswer State.
        // if (this.promptAnswer.response) this.continue = true;
      },
    },
  },
});
</script>
