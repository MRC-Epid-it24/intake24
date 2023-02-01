<template>
  <v-card class="mb-4">
    <v-toolbar flat>
      <v-breadcrumbs v-if="!isMobile" class="pl-0" :items="items">
        <template #divider>
          <v-icon x-small>fa-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <v-spacer v-if="!isMobile"></v-spacer>
      <confirm-dialog label="Reset survey state" @confirm="$emit('restart')">
        <template #activator="{ attrs, on }">
          <v-btn v-bind="attrs" class="mr-2" color="error" outlined v-on="on">
            <v-icon left>fas fa-times</v-icon>
            <span>Reset</span>
          </v-btn>
        </template>
        Reset survey state
      </confirm-dialog>
      <request-help :survey-id="$route.params.surveyId"></request-help>
    </v-toolbar>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import breadcrumbsMixin from './breadcrumbs-mixin';

export default defineComponent({
  name: 'RecallBreadcrumbs',

  mixins: [breadcrumbsMixin],

  emits: ['restart'],

  computed: {
    items() {
      return this.getBreadCrumbs();
    },
  },
});
</script>
