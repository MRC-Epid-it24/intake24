<template>
  <v-toolbar class="mb-4">
    <v-breadcrumbs v-if="!isNotDesktop" :items="brds" divider="/"></v-breadcrumbs>
    <v-spacer v-if="!isNotDesktop"></v-spacer>
    <v-btn @click="$router.back()"> back </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { BrdCrumbs } from '@intake24/survey/components/mixins/breadcrumbs';
import { breadcrumbs } from '@intake24/survey/components/mixins';

export default defineComponent({
  name: 'RecallBreadCrumbs',

  props: ['promptName'],

  mixins: [breadcrumbs],

  computed: {
    brds(): BrdCrumbs[] {
      return this.getBreadCrumbs(this.promptName).filter((el) => !el.disabled);
    },
  },
});
</script>
