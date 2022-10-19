<template>
  <v-bottom-navigation
    v-model="tabIndex"
    app
    background-color="secondary"
    :color="color"
    fixed
    grow
  >
    <v-btn @click="onItemClick(0)">
      <span>Add meal</span>
      <v-icon>$plus</v-icon>
    </v-btn>

    <v-btn @click="onItemClick(1)">
      <span>Review</span>
      <v-icon>$survey</v-icon>
    </v-btn>

    <v-btn
      :color="isContinueEnabled ? 'success' : 'primary'"
      :disabled="!isContinueEnabled"
      @click="onItemClick(2)"
    >
      <span>{{ $t('common.action.continue') }}</span>
      <v-icon>$next</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { PromptAnswer } from '@intake24/common/types';

export default defineComponent({
  name: 'BottomNavigationMobile',

  props: {
    bottomNavigation: Number,
    continueButtonEnabled: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      tabIndex: 2,
      activeItem: 'meal',
      color: '#ffffff',
      promptAnswer: null as PromptAnswer | null,
      // TODO: change default to false once  all prompts will be changed to work with the tempPromptAnswer State.
      canContinue: true,
    };
  },

  computed: {
    isContinueEnabled() {
      return this.continueButtonEnabled || this.tabIndex !== 2;
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

  methods: {
    onItemClick(tab: number) {
      // Prevent extra switching if active tab is clicked again, but allow continuing
      if (this.tabIndex == tab && tab !== 2) return;
      if (!tab) this.$emit('navigation-item-click', this.$props.bottomNavigation);
      this.$emit('navigation-item-click', tab);
    },
  },
});
</script>
