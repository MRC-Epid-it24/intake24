<template>
  <v-container class="container-max" :class="{ 'pa-0': isMobile }" fluid>
    <component :is="layout"></component>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { RecallDesktop, RecallMobile } from '@intake24/survey/components';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'SurveyRecall',

  components: { RecallDesktop, RecallMobile },

  beforeRouteEnter({ params }, from, next) {
    useSurvey().allowRecall ? next() : next({ name: 'survey-home', params });
  },

  computed: {
    layout(): string {
      return this.isMobile ? 'recall-mobile' : 'recall-desktop';
    },
  },
});
</script>

<style lang="scss" scoped>
.container-max {
  max-width: 1280px !important;
}
</style>
