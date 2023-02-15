<template>
  <v-card class="mb-4">
    <v-toolbar flat>
      <v-breadcrumbs v-if="!isMobile" class="pl-0" :items="items">
        <template #divider>
          <v-icon x-small>fa-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <v-spacer v-if="!isMobile"></v-spacer>
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

  computed: {
    items() {
      return this.getBreadCrumbs;
    },
  },
});
</script>
