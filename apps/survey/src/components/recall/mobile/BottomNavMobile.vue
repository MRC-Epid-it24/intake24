<template>
  <v-bottom-navigation
    app
    background-color="secondary"
    :color="color"
    fixed
    grow
    :value="tab"
    @input="updateTab"
  >
    <v-btn @click="updateTab(0)">
      <span class="text-overline font-weight-medium">Add meal</span>
      <v-icon class="pb-1">$plus</v-icon>
    </v-btn>
    <v-divider vertical></v-divider>
    <v-btn @click="updateTab(1)">
      <span class="text-overline font-weight-medium">Review</span>
      <v-icon class="pb-1">$survey</v-icon>
    </v-btn>
    <v-btn
      :color="isContinueEnabled ? 'success' : 'primary'"
      :disabled="!isContinueEnabled"
      @click="updateTab(2)"
    >
      <span class="text-overline font-weight-medium">{{ $t('common.action.continue') }}</span>
      <v-icon class="pb-1">$next</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BottomNavigationMobile',

  props: {
    tab: {
      type: Number,
      default: 2,
    },
    canContinue: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      color: '#ffffff',
    };
  },

  computed: {
    isContinueEnabled() {
      return this.canContinue || this.tab !== 2;
    },
  },

  methods: {
    updateTab(tab: number) {
      // Prevent extra switching if active tab is clicked again, but allow continuing
      if (this.tab === tab && tab !== 2) return;

      this.$emit('update:tab', tab);
    },
  },
});
</script>
