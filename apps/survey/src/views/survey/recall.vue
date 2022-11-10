<template>
  <v-container :class="{ 'pa-0': isMobile }">
    <component :is="layout"></component>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useSurvey } from '@intake24/survey/stores';

import RecallDesktop from './recall-desktop.vue';
import RecallMobile from './recall-mobile.vue';

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
