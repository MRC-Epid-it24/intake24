<template>
  <v-toolbar class="mb-4">
    <v-breadcrumbs v-if="!isNotDesktop" :items="brds" divider="/"></v-breadcrumbs>
    <v-spacer v-if="!isNotDesktop"></v-spacer>
    <v-btn @click="$router.back()"> back </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import type { VueConstructor } from 'vue';
import Vue from 'vue';
import { mapState } from 'pinia';
import type { BreadCrumbsContent, BrdCrumbs } from '@intake24/survey/components/mixins/breadcrumbs';
import breadcrumbs from '@intake24/survey/components/mixins/breadcrumbs';
import { useSurvey } from '@intake24/survey/stores';

export default (Vue as VueConstructor<Vue & BreadCrumbsContent>).extend({
  name: 'RecallBreadCrumbs',

  props: ['promptName'],

  mixins: [breadcrumbs],

  computed: {
    ...mapState(useSurvey, ['selectedMeal', 'selectedMealIndex', 'selectedFood']),

    brds(): BrdCrumbs[] {
      return this.getBreadCrumbs(this.promptName).filter((el) => !el.disabled);
    },
  },
});
</script>
