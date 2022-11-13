<template>
  <v-card :flat="isMobile" :tile="isMobile">
    <slot name="header">
      <v-sheet class="px-4 pt-4" :class="{ 'pb-4': !hasDefaultSlot }">
        <h3>{{ localeText }}</h3>
        <div v-if="localeDescription" class="mt-4" v-html="localeDescription"></div>
      </v-sheet>
    </slot>
    <v-card-text v-if="hasDefaultSlot">
      <slot></slot>
    </v-card-text>
    <v-card-actions
      v-if="!isMobile && hasActionsSlot"
      class="pa-4 d-flex"
      :class="{ 'flex-column-reverse': isMobile }"
    >
      <slot name="actions"></slot>
    </v-card-actions>
    <v-bottom-navigation
      v-if="isMobile"
      app
      background-color="secondary"
      class="bottom-navigation"
      dark
      fixed
      grow
      :value="navTab"
      @change="navAction"
    >
      <slot name="nav-actions">
        <v-btn value="add-meal">
          <span class="text-overline font-weight-medium">
            {{ $t('prompts.addMeal.yes') }}
          </span>
          <v-icon class="pb-1">$plus</v-icon>
        </v-btn>
        <v-divider vertical></v-divider>
        <v-btn value="review">
          <span class="text-overline font-weight-medium">Review</span>
          <v-icon class="pb-1">$survey</v-icon>
        </v-btn>
        <v-divider vertical></v-divider>
        <v-btn
          :color="isValid ? 'success' : 'primary'"
          :disabled="!isValid"
          value="next"
          @click="next"
        >
          <span class="text-overline font-weight-medium">
            {{ $t('common.action.continue') }}
          </span>
          <v-icon class="pb-1">$next</v-icon>
        </v-btn>
      </slot>
    </v-bottom-navigation>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import layoutMixin from './layout-mixin';

export default defineComponent({
  name: 'PromptLayout',

  mixins: [layoutMixin],
});
</script>

<style lang="scss">
.bottom-navigation .v-btn {
  max-width: unset !important;
}
</style>
