<template>
  <v-toolbar class="mb-4">
    <v-breadcrumbs v-if="!isNotDesktop" :items="brds" divider="/"></v-breadcrumbs>
    <v-spacer v-if="!isNotDesktop"></v-spacer>
    <v-btn @click="$router.back()"> back </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { RequiredLocaleTranslation } from '@intake24/common/types';
import type { BrdCrumbs } from '@intake24/survey/components/mixins/breadcrumbs';
import { breadcrumbs } from '@intake24/survey/components/mixins';

export default defineComponent({
  name: 'RecallBreadCrumbs',

  mixins: [breadcrumbs],

  props: {
    promptName: {
      type: Object as PropType<RequiredLocaleTranslation>,
    },
  },

  computed: {
    brds(): BrdCrumbs[] {
      return this.getBreadCrumbs(this.promptName).filter((el) => !el.disabled);
    },
  },
});
</script>
