<template>
  <v-toolbar class="mb-4">
    <v-breadcrumbs v-if="!isNotDesktop" divider="/" :items="brds"></v-breadcrumbs>
    <v-spacer v-if="!isNotDesktop"></v-spacer>
    <request-help :survey-id="$route.params.surveyId"></request-help>
  </v-toolbar>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { RequiredLocaleTranslation } from '@intake24/common/types';
import type { BrdCrumbs } from '@intake24/survey/components/mixins/breadcrumbs';
import { breadcrumbs } from '@intake24/survey/components/mixins';
import RequestHelp from '@intake24/survey/components/request-help.vue';

export default defineComponent({
  name: 'RecallBreadCrumbs',

  components: { RequestHelp },

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
