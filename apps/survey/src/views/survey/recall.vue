<template>
  <v-container :class="{ 'pa-0': isMobile }">
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
      return this.isNotDesktop ? 'recall-mobile' : 'recall-desktop';
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../scss/meallistmobile.scss';
</style>
